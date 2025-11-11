import axios from 'axios';

// 1. TU LÓGICA DE URL (ESTÁ PERFECTA)
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://rescate-fresco-addhaeh7cbehd5ad.eastus2-01.azurewebsites.net/api' 
  : 'http://localhost:5001/api';

// 2. CREAMOS LA INSTANCIA 'API' CENTRAL
// Esta instancia 'api' reemplazará a 'axios' en todo el proyecto
const api = axios.create({
  baseURL: API_BASE_URL,
});

// 3. AÑADIMOS EL INTERCEPTOR DE TOKEN (LA MAGIA)
// Esto se ejecuta ANTES de CUALQUIER llamada hecha con 'api'
api.interceptors.request.use(
  (config) => {
    // Coge el token de localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      // Si existe, lo añade a los headers
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Devuelve la config (con el token)
  },
  (error) => {
    return Promise.reject(error);
  }
);
// ----------------------------------------------

// --- TUS INTERFACES (ESTÁN PERFECTAS) ---
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
  tienda: string;
  ubicacion: string;
  fotos: string[];
  estado: 'Disponible' | 'reservado'; 
}

export interface LoteFilters {
  categoria?: string;
  vencimientoAntesDe?: string;
  nombre?: string;
}
// ----------------------------------------

export const fetchLotes = async (filters: LoteFilters): Promise<Lote[]> => {
  const params: Record<string, string> = {};

  if (filters.categoria) params.categoria = filters.categoria;
  if (filters.vencimientoAntesDe) params.vencimientoAntesDe = filters.vencimientoAntesDe;
  if (filters.nombre) params.nombre = filters.nombre;

  const response = await axios.get('/api/lotes', {
    params,
    headers: {
// --- 'fetchLotes' MODIFICADO ---
export const fetchLotes = async (filters: LoteFilters): Promise<Lote[]> => {
  
  // Preparamos los parámetros (tu lógica original)
  const params: Record<string, string> = {};
  if (filters.categoria) params.categoria = filters.categoria;
  if (filters.vencimientoAntesDe) params.vencimientoAntesDe = filters.vencimientoAntesDe;
  if (filters.nombre) params.nombre = filters.nombre;
  
  // 5. CAMBIO CLAVE:
  // Usamos 'api.get' (que tiene baseURL y token)
  // en lugar de 'axios.get(API_ENDPOINT...'
  const response = await api.get('/lotes', { // Solo la ruta relativa
    params, // Tus filtros
    headers: { // Tus headers de caché
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });

  return response.data.map((lote: Lote) => ({
    ...lote,
    estado: lote.estado || 'disponible',
  }));
};

export const reservarLote = async (id: string): Promise<void> => {
  try {
    await axios.post(`/api/lotes/${id}/reservar`);
  } catch (error) {
    console.error('Error al reservar lote:', error);
    throw error;
  }
};
  // Asumimos que tu API devuelve el array de lotes directamente
  return response.data;
};
// -----------------------------

// 6. EXPORTAMOS 'api' PARA QUE OTROS ARCHIVOS LO USEN
export default api;
