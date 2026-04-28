import { Router, Request, Response } from 'express';
import * as composer from '../services/composer';
import {
  RegisterMedicineTypePayload,
  IssueLicensePayload,
  RevokeLicensePayload,
  ProlongateLicensePayload,
  CreateMedicinePayload,
  CreateOrderPayload,
  ProcessOrderPayload,
  FulfillOrderPayload,
  WritePrescriptionPayload,
  SellMedicinePayload,
} from '../types';

const router = Router();

const ref = (type: string, id: string) => `resource:org.acme.${type}#${id}`;

// ── GOVERNMENT TRANSACTIONS ───────────────────────────────────

/**
 * POST /transactions/register-medicine-type
 * Government registers a new drug type in the system
 *
 * Body: { medicineTypeId, name, description, activeIngredient, requiresPrescription }
 */
router.post('/register-medicine-type', async (req: Request, res: Response) => {
  try {
    const payload: RegisterMedicineTypePayload = req.body;
    const data = await composer.submitTransaction('RegisterMedicineType', payload);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

/**
 * POST /transactions/issue-license
 * Government issues a production license to a Manufacturer
 *
 * Body: { licenseId, manufacturerId, medicineTypeId, expiryDate }
 */
router.post('/issue-license', async (req: Request, res: Response) => {
  try {
    const { licenseId, manufacturerId, medicineTypeId, expiryDate } = req.body;
    const payload: IssueLicensePayload = {
      licenseId,
      manufacturer: ref('Manufacturer', manufacturerId),
      medicineType: ref('MedicineType', medicineTypeId),
      expiryDate,
    };
    const data = await composer.submitTransaction('IssueLicense', payload);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

/**
 * POST /transactions/revoke-license
 * Government revokes an active license
 *
 * Body: { licenseId }
 */
router.post('/revoke-license', async (req: Request, res: Response) => {
  try {
    const payload: RevokeLicensePayload = { license: ref('License', req.body.licenseId) };
    const data = await composer.submitTransaction('RevokeLicense', payload);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

/**
 * POST /transactions/prolongate-license
 * Government extends a license's expiry date
 *
 * Body: { licenseId, newExpiryDate }
 */
router.post('/prolongate-license', async (req: Request, res: Response) => {
  try {
    const payload: ProlongateLicensePayload = {
      license: ref('License', req.body.licenseId),
      newExpiryDate: req.body.newExpiryDate,
    };
    const data = await composer.submitTransaction('ProlongateLicense', payload);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

// ── MANUFACTURER TRANSACTIONS ─────────────────────────────────

/**
 * POST /transactions/create-medicine
 * Manufacturer creates a new medicine unit (validates license)
 *
 * Body: { medicineId, medicineTypeId, licenseId, expiryDate }
 */
router.post('/create-medicine', async (req: Request, res: Response) => {
  try {
    const { medicineId, medicineTypeId, licenseId, expiryDate } = req.body;
    const payload: CreateMedicinePayload = {
      medicineId,
      medicineType: ref('MedicineType', medicineTypeId),
      license: ref('License', licenseId),
      expiryDate,
    };
    const data = await composer.submitTransaction('CreateMedicine', payload);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

/**
 * POST /transactions/process-order
 * Manufacturer acknowledges an order (PENDING → PROCESSING)
 *
 * Body: { orderId }
 */
router.post('/process-order', async (req: Request, res: Response) => {
  try {
    const payload: ProcessOrderPayload = { order: ref('Order', req.body.orderId) };
    const data = await composer.submitTransaction('ProcessOrder', payload);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

/**
 * POST /transactions/fulfill-order
 * Manufacturer assigns medicine units and delivers to Pharmacy
 *
 * Body: { orderId, medicineIds: string[] }
 */
router.post('/fulfill-order', async (req: Request, res: Response) => {
  try {
    const { orderId, medicineIds } = req.body;
    const payload: FulfillOrderPayload = {
      order: ref('Order', orderId),
      medicines: medicineIds.map((id: string) => ref('Medicine', id)),
    };
    const data = await composer.submitTransaction('FulfillOrder', payload);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

// ── PHARMACY TRANSACTIONS ─────────────────────────────────────

/**
 * POST /transactions/create-order
 * Pharmacy places an order for medicine units from a Manufacturer
 *
 * Body: { orderId, medicineTypeId, manufacturerId, quantity }
 */
router.post('/create-order', async (req: Request, res: Response) => {
  try {
    const { orderId, medicineTypeId, manufacturerId, quantity } = req.body;
    const payload: CreateOrderPayload = {
      orderId,
      medicineType: ref('MedicineType', medicineTypeId),
      manufacturer: ref('Manufacturer', manufacturerId),
      quantity,
    };
    const data = await composer.submitTransaction('CreateOrder', payload);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

/**
 * POST /transactions/sell-medicine
 * Pharmacy sells a medicine unit to a Citizen
 * If medicine requires prescription, prescriptionId must be provided
 *
 * Body: { medicineId, citizenId, prescriptionId? }
 */
router.post('/sell-medicine', async (req: Request, res: Response) => {
  try {
    const { medicineId, citizenId, prescriptionId } = req.body;
    const payload: SellMedicinePayload = {
      medicine: ref('Medicine', medicineId),
      citizen: ref('Citizen', citizenId),
      ...(prescriptionId && { prescription: ref('Prescription', prescriptionId) }),
    };
    const data = await composer.submitTransaction('SellMedicine', payload);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

// ── DOCTOR TRANSACTIONS ───────────────────────────────────────

/**
 * POST /transactions/write-prescription
 * Doctor writes a prescription for a Citizen
 *
 * Body: {
 *   prescriptionId,
 *   citizenId,
 *   expiryDate,
 *   items: [{ medicineTypeId, quantity }]
 * }
 */
router.post('/write-prescription', async (req: Request, res: Response) => {
  try {
    const { prescriptionId, citizenId, expiryDate, items } = req.body;
    const payload: WritePrescriptionPayload = {
      prescriptionId,
      citizen: ref('Citizen', citizenId),
      expiryDate,
      items: items.map((item: { medicineTypeId: string; quantity: number }) => ({
        $class: 'org.acme.PrescriptionItem',
        medicineType: ref('MedicineType', item.medicineTypeId),
        quantity: item.quantity,
        remaining: item.quantity,
      })),
    };
    const data = await composer.submitTransaction('WritePrescription', payload);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

export default router;
