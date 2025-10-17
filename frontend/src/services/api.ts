import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Lote {
  _id?: string;
  codigoLote: string;
  nombreProducto: string;
  categoria: 'Frutas' | 'Verduras' | 'Lácteos' | 'Carnes' | 'Panadería' | 'Otros';
  cantidad: number;
  unidad: 'kg' | 'unidades' | 'litros';
  fechaVencimiento: string | Date;
  proveedor: string;
  estado: 'Disponible' | 'Reservado' | 'Donado' | 'Vencido';
  ubicacion?: string;
  observaciones?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}

export interface Stats {
  total: number;
  porEstado: {
    disponibles: number;
    reservados: number;
    donados: number;
    vencidos: number;
  };
  proximosVencer: number;
  porCategoria: Array<{
    _id: string;
    total: number;
    disponibles: number;
  }>;
}

class LotesAPI {
  async getAll(params?: {
    search?: string;
    categoria?: string;
    estado?: string;
    ordenar?: string;
  }): Promise<ApiResponse<Lote[]>> {
    const response = await api.get('/lotes', { params });
    return response.data;
  }

  async getById(id: string): Promise<ApiResponse<Lote>> {
    const response = await api.get(`/lotes/${id}`);
    return response.data;
  }

  async create(
    lote: Omit<Lote, '_id' | 'createdAt' | 'updatedAt'>,
    imageFile?: File
  ): Promise<ApiResponse<Lote>> {
    const formData = new FormData();
    Object.entries(lote).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    if (imageFile) {
      formData.append('imagen', imageFile);
    }

    const response = await api.post('/lotes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async update(id: string, lote: Partial<Lote>): Promise<ApiResponse<Lote>> {
    const response = await api.put(`/lotes/${id}`, lote);
    return response.data;
  }

  async cambiarEstado(id: string, estado: Lote['estado']): Promise<ApiResponse<Lote>> {
    const response = await api.patch(`/lotes/${id}/estado`, { estado });
    return response.data;
  }

  async delete(id: string): Promise<ApiResponse<Lote>> {
    const response = await api.delete(`/lotes/${id}`);
    return response.data;
  }

  async getStats(): Promise<ApiResponse<Stats>> {
    const response = await api.get('/lotes/stats');
    return response.data;
  }
}

export default new LotesAPI();