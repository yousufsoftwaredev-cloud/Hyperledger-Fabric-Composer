import { useState } from 'react';
import { submitTransaction } from '../../services/api';
import ApiResult from '../shared/ApiResult';
import FormField from '../shared/FormField';

type Result = { loading: boolean; error?: string; data?: unknown };
const idle: Result = { loading: false };

export default function GovernmentTransactions() {
  // Register Medicine Type
  const [regForm, setRegForm] = useState({
    medicineTypeId: '', name: '', description: '', activeIngredient: '', requiresPrescription: false,
  });
  const [regResult, setRegResult] = useState<Result>(idle);

  // Issue License
  const [issueForm, setIssueForm] = useState({
    licenseId: '', manufacturerId: '', medicineTypeId: '', expiryDate: '',
  });
  const [issueResult, setIssueResult] = useState<Result>(idle);

  // Revoke License
  const [revokeForm, setRevokeForm] = useState({ licenseId: '' });
  const [revokeResult, setRevokeResult] = useState<Result>(idle);

  // Prolongate License
  const [prolongateForm, setProlongateForm] = useState({ licenseId: '', newExpiryDate: '' });
  const [prolongateResult, setProlongateResult] = useState<Result>(idle);

  const setReg = (name: string, value: string | boolean) =>
    setRegForm((p) => ({ ...p, [name]: value }));
  const setIssue = (name: string, value: string | boolean) =>
    setIssueForm((p) => ({ ...p, [name]: value as string }));
  const setRevoke = (name: string, value: string | boolean) =>
    setRevokeForm((p) => ({ ...p, [name]: value as string }));
  const setProl = (name: string, value: string | boolean) =>
    setProlongateForm((p) => ({ ...p, [name]: value as string }));

  const submit = async (
    txName: string,
    body: unknown,
    setResult: (r: Result) => void
  ) => {
    setResult({ loading: true });
    const res = await submitTransaction(txName, body);
    if (res.success) setResult({ loading: false, data: res.data ?? 'OK' });
    else setResult({ loading: false, error: res.error });
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Government Transactions</h2>
        <p>Blockchain write operations available to Government</p>
      </div>

      {/* Register Medicine Type */}
      <div className="section">
        <h3>Register Medicine Type</h3>
        <form
          className="create-form"
          onSubmit={(e) => { e.preventDefault(); submit('register-medicine-type', regForm, setRegResult); }}
        >
          <FormField label="Medicine Type ID" name="medicineTypeId" value={regForm.medicineTypeId} onChange={setReg} placeholder="e.g. MT001" required />
          <FormField label="Name" name="name" value={regForm.name} onChange={setReg} placeholder="e.g. Paracetamol" required />
          <FormField label="Description" name="description" value={regForm.description} onChange={setReg} placeholder="Pain reliever" required />
          <FormField label="Active Ingredient" name="activeIngredient" value={regForm.activeIngredient} onChange={setReg} placeholder="e.g. Acetaminophen" required />
          <FormField label="Requires Prescription" name="requiresPrescription" value={regForm.requiresPrescription} onChange={setReg} type="checkbox" />
          <button type="submit" className="btn-primary" disabled={regResult.loading}>
            {regResult.loading ? 'Submitting…' : 'Register Medicine Type'}
          </button>
        </form>
        <ApiResult loading={false} error={regResult.error} data={regResult.data} />
      </div>

      {/* Issue License */}
      <div className="section">
        <h3>Issue License to Manufacturer</h3>
        <form
          className="create-form"
          onSubmit={(e) => { e.preventDefault(); submit('issue-license', issueForm, setIssueResult); }}
        >
          <FormField label="License ID" name="licenseId" value={issueForm.licenseId} onChange={setIssue} placeholder="e.g. LIC001" required />
          <FormField label="Manufacturer ID" name="manufacturerId" value={issueForm.manufacturerId} onChange={setIssue} placeholder="e.g. MFG001" required />
          <FormField label="Medicine Type ID" name="medicineTypeId" value={issueForm.medicineTypeId} onChange={setIssue} placeholder="e.g. MT001" required />
          <FormField label="Expiry Date" name="expiryDate" value={issueForm.expiryDate} onChange={setIssue} type="date" required />
          <button type="submit" className="btn-primary" disabled={issueResult.loading}>
            {issueResult.loading ? 'Submitting…' : 'Issue License'}
          </button>
        </form>
        <ApiResult loading={false} error={issueResult.error} data={issueResult.data} />
      </div>

      {/* Revoke License */}
      <div className="section">
        <h3>Revoke License</h3>
        <form
          className="create-form"
          onSubmit={(e) => { e.preventDefault(); submit('revoke-license', revokeForm, setRevokeResult); }}
        >
          <FormField label="License ID" name="licenseId" value={revokeForm.licenseId} onChange={setRevoke} placeholder="e.g. LIC001" required />
          <button type="submit" className="btn-danger" disabled={revokeResult.loading}>
            {revokeResult.loading ? 'Submitting…' : 'Revoke License'}
          </button>
        </form>
        <ApiResult loading={false} error={revokeResult.error} data={revokeResult.data} />
      </div>

      {/* Prolongate License */}
      <div className="section">
        <h3>Extend License Expiry</h3>
        <form
          className="create-form"
          onSubmit={(e) => { e.preventDefault(); submit('prolongate-license', prolongateForm, setProlongateResult); }}
        >
          <FormField label="License ID" name="licenseId" value={prolongateForm.licenseId} onChange={setProl} placeholder="e.g. LIC001" required />
          <FormField label="New Expiry Date" name="newExpiryDate" value={prolongateForm.newExpiryDate} onChange={setProl} type="date" required />
          <button type="submit" className="btn-primary" disabled={prolongateResult.loading}>
            {prolongateResult.loading ? 'Submitting…' : 'Extend License'}
          </button>
        </form>
        <ApiResult loading={false} error={prolongateResult.error} data={prolongateResult.data} />
      </div>
    </div>
  );
}
