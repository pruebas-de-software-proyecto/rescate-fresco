import { Schema, model, Document } from 'mongoose';

export interface ILot extends Document {
  nombre: string;
  categoria: 'Frutas' | 'Verduras' | 'Lácteos' | 'Carnes' | 'Panadería' | 'Otros';
  descripcion: string;
  cantidad: number;
  unidad: 'kg' | 'unidades' | 'litros';
  precioOriginal: number;
  precioRescate: number;
  fechaVencimiento: Date;
  ventanaRetiro: string;
  ubicacion: string;
  fotos: string[];
  estado: 'disponible' | 'reservado' | 'pagado' | 'retirado' | 'vencido';
  holdExpiresAt?: Date | null;
  retiroLimite?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const lotSchema = new Schema<ILot>(
  {
    nombre: { type: String, required: true },
    categoria: {
      type: String,
      enum: ['Frutas', 'Verduras', 'Lácteos', 'Carnes', 'Panadería', 'Otros'],
      required: true,
    },
    descripcion: { type: String, required: true },
    cantidad: { type: Number, required: true },
    unidad: { 
      type: String, 
      enum: ['kg', 'unidades', 'litros'], 
      required: true 
    },
    precioOriginal: { type: Number, required: true },
    precioRescate: { type: Number, required: true },
    fechaVencimiento: { type: Date, required: true },
    ventanaRetiro: { type: String, required: true },
    ubicacion: { type: String, required: true },
    fotos: { type: [String], default: [] },
    estado: {
      type: String,
      enum: ['disponible', 'reservado', 'pagado', 'retirado', 'vencido'],
      default: 'disponible',
    },
    holdExpiresAt: { type: Date, default: null },
    retiroLimite: { type: Date, default: null },
  },
  { timestamps: true }
);

export default model<ILot>('Lot', lotSchema);
