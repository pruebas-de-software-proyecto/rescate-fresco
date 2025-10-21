import {
  Box,
  Button,
  Card, CardContent, CardMedia,
  CircularProgress,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchLotes, Lote, LoteFilters } from '../api/lotes';
import { FilterControls } from './FilterControls';

const DEFAULT_CATEGORY = 'Todos'; 

import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../useDebounce';

export default function LotList() {
    const [lotes, setLotes] = useState<Lote[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [categoryFilter, setCategoryFilter] = useState<string>(DEFAULT_CATEGORY);
    const [expiryDateFilter, setExpiryDateFilter] = useState<string>('');
    const [searchInput, setSearchInput] = useState<string>(''); 
    const debouncedSearchFilter = useDebounce(searchInput, 500); 
    

    // --- LÓGICA DE CARGA Y FILTRADO (useEffect) ---
    useEffect(() => {
        const loadLotes = async () => {
            setLoading(true);
            const filters: LoteFilters = {};

            // ✅ LÓGICA DE FILTROS CORRECTA
            if (categoryFilter && categoryFilter !== DEFAULT_CATEGORY) {
                filters.categoria = categoryFilter;
            }
            if (expiryDateFilter) {
                filters.vencimientoAntesDe = new Date(expiryDateFilter).toISOString(); 
            }
            if (debouncedSearchFilter && debouncedSearchFilter.trim()) {
                filters.nombre = debouncedSearchFilter.trim(); 
            }

            // 🔍 DEBUG: Ver qué filtros se están enviando
            console.log("🔍 Filtros enviados:", filters);

            try {
                const data = await fetchLotes(filters);
                console.log("✅ Datos recibidos:", data);
                setLotes(data || []);
            } catch (error) {
                console.error("❌ Error al cargar lotes:", error);
                setLotes([]);
            } finally {
                setLoading(false);
            }
        };

        loadLotes();
        
    }, [categoryFilter, expiryDateFilter, debouncedSearchFilter]); 

  if (loading)
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Cargando lotes...</Typography>
      </Box>
    );

  const isAnyFilterActive = categoryFilter !== DEFAULT_CATEGORY || expiryDateFilter || searchInput;
  const noLotesMessage = isAnyFilterActive
    ? "No se encontraron lotes que coincidan con los filtros. 😢"
    : "No hay lotes disponibles. 😔";

  if (lotes.length === 0 && !loading)
    return (
      <Box sx={{ p: 3 }}>
        <FilterControls 
          categoryFilter={categoryFilter} 
          setCategoryFilter={setCategoryFilter}
          expiryDateFilter={expiryDateFilter}
          setExpiryDateFilter={setExpiryDateFilter}
          searchFilter={searchInput} 
          setSearchFilter={setSearchInput}
        />
        <Typography align="center" sx={{ mt: 5, color: 'text.secondary' }}>
          {noLotesMessage}
        </Typography>
      </Box>
    );

  // --- Lista de Lotes ---
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        sx={{ mb: 4, fontWeight: 700, color: 'primary.main' }}
      >
        ¡Rescata Lotes Ahora! ♻️
      </Typography>
      
      {/* CONTROLES DE FILTRO */}
      <FilterControls 
        categoryFilter={categoryFilter} 
        setCategoryFilter={setCategoryFilter}
        expiryDateFilter={expiryDateFilter}
        setExpiryDateFilter={setExpiryDateFilter}
        searchFilter={searchInput} 
        setSearchFilter={setSearchInput}
      />
      
      {/* Grid de Lotes */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 3,
          mt: 3
        }}
      >
        {lotes.map((lote) => (
          <Box key={lote._id}>
            <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 4, display: 'flex', flexDirection: 'column' }}>
              
              {/* Contenido de la Card (Media y Content) */}
              {lote.fotos && lote.fotos.length > 0 ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={lote.fotos[0]}
                  alt={lote.nombre}
                  sx={{ objectFit: 'cover' }}
                />
              ) : (
                <Box
                  sx={{ height: 200, backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#616161', typography: 'subtitle1' }}
                >
                  Sin imagen
                </Box>
              )}

              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" component="div" noWrap title={lote.nombre}>
                    {lote.nombre}
                  </Typography>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mt: 0.5, mb: 1.5, fontWeight: 500 }}
                  >
                    Vence: {new Date(lote.fechaVencimiento).toLocaleDateString()}
                  </Typography>
                  
                  <Typography
                    variant="h5"
                    color="success.main"
                    sx={{ fontWeight: 700 }}
                  >
                    ${lote.precioRescate}
                  </Typography>
                </Box>

                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/${lote._id}`)}
                >
                  Ver Detalles
                </Button>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
}