import express from 'express';
import { getLotes, createLote } from '../controllers/lotController';

const router = express.Router();

router.get('/', getLotes);
router.post('/', createLote);
export default router;
