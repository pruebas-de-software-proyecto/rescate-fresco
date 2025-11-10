import { TextField } from "@mui/material";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function ExpiryDateFilter({ value, onChange }: Props) {
  return (
    <TextField
      type="date"
      fullWidth
      InputLabelProps={{ shrink: true }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="dd/mm/aaaa"
      sx={{
        "& input": { borderRadius: 2, backgroundColor: "#fafafa" },
      }}
    />
  );
}
