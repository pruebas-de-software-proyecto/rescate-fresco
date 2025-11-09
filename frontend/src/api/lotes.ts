import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL;
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


export const fetchLotes = async (filters: LoteFilters): Promise<Lote[]> => {
  // Asegúrate de que la URL base esté definida
  if (!API_BASE_URL) {
      throw new Error("VITE_API_URL no está definido.");
  }
  
  // 2. CONSTRUIR LA URL COMPLETA
  const API_ENDPOINT = `${API_BASE_URL}/api/lotes`; // O solo /lotes, dependiendo de la configuración de tu backend
                                                   // Mantendremos /api/lotes como lo tienes.
  
  const params: Record<string, string> = {};
  // ... (tu lógica de filtros) ...

  const response = await axios.get(API_ENDPOINT, {
    params,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });

  return response.data;
};