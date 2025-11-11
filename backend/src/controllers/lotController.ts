import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import Lot from '../models/lotModels';

export const getLotes = async (req: Request, res: Response) => {
  try {
    const filters: any = {};
    const { categoria, vencimientoAntesDe, nombre } = req.query;
    if (nombre) {
      filters.nombre = { $regex: nombre, $options: 'i' };
    }
    if (categoria && categoria !== 'Todos') {
      filters.categoria = categoria;
    }
    if (vencimientoAntesDe) {
      try {
        const targetDate = new Date(vencimientoAntesDe as string);
        filters.fechaVencimiento = { $gte: targetDate };
      } catch (e) {
        console.error("Fecha de vencimiento no válida:", vencimientoAntesDe);
      }
    }
    console.log("Filtros de MongoDB aplicados:", filters);
    const lotes = await Lot.find(filters);
    res.json(lotes);
  } catch (error) {
    console.error("Error al obtener lotes:", error);
    res.status(500).json({ error: 'Error interno del servidor al obtener lotes' });
  }
};


export const createLote = async (req: Request, res: Response) => {
  try {
    const loteData = req.body;
    const imagenSubida = req.file; 
    if (imagenSubida) {
      const fotoUrl = (imagenSubida as any).location || imagenSubida.path;
      loteData.fotos = [fotoUrl];
    }
    const nuevoLote = new Lot(loteData);
    const loteGuardado = await nuevoLote.save();
    res.status(201).json({
      success: true,
      data: loteGuardado,
      message: 'Lote creado exitosamente',
    });
  } catch (error) {
    console.error("Error al crear el lote:", error);
    if (error instanceof MongooseError.ValidationError) {
        return res.status(400).json({ 
            success: false, 
            message: "Fallo la validación de datos. Verifique que todos los campos requeridos han sido enviados.",
            errors: (error as any).errors
        });
    }
    res.status(500).json({ success: false, error: 'Error interno al crear el lote' });
  }
};

export const getLoteById = async (req: Request, res: Response) => {
  try {
    const lote = await Lot.findById(req.params.id); // Asumo que esta línea falta o fue removida
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

export const deleteLote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Lot.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Lote no encontrado' });
    res.json({ message: 'Lote eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar lote' });
  }
};