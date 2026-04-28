import { useState } from 'react';
import { submitTransaction } from '../../services/api';
import ApiResult from '../shared/ApiResult';
import FormField from '../shared/FormField';

type Result = { loading: boolean; error?: string; data?: unknown };
const idle: Result = { loading: false };

export default function PharmacyTransactions() {
  // Create Order
  const [orderForm, setOrderForm] = useState({
    orderId: '', medicineTypeId: '', manufacturerId: '', quantity: '1',
  });
  const [orderResult, setOrderResult] = useState<Result>(idle);

  // Sell Medicine
  const [sellForm, setSellForm] = useState({
    medicineId: '', citizenId: '', prescriptionId: '',
  });
  const [sellResult, setSellResult] = useState<Result>(idle);

  const setOrder = (name: string, value: string | boolean) =>
    setOrderForm((p) => ({ ...p, [name]: value as string }));
  const setSell = (name: string, value: string | boolean) =>
    setSellForm((p) => ({ ...p, [name]: value as string }));

  const submit = async (txName: string, body: unknown, setResult: (r: Result) => void) => {
    setResult({ loading: true });
    const res = await submitTransaction(txName, body);
    if (res.success) setResult({ loading: false, data: res.data ?? 'OK' });
    else setResult({ loading: false, error: res.error });
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Pharmacy Transactions</h2>
        <p>Blockchain write operations available to Pharmacy</p>
      </div>

      {/* Create Order */}
      <div className="section">
        <h3>Place Medicine Order</h3>
        <form
          className="create-form"
          onSubmit={(e) => {
            e.preventDefault();
            submit('create-order', { ...orderForm, quantity: Number(orderForm.quantity) }, setOrderResult);
          }}
        >
          <FormField label="Order ID" name="orderId" value={orderForm.orderId} onChange={setOrder} placeholder="e.g. ORD001" required />
          <FormField label="Medicine Type ID" name="medicineTypeId" value={orderForm.medicineTypeId} onChange={setOrder} placeholder="e.g. MT001" required />
          <FormField label="Manufacturer ID" name="manufacturerId" value={orderForm.manufacturerId} onChange={setOrder} placeholder="e.g. MFG001" required />
          <FormField label="Quantity" name="quantity" value={orderForm.quantity} onChange={setOrder} type="number" placeholder="1" required />
          <button type="submit" className="btn-primary" disabled={orderResult.loading}>
            {orderResult.loading ? 'Submitting…' : 'Place Order'}
          </button>
        </form>
        <ApiResult loading={false} error={orderResult.error} data={orderResult.data} />
      </div>

      {/* Sell Medicine */}
      <div className="section">
        <h3>Sell Medicine to Citizen</h3>
        <p className="field-hint">prescriptionId is only required for prescription-only medicines</p>
        <form
          className="create-form"
          onSubmit={(e) => {
            e.preventDefault();
            const body: Record<string, string> = {
              medicineId: sellForm.medicineId,
              citizenId: sellForm.citizenId,
            };
            if (sellForm.prescriptionId) body.prescriptionId = sellForm.prescriptionId;
            submit('sell-medicine', body, setSellResult);
          }}
        >
          <FormField label="Medicine ID" name="medicineId" value={sellForm.medicineId} onChange={setSell} placeholder="e.g. MED001" required />
          <FormField label="Citizen ID" name="citizenId" value={sellForm.citizenId} onChange={setSell} placeholder="e.g. CIT001" required />
          <FormField label="Prescription ID (optional)" name="prescriptionId" value={sellForm.prescriptionId} onChange={setSell} placeholder="e.g. PRE001" />
          <button type="submit" className="btn-primary" disabled={sellResult.loading}>
            {sellResult.loading ? 'Submitting…' : 'Sell Medicine'}
          </button>
        </form>
        <ApiResult loading={false} error={sellResult.error} data={sellResult.data} />
      </div>
    </div>
  );
}
