import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string; 
  role: 'CONSUMIDOR' | 'TIENDA';
  nombre?: string;
  nombreTienda?: string;
}


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
    select: false 
  },
  role: {
    type: String,
    enum: ['CONSUMIDOR', 'TIENDA'],
    required: true
  },
  nombre: { type: String },
  nombreTienda: { type: String }
}, {
  timestamps: true
});

export const User = model<IUser>('User', userSchema);