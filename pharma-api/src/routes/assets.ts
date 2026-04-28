import { Router, Request, Response } from 'express';
import * as composer from '../services/composer';
import { MedicineType, License, Medicine, Order, Prescription, ApiResponse } from '../types';

const router = Router();

// ── MEDICINE TYPE ─────────────────────────────────────────────

router.get('/medicine-type', async (_req: Request, res: Response) => {
  try {
    const data = await composer.getAll<MedicineType>('MedicineType');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

router.get('/medicine-type/:id', async (req: Request, res: Response) => {
  try {
    const data = await composer.getById<MedicineType>('MedicineType', req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, error: composer.extractError(err) });
  }
});

// ── LICENSE ───────────────────────────────────────────────────

router.get('/license', async (_req: Request, res: Response) => {
  try {
    const data = await composer.getAll<License>('License');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

router.get('/license/:id', async (req: Request, res: Response) => {
  try {
    const data = await composer.getById<License>('License', req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, error: composer.extractError(err) });
  }
});

// ── MEDICINE ──────────────────────────────────────────────────

router.get('/medicine', async (_req: Request, res: Response) => {
  try {
    const data = await composer.getAll<Medicine>('Medicine');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

router.get('/medicine/:id', async (req: Request, res: Response) => {
  try {
    const data = await composer.getById<Medicine>('Medicine', req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, error: composer.extractError(err) });
  }
});

// ── ORDER ─────────────────────────────────────────────────────

router.get('/order', async (_req: Request, res: Response) => {
  try {
    const data = await composer.getAll<Order>('Order');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

router.get('/order/:id', async (req: Request, res: Response) => {
  try {
    const data = await composer.getById<Order>('Order', req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, error: composer.extractError(err) });
  }
});

// ── PRESCRIPTION ──────────────────────────────────────────────

router.get('/prescription', async (_req: Request, res: Response) => {
  try {
    const data = await composer.getAll<Prescription>('Prescription');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: composer.extractError(err) });
  }
});

router.get('/prescription/:id', async (req: Request, res: Response) => {
  try {
    const data = await composer.getById<Prescription>('Prescription', req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, error: composer.extractError(err) });
  }
});

export default router;
