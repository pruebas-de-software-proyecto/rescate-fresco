import axios from 'axios';
// Configuración de URL base según el entorno
const API_BASE_URL = import.meta.env.PROD
    ? 'https://rescate-fresco-addhaeh7cbehd5ad.eastus2-01.azurewebsites.net/api'
    : 'http://localhost:5001/api';
// Instancia de axios configurada
const api = axios.create({
    baseURL: API_BASE_URL,
});
// Interceptor para agregar token de autenticación automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// Funciones del API
export const fetchLotes = async (filters) => {
    // Preparamos los parámetros de filtrado
    const params = {};
    if (filters.categoria)
        params.categoria = filters.categoria;
    if (filters.vencimientoAntesDe)
        params.vencimientoAntesDe = filters.vencimientoAntesDe;
    if (filters.nombre)
        params.nombre = filters.nombre;
    // Usamos la instancia 'api' configurada con baseURL y token
    const response = await api.get('/lotes', {
        params,
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
        },
    });
    return response.data.map((lote) => ({
        ...lote,
        estado: lote.estado || 'Disponible',
    }));
};
export const getLoteById = async (id) => {
    try {
        const response = await api.get(`/lotes/${id}`);
        return {
            ...response.data,
            estado: response.data.estado || 'Disponible',
        };
    }
    catch (error) {
        console.error('Error al obtener lote:', error);
        throw error;
    }
};
export const reservarLote = async (id) => {
    try {
        await api.post(`/lotes/${id}/reservar`);
    }
    catch (error) {
        console.error('Error al reservar lote:', error);
        throw error;
    }
};
// Exportar instancia de API configurada
export default api;
