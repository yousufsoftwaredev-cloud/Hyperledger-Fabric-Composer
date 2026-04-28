import { useState } from 'react';
import { submitTransaction } from '../../services/api';
import ApiResult from '../shared/ApiResult';
import FormField from '../shared/FormField';

type Result = { loading: boolean; error?: string; data?: unknown };
const idle: Result = { loading: false };

export default function ManufacturerTransactions() {
  // Create Medicine
  const [createMedForm, setCreateMedForm] = useState({
    medicineId: '', medicineTypeId: '', licenseId: '', expiryDate: '',
  });
  const [createMedResult, setCreateMedResult] = useState<Result>(idle);

  // Process Order
  const [processForm, setProcessForm] = useState({ orderId: '' });
  const [processResult, setProcessResult] = useState<Result>(idle);

  // Fulfill Order
  const [fulfillForm, setFulfillForm] = useState({ orderId: '', medicineIds: '' });
  const [fulfillResult, setFulfillResult] = useState<Result>(idle);

  const setMed = (name: string, value: string | boolean) =>
    setCreateMedForm((p) => ({ ...p, [name]: value as string }));
  const setProcess = (name: string, value: string | boolean) =>
    setProcessForm((p) => ({ ...p, [name]: value as string }));
  const setFulfill = (name: string, value: string | boolean) =>
    setFulfillForm((p) => ({ ...p, [name]: value as string }));

  const submit = async (txName: string, body: unknown, setResult: (r: Result) => void) => {
    setResult({ loading: true });
    const res = await submitTransaction(txName, body);
    if (res.success) setResult({ loading: false, data: res.data ?? 'OK' });
    else setResult({ loading: false, error: res.error });
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Manufacturer Transactions</h2>
        <p>Blockchain write operations available to Manufacturer</p>
      </div>

      {/* Create Medicine */}
      <div className="section">
        <h3>Create Medicine Unit</h3>
        <form
          className="create-form"
          onSubmit={(e) => {
            e.preventDefault();
            submit('create-medicine', createMedForm, setCreateMedResult);
          }}
        >
          <FormField label="Medicine ID" name="medicineId" value={createMedForm.medicineId} onChange={setMed} placeholder="e.g. MED001" required />
          <FormField label="Medicine Type ID" name="medicineTypeId" value={createMedForm.medicineTypeId} onChange={setMed} placeholder="e.g. MT001" required />
          <FormField label="License ID" name="licenseId" value={createMedForm.licenseId} onChange={setMed} placeholder="e.g. LIC001" required />
          <FormField label="Expiry Date" name="expiryDate" value={createMedForm.expiryDate} onChange={setMed} type="date" required />
          <button type="submit" className="btn-primary" disabled={createMedResult.loading}>
            {createMedResult.loading ? 'Submitting…' : 'Create Medicine'}
          </button>
        </form>
        <ApiResult loading={false} error={createMedResult.error} data={createMedResult.data} />
      </div>

      {/* Process Order */}
      <div className="section">
        <h3>Process Order (PENDING → PROCESSING)</h3>
        <form
          className="create-form"
          onSubmit={(e) => { e.preventDefault(); submit('process-order', processForm, setProcessResult); }}
        >
          <FormField label="Order ID" name="orderId" value={processForm.orderId} onChange={setProcess} placeholder="e.g. ORD001" required />
          <button type="submit" className="btn-primary" disabled={processResult.loading}>
            {processResult.loading ? 'Submitting…' : 'Process Order'}
          </button>
        </form>
        <ApiResult loading={false} error={processResult.error} data={processResult.data} />
      </div>

      {/* Fulfill Order */}
      <div className="section">
        <h3>Fulfill Order (Deliver Medicines)</h3>
        <p className="field-hint">Enter medicine IDs separated by commas (e.g. MED001,MED002)</p>
        <form
          className="create-form"
          onSubmit={(e) => {
            e.preventDefault();
            const medicineIds = fulfillForm.medicineIds.split(',').map((s) => s.trim()).filter(Boolean);
            submit('fulfill-order', { orderId: fulfillForm.orderId, medicineIds }, setFulfillResult);
          }}
        >
          <FormField label="Order ID" name="orderId" value={fulfillForm.orderId} onChange={setFulfill} placeholder="e.g. ORD001" required />
          <FormField label="Medicine IDs (comma-separated)" name="medicineIds" value={fulfillForm.medicineIds} onChange={setFulfill} placeholder="MED001,MED002" required />
          <button type="submit" className="btn-primary" disabled={fulfillResult.loading}>
            {fulfillResult.loading ? 'Submitting…' : 'Fulfill Order'}
          </button>
        </form>
        <ApiResult loading={false} error={fulfillResult.error} data={fulfillResult.data} />
      </div>
    </div>
  );
}
