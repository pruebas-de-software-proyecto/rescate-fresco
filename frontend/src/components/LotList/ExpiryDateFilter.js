import { jsx as _jsx } from "react/jsx-runtime";
import { TextField } from "@mui/material";
export function ExpiryDateFilter({ value, onChange }) {
    return (_jsx(TextField, { type: "date", fullWidth: true, InputLabelProps: { shrink: true }, value: value, onChange: (e) => onChange(e.target.value), placeholder: "dd/mm/aaaa", sx: {
            "& input": { borderRadius: 2, backgroundColor: "#fafafa" },
        } }));
}
