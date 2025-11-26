import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLoteById } from "../../api/lotes";
// Importamos la instancia de tu API. 
// Asegúrate de que este archivo exista en src/api/lotes.ts

const PinPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lote, setLote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatos = async () => {
      if (!id) return;
      try {
        const response = await getLoteById(id);
        // Manejamos si la respuesta viene directa o anidada en 'data'
        setLote((response as any).data || response); 
      } catch (error) {
        console.error("Error cargando ticket:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDatos();
  }, [id]);

  if (loading) return <div style={{ padding: "2rem" }}>Generando tu ticket...</div>;
  if (!lote) return <div>No se encontró la información del retiro.</div>;

  // URL segura para generar el QR sin librerías extra
  // Usamos el código de retiro si existe, o el ID como fallback
  const qrValue = lote.codigoRetiro || lote._id || "error";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrValue}`;

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      padding: "2rem",
      textAlign: "center" 
    }}>
      <h2 style={{ color: "#2E7D32" }}>¡Compra Confirmada!</h2>
      <p>Muestra este código al vendedor para retirar tu pedido.</p>

      {/* Tarjeta del PIN */}
      <div style={{ 
        background: "#f0fdf4", 
        border: "2px dashed #2E7D32", 
        padding: "2rem", 
        borderRadius: "12px",
        margin: "2rem 0"
      }}>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>TU CÓDIGO DE RETIRO</p>
        <h1 style={{ 
          fontSize: "3rem", 
          margin: "10px 0", 
          letterSpacing: "5px", 
          fontFamily: "monospace" 
        }}>
          {lote.codigoRetiro || "---"}
        </h1>
      </div>

      <button 
        onClick={() => navigate("/")}
        style={{ 
          marginTop: "2rem", 
          padding: "10px 20px", 
          background: "#2E7D32", 
          color: "white", 
          border: "none", 
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Volver al Inicio
      </button>
    </div>
  );
}

export default PinPage;