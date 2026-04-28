import { Router, Request, Response } from 'express';
import * as composer from '../services/composer';

const router = Router();

const ref = (type: string, id: string) => `resource:org.acme.${type}#${id}`;

// GET /queries/medicine-types
router.get('/medicine-types', async (_req: Request, res: Response) => {
  try {
    const data = await composer.query('GetAllMedicineTypes');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

// GET /queries/prescription-medicine-types
router.get('/prescription-medicine-types', async (_req: Request, res: Response) => {
  try {
    const data = await composer.query('GetPrescriptionMedicineTypes');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

// GET /queries/licenses/:manufacturerId
router.get('/licenses/:manufacturerId', async (req: Request, res: Response) => {
  try {
    const data = await composer.query('GetLicensesByManufacturer', {
      manufacturer: ref('Manufacturer', req.params.manufacturerId),
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

// GET /queries/active-licenses/:manufacturerId
router.get('/active-licenses/:manufacturerId', async (req: Request, res: Response) => {
  try {
    const data = await composer.query('GetActiveLicensesByManufacturer', {
      manufacturer: ref('Manufacturer', req.params.manufacturerId),
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

// GET /queries/medicine/status/:status
router.get('/medicine/status/:status', async (req: Request, res: Response) => {
  try {
    const data = await composer.query('GetMedicineByStatus', { status: req.params.status });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

// GET /queries/medicine/type/:medicineTypeId
router.get('/medicine/type/:medicineTypeId', async (req: Request, res: Response) => {
  try {
    const data = await composer.query('GetMedicineByType', {
      medicineType: ref('MedicineType', req.params.medicineTypeId),
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

// GET /queries/medicine/owner/:ownerType/:ownerId
// ownerType: Manufacturer | Pharmacy | Citizen
router.get('/medicine/owner/:ownerType/:ownerId', async (req: Request, res: Response) => {
  try {
    const data = await composer.query('GetMedicineByOwner', {
      ownerId: ref(req.params.ownerType, req.params.ownerId),
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

// GET /queries/medicine/manufacturer/:manufacturerId
router.get('/medicine/manufacturer/:manufacturerId', async (req: Request, res: Response) => {
  try {
    const data = await composer.query('GetMedicineByManufacturer', {
      manufacturer: ref('Manufacturer', req.params.manufacturerId),
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

// GET /queries/orders/pharmacy/:pharmacyId
router.get('/orders/pharmacy/:pharmacyId', async (req: Request, res: Response) => {
  try {
    const data = await composer.query('GetOrdersByPharmacy', {
      pharmacy: ref('Pharmacy', req.params.pharmacyId),
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

// GET /queries/orders/manufacturer/:manufacturerId
router.get('/orders/manufacturer/:manufacturerId', async (req: Request, res: Response) => {
  try {
    const data = await composer.query('GetOrdersByManufacturer', {
      manufacturer: ref('Manufacturer', req.params.manufacturerId),
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

// GET /queries/orders/status/:status
router.get('/orders/status/:status', async (req: Request, res: Response) => {
  try {
    const data = await composer.query('GetOrdersByStatus', { status: req.params.status });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

// GET /queries/prescriptions/citizen/:citizenId
router.get('/prescriptions/citizen/:citizenId', async (req: Request, res: Response) => {
  try {
    const data = await composer.query('GetPrescriptionsByCitizen', {
      citizen: ref('Citizen', req.params.citizenId),
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

// GET /queries/prescriptions/doctor/:doctorId
router.get('/prescriptions/doctor/:doctorId', async (req: Request, res: Response) => {
  try {
    const data = await composer.query('GetPrescriptionsByDoctor', {
      doctor: ref('Doctor', req.params.doctorId),
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

// GET /queries/prescriptions/valid
router.get('/prescriptions/valid', async (_req: Request, res: Response) => {
  try {
    const data = await composer.query('GetValidPrescriptions');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

export default router;
