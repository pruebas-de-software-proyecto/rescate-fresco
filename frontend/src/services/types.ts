import api from '../api/lotes';

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

// 4. LA CLASE (que ya estaba bien y usa la 'api' importada)
class FullLotesAPI {
  async getAll(): Promise<FullLote[]> {
    // Esta ruta '/lotes' probablemente debería ser '/lotes/gestion'
    // Revisa tus rutas del backend, pero por ahora usa el token.
    const res = await api.get('/lotes'); 
    return res.data;
  }

  async create(
    lotePayload: Omit<FullLote, '_id' | 'createdAt' | 'updatedAt'>, 
    imageFile?: File
  ): Promise<{ data: FullLote }> {
    
    if (!imageFile) {
      console.log('Enviando datos como JSON al backend...');
      const res = await api.post('/lotes', lotePayload);
      return res.data;
    }
    
    console.log('Enviando datos como FormData (con archivo)...');
    const formData = new FormData();
    
    Object.entries(lotePayload).forEach(([key, value]) => {
      if (key === 'fotos') {
        (value as string[]).forEach((url, index) => {
            formData.append(`${key}[${index}]`, url);
        });
      } else {
          formData.append(key, String(value));
      }
    });

    formData.append('imagen', imageFile);

    const res = await api.post('/lotes', formData); 
    return res.data;
  }

  async getById(id: string): Promise<FullLote> {
    const res = await api.get(`/lotes/${id}`); // <-- Enviará token
    return res.data;
  }

  async update(id: string, lote: Partial<FullLote>): Promise<FullLote> {
    const res = await api.put(`/lotes/${id}`, lote); // <-- Enviará token
    return res.data;
  }

  async delete(id: string): Promise<FullLote> {
    const res = await api.delete(`/lotes/${id}`); // <-- Enviará token
    return res.data;
  }
}

export default new FullLotesAPI();