import express from 'express';
import { actualizarLote, createLote, deleteLote, generarCodigoRetiro, getLoteById, getLotes, pagarLote, reservarLote, getMisLotes } from '../controllers/lotController';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', getLotes);
router.post('/', protect, createLote);
router.get('/mis-lotes', protect, getMisLotes);

router.get('/:id', getLoteById);

router.put('/:id', actualizarLote); // Actualizar lote
router.delete('/:id', deleteLote); // Eliminar lote

router.post("/:id/reservar", reservarLote); // Reservar lote
router.post("/:id/pagar", pagarLote); // Pagar lote 
router.post("/:id/generar-pin", generarCodigoRetiro); // Generar código de retiro


export default router;
