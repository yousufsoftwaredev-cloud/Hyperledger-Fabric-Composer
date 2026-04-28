import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GovernmentPage from './components/participants/GovernmentPage';
import ManufacturerPage from './components/participants/ManufacturerPage';
import PharmacyPage from './components/participants/PharmacyPage';
import DoctorPage from './components/participants/DoctorPage';
import CitizenPage from './components/participants/CitizenPage';
import MedicineTypePage from './components/assets/MedicineTypePage';
import LicensePage from './components/assets/LicensePage';
import MedicinePage from './components/assets/MedicinePage';
import OrderPage from './components/assets/OrderPage';
import PrescriptionPage from './components/assets/PrescriptionPage';
import GovernmentTransactions from './components/transactions/GovernmentTransactions';
import ManufacturerTransactions from './components/transactions/ManufacturerTransactions';
import PharmacyTransactions from './components/transactions/PharmacyTransactions';
import DoctorTransactions from './components/transactions/DoctorTransactions';
import QueriesPage from './components/queries/QueriesPage';
import './index.css';

function AppLayout() {
  const { user } = useAuth();

  if (!user) return <Login />;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/participants/government"   element={<GovernmentPage />} />
          <Route path="/participants/manufacturer" element={<ManufacturerPage />} />
          <Route path="/participants/pharmacy"     element={<PharmacyPage />} />
          <Route path="/participants/doctor"       element={<DoctorPage />} />
          <Route path="/participants/citizen"      element={<CitizenPage />} />
          <Route path="/assets/medicine-type"      element={<MedicineTypePage />} />
          <Route path="/assets/license"            element={<LicensePage />} />
          <Route path="/assets/medicine"           element={<MedicinePage />} />
          <Route path="/assets/order"              element={<OrderPage />} />
          <Route path="/assets/prescription"       element={<PrescriptionPage />} />
          <Route path="/transactions/government"   element={<GovernmentTransactions />} />
          <Route path="/transactions/manufacturer" element={<ManufacturerTransactions />} />
          <Route path="/transactions/pharmacy"     element={<PharmacyTransactions />} />
          <Route path="/transactions/doctor"       element={<DoctorTransactions />} />
          <Route path="/queries"                   element={<QueriesPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}
