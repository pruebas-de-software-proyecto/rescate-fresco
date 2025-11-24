import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { InputBase, Paper, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
export function SearchBar({ value, onChange, placeholder }) {
    return (_jsxs(Paper, { elevation: 1, sx: {
            p: "4px 10px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            maxWidth: 500,
            borderRadius: "999px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }, children: [_jsx(IconButton, { sx: { p: "10px" }, children: _jsx(SearchIcon, {}) }), _jsx(InputBase, { sx: { ml: 1, flex: 1 }, placeholder: placeholder || "Buscar...", value: value, onChange: (e) => onChange(e.target.value) })] }));
}
