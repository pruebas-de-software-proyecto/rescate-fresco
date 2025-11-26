import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import Lot from '../models/lotModels';

export const getLotes = async (req: Request, res: Response) => {
  try {
    const filters: any = {};
    const { categoria, vencimientoAntesDe, nombre } = req.query;
    if (nombre) filters.nombre = { $regex: nombre, $options: 'i' };
    if (categoria && categoria !== 'Todos') filters.categoria = categoria;
    if (vencimientoAntesDe) {
      const targetDate = new Date(vencimientoAntesDe as string);
      filters.fechaVencimiento = { $gte: targetDate };
    }
    filters.estado = { $in: ['Disponible', 'reservado'] };
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
        errors: (error as any).errors,
      });
    }
    res.status(500).json({ success: false, error: 'Error interno al crear el lote' });
  }
};

export const getLoteById = async (req: Request, res: Response) => {
  try {
    const lote = await Lot.findById(req.params.id);
    if (!lote) return res.status(404).json({ message: 'Lote no encontrado' });
    if (lote.estado === 'reservado' && lote.holdExpiresAt && lote.holdExpiresAt < new Date()) {
      lote.estado = 'Disponible';
      lote.holdExpiresAt = null;
      await lote.save();
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
    const deleted = await Lot.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Lote no encontrado' });
    res.json({ message: 'Lote eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar lote' });
  }
};

export const reservarLote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lote = await Lot.findById(id);
    if (!lote) return res.status(404).json({ error: "Lote no encontrado" });
    if (lote.estado !== "Disponible")
      return res.status(400).json({ error: "El lote no está disponible" });

    const holdDuration = 15 * 60 * 1000; 
    lote.estado = "reservado";
    lote.holdExpiresAt = new Date(Date.now() + holdDuration);
    await lote.save();
    res.json({
      message: "Lote reservado temporalmente. Tienes 15 minutos para pagar.",
      reservaId: lote._id,
      lote,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al reservar lote", details: error });
  }
};

export const pagarLote = async (req: Request, res: Response) => {
  try {
    const { loteId } = req.body;
    const lote = await Lot.findById(loteId);
    if (!lote) return res.status(404).json({ error: "Lote no encontrado" });
    if (lote.estado !== "reservado")
      return res.status(400).json({ error: "El lote no está reservado" });
    if (lote.holdExpiresAt && lote.holdExpiresAt < new Date()) {
      lote.estado = "Disponible";
      lote.holdExpiresAt = null;
      await lote.save();
      return res.status(400).json({ error: "La reserva expiró. Debes reservar nuevamente." });
    }
    lote.estado = "pagado";
    lote.holdExpiresAt = null;
    const [inicio, fin] = lote.ventanaRetiro.split("-");
    const [h, m] = fin.split(":").map(Number);
    const retiroLimite = new Date();
    retiroLimite.setHours(h, m, 0, 0);
    lote.retiroLimite = retiroLimite;
    await lote.save();
    res.json({
      message: "Pago confirmado. Puedes retirar el lote dentro de la ventana horaria.",
      lote,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al procesar el pago" });
  }
};

export const generarCodigoRetiro = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
    const lote = await Lot.findByIdAndUpdate(
      id,
      { codigoRetiro: codigo },
      { new: true }
    );

    if (!lote) {
      return res.status(404).json({ error: "Lote no encontrado" });
    }
    res.json({
      message: "Código generado correctamente",
      codigoRetiro: lote.codigoRetiro,
      loteId: lote._id
    });

  } catch (error) {
    console.error("Error al generar PIN:", error);
    res.status(500).json({ error: "Error interno al generar el código" });
  }
};
