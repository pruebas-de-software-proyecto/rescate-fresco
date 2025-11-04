import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const mockCategories = [
  "Todos",
  "Frutas",
  "Verduras",
  "Lácteos",
  "Panadería",
  "Carnes",
];
const DEFAULT_CATEGORY = "Todos";

export interface FilterControlsProps {
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  expiryDateFilter: string;
  setExpiryDateFilter: (date: string) => void;
  searchFilter: string;
  setSearchFilter: (term: string) => void;
}

export function FilterControls({
  categoryFilter,
  setCategoryFilter,
  expiryDateFilter,
  setExpiryDateFilter,
  searchFilter,
  setSearchFilter,
}: FilterControlsProps) {
  const handleResetFilters = () => {
    setCategoryFilter(DEFAULT_CATEGORY);
    setExpiryDateFilter("");
    setSearchFilter("");
  };

  const isFilterActive =
    categoryFilter !== DEFAULT_CATEGORY || expiryDateFilter || searchFilter;

  return (
    <Box
      sx={{
        width: 220,
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignSelf: "flex-start",
      }}
    >
      {/* Filtro de Categoría */}
      <FormControl fullWidth size="small">
        <InputLabel id="category-label">Categoría</InputLabel>
        <Select
          labelId="category-label" 
          id="category-select"
          value={categoryFilter}
          label="Categoría"
          onChange={(e) => setCategoryFilter(e.target.value as string)}
        >
          {mockCategories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>


      {/* Filtro de fecha */}
      <TextField
        label="Vence luego de"
        type="date"
        value={expiryDateFilter}
        onChange={(e) => setExpiryDateFilter(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
        size="small"
      />

      {/* Búsqueda */}
      <TextField
        label="Buscar..."
        value={searchFilter}
        onChange={(e) => setSearchFilter(e.target.value)}
        fullWidth
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Botón Resetear */}
      {isFilterActive && (
        <Button
          onClick={handleResetFilters}
          variant="outlined"
          color="primary"
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Resetear
        </Button>
      )}
    </Box>
  );
}
