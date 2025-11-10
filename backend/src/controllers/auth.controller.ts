import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// --- REGISTRO ---
export const register = async (req: Request, res: Response) => {
  const { email, password, role, nombre, nombreTienda } = req.body;

  try {
    // 1. Validar que la contraseña exista (TS no lo sabe si está oculta)
    if (!password) {
      return res.status(400).json({ message: 'La contraseña es requerida' });
    }

    // 2. Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El email ya está en uso' });
    }

    // 3. Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Crear el usuario
    const user = new User({
      email,
      password: hashedPassword,
      role,
      nombre: role === 'CONSUMIDOR' ? nombre : undefined,
      nombreTienda: role === 'TIENDA' ? nombreTienda : undefined,
    });

    // 5. Guardar en BD
    await user.save();
    
    res.status(201).json({ message: 'Usuario creado exitosamente' });

  } catch (error: any) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// --- LOGIN ---
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 1. Validar que envíen datos
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    // 2. Buscar usuario (y pedir explícitamente el password)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 3. Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 4. Crear el Token (JWT)
    const payload = {
      id: user._id,
      role: user.role,
      email: user.email
    };

    // 5. Leer el secreto del .env
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET no está definido en las variables de entorno');
    }

    const token = jwt.sign(payload, secret, { expiresIn: '1d' });

    // 6. Enviar el token al frontend
    res.json({
      message: 'Login exitoso',
      token: token,
      user: { id: user._id, email: user.email, role: user.role }
    });

  } catch (error: any) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};