import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import {
    Box,
    Button,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';

const mockCategories = ['Todos', 'Frutas', 'Verduras', 'Lácteos', 'Panadería', 'Carnes'];
const DEFAULT_CATEGORY = 'Todos';

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
        setExpiryDateFilter('');
        setSearchFilter('');
    };
    
    const isFilterActive = categoryFilter !== DEFAULT_CATEGORY || expiryDateFilter || searchFilter; 

    return (
        <Box 
            sx={{ 
                mb: 4, 
                p: 4, // Más padding interno
                // 💅 Nuevo estilo de tarjeta: fondo blanco, bordes y sombra
                backgroundColor: 'background.paper', 
                borderRadius: 2, 
                boxShadow: 6,
            }}
        >
            <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                    fontWeight: 700, 
                    color: 'text.primary', 
                    display: 'flex', 
                    alignItems: 'center',
                    mb: 3
                }}
            >
                <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
                Opciones de Búsqueda y Filtrado
            </Typography>
            
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: '1fr 1fr',
                        md: '2fr 1fr 1fr auto'
                    },
                    gap: 3,
                    alignItems: 'end'
                }}
            >
                {/* BARRA DE BÚSQUEDA */}
                <TextField
                    label="Buscar por Nombre del Lote..."
                    value={searchFilter} 
                    onChange={(e) => setSearchFilter(e.target.value)} 
                    fullWidth
                    variant="outlined"
                    autoFocus={searchFilter.length > 0}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" /> 
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Filtro de Categoría */}
                <FormControl fullWidth variant="outlined">
                    <InputLabel id="category-filter-label">Categoría</InputLabel>
                    <Select
                        labelId="category-filter-label"
                        id="category-filter"
                        value={categoryFilter}
                        label="Categoria"
                        onChange={(e) => setCategoryFilter(e.target.value as string)}
                    >
                        {mockCategories.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Filtro de Vencimiento */}
                <TextField
                    label="Vence Antes De"
                    type="date"
                    value={expiryDateFilter}
                    onChange={(e) => setExpiryDateFilter(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    variant="outlined"
                />
                
                {/* Botón para resetear filtros */}
                {isFilterActive && (
                    <Button 
                        variant="text" 
                        color="primary"
                        onClick={handleResetFilters}
                        sx={{ 
                            height: '56px',
                            textTransform: 'none',
                            fontWeight: 600,
                            minWidth: '100px'
                        }}
                    >
                        Resetear
                    </Button>
                )}
            </Box>
        </Box>
    );
}