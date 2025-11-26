import express from 'express';
import { actualizarLote, createLote, deleteLote, generarCodigoRetiro, getLoteById, getLotes, pagarLote, reservarLote } from '../controllers/lotController';

const router = express.Router();

router.get('/', getLotes);
router.post('/', createLote);
router.get('/:id', getLoteById);

router.put('/:id', actualizarLote); // Actualizar lote
router.delete('/:id', deleteLote); // Eliminar lote

router.post("/:id/reservar", reservarLote); // Reservar lote
router.post("/:id/pagar", pagarLote); // Pagar lote 
router.post("/:id/generar-pin", generarCodigoRetiro); // Generar código de retiro


export default router;
