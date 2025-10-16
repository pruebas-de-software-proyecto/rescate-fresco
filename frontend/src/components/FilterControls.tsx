import React from 'react';
import {
    Box, Grid, Typography, FormControl, InputLabel, Select, MenuItem,
    TextField, InputAdornment, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

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
            
            <Grid container spacing={3} alignItems="flex-end">
                
                {/* BARRA DE BÚSQUEDA */}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Buscar por Nombre del Lote..."
                        value={searchFilter} 
                        onChange={(e) => setSearchFilter(e.target.value)} 
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" /> 
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                {/* Filtro de Categoría */}
                <Grid item xs={12} sm={4} md={2}>
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
                </Grid>

                {/* Filtro de Vencimiento */}
                <Grid item xs={12} sm={5} md={2}>
                    <TextField
                        label="Vence Antes De"
                        type="date"
                        value={expiryDateFilter}
                        onChange={(e) => setExpiryDateFilter(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        variant="outlined"
                    />
                </Grid>
                
                {/* Botón para resetear filtros */}
                {isFilterActive && (
                    <Grid item xs={12} sm={3} md={2}>
                        <Button 
                            // 💅 Estilo discreto para el reseteo
                            variant="text" 
                            color="primary"
                            onClick={handleResetFilters}
                            fullWidth
                            sx={{ 
                                height: '56px',
                                textTransform: 'none',
                                fontWeight: 600,
                            }}
                        >
                            Resetear
                        </Button>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}