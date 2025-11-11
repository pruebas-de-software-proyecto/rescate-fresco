import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model'; // Importamos nuestra interfaz de usuario

// Definimos un tipo para el payload que está dentro del token
interface JwtPayload {
  id: string;
  role: 'CONSUMIDOR' | 'TIENDA';
  email: string;
}

// Extendemos la interfaz Request de Express para añadir nuestra propiedad 'user'
// Esto es para que TypeScript no se queje cuando hagamos 'req.user'
declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload; // El usuario decodificado del token
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // 1. Revisar si el token viene en el header 'Authorization'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extraer el token (ej: "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verificar el token
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET no está definido');
      }

      const decoded = jwt.verify(token, secret) as JwtPayload;
      
      // 4. Añadir el payload del usuario al objeto 'req'
      // Así, todas las rutas protegidas sabrán "quién" hizo la petición
      req.user = decoded;
      
      // 5. Dejar pasar la petición
      next();

    } catch (error) {
      // Si el token es inválido o expiró
      return res.status(401).json({ message: 'No autorizado, token inválido' });
    }
  }

  // 6. Si no hay token en el header
  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no hay token' });
  }
};