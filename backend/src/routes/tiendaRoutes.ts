import { Router } from 'express';
import { getMiTienda } from '../controllers/tiendaController';
import { verifyToken } from '../verifyToken';

const router = Router();

router.get('/me', verifyToken, getMiTienda);

export default router;