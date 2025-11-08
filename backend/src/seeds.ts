import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Lot from './models/lotModels';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://fcafigueroal_db_user:xvO26Cq0mQlvyUBd@rescate-fresco-cluster.myy7abz.mongodb.net/farmlink?retryWrites=true&w=majority');
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
