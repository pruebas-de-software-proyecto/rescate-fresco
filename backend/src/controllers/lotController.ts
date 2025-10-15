import { Request, Response } from 'express';
import Lot from '../models/lotModels';

export const getLotes = async (req: Request, res: Response) => {
  try {
    const lotes = await Lot.find();
    res.json(lotes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener lotes' });
  }
};

export const createLote = async (req: Request, res: Response) => {
  const nuevoLote = new Lot(req.body);
  const loteGuardado = await nuevoLote.save();
  res.status(201).json(loteGuardado);
};
