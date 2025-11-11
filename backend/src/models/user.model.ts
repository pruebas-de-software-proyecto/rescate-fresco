import { Schema, model, Document } from 'mongoose';

// 1. Interfaz de TS que define el documento (para tipado)
export interface IUser extends Document {
  email: string;
  password?: string; // Es opcional en la interfaz, pero 'required' en el schema
  role: 'CONSUMIDOR' | 'TIENDA';
  nombre?: string;
  nombreTienda?: string;
}

// 2. El Schema de Mongoose (la regla para la BD)
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false // IMPORTANTE: Oculta el password en las consultas por defecto
  },
  role: {
    type: String,
    enum: ['CONSUMIDOR', 'TIENDA'],
    required: true
  },
  nombre: { type: String },
  nombreTienda: { type: String }
}, {
  timestamps: true // Añade createdAt y updatedAt
});

// 3. El Modelo (la herramienta para interactuar con la colección 'users')
// Mongoose creará la colección 'users' automáticamente
export const User = model<IUser>('User', userSchema);