import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography } from "@mui/material";
import { CategoryFilter } from "./CategoryFilter";
import { ExpiryDateFilter } from "./ExpiryDateFilter";
export function FilterSidebar({ categoryFilter, setCategoryFilter, expiryDateFilter, setExpiryDateFilter, }) {
    return (_jsxs(Box, { sx: {
            width: "230px",
            backgroundColor: "white",
            borderRadius: 3,
            boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
        }, children: [_jsx(Typography, { variant: "subtitle1", sx: { fontWeight: "bold" }, children: "Categor\u00EDa" }), _jsx(CategoryFilter, { value: categoryFilter, onChange: setCategoryFilter }), _jsx(Typography, { variant: "subtitle1", sx: { fontWeight: "bold", mt: 2 }, children: "Vence despu\u00E9s de" }), _jsx(ExpiryDateFilter, { value: expiryDateFilter, onChange: setExpiryDateFilter })] }));
}
