import axios from 'axios';
import type { FullLote } from '../services/types';

// Configuración de URL base según el entorno
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://rescate-fresco-addhaeh7cbehd5ad.eastus2-01.azurewebsites.net/api' 
  : 'http://localhost:5001/api';

// Instancia de axios configurada
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para agregar token de autenticación automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // Imprimimos en consola qué está pasando
    console.log(`📡 Enviando petición a: ${config.url}`);
    
    if (token) {
      console.log("✅ Token encontrado en LocalStorage. Adjuntando...");
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ ALERTA: No hay token en LocalStorage. Se envía sin credenciales.");
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interfaces
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
  proveedor?: string;
  ubicacion: string;
  fotos: string[];
  estado: 'Disponible' | 'reservado'; 
  codigoRetiro?: string;
}

export interface LoteFilters {
  categoria?: string;
  vencimientoAntesDe?: string;
  nombre?: string;
  estado?: string;
}

// Funciones del API



export const fetchLotes = async (filters: LoteFilters): Promise<Lote[]> => {
  // Preparamos los parámetros de filtrado
  const params: Record<string, string> = {};
  if (filters.categoria) params.categoria = filters.categoria;
  if (filters.vencimientoAntesDe) params.vencimientoAntesDe = filters.vencimientoAntesDe;
  if (filters.nombre) params.nombre = filters.nombre;
  if (filters.estado) params.estado = filters.estado;
  
  // Usamos la instancia 'api' configurada con baseURL y token
  const response = await api.get('/lotes', {
    params,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });

  return response.data.map((lote: Lote) => ({
    ...lote,
    estado: lote.estado || 'Disponible',
  }));
};

export const getLoteById = async (id: string): Promise<FullLote> => {
  try {
    const response = await api.get(`/lotes/${id}`);
    return {
      ...response.data,
      estado: response.data.estado || 'Disponible',
    };
  } catch (error) {
    console.error('Error al obtener lote:', error);
    throw error;
  }
};

export const reservarLote = async (id: string): Promise<void> => {
  try {
    await api.post(`/lotes/${id}/reservar`);
  } catch (error) {
    console.error('Error al reservar lote:', error);
    throw error;
  }
};

export const generarPin = async (id: string): Promise<{ codigoRetiro: string }> => {
  try {
    const response = await api.post(`/lotes/${id}/generar-pin`);
    // Retornamos la data que contiene el codigoRetiro
    return response.data;
  } catch (error) {
    console.error('Error al generar PIN:', error);
    throw error;
  }
};


// Exportar instancia de API configurada
export default api;
