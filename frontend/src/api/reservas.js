import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
export async function fetchReservas() {
    const { data } = await axios.get(`${API_URL}/reservas`);
    return data;
}
export async function cancelarReserva(id) {
    await axios.patch(`${API_URL}/reservas/${id}/cancelar`);
}
