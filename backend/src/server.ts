import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import connectDB from './config/db';
import lotRoutes from './routes/lotRoutes';

const app = express();
const PORT = process.env.PORT || 5001;

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de requests
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Ruta raíz
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: '✅ API de Rescate Fresco',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      lotes: '/api/lotes',
      stats: '/api/lotes/stats',
      health: '/health'
    }
  });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// IMPORTANTE: Rutas de la API
app.use('/api/lotes', lotRoutes);

// Manejo de rutas no encontradas
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.path}`
  });
});

// Manejo de errores global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`);
  console.log(`📍 API disponible en http://localhost:${PORT}`);
  console.log(`📊 Documentación en http://localhost:${PORT}/api/lotes`);
});

export default app;