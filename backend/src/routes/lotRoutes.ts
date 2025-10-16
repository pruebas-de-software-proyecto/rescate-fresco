import express from 'express';
import { createLote, getLoteById, getLotes, actualizarLote } from '../controllers/lotController';

const router = express.Router();

router.get('/', getLotes);
router.post('/', createLote);
router.get('/:id', getLoteById);

router.put('/:id', actualizarLote); //actualizar lote

export default router;
