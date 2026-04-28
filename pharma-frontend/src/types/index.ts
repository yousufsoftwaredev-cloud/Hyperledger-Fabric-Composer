// Auth
export type UserRole = 'government' | 'manufacturer' | 'pharmacy' | 'doctor' | 'citizen';

export interface HardcodedUser {
  username: string;
  password: string;
  role: UserRole;
  id: string;
  name: string;
}

// Participant types
export interface Government {
  govId: string;
  name: string;
  $class?: string;
}

export interface Manufacturer {
  manufacturerId: string;
  name: string;
  location: string;
  $class?: string;
}

export interface Pharmacy {
  pharmacyId: string;
  name: string;
  location: string;
  $class?: string;
}

export interface Doctor {
  doctorId: string;
  name: string;
  licenseNumber: string;
  specialization: string;
  $class?: string;
}

export interface Citizen {
  citizenId: string;
  name: string;
  dateOfBirth: string;
  $class?: string;
}

// Asset types
export interface MedicineType {
  medicineTypeId: string;
  name: string;
  description: string;
  activeIngredient: string;
  requiresPrescription: boolean;
  registeredBy?: string;
  $class?: string;
}

export interface License {
  licenseId: string;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  issueDate: string;
  expiryDate: string;
  manufacturer: string;
  medicineType: string;
  issuedBy?: string;
  $class?: string;
}

export type OwnerType = 'MANUFACTURER' | 'PHARMACY' | 'CITIZEN' | 'GOVERNMENT';

export interface Medicine {
  medicineId: string;
  expiryDate: string;
  status: 'PRODUCED' | 'IN_ORDER' | 'WITH_PHARMACY' | 'SOLD';
  ownerId: string;
  ownerType: OwnerType;
  medicineType: string;
  producedUnderLicense: string;
  producedBy: string;
  $class?: string;
}

export interface Order {
  orderId: string;
  quantity: number;
  status: 'PENDING' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';
  medicineType: string;
  pharmacy: string;
  manufacturer: string;
  medicines?: string[];
  $class?: string;
}

export interface PrescriptionItem {
  medicineType: string;
  quantity: number;
  remaining: number;
}

export interface Prescription {
  prescriptionId: string;
  issueDate: string;
  expiryDate: string;
  isValid: boolean;
  doctor: string;
  citizen: string;
  items: PrescriptionItem[];
  $class?: string;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
