import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
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
  try {
    const loteData = req.body;
    const imagenSubida = req.file; 

    // --- 1. DETERMINAR LA URL DE LA IMAGEN ---
    
    // Si Multer procesó un archivo, obtenemos la URL de req.file (escenario 2: FormData)
    if (imagenSubida) {
      // Ajusta 'location' o 'path' según tu configuración de subida a la nube (S3/Cloudinary)
      const fotoUrl = (imagenSubida as any).location || imagenSubida.path;
      
      // Sobreescribir el campo 'fotos' con la URL recién subida.
      loteData.fotos = [fotoUrl];
      
    } 
    // Si NO hay req.file (escenario 1: JSON con URL), 
    // el array 'fotos' ya viene poblado en loteData (req.body) directamente del frontend.

    // --- 2. VALIDAR Y GUARDAR ---
    const nuevoLote = new Lot(loteData);
    const loteGuardado = await nuevoLote.save();

    // --- 3. RESPUESTA ÉXITO ---
    res.status(201).json({
      success: true,
      data: loteGuardado,
      message: 'Lote creado exitosamente',
    });

  } catch (error) {
    console.error("Error al crear el lote:", error);

    // --- 4. MANEJO DE ERRORES ---
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