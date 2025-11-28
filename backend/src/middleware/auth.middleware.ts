import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model'; // Importamos nuestra interfaz de usuario

interface JwtPayload {
  id: string;
  role: 'CONSUMIDOR' | 'TIENDA';
  email: string;
}

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload; // El usuario decodificado del token
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  console.log("--- MIDDLEWARE PROTECT ---");
  console.log("Header Auth recibido:", req.headers.authorization);

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error('Falta JWT_SECRET');

      const decoded = jwt.verify(token, secret) as any;
      
      console.log("Token decodificado correctamente. Usuario ID:", decoded.id);
      
      req.user = decoded;
      next();
      return;

    } catch (error) {
      console.error("Error verificando token:", error);
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }
  }

  if (!token) {
    console.log("No se encontró token en el header");
    return res.status(401).json({ message: 'No autorizado, no hay token' });
  }
};