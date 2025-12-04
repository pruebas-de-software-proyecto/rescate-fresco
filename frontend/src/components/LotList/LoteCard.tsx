import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Lote } from "../../api/lotes";

interface Props {
  lote: Lote;
  onView: () => void;
  onReserve?: () => void;
}

export function LoteCard({ lote, onView, onReserve }: Props) {
  const navigate = useNavigate();

  const estadoColors: Record<
    string,
    "default" | "success" | "warning" | "error" | "info"
  > = {
    Disponible: "success",
    reservado: "warning",
    pagado: "info",
    retirado: "default",
    vencido: "error",
  };

  const handleReserve = () => {
    navigate(`/pago/${lote._id}`);
  };

  return (
    <Card
      data-testid="lote-card" 
      sx={{
        width: 260,
        borderRadius: 3,
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
        },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
      }}
    >
      {/* 🟡 Estado del lote */}
      <Chip
        label={lote.estado.toUpperCase()}
        color={estadoColors[lote.estado] || "default"}
        size="small"
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          fontWeight: 600,
          backgroundColor:
            lote.estado === "Disponible"
              ? "#4caf50"
              : lote.estado === "reservado"
              ? "#ffb300"
              : lote.estado === "pagado"
              ? "#0288d1"
              : lote.estado === "vencido"
              ? "#e53935"
              : "#9e9e9e",
          color: "white",
        }}
      />

      {/* 🖼️ Imagen y detalles */}
      <Box>
        <CardMedia
          component="img"
          height="160"
          image={
            lote.fotos?.[0] ||
            "https://via.placeholder.com/300x160?text=Sin+imagen"
          }
          alt={lote.nombre}
          sx={{ objectFit: "cover", borderRadius: "12px 12px 0 0" }}
        />
        <CardContent sx={{ pb: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {lote.nombre}
          </Typography>

          <Typography
            color="success.main"
            sx={{ fontWeight: 700, fontSize: "1.2rem" }}
          >
            ${lote.precioRescate}
          </Typography>

          <Typography
            variant="body2"
            sx={{ textDecoration: "line-through", color: "text.disabled" }}
          >
            ${lote.precioOriginal}
          </Typography>

          <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
            Fecha vencimiento:{" "}
            {new Date(lote.fechaVencimiento).toLocaleDateString("es-CL")}
          </Typography>
        </CardContent>
      </Box>

      {/* ⚙️ Botones */}
      <Stack direction="row" spacing={1.5} sx={{ p: 2, pt: 1 }}>
        <Button
          data-testid="btn-detalle"
          variant="outlined"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
        >
          Ver detalle
        </Button>

        <Button
          variant="contained"
          color="primary"
          disabled={lote.estado !== "Disponible"}
          onClick={handleReserve}
        >
          {lote.estado === "reservado" ? "Reservado" : "Reservar"}
        </Button>
      </Stack>
    </Card>
  );
}
