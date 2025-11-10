import axios from 'axios';

// 1. TU LÓGICA DE URL (ESTÁ PERFECTA)
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://rescate-fresco-addhaeh7cbehd5ad.eastus2-01.azurewebsites.net/api' 
  : 'http://localhost:5001/api';

// --- 2. CREAMOS LA INSTANCIA 'API' CON TOKEN ---
// Esta instancia 'api' reemplazará a 'axios'
const api = axios.create({
  baseURL: API_BASE_URL,
});

// 3. EL INTERCEPTOR (LA MAGIA)
// Esto se ejecuta ANTES de CUALQUIER llamada hecha con 'api'
api.interceptors.request.use(
  (config) => {
    // Coge el token de localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      // Si existe, lo añade a los headers
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Devuelve la config (con el token) para que la llamada continúe
  },
  (error) => {
    // Si hay un error al adjuntar el token, rechaza la promesa
    return Promise.reject(error);
  }
);
// ----------------------------------------------

// --- TUS INTERFACES (ESTÁN PERFECTAS) ---
export interface Lote {
  _id: string;
  nombre: string;
  categoria: string;
  // ... (el resto de tus campos)
  fotos: string[];
}

export interface LoteFilters {
  categoria?: string;
  vencimientoAntesDe?: string;
  nombre?: string;
}
// ----------------------------------------

// --- 'fetchLotes' MODIFICADO ---
export const fetchLotes = async (filters: LoteFilters): Promise<Lote[]> => {
  
  // 4. Preparamos los parámetros (tu lógica original)
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
      'Expires': '0'
    }
  });

  // Asumimos que tu API devuelve el array de lotes directamente
  return response.data;
};
// -----------------------------

// 6. EXPORTAMOS 'api' PARA QUE OTROS COMPONENTES LO USEN
export default api;