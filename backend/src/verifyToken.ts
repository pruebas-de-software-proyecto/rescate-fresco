import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // 1. Buscamos el token en el header "Authorization"
  // El cliente lo envía como: "Bearer eyJhbGciOiJIUz..."
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    // 2. Verificamos el token con la clave secreta
    // IMPORTANTE: Debe ser la misma clave que usaste en authController.ts para el login
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
        console.error("ERROR CRÍTICO: JWT_SECRET no está definido en el .env");
        return res.status(500).json({ error: "Error de configuración en el servidor" });
    }

    const verified = jwt.verify(token, secret);
    
    // 3. Agregamos el usuario decodificado a la request
    // Usamos (req as any) para adjuntar la propiedad 'user' sin errores de TypeScript
    (req as any).user = verified;
    
    next(); // Todo bien, pasamos al controlador (getMiTienda)
  } catch (error) {
    res.status(400).json({ error: 'Token no válido o expirado.' });
  }
};