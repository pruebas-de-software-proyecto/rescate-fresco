import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

export default function PagoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lote, setLote] = useState<any>(null);

  // Cargar datos del lote
  useEffect(() => {
    axios.get(`http://localhost:5001/api/lotes/${id}`)
      .then(res => setLote(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handlePago = async () => {
    try {
      const res = await axios.post("http://localhost:5001/api/payments/create-simulation", { lotId: id });
      alert(`Pago simulado creado. Status: ${res.data.status}`);
      navigate("/"); // vuelve a la lista
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
