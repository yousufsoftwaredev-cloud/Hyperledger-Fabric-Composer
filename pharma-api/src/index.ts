import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import participantRoutes from './routes/participants';
import assetRoutes from './routes/assets';
import transactionRoutes from './routes/transactions';
import queryRoutes from './routes/queries';
import * as composer from './services/composer';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ── ROUTES ───────────────────────────────────────────────────
app.use('/participants', participantRoutes);
app.use('/assets', assetRoutes);
app.use('/transactions', transactionRoutes);
app.use('/queries', queryRoutes);

// ── SYSTEM ───────────────────────────────────────────────────
app.get('/ping', async (_req, res) => {
  try {
    const data = await composer.ping();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    composerRestUrl: process.env.COMPOSER_REST_URL,
    timestamp: new Date().toISOString(),
  });
});

// ── START ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Pharma API running at http://localhost:${PORT}`);
  console.log(`Composer REST URL: ${process.env.COMPOSER_REST_URL}`);
  console.log('\nAvailable routes:');
  console.log('  GET  /health');
  console.log('  GET  /ping');
  console.log('  ─── Participants ───');
  console.log('  GET  POST /participants/government');
  console.log('  GET  POST /participants/manufacturer');
  console.log('  GET  POST /participants/pharmacy');
  console.log('  GET  POST /participants/doctor');
  console.log('  GET  POST /participants/citizen');
  console.log('  ─── Assets ───');
  console.log('  GET  /assets/medicine-type');
  console.log('  GET  /assets/license');
  console.log('  GET  /assets/medicine');
  console.log('  GET  /assets/order');
  console.log('  GET  /assets/prescription');
  console.log('  ─── Transactions ───');
  console.log('  POST /transactions/register-medicine-type');
  console.log('  POST /transactions/issue-license');
  console.log('  POST /transactions/revoke-license');
  console.log('  POST /transactions/prolongate-license');
  console.log('  POST /transactions/create-medicine');
  console.log('  POST /transactions/create-order');
  console.log('  POST /transactions/process-order');
  console.log('  POST /transactions/fulfill-order');
  console.log('  POST /transactions/write-prescription');
  console.log('  POST /transactions/sell-medicine');
  console.log('  ─── Queries ───');
  console.log('  GET  /queries/medicine-types');
  console.log('  GET  /queries/prescription-medicine-types');
  console.log('  GET  /queries/licenses/:manufacturerId');
  console.log('  GET  /queries/active-licenses/:manufacturerId');
  console.log('  GET  /queries/medicine/status/:status');
  console.log('  GET  /queries/medicine/type/:medicineTypeId');
  console.log('  GET  /queries/medicine/owner/:ownerType/:ownerId');
  console.log('  GET  /queries/medicine/manufacturer/:manufacturerId');
  console.log('  GET  /queries/orders/pharmacy/:pharmacyId');
  console.log('  GET  /queries/orders/manufacturer/:manufacturerId');
  console.log('  GET  /queries/orders/status/:status');
  console.log('  GET  /queries/prescriptions/citizen/:citizenId');
  console.log('  GET  /queries/prescriptions/doctor/:doctorId');
  console.log('  GET  /queries/prescriptions/valid');
});
