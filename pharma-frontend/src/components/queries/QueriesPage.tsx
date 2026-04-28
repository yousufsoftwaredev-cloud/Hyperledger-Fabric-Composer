import { useState } from 'react';
import {
  queryMedicineTypes,
  queryPrescriptionMedicineTypes,
  queryLicensesByManufacturer,
  queryActiveLicenses,
  queryMedicineByStatus,
  queryMedicineByType,
  queryMedicineByOwner,
  queryMedicineByManufacturer,
  queryOrdersByPharmacy,
  queryOrdersByManufacturer,
  queryOrdersByStatus,
  queryPrescriptionsByCitizen,
  queryPrescriptionsByDoctor,
  queryValidPrescriptions,
} from '../../services/api';
import ApiResult from '../shared/ApiResult';

type Result = { loading: boolean; error?: string; data?: unknown };
const idle: Result = { loading: false };

function Q({
  title,
  params,
  onQuery,
}: {
  title: string;
  params?: { name: string; label: string; placeholder?: string }[];
  onQuery: (inputs: Record<string, string>, setResult: (r: Result) => void) => void;
}) {
  const [inputs, setInputs] = useState<Record<string, string>>(
    Object.fromEntries((params ?? []).map((p) => [p.name, '']))
  );
  const [result, setResult] = useState<Result>(idle);

  const handleRun = (e: React.FormEvent) => {
    e.preventDefault();
    setResult({ loading: true });
    onQuery(inputs, setResult);
  };

  return (
    <div className="section">
      <h3>{title}</h3>
      <form className="inline-form query-form" onSubmit={handleRun}>
        {(params ?? []).map((p) => (
          <input
            key={p.name}
            type="text"
            value={inputs[p.name]}
            onChange={(e) => setInputs((prev) => ({ ...prev, [p.name]: e.target.value }))}
            placeholder={p.label + (p.placeholder ? ` (${p.placeholder})` : '')}
            required
          />
        ))}
        <button type="submit" className="btn-primary" disabled={result.loading}>
          {result.loading ? 'Running…' : 'Run Query'}
        </button>
      </form>
      <ApiResult loading={false} error={result.error} data={result.data} />
    </div>
  );
}

export default function QueriesPage() {
  const wrap =
    <T,>(fn: () => Promise<{ success: boolean; data?: T; error?: string }>) =>
    (_inputs: Record<string, string>, setResult: (r: Result) => void) => {
      fn().then((res) => {
        if (res.success) setResult({ loading: false, data: res.data });
        else setResult({ loading: false, error: res.error });
      });
    };

  const wrapP =
    <T,>(fn: (inputs: Record<string, string>) => Promise<{ success: boolean; data?: T; error?: string }>) =>
    (inputs: Record<string, string>, setResult: (r: Result) => void) => {
      fn(inputs).then((res) => {
        if (res.success) setResult({ loading: false, data: res.data });
        else setResult({ loading: false, error: res.error });
      });
    };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Blockchain Queries</h2>
        <p>Read-only queries against the blockchain ledger</p>
      </div>

      <Q
        title="All Medicine Types"
        onQuery={wrap(() => queryMedicineTypes<unknown>())}
      />
      <Q
        title="Prescription-Only Medicine Types"
        onQuery={wrap(() => queryPrescriptionMedicineTypes<unknown>())}
      />
      <Q
        title="All Valid Prescriptions"
        onQuery={wrap(() => queryValidPrescriptions<unknown>())}
      />
      <Q
        title="Licenses by Manufacturer"
        params={[{ name: 'manufacturerId', label: 'Manufacturer ID', placeholder: 'MFG001' }]}
        onQuery={wrapP((i) => queryLicensesByManufacturer<unknown>(i.manufacturerId))}
      />
      <Q
        title="Active Licenses by Manufacturer"
        params={[{ name: 'manufacturerId', label: 'Manufacturer ID', placeholder: 'MFG001' }]}
        onQuery={wrapP((i) => queryActiveLicenses<unknown>(i.manufacturerId))}
      />
      <Q
        title="Medicine by Status"
        params={[{ name: 'status', label: 'Status', placeholder: 'PRODUCED | IN_ORDER | WITH_PHARMACY | SOLD' }]}
        onQuery={wrapP((i) => queryMedicineByStatus<unknown>(i.status))}
      />
      <Q
        title="Medicine by Type"
        params={[{ name: 'medicineTypeId', label: 'Medicine Type ID', placeholder: 'MT001' }]}
        onQuery={wrapP((i) => queryMedicineByType<unknown>(i.medicineTypeId))}
      />
      <Q
        title="Medicine by Owner"
        params={[
          { name: 'ownerType', label: 'Owner Type', placeholder: 'Manufacturer | Pharmacy | Citizen' },
          { name: 'ownerId',   label: 'Owner ID',   placeholder: 'MFG001' },
        ]}
        onQuery={wrapP((i) => queryMedicineByOwner<unknown>(i.ownerType, i.ownerId))}
      />
      <Q
        title="Medicine by Manufacturer"
        params={[{ name: 'manufacturerId', label: 'Manufacturer ID', placeholder: 'MFG001' }]}
        onQuery={wrapP((i) => queryMedicineByManufacturer<unknown>(i.manufacturerId))}
      />
      <Q
        title="Orders by Pharmacy"
        params={[{ name: 'pharmacyId', label: 'Pharmacy ID', placeholder: 'PHA001' }]}
        onQuery={wrapP((i) => queryOrdersByPharmacy<unknown>(i.pharmacyId))}
      />
      <Q
        title="Orders by Manufacturer"
        params={[{ name: 'manufacturerId', label: 'Manufacturer ID', placeholder: 'MFG001' }]}
        onQuery={wrapP((i) => queryOrdersByManufacturer<unknown>(i.manufacturerId))}
      />
      <Q
        title="Orders by Status"
        params={[{ name: 'status', label: 'Status', placeholder: 'PENDING | PROCESSING | DELIVERED | CANCELLED' }]}
        onQuery={wrapP((i) => queryOrdersByStatus<unknown>(i.status))}
      />
      <Q
        title="Prescriptions by Citizen"
        params={[{ name: 'citizenId', label: 'Citizen ID', placeholder: 'CIT001' }]}
        onQuery={wrapP((i) => queryPrescriptionsByCitizen<unknown>(i.citizenId))}
      />
      <Q
        title="Prescriptions by Doctor"
        params={[{ name: 'doctorId', label: 'Doctor ID', placeholder: 'DOC001' }]}
        onQuery={wrapP((i) => queryPrescriptionsByDoctor<unknown>(i.doctorId))}
      />
    </div>
  );
}
