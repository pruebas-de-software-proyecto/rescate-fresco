import { Request, Response } from 'express';
import Lot from '../models/lotModels';

export const getLotes = async (req: Request, res: Response) => {
  try {
    // 1. Inicializa el objeto de filtros de Mongoose/MongoDB
    const filters: any = {};
    const { categoria, vencimientoAntesDe, nombre } = req.query;

    // --- FILTRO DE NOMBRE (Ya funcionaba) ---
    if (nombre) {
      // Búsqueda insensible a mayúsculas/minúsculas
      filters.nombre = { $regex: nombre, $options: 'i' };
    }

    // --- FILTRO DE CATEGORÍA (NUEVA LÓGICA) ---
    if (categoria && categoria !== 'Todos') {
      // Asume que el campo en tu modelo se llama 'categoria'
      filters.categoria = categoria;
    }

    // --- FILTRO DE VENCIMIENTO (NUEVA LÓGICA CLAVE) ---
    if (vencimientoAntesDe) {
      // El cliente envía una fecha ISO, necesitamos un objeto Date para la comparación.
      // $lte: Busca documentos donde la fechaVencimiento es Menor o Igual a la fecha proporcionada.
      try {
        const targetDate = new Date(vencimientoAntesDe as string);
        filters.fechaVencimiento = { $lte: targetDate };
      } catch (e) {
        // Manejo de error si la fecha no es válida, aunque el frontend la envía bien.
        console.error("Fecha de vencimiento no válida:", vencimientoAntesDe);
        // Podrías devolver un error 400 aquí, pero por ahora solo se ignora el filtro
      }
    }

    // 2. Ejecuta la consulta con todos los filtros aplicados
    console.log("Filtros de MongoDB aplicados:", filters);
    const lotes = await Lot.find(filters);

    res.json(lotes);
  } catch (error) {
    console.error("Error al obtener lotes:", error);
    res.status(500).json({ error: 'Error interno del servidor al obtener lotes' });
  }
};

export const createLote = async (req: Request, res: Response) => {
    // Implementación de createLote si existe en HEAD o en tu rama
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