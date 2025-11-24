import axios from 'axios';
const API_BASE_URL = import.meta.env.PROD
    ? 'https://rescate-fresco-addhaeh7cbehd5ad.eastus2-01.azurewebsites.net/api'
    : 'http://localhost:5001/api';
// --------------------
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
api.interceptors.request.use((config) => {
    // Coge el token de localStorage
    const token = localStorage.getItem('token');
    if (token) {
        // Si existe, lo añade a los headers
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
class LotesAPI {
    async getAll(params) {
        const response = await api.get('/lotes', { params });
        return response.data;
    }
    async getById(id) {
        const response = await api.get(`/lotes/${id}`);
        return response.data;
    }
    async create(lote, imageFile) {
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
    async update(id, lote) {
        const response = await api.put(`/lotes/${id}`, lote);
        return response.data;
    }
    async cambiarEstado(id, estado) {
        const response = await api.patch(`/lotes/${id}/estado`, { estado });
        return response.data;
    }
    async delete(id) {
        const response = await api.delete(`/lotes/${id}`);
        return response.data;
    }
    async getStats() {
        const response = await api.get('/lotes/stats');
        return response.data;
    }
}
export default new LotesAPI();
