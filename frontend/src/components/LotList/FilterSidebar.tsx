import { Box, Typography } from "@mui/material";
import { CategoryFilter } from "./CategoryFilter";
import { ExpiryDateFilter } from "./ExpiryDateFilter";

interface Props {
  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
  expiryDateFilter: string;
  setExpiryDateFilter: (v: string) => void;
}

export function FilterSidebar({
  categoryFilter,
  setCategoryFilter,
  expiryDateFilter,
  setExpiryDateFilter,
}: Props) {
  return (
    <Box
      sx={{
        width: "230px",
        backgroundColor: "white",
        borderRadius: 3,
        boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        Categoría
      </Typography>
      <CategoryFilter value={categoryFilter} onChange={setCategoryFilter} />

      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2 }}>
        Vence después de
      </Typography>
      <ExpiryDateFilter value={expiryDateFilter} onChange={setExpiryDateFilter} />
    </Box>
  );
}
