import axios from 'axios';
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://rescate-fresco-addhaeh7cbehd5ad.eastus2-01.azurewebsites.net/api' 
  : 'http://localhost:5001/api';
// --------------------

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

// frontend/src/services/fullLotesService.ts (Función Corregida)

  async create(
      // El payload debe incluir el campo 'fotos' con las URLs
      lotePayload: Omit<FullLote, '_id' | 'createdAt' | 'updatedAt'>, 
      imageFile?: File
    ): Promise<{ data: FullLote }> {
      
      // Si NO hay archivo adjunto, enviamos el payload como JSON
      if (!imageFile) {
        console.log('Enviando datos como JSON al backend...');
        const res = await api.post('/lotes', lotePayload); // Envía JSON (application/json)
        return res.data;
      }
      
      // Si SÍ hay archivo, usamos FormData (el flujo original de Multer)
      console.log('Enviando datos como FormData (con archivo)...');
      const formData = new FormData();
      
      // Adjuntar campos de texto/datos, incluido el array 'fotos'
      Object.entries(lotePayload).forEach(([key, value]) => {
        // Manejar el array 'fotos' por separado si es necesario, 
        // o dejar que el backend lo parsee correctamente (opción más simple)
        if (key === 'fotos') {
            // Asumimos que 'value' es un array de strings (URLs)
            (value as string[]).forEach((url, index) => {
                formData.append(`${key}[${index}]`, url);
            });
        } else {
            formData.append(key, String(value));
        }
      });

      // Adjuntar el archivo
      formData.append('imagen', imageFile);

      // No se establece 'Content-Type', Axios lo hace automáticamente con el boundary
      const res = await api.post('/lotes', formData); 
      return res.data;
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