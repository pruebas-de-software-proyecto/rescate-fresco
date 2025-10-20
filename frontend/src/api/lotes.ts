export interface Lote {
  _id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  cantidad: number;
  unidad: 'kg' | 'unidades' | 'litros';
  precioOriginal: number;
  precioRescate: number;
  fechaVencimiento: string;
  ventanaRetiro: string;
  ubicacion: string;
  fotos: string[];
}

export interface LoteFilters {
  categoria?: string;
  vencimientoAntesDe?: string;
  nombre?: string;
}

import axios from 'axios';

export const fetchLotes = async (filters: LoteFilters): Promise<Lote[]> => {
  // Convertir filtros a objeto plano (no URLSearchParams)
  const params: Record<string, string> = {};

  if (filters.categoria) {
    params.categoria = filters.categoria;
  }
  if (filters.vencimientoAntesDe) {
    params.vencimientoAntesDe = filters.vencimientoAntesDe;
  }
  if (filters.nombre) {
    params.nombre = filters.nombre;
  }

  const response = await axios.get('/api/lotes', {
    params,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });

  return response.data;
};