'use strict';

const NS = 'org.acme';

// ============================================================
// GOVERNMENT TRANSACTIONS
// ============================================================

/**
 * Government registers a new type of medicine in the system.
 * This is the first step in the drug lifecycle — no medicine can be
 * produced without a registered MedicineType.
 *
 * @param {org.acme.RegisterMedicineType} tx
 * @transaction
 */
async function registerMedicineType(tx) {
    const participant = getCurrentParticipant();
    if (participant.getFullyQualifiedType() !== NS + '.Government') {
        throw new Error('Only Government can register medicine types');
    }

    const factory = getFactory();
    const medicineType = factory.newResource(NS, 'MedicineType', tx.medicineTypeId);
    medicineType.name = tx.name;
    medicineType.description = tx.description;
    medicineType.activeIngredient = tx.activeIngredient;
    medicineType.requiresPrescription = tx.requiresPrescription;
    medicineType.registeredBy = factory.newRelationship(NS, 'Government', participant.getIdentifier());

    const registry = await getAssetRegistry(NS + '.MedicineType');
    await registry.add(medicineType);
}

/**
 * Government issues a production license to a Manufacturer for a specific MedicineType.
 * A Manufacturer must hold an ACTIVE license to legally produce medicine units.
 *
 * @param {org.acme.IssueLicense} tx
 * @transaction
 */
async function issueLicense(tx) {
    const participant = getCurrentParticipant();
    if (participant.getFullyQualifiedType() !== NS + '.Government') {
        throw new Error('Only Government can issue licenses');
    }

    const factory = getFactory();
    const license = factory.newResource(NS, 'License', tx.licenseId);
    license.status = 'ACTIVE';
    license.issueDate = new Date();
    license.expiryDate = tx.expiryDate;
    license.manufacturer = tx.manufacturer;
    license.medicineType = tx.medicineType;
    license.issuedBy = factory.newRelationship(NS, 'Government', participant.getIdentifier());

    const registry = await getAssetRegistry(NS + '.License');
    await registry.add(license);

    const event = factory.newEvent(NS, 'LicenseIssued');
    event.license = factory.newRelationship(NS, 'License', tx.licenseId);
    event.manufacturer = tx.manufacturer;
    emit(event);
}

/**
 * Government revokes a license, making it illegal for the Manufacturer
 * to produce any further medicine units under that license.
 *
 * @param {org.acme.RevokeLicense} tx
 * @transaction
 */
async function revokeLicense(tx) {
    const participant = getCurrentParticipant();
    if (participant.getFullyQualifiedType() !== NS + '.Government') {
        throw new Error('Only Government can revoke licenses');
    }
    if (tx.license.status !== 'ACTIVE') {
        throw new Error('Only ACTIVE licenses can be revoked');
    }

    tx.license.status = 'REVOKED';

    const registry = await getAssetRegistry(NS + '.License');
    await registry.update(tx.license);

    const factory = getFactory();
    const event = factory.newEvent(NS, 'LicenseRevoked');
    event.license = tx.license;
    emit(event);
}

/**
 * Government extends the expiry date of an existing license.
 * Can also reactivate an EXPIRED license (but not a REVOKED one).
 *
 * @param {org.acme.ProlongateLicense} tx
 * @transaction
 */
async function prolongateLicense(tx) {
    const participant = getCurrentParticipant();
    if (participant.getFullyQualifiedType() !== NS + '.Government') {
        throw new Error('Only Government can prolongate licenses');
    }
    if (tx.license.status === 'REVOKED') {
        throw new Error('Cannot prolongate a revoked license');
    }
    if (tx.newExpiryDate <= new Date()) {
        throw new Error('New expiry date must be in the future');
    }

    tx.license.expiryDate = tx.newExpiryDate;
    tx.license.status = 'ACTIVE';

    const registry = await getAssetRegistry(NS + '.License');
    await registry.update(tx.license);

    const factory = getFactory();
    const event = factory.newEvent(NS, 'LicenseProlongated');
    event.license = tx.license;
    event.newExpiryDate = tx.newExpiryDate;
    emit(event);
}

// ============================================================
// MANUFACTURER TRANSACTIONS
// ============================================================

/**
 * Manufacturer creates a single unit of medicine with a unique ID.
 * Validates that the Manufacturer holds a valid, non-expired license
 * for this specific MedicineType before allowing creation.
 *
 * @param {org.acme.CreateMedicine} tx
 * @transaction
 */
async function createMedicine(tx) {
    const participant = getCurrentParticipant();
    if (participant.getFullyQualifiedType() !== NS + '.Manufacturer') {
        throw new Error('Only Manufacturer can create medicine');
    }
    if (tx.license.status !== 'ACTIVE') {
        throw new Error('License is not active');
    }
    if (tx.license.manufacturer.getIdentifier() !== participant.getIdentifier()) {
        throw new Error('This license does not belong to you');
    }
    if (tx.license.medicineType.getIdentifier() !== tx.medicineType.getIdentifier()) {
        throw new Error('License does not cover this medicine type');
    }
    if (new Date(tx.license.expiryDate) < new Date()) {
        throw new Error('License has expired');
    }

    const factory = getFactory();
    const medicine = factory.newResource(NS, 'Medicine', tx.medicineId);
    medicine.expiryDate = tx.expiryDate;
    medicine.status = 'PRODUCED';
    medicine.ownerId = 'resource:' + NS + '.Manufacturer#' + participant.getIdentifier();
    medicine.ownerType = 'MANUFACTURER';
    medicine.medicineType = tx.medicineType;
    medicine.producedUnderLicense = factory.newRelationship(NS, 'License', tx.license.getIdentifier());
    medicine.producedBy = factory.newRelationship(NS, 'Manufacturer', participant.getIdentifier());

    const registry = await getAssetRegistry(NS + '.Medicine');
    await registry.add(medicine);

    const event = factory.newEvent(NS, 'MedicineCreated');
    event.medicine = factory.newRelationship(NS, 'Medicine', tx.medicineId);
    event.manufacturer = factory.newRelationship(NS, 'Manufacturer', participant.getIdentifier());
    emit(event);
}

/**
 * Manufacturer acknowledges an order and changes its status to PROCESSING.
 * Must be called before FulfillOrder.
 *
 * @param {org.acme.ProcessOrder} tx
 * @transaction
 */
async function processOrder(tx) {
    const participant = getCurrentParticipant();
    if (participant.getFullyQualifiedType() !== NS + '.Manufacturer') {
        throw new Error('Only Manufacturer can process orders');
    }
    if (tx.order.manufacturer.getIdentifier() !== participant.getIdentifier()) {
        throw new Error('This order is not assigned to you');
    }
    if (tx.order.status !== 'PENDING') {
        throw new Error('Only PENDING orders can be processed');
    }

    tx.order.status = 'PROCESSING';

    const registry = await getAssetRegistry(NS + '.Order');
    await registry.update(tx.order);
}

/**
 * Manufacturer fulfills an order by assigning specific medicine units to it
 * and transferring ownership of each unit to the Pharmacy.
 * Number of medicines supplied must match the ordered quantity.
 *
 * @param {org.acme.FulfillOrder} tx
 * @transaction
 */
async function fulfillOrder(tx) {
    const participant = getCurrentParticipant();
    if (participant.getFullyQualifiedType() !== NS + '.Manufacturer') {
        throw new Error('Only Manufacturer can fulfill orders');
    }
    if (tx.order.manufacturer.getIdentifier() !== participant.getIdentifier()) {
        throw new Error('This order is not assigned to you');
    }
    if (tx.order.status !== 'PROCESSING') {
        throw new Error('Order must be in PROCESSING status to fulfill');
    }
    if (tx.medicines.length !== tx.order.quantity) {
        throw new Error('Medicine count (' + tx.medicines.length + ') does not match order quantity (' + tx.order.quantity + ')');
    }

    const medicineRegistry = await getAssetRegistry(NS + '.Medicine');
    const medicineTypeRegistry = await getAssetRegistry(NS + '.MedicineType');
    const pharmacyOwnerId = 'resource:' + NS + '.Pharmacy#' + tx.order.pharmacy.getIdentifier();
    const orderedMedicineTypeId = tx.order.medicineType.getIdentifier();

    for (let medicine of tx.medicines) {
        if (medicine.status !== 'PRODUCED') {
            throw new Error('Medicine ' + medicine.medicineId + ' is not in PRODUCED status');
        }
        if (medicine.medicineType.getIdentifier() !== orderedMedicineTypeId) {
            throw new Error('Medicine ' + medicine.medicineId + ' is of the wrong type');
        }
        if (new Date(medicine.expiryDate) < new Date()) {
            throw new Error('Medicine ' + medicine.medicineId + ' has expired');
        }
        medicine.status = 'WITH_PHARMACY';
        medicine.ownerId = pharmacyOwnerId;
        medicine.ownerType = 'PHARMACY';
        await medicineRegistry.update(medicine);
    }

    tx.order.medicines = tx.medicines;
    tx.order.status = 'DELIVERED';

    const orderRegistry = await getAssetRegistry(NS + '.Order');
    await orderRegistry.update(tx.order);

    const factory = getFactory();
    const event = factory.newEvent(NS, 'OrderFulfilled');
    event.order = tx.order;
    emit(event);
}

// ============================================================
// PHARMACY TRANSACTIONS
// ============================================================

/**
 * Pharmacy creates an order for a specific quantity of a MedicineType
 * from a chosen Manufacturer.
 *
 * @param {org.acme.CreateOrder} tx
 * @transaction
 */
async function createOrder(tx) {
    const participant = getCurrentParticipant();
    if (participant.getFullyQualifiedType() !== NS + '.Pharmacy') {
        throw new Error('Only Pharmacy can create orders');
    }
    if (tx.quantity <= 0) {
        throw new Error('Order quantity must be greater than 0');
    }

    const factory = getFactory();
    const order = factory.newResource(NS, 'Order', tx.orderId);
    order.quantity = tx.quantity;
    order.status = 'PENDING';
    order.medicineType = tx.medicineType;
    order.pharmacy = factory.newRelationship(NS, 'Pharmacy', participant.getIdentifier());
    order.manufacturer = tx.manufacturer;

    const registry = await getAssetRegistry(NS + '.Order');
    await registry.add(order);

    const event = factory.newEvent(NS, 'OrderCreated');
    event.order = factory.newRelationship(NS, 'Order', tx.orderId);
    emit(event);
}

/**
 * Pharmacy sells a medicine unit to a Citizen.
 *
 * If the MedicineType requires a prescription:
 *   - Prescription must be provided, valid, and belong to the Citizen
 *   - Prescription must not be expired
 *   - The matching PrescriptionItem's remaining counter must be > 0
 *   - Counter is decremented by 1 on each successful sale
 *
 * If no prescription is required, the sale completes immediately.
 * Ownership transfers from Pharmacy to Citizen.
 *
 * @param {org.acme.SellMedicine} tx
 * @transaction
 */
async function sellMedicine(tx) {
    const participant = getCurrentParticipant();
    if (participant.getFullyQualifiedType() !== NS + '.Pharmacy') {
        throw new Error('Only Pharmacy can sell medicine');
    }

    const pharmacyOwnerId = 'resource:' + NS + '.Pharmacy#' + participant.getIdentifier();
    if (tx.medicine.ownerId !== pharmacyOwnerId) {
        throw new Error('This medicine does not belong to your pharmacy');
    }
    if (tx.medicine.status !== 'WITH_PHARMACY') {
        throw new Error('Medicine is not available for sale');
    }
    if (new Date(tx.medicine.expiryDate) < new Date()) {
        throw new Error('Medicine has expired and cannot be sold');
    }

    // Fetch the MedicineType to check if prescription is required
    const medicineTypeRegistry = await getAssetRegistry(NS + '.MedicineType');
    const medicineType = await medicineTypeRegistry.get(tx.medicine.medicineType.getIdentifier());

    if (medicineType.requiresPrescription) {
        if (!tx.prescription) {
            throw new Error('This medicine requires a prescription');
        }
        if (!tx.prescription.isValid) {
            throw new Error('Prescription is not valid');
        }
        if (tx.prescription.citizen.getIdentifier() !== tx.citizen.getIdentifier()) {
            throw new Error('Prescription does not belong to this citizen');
        }
        if (new Date(tx.prescription.expiryDate) < new Date()) {
            throw new Error('Prescription has expired');
        }

        // Find matching item and decrement remaining counter
        let found = false;
        for (let item of tx.prescription.items) {
            if (item.medicineType.getIdentifier() === medicineType.medicineTypeId) {
                if (item.remaining <= 0) {
                    throw new Error('No remaining units in prescription for this medicine type');
                }
                item.remaining -= 1;
                found = true;
                break;
            }
        }
        if (!found) {
            throw new Error('Prescription does not cover this medicine type');
        }

        const prescriptionRegistry = await getAssetRegistry(NS + '.Prescription');
        await prescriptionRegistry.update(tx.prescription);
    }

    tx.medicine.status = 'SOLD';
    tx.medicine.ownerId = 'resource:' + NS + '.Citizen#' + tx.citizen.getIdentifier();
    tx.medicine.ownerType = 'CITIZEN';

    const medicineRegistry = await getAssetRegistry(NS + '.Medicine');
    await medicineRegistry.update(tx.medicine);

    const factory = getFactory();
    const event = factory.newEvent(NS, 'MedicineSold');
    event.medicine = tx.medicine;
    event.citizen = tx.citizen;
    emit(event);
}

// ============================================================
// DOCTOR TRANSACTIONS
// ============================================================

/**
 * Doctor writes a prescription for a Citizen.
 * Each item in the prescription specifies a MedicineType, the total quantity
 * prescribed, and the remaining counter (starts equal to quantity).
 * The remaining counter is decremented each time the Pharmacy sells
 * that medicine type to the Citizen.
 *
 * @param {org.acme.WritePrescription} tx
 * @transaction
 */
async function writePrescription(tx) {
    const participant = getCurrentParticipant();
    if (participant.getFullyQualifiedType() !== NS + '.Doctor') {
        throw new Error('Only Doctor can write prescriptions');
    }
    if (tx.expiryDate <= new Date()) {
        throw new Error('Prescription expiry date must be in the future');
    }
    if (!tx.items || tx.items.length === 0) {
        throw new Error('Prescription must contain at least one item');
    }

    // Ensure remaining matches quantity for each item
    for (let item of tx.items) {
        if (item.quantity <= 0) {
            throw new Error('Prescription item quantity must be greater than 0');
        }
        item.remaining = item.quantity;
    }

    const factory = getFactory();
    const prescription = factory.newResource(NS, 'Prescription', tx.prescriptionId);
    prescription.issueDate = new Date();
    prescription.expiryDate = tx.expiryDate;
    prescription.isValid = true;
    prescription.doctor = factory.newRelationship(NS, 'Doctor', participant.getIdentifier());
    prescription.citizen = tx.citizen;
    prescription.items = tx.items;

    const registry = await getAssetRegistry(NS + '.Prescription');
    await registry.add(prescription);

    const event = factory.newEvent(NS, 'PrescriptionWritten');
    event.prescription = factory.newRelationship(NS, 'Prescription', tx.prescriptionId);
    event.citizen = tx.citizen;
    emit(event);
}
