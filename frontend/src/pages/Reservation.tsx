import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import QRCode from "react-qr-code";
import { Reserva, fetchReservas, cancelarReserva } from "../api/reservas";

export default function Reservation() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrValue, setQrValue] = useState("");

  // Cargar reservas al montar
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchReservas();
        setReservas(data);
      } catch (err) {
        console.error("Error al cargar reservas:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCancel = async (id: string) => {
    const confirmar = confirm(
      "¿Seguro que quieres cancelar tu reserva? Podrás hacerlo hasta 2 horas antes del retiro."
    );
    if (!confirmar) return;

    try {
      await cancelarReserva(id);
      setReservas((prev) =>
        prev.map((r) => (r._id === id ? { ...r, estado: "Cancelada" } : r))
      );
    } catch (err) {
      console.error("Error al cancelar reserva:", err);
      alert("No se pudo cancelar la reserva. Intenta nuevamente.");
    }
  };

  const handleShowQR = (codigo: string) => {
    setQrValue(codigo);
    setQrOpen(true);
  };

  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Cargando tus reservas...</Typography>
      </Box>
    );

  if (reservas.length === 0)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6">No tienes reservas activas.</Typography>
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Mis Reservas
      </Typography>

      {reservas.map((reserva) => (
        <Card
          key={reserva._id}
          sx={{
            mb: 2,
            borderRadius: 3,
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {reserva.nombre}
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 1 }}>
              Estado:{" "}
              <strong
                style={{
                  color:
                    reserva.estado === "Pendiente"
                      ? "#1976d2"
                      : reserva.estado === "Retirada"
                      ? "#2e7d32"
                      : "#d32f2f",
                }}
              >
                {reserva.estado}
              </strong>
            </Typography>

            <Divider sx={{ my: 1 }} />

            <Typography variant="body2">
              <strong>Fecha de retiro:</strong> {reserva.fechaRetiro}
            </Typography>
            <Typography variant="body2">
              <strong>Ubicación:</strong> {reserva.ubicacion}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Instrucciones:</strong> {reserva.instrucciones}
            </Typography>

            {reserva.estado === "Pendiente" && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handleShowQR(reserva.codigoQR || reserva._id)
                  }
                >
                  Ver QR
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleCancel(reserva._id)}
                >
                  Cancelar
                </Button>
              </Box>
            )}

            {reserva.estado === "Cancelada" && (
              <Typography color="error.main" sx={{ mt: 1 }}>
                Reserva cancelada.
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}

    </Box>
  );
}
