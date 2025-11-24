import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Card, CardContent, CardMedia, Chip, Stack, Typography, } from "@mui/material";
import { useNavigate } from "react-router-dom";
export function LoteCard({ lote, onView, onReserve }) {
    const navigate = useNavigate();
    const estadoColors = {
        Disponible: "success",
        reservado: "warning",
        pagado: "info",
        retirado: "default",
        vencido: "error",
    };
    const handleReserve = () => {
        navigate(`/pago/${lote._id}`);
    };
    return (_jsxs(Card, { sx: {
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
        }, children: [_jsx(Chip, { label: lote.estado.toUpperCase(), color: estadoColors[lote.estado] || "default", size: "small", sx: {
                    position: "absolute",
                    top: 10,
                    right: 10,
                    fontWeight: 600,
                    backgroundColor: lote.estado === "Disponible"
                        ? "#4caf50"
                        : lote.estado === "reservado"
                            ? "#ffb300"
                            : lote.estado === "pagado"
                                ? "#0288d1"
                                : lote.estado === "vencido"
                                    ? "#e53935"
                                    : "#9e9e9e",
                    color: "white",
                } }), _jsxs(Box, { children: [_jsx(CardMedia, { component: "img", height: "160", image: lote.fotos?.[0] ||
                            "https://via.placeholder.com/300x160?text=Sin+imagen", alt: lote.nombre, sx: { objectFit: "cover", borderRadius: "12px 12px 0 0" } }), _jsxs(CardContent, { sx: { pb: 0 }, children: [_jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: lote.nombre }), _jsxs(Typography, { color: "success.main", sx: { fontWeight: 700, fontSize: "1.2rem" }, children: ["$", lote.precioRescate] }), _jsxs(Typography, { variant: "body2", sx: { textDecoration: "line-through", color: "text.disabled" }, children: ["$", lote.precioOriginal] }), _jsxs(Typography, { variant: "body2", color: "success.main", sx: { mt: 1 }, children: ["Fecha vencimiento:", " ", new Date(lote.fechaVencimiento).toLocaleDateString("es-CL")] })] })] }), _jsxs(Stack, { direction: "row", spacing: 1.5, sx: { p: 2, pt: 1 }, children: [_jsx(Button, { variant: "outlined", fullWidth: true, onClick: (e) => {
                            e.stopPropagation();
                            onView();
                        }, children: "Ver detalle" }), _jsx(Button, { variant: "contained", color: "primary", disabled: lote.estado !== "Disponible", onClick: handleReserve, children: lote.estado === "reservado" ? "Reservado" : "Reservar" })] })] }));
}
