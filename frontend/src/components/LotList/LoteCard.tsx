import { Box, Button, Card, CardContent, CardMedia, Typography, Stack } from "@mui/material";
import { Lote } from "../../api/lotes";

interface Props {
  lote: Lote;
  onView: () => void;
  onAddToCart?: () => void;
}

export function LoteCard({ lote, onView, onAddToCart }: Props) {
  return (
    <Card
      sx={{
        width: 250,
        borderRadius: 3,
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <CardMedia
          component="img"
          height="160"
          image={lote.fotos?.[0] || "https://via.placeholder.com/300x160?text=Sin+imagen"}
          alt={lote.nombre}
          sx={{ objectFit: "cover", borderRadius: "12px 12px 0 0" }}
        />
        <CardContent sx={{ pb: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {lote.nombre}
          </Typography>

          <Typography color="success.main" sx={{ fontWeight: 700, fontSize: "1.2rem" }}>
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

      <Stack direction="row" spacing={1.5} sx={{ p: 2, pt: 1 }}>
        <Button
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
          color="success"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.();
          }}
        >
          Agregar al carrito
        </Button>
      </Stack>
    </Card>
  );
}
