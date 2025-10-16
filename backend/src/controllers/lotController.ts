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

export const getLoteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lote = await Lot.findById(id);

    if (!lote) {
      return res.status(404).json({ message: 'Lote no encontrado' });
    }
    res.json(lote);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el lote' });
  }
};

export const actualizarLote = async (req: Request, res: Response) => {
  try {
    const loteActualizado = await Lot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!loteActualizado) return res.status(404).json({ message: 'Lote no encontrado' });
    res.json(loteActualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar lote' });
  }
};