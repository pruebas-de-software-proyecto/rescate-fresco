import express, { Request, Response, Router } from "express";
import Stripe from "stripe";
import Lot from "../models/lotModels";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Crear pago simulado
router.post("/create-simulation", async (req: Request, res: Response) => {
  const { lotId } = req.body;
  console.log("Body recibido:", req.body);

  if (!lotId) return res.status(400).json({ error: "No se envió lotId" });

  try {
    const lote = await Lot.findById(lotId);
    if (!lote) return res.status(404).json({ error: "Lote no encontrado" });

    const pi = await stripe.paymentIntents.create({
      amount: Math.round(lote.precioRescate * 100),
      currency: "clp",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
      payment_method: "pm_card_visa",
      confirm: true,
      metadata: { lotId },
    });
    
    console.log("PaymentIntent creado:", pi.id);
    return res.json({ ok: true, paymentIntentId: pi.id, status: pi.status });
  } catch (err: any) {
    console.error("Error creando PaymentIntent:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Webhook para actualizar lote cuando se confirme pago
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    console.log("📩 Webhook recibido");
    const sig = req.headers["stripe-signature"] as string;
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error("Webhook error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("✅ Evento recibido de Stripe:", event.type);

    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as Stripe.PaymentIntent;
      const lotId = pi.metadata.lotId;

      try {
        await Lot.findByIdAndUpdate(lotId, { estado: "Reservado" });
        console.log("✅ Lote marcado como reservado:", lotId);
      } catch (err) {
        console.error("Error actualizando lote:", err);
      }
    }

    res.json({ received: true });
  }
);


export default router;
