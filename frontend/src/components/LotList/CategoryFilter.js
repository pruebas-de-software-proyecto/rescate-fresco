import { jsx as _jsx } from "react/jsx-runtime";
import { Box, Chip } from "@mui/material";
const categories = ["Todos", "Frutas", "Verduras", "Lácteos", "Carnes", "Panadería"];
export function CategoryFilter({ value, onChange }) {
    return (_jsx(Box, { sx: { display: "flex", flexWrap: "wrap", gap: 1 }, children: categories.map((cat) => (_jsx(Chip, { label: cat, clickable: true, onClick: () => onChange(cat), color: value === cat ? "success" : "default", variant: value === cat ? "filled" : "outlined" }, cat))) }));
}
