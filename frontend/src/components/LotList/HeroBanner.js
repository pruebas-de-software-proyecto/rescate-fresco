import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography } from "@mui/material";
export default function HeroBanner() {
    return (_jsxs(Box, { sx: {
            width: "100%",
            minHeight: "50vh",
            background: "linear-gradient(180deg, #2e7d32 0%, #66bb6a 100%)",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 2,
        }, children: [_jsx(Typography, { variant: "h4", sx: { fontWeight: "bold", mb: 1, textShadow: "0 2px 6px rgba(0,0,0,0.3)" }, children: "Reduce el desperdicio de alimentos a un precio" }), _jsx(Typography, { variant: "h4", sx: { fontWeight: "bold", textShadow: "0 2px 6px rgba(0,0,0,0.3)" }, children: "m\u00E1s conveniente" }), _jsx("img", { src: "/frutas.png", alt: "Frutas felices", style: { width: "100%" } })] }));
}
