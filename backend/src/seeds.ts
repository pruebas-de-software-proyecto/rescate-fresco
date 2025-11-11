import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Lot from './controllers/models/lotModels';

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
  nombre: 'Paltas',
  categoria: 'Verduras',
  descripcion: 'Palta Hass Madura',
  cantidad: 25,
  unidad: 'kg',
  precioOriginal: 3500,
  precioRescate: 2700,
  fechaVencimiento: new Date('2025-10-20T12:00:00Z'),
  ventanaRetiro: '12:00 - 17:00',
  ubicacion: 'Persa Bio-Bio',
  fotos: ['https://example.com/paltas.jpg'],
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
