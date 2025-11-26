import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { generarPin, reservarLote } from "../api/lotes";

export default function PagoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lote, setLote] = useState<any>(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  // Cargar datos del lote
  useEffect(() => {
    axios.get(`${API_URL}/lotes/${id}`)
      .then(res => setLote(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handlePago = async () => {
    try {
      const res = await axios.post(`${API_URL}/payments/create-simulation`, { lotId: id });
      await reservarLote(id!);
      const respuesta = await generarPin(id!);
      const codigo = respuesta.codigoRetiro;
      console.log(codigo);
      alert(`Pago simulado creado. Status: ${res.data.status}`);
      navigate(`/pago/${id}/${codigo}`);
    } catch (err) {
      console.error(err);
      alert("Error creando pago simulado");
    }
  };

  const handleCancelar = () => navigate("/");

  if (!lote) return <p>Cargando información del lote...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Simular Pago</h2>
      <p>Lote: <strong>{lote.nombre}</strong></p>
      <p>Precio: <strong>${lote.precioRescate}</strong></p>
      <p>Fecha de vencimiento: {new Date(lote.fechaVencimiento).toLocaleDateString("es-CL")}</p>

      <button onClick={handlePago} style={{ marginRight: "1rem", padding: "0.5rem 1rem" }}>
        Sí, pagar (sandbox)
      </button>
      <button onClick={handleCancelar} style={{ padding: "0.5rem 1rem" }}>Cancelar</button>
    </div>
  );
}
