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
  export async function fetchLotes(): Promise<Lote[]> {
    try {
      const res = await fetch("http://localhost:5000/api/lotes");
      if (!res.ok) throw new Error("Error al obtener lotes");
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  