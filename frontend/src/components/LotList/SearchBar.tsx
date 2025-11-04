import { InputBase, Paper, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder }: Props) {
  return (
    <Paper
      elevation={1}
      sx={{
        p: "4px 10px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: 500,
        borderRadius: "999px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      }}
    >
      <IconButton sx={{ p: "10px" }}>
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder || "Buscar..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Paper>
  );
}
