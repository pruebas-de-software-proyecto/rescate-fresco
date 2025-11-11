import express from "express";
import { reservarLote } from "../controllers/lotController"; 

const router = express.Router();

router.post("/", reservarLote);

export default router;
