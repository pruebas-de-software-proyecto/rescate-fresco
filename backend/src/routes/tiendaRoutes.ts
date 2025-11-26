import { Router } from 'express';
import { getMiTienda } from '../controllers/tiendaController';
import { verifyToken } from '../verifyToken';

const router = Router();

// GET /api/tiendas/me
// 1. verifyToken -> Revisa el token y extrae el ID
// 2. getMiTienda -> Usa ese ID para buscar en la BD
router.get('/me', verifyToken, getMiTienda);

export default router;