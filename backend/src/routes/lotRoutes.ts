import express from 'express';
import { createLote, getLoteById, getLotes } from '../controllers/lotController';

const router = express.Router();

router.get('/', getLotes);
router.post('/', createLote);
router.get('/:id', getLoteById);
export default router;
