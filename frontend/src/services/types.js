// 1. IMPORTAMOS la instancia 'api' CORRECTA (la que tiene el token)
import api from '../api/lotes';
// 4. LA CLASE (que ya estaba bien y usa la 'api' importada)
class FullLotesAPI {
    async getAll() {
        // Esta ruta '/lotes' probablemente debería ser '/lotes/gestion'
        // Revisa tus rutas del backend, pero por ahora usa el token.
        const res = await api.get('/lotes');
        return res.data;
    }
    async create(lotePayload, imageFile) {
        if (!imageFile) {
            console.log('Enviando datos como JSON al backend...');
            const res = await api.post('/lotes', lotePayload);
            return res.data;
        }
        console.log('Enviando datos como FormData (con archivo)...');
        const formData = new FormData();
        Object.entries(lotePayload).forEach(([key, value]) => {
            if (key === 'fotos') {
                value.forEach((url, index) => {
                    formData.append(`${key}[${index}]`, url);
                });
            }
            else {
                formData.append(key, String(value));
            }
        });
        formData.append('imagen', imageFile);
        const res = await api.post('/lotes', formData);
        return res.data;
    }
    async getById(id) {
        const res = await api.get(`/lotes/${id}`); // <-- Enviará token
        return res.data;
    }
    async update(id, lote) {
        const res = await api.put(`/lotes/${id}`, lote); // <-- Enviará token
        return res.data;
    }
    async delete(id) {
        const res = await api.delete(`/lotes/${id}`); // <-- Enviará token
        return res.data;
    }
}
export default new FullLotesAPI();
