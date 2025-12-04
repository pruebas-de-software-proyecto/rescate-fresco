import dotenv from 'dotenv';
dotenv.config(); // Configurar dotenv al principio

import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import cron from "node-cron";
import Stripe from "stripe";

// Configuración y Modelos
import connectDB from './config/db';
import Lot from "./models/lotModels";

// Importación de Rutas
import authRoutes from './routes/auth.routes';
import lotRoutes from './routes/lotRoutes';
import paymentRoutes from './routes/paymentRoutes';
import reservaRoutes from "./routes/reservaRoutes";
import tiendaRoutes from './routes/tiendaRoutes'; // <--- Importado aquí arriba

const app = express();
const PORT = process.env.PORT || 5001;

// 1. Conectar a la base de datos
connectDB();

// 2. Configuración de CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://mango-mushroom-0e9b2f40f.3.azurestaticapps.net'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// 3. Configuración de Stripe (Webhook debe ir ANTES del express.json)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error("❌ Webhook error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as Stripe.PaymentIntent;
      const lotId = pi.metadata.lotId;

      try {
        await Lot.findByIdAndUpdate(lotId, { estado: "reservado" });
        console.log("✅ Lote marcado como reservado:", lotId);
      } catch (err) {
        console.error("Error actualizando lote:", err);
      }
    }

    res.json({ received: true });
  }
);

// 4. Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging de requests
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// 5. Rutas Base
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

app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// 6. RUTAS DE LA API (El orden importa)
app.use('/api/auth', authRoutes);
app.use('/api/lotes', lotRoutes);
app.use("/api/reservas", reservaRoutes); 
app.use('/api/payments', paymentRoutes);
app.use('/api/tienda', tiendaRoutes);

// 7. Manejo de errores (Catch-All)
// Si ninguna ruta anterior coincidió, cae aquí (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.path}`
  });
});

// Manejo de errores global (500)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 8. Cron Jobs
cron.schedule("0 0 * * *", async () => {
  console.log("Verificando lotes vencidos...");
  const hoy = new Date();
  await Lot.updateMany(
    { fechaVencimiento: { $lt: hoy }, estado: { $ne: "vencido" } },
    { $set: { estado: "vencido" } }
  );
  console.log("Lotes vencidos actualizados");
});

// 9. Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`);
  console.log(`📍 API disponible en http://localhost:${PORT}`);
});

export default app;