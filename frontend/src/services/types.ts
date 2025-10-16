// frontend/src/services/fullLotesService.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

export interface FullLote {
  _id: string;
  nombre: string;
  nombreProducto?: string;
  categoria: 'Frutas' | 'Verduras' | 'Lácteos' | 'Carnes' | 'Panadería' | 'Otros';
  descripcion: string;
  cantidad: number;
  unidad: 'kg' | 'unidades' | 'litros';
  precioOriginal: number;
  precioRescate: number;
  fechaVencimiento: string;
  ventanaRetiro: string;
  ubicacion: string;
  fotos: string[];
  estado: 'Disponible' | 'Reservado' | 'Donado' | 'Vencido';
  proveedor: string;
  observaciones?: string;
  createdAt?: string;
  updatedAt?: string;
}

const api = axios.create({ baseURL: API_BASE_URL });

class FullLotesAPI {
  async getAll(): Promise<FullLote[]> {
    const res = await api.get('/lotes'); // usa el endpoint existente
    return res.data; // devuelve todos los campos
  }

  async getById(id: string): Promise<FullLote> {
    const res = await api.get(`/lotes/${id}`);
    return res.data;
  }

  async update(id: string, lote: Partial<FullLote>): Promise<FullLote> {
    const res = await api.put(`/lotes/${id}`, lote);
    return res.data;
  }

  async delete(id: string): Promise<FullLote> {
    const res = await api.delete(`/lotes/${id}`);
    return res.data;
  }
}

export default new FullLotesAPI();
