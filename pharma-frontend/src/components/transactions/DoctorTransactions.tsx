import { useState } from 'react';
import { submitTransaction } from '../../services/api';
import ApiResult from '../shared/ApiResult';
import FormField from '../shared/FormField';

type Result = { loading: boolean; error?: string; data?: unknown };
const idle: Result = { loading: false };

interface PrescriptionItem {
  medicineTypeId: string;
  quantity: string;
}

export default function DoctorTransactions() {
  const [form, setForm] = useState({
    prescriptionId: '',
    citizenId: '',
    expiryDate: '',
  });
  const [items, setItems] = useState<PrescriptionItem[]>([
    { medicineTypeId: '', quantity: '1' },
  ]);
  const [result, setResult] = useState<Result>(idle);

  const setField = (name: string, value: string | boolean) =>
    setForm((p) => ({ ...p, [name]: value as string }));

  const setItem = (idx: number, field: keyof PrescriptionItem, value: string) => {
    setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  };

  const addItem = () => setItems((p) => [...p, { medicineTypeId: '', quantity: '1' }]);
  const removeItem = (idx: number) => setItems((p) => p.filter((_, i) => i !== idx));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult({ loading: true });
    const payload = {
      ...form,
      items: items.map((it) => ({
        medicineTypeId: it.medicineTypeId,
        quantity: Number(it.quantity),
      })),
    };
    submitTransaction('write-prescription', payload).then((res) => {
      if (res.success) setResult({ loading: false, data: res.data ?? 'OK' });
      else setResult({ loading: false, error: res.error });
    });
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Doctor Transactions</h2>
        <p>Blockchain write operations available to Doctor</p>
      </div>

      <div className="section">
        <h3>Write Prescription</h3>
        <form className="create-form" onSubmit={handleSubmit}>
          <FormField label="Prescription ID" name="prescriptionId" value={form.prescriptionId} onChange={setField} placeholder="e.g. PRE001" required />
          <FormField label="Citizen ID" name="citizenId" value={form.citizenId} onChange={setField} placeholder="e.g. CIT001" required />
          <FormField label="Expiry Date" name="expiryDate" value={form.expiryDate} onChange={setField} type="date" required />

          <div className="prescription-items">
            <label className="items-label">Prescription Items</label>
            {items.map((item, idx) => (
              <div key={idx} className="prescription-item-row">
                <input
                  type="text"
                  value={item.medicineTypeId}
                  onChange={(e) => setItem(idx, 'medicineTypeId', e.target.value)}
                  placeholder="Medicine Type ID (e.g. MT001)"
                  required
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => setItem(idx, 'quantity', e.target.value)}
                  placeholder="Qty"
                  min={1}
                  required
                  style={{ width: '80px' }}
                />
                {items.length > 1 && (
                  <button type="button" className="btn-danger btn-sm" onClick={() => removeItem(idx)}>
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="btn-secondary btn-sm" onClick={addItem}>
              + Add Item
            </button>
          </div>

          <button type="submit" className="btn-primary" disabled={result.loading}>
            {result.loading ? 'Submitting…' : 'Write Prescription'}
          </button>
        </form>
        <ApiResult loading={false} error={result.error} data={result.data} />
      </div>
    </div>
  );
}
