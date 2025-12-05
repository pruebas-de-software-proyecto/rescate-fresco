import { Router } from 'express';
import { getMiTienda, getMetricas } from '../controllers/tiendaController';
import { verifyToken } from '../verifyToken';

const router = Router();

router.get('/me', verifyToken, getMiTienda);
router.get('/metricas', verifyToken, getMetricas);

export default router;