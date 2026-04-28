import { Router, Request, Response } from 'express';
import * as composer from '../services/composer';
import { Government, Manufacturer, Pharmacy, Doctor, Citizen, ApiResponse } from '../types';

const router = Router();

// ── GOVERNMENT ──────────────────────────────────────────────

router.get('/government', async (_req: Request, res: Response) => {
  try {
    const data = await composer.getAll<Government>('Government');
    const response: ApiResponse<Government[]> = { success: true, data };
    res.json(response);
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

router.post('/government', async (req: Request, res: Response) => {
  try {
    const body = { $class: 'org.acme.Government', ...req.body };
    const data = await composer.create<Government>('Government', body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

router.get('/government/:id', async (req: Request, res: Response) => {
  try {
    const data = await composer.getById<Government>('Government', req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, error: composer.extractError(err) });
  }
});

// ── MANUFACTURER ─────────────────────────────────────────────

router.get('/manufacturer', async (_req: Request, res: Response) => {
  try {
    const data = await composer.getAll<Manufacturer>('Manufacturer');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

router.post('/manufacturer', async (req: Request, res: Response) => {
  try {
    const body = { $class: 'org.acme.Manufacturer', ...req.body };
    const data = await composer.create<Manufacturer>('Manufacturer', body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

router.get('/manufacturer/:id', async (req: Request, res: Response) => {
  try {
    const data = await composer.getById<Manufacturer>('Manufacturer', req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, error: composer.extractError(err) });
  }
});

// ── PHARMACY ─────────────────────────────────────────────────

router.get('/pharmacy', async (_req: Request, res: Response) => {
  try {
    const data = await composer.getAll<Pharmacy>('Pharmacy');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

router.post('/pharmacy', async (req: Request, res: Response) => {
  try {
    const body = { $class: 'org.acme.Pharmacy', ...req.body };
    const data = await composer.create<Pharmacy>('Pharmacy', body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

router.get('/pharmacy/:id', async (req: Request, res: Response) => {
  try {
    const data = await composer.getById<Pharmacy>('Pharmacy', req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, error: composer.extractError(err) });
  }
});

// ── DOCTOR ───────────────────────────────────────────────────

router.get('/doctor', async (_req: Request, res: Response) => {
  try {
    const data = await composer.getAll<Doctor>('Doctor');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

router.post('/doctor', async (req: Request, res: Response) => {
  try {
    const body = { $class: 'org.acme.Doctor', ...req.body };
    const data = await composer.create<Doctor>('Doctor', body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

router.get('/doctor/:id', async (req: Request, res: Response) => {
  try {
    const data = await composer.getById<Doctor>('Doctor', req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, error: composer.extractError(err) });
  }
});

// ── CITIZEN ──────────────────────────────────────────────────

router.get('/citizen', async (_req: Request, res: Response) => {
  try {
    const data = await composer.getAll<Citizen>('Citizen');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

router.post('/citizen', async (req: Request, res: Response) => {
  try {
    const body = { $class: 'org.acme.Citizen', ...req.body };
    const data = await composer.create<Citizen>('Citizen', body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

router.get('/citizen/:id', async (req: Request, res: Response) => {
  try {
    const data = await composer.getById<Citizen>('Citizen', req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, error: composer.extractError(err) });
  }
});

export default router;
