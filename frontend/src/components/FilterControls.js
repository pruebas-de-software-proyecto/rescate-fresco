import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField, } from "@mui/material";
const mockCategories = [
    "Todos",
    "Frutas",
    "Verduras",
    "Lácteos",
    "Panadería",
    "Carnes",
];
const DEFAULT_CATEGORY = "Todos";
export function FilterControls({ categoryFilter, setCategoryFilter, expiryDateFilter, setExpiryDateFilter, searchFilter, setSearchFilter, }) {
    const handleResetFilters = () => {
        setCategoryFilter(DEFAULT_CATEGORY);
        setExpiryDateFilter("");
        setSearchFilter("");
    };
    const isFilterActive = categoryFilter !== DEFAULT_CATEGORY || expiryDateFilter || searchFilter;
    return (_jsxs(Box, { sx: {
            width: 220,
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignSelf: "flex-start",
        }, children: [_jsxs(FormControl, { fullWidth: true, size: "small", children: [_jsx(InputLabel, { id: "category-label", children: "Categor\u00EDa" }), _jsx(Select, { labelId: "category-label", id: "category-select", value: categoryFilter, label: "Categor\u00EDa", onChange: (e) => setCategoryFilter(e.target.value), children: mockCategories.map((category) => (_jsx(MenuItem, { value: category, children: category }, category))) })] }), _jsx(TextField, { label: "Vence luego de", type: "date", value: expiryDateFilter, onChange: (e) => setExpiryDateFilter(e.target.value), InputLabelProps: { shrink: true }, fullWidth: true, size: "small" }), _jsx(TextField, { label: "Buscar...", value: searchFilter, onChange: (e) => setSearchFilter(e.target.value), fullWidth: true, size: "small", InputProps: {
                    startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(SearchIcon, { color: "action" }) })),
                } }), isFilterActive && (_jsx(Button, { onClick: handleResetFilters, variant: "outlined", color: "primary", sx: { textTransform: "none", fontWeight: 600 }, children: "Resetear" }))] }));
}
