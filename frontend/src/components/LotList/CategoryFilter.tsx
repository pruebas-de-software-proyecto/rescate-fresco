import { Box, Chip } from "@mui/material";

const categories = ["Todos", "Frutas", "Verduras", "Lácteos", "Carnes", "Panadería"];

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function CategoryFilter({ value, onChange }: Props) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {categories.map((cat) => (
        <Chip
          key={cat}
          label={cat}
          clickable
          onClick={() => onChange(cat)}
          color={value === cat ? "success" : "default"}
          variant={value === cat ? "filled" : "outlined"}
        />
      ))}
    </Box>
  );
}
