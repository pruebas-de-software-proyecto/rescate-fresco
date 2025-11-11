import axios from "axios";

export interface Reserva {
  _id: string;
  nombre: string;
  estado: "Pendiente" | "Retirada" | "Cancelada";
  fechaRetiro: string;
  ubicacion: string;
  instrucciones: string;
  codigoQR?: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function fetchReservas(): Promise<Reserva[]> {
  const { data } = await axios.get(`${API_URL}/reservas`);
  return data;
}

export async function cancelarReserva(id: string): Promise<void> {
  await axios.patch(`${API_URL}/reservas/${id}/cancelar`);
}
