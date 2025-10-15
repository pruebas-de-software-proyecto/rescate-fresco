import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lot from './models/lotModels'; 

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/farmlink');
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

const loteExample = {
  nombre: 'Manzanas',
  categoria: 'Frutas',
  descripcion: 'Manzanas rojas frescas',
  cantidad: 10,
  unidad: 'kg',
  precioOriginal: 1000,
  precioRescate: 500,
  fechaVencimiento: new Date('2025-10-20T12:00:00Z'),
  ventanaRetiro: '09:00 - 12:00',
  ubicacion: 'Tienda Central',
  fotos: ['https://example.com/manzanas.jpg'],
};

const seedLote = async () => {
  await connectDB();

  try {
    const lote = new Lot(loteExample);
    await lote.save();
    console.log('Lote insertado correctamente:', lote);
  } catch (error) {
    console.error('Error insertando lote:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedLote();
