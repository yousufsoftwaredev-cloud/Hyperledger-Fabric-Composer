// ============================================================
// PARTICIPANTS
// ============================================================

export interface Government {
  $class: 'org.acme.Government';
  govId: string;
  name: string;
}

export interface Manufacturer {
  $class: 'org.acme.Manufacturer';
  manufacturerId: string;
  name: string;
  location: string;
}

export interface Pharmacy {
  $class: 'org.acme.Pharmacy';
  pharmacyId: string;
  name: string;
  location: string;
}

export interface Doctor {
  $class: 'org.acme.Doctor';
  doctorId: string;
  name: string;
  licenseNumber: string;
  specialization: string;
}

export interface Citizen {
  $class: 'org.acme.Citizen';
  citizenId: string;
  name: string;
  dateOfBirth: string;
}

// ============================================================
// ENUMS
// ============================================================

export type LicenseStatus = 'ACTIVE' | 'REVOKED' | 'EXPIRED';
export type MedicineStatus = 'PRODUCED' | 'IN_ORDER' | 'WITH_PHARMACY' | 'SOLD';
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';
export type OwnerType = 'MANUFACTURER' | 'PHARMACY' | 'CITIZEN' | 'GOVERNMENT';

// ============================================================
// ASSETS
// ============================================================

export interface MedicineType {
  $class: 'org.acme.MedicineType';
  medicineTypeId: string;
  name: string;
  description: string;
  activeIngredient: string;
  requiresPrescription: boolean;
  registeredBy: string;
}

export interface License {
  $class: 'org.acme.License';
  licenseId: string;
  status: LicenseStatus;
  issueDate: string;
  expiryDate: string;
  manufacturer: string;
  medicineType: string;
  issuedBy: string;
}

export interface Medicine {
  $class: 'org.acme.Medicine';
  medicineId: string;
  expiryDate: string;
  status: MedicineStatus;
  ownerId: string;
  ownerType: OwnerType;
  medicineType: string;
  producedUnderLicense: string;
  producedBy: string;
}

export interface PrescriptionItem {
  $class: 'org.acme.PrescriptionItem';
  medicineType: string;
  quantity: number;
  remaining: number;
}

export interface Order {
  $class: 'org.acme.Order';
  orderId: string;
  quantity: number;
  status: OrderStatus;
  medicineType: string;
  pharmacy: string;
  manufacturer: string;
  medicines?: string[];
}

export interface Prescription {
  $class: 'org.acme.Prescription';
  prescriptionId: string;
  issueDate: string;
  expiryDate: string;
  isValid: boolean;
  doctor: string;
  citizen: string;
  items: PrescriptionItem[];
}

// ============================================================
// TRANSACTIONS
// ============================================================

export interface RegisterMedicineTypePayload {
  medicineTypeId: string;
  name: string;
  description: string;
  activeIngredient: string;
  requiresPrescription: boolean;
}

export interface IssueLicensePayload {
  licenseId: string;
  manufacturer: string;
  medicineType: string;
  expiryDate: string;
}

export interface RevokeLicensePayload {
  license: string;
}

export interface ProlongateLicensePayload {
  license: string;
  newExpiryDate: string;
}

export interface CreateMedicinePayload {
  medicineId: string;
  medicineType: string;
  license: string;
  expiryDate: string;
}

export interface CreateOrderPayload {
  orderId: string;
  medicineType: string;
  manufacturer: string;
  quantity: number;
}

export interface ProcessOrderPayload {
  order: string;
}

export interface FulfillOrderPayload {
  order: string;
  medicines: string[];
}

export interface WritePrescriptionPayload {
  prescriptionId: string;
  citizen: string;
  items: Array<{
    medicineType: string;
    quantity: number;
    remaining: number;
  }>;
  expiryDate: string;
}

export interface SellMedicinePayload {
  medicine: string;
  citizen: string;
  prescription?: string;
}

// ============================================================
// API RESPONSE WRAPPER
// ============================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
