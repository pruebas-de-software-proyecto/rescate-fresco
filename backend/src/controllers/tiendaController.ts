import { Request, Response } from 'express';
import { User } from '../models/user.model';

export const getMiTienda = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'No estás autenticado' });
    }

    const usuario = await User.findById(userId).select('nombreTienda email role');

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      id: usuario._id,
      nombreTienda: usuario.nombreTienda,
      email: usuario.email
    });

  } catch (error) {
    console.error('Error al obtener perfil de tienda:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};