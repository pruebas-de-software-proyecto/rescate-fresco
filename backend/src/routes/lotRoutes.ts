import express from 'express';
import { createLote, getLoteById, getLotes, actualizarLote, deleteLote } from '../controllers/lotController';

const router = express.Router();

router.get('/', getLotes);
router.post('/', createLote);
router.get('/:id', getLoteById);

router.put('/:id', actualizarLote); //actualizar lote
router.delete('/:id', deleteLote); // Eliminar lote

export default router;
