import axios from 'axios';
import type { ApiResponse } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

const client = axios.create({ baseURL: BASE_URL });

async function request<T>(fn: () => Promise<{ data: ApiResponse<T> }>): Promise<ApiResponse<T>> {
  try {
    const res = await fn();
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.data) {
      return err.response.data as ApiResponse<T>;
    }
    return { success: false, error: String(err) };
  }
}

// System
export const healthCheck = () =>
  request<{ status: string; composerUrl: string; timestamp: string }>(() => client.get('/health'));

export const ping = () => request<unknown>(() => client.get('/ping'));

// Participants
export const getParticipants = <T>(type: string) =>
  request<T[]>(() => client.get(`/participants/${type}`));

export const getParticipantById = <T>(type: string, id: string) =>
  request<T>(() => client.get(`/participants/${type}/${id}`));

export const createParticipant = <T>(type: string, body: unknown) =>
  request<T>(() => client.post(`/participants/${type}`, body));

// Assets
export const getAssets = <T>(type: string) =>
  request<T[]>(() => client.get(`/assets/${type}`));

export const getAssetById = <T>(type: string, id: string) =>
  request<T>(() => client.get(`/assets/${type}/${id}`));

// Transactions
export const submitTransaction = <T>(name: string, body: unknown) =>
  request<T>(() => client.post(`/transactions/${name}`, body));

// Queries
export const queryMedicineTypes = <T>() =>
  request<T[]>(() => client.get('/queries/medicine-types'));

export const queryPrescriptionMedicineTypes = <T>() =>
  request<T[]>(() => client.get('/queries/prescription-medicine-types'));

export const queryLicensesByManufacturer = <T>(manufacturerId: string) =>
  request<T[]>(() => client.get(`/queries/licenses/${manufacturerId}`));

export const queryActiveLicenses = <T>(manufacturerId: string) =>
  request<T[]>(() => client.get(`/queries/active-licenses/${manufacturerId}`));

export const queryMedicineByStatus = <T>(status: string) =>
  request<T[]>(() => client.get(`/queries/medicine/status/${status}`));

export const queryMedicineByType = <T>(medicineTypeId: string) =>
  request<T[]>(() => client.get(`/queries/medicine/type/${medicineTypeId}`));

export const queryMedicineByOwner = <T>(ownerType: string, ownerId: string) =>
  request<T[]>(() => client.get(`/queries/medicine/owner/${ownerType}/${ownerId}`));

export const queryMedicineByManufacturer = <T>(manufacturerId: string) =>
  request<T[]>(() => client.get(`/queries/medicine/manufacturer/${manufacturerId}`));

export const queryOrdersByPharmacy = <T>(pharmacyId: string) =>
  request<T[]>(() => client.get(`/queries/orders/pharmacy/${pharmacyId}`));

export const queryOrdersByManufacturer = <T>(manufacturerId: string) =>
  request<T[]>(() => client.get(`/queries/orders/manufacturer/${manufacturerId}`));

export const queryOrdersByStatus = <T>(status: string) =>
  request<T[]>(() => client.get(`/queries/orders/status/${status}`));

export const queryPrescriptionsByCitizen = <T>(citizenId: string) =>
  request<T[]>(() => client.get(`/queries/prescriptions/citizen/${citizenId}`));

export const queryPrescriptionsByDoctor = <T>(doctorId: string) =>
  request<T[]>(() => client.get(`/queries/prescriptions/doctor/${doctorId}`));

export const queryValidPrescriptions = <T>() =>
  request<T[]>(() => client.get('/queries/prescriptions/valid'));
