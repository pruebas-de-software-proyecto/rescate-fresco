import api from './lotes';

export interface TiendaPerfil {
  id: string;
  nombreTienda?: string;
  email: string;
}

const tiendasAPI = {
  getMiTienda: async (): Promise<TiendaPerfil> => {
    const response = await api.get('/tienda/me');
    return response.data;
  }
};

export default tiendasAPI;