import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Card, CardContent, CardMedia, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchLotes } from '../api/lotes';
import { FilterControls } from './FilterControls';
const DEFAULT_CATEGORY = 'Todos';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../useDebounce';
export default function LotList() {
    const [lotes, setLotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [categoryFilter, setCategoryFilter] = useState(DEFAULT_CATEGORY);
    const [expiryDateFilter, setExpiryDateFilter] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearchFilter = useDebounce(searchInput, 500);
    // --- LÓGICA DE CARGA Y FILTRADO (useEffect) ---
    useEffect(() => {
        const loadLotes = async () => {
            setLoading(true);
            const filters = {};
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
            }
            catch (error) {
                console.error("❌ Error al cargar lotes:", error);
                setLotes([]);
            }
            finally {
                setLoading(false);
            }
        };
        loadLotes();
    }, [categoryFilter, expiryDateFilter, debouncedSearchFilter]);
    if (loading)
        return (_jsxs(Box, { sx: { textAlign: 'center', mt: 5 }, children: [_jsx(CircularProgress, {}), _jsx(Typography, { sx: { mt: 2 }, children: "Cargando lotes..." })] }));
    const isAnyFilterActive = categoryFilter !== DEFAULT_CATEGORY || expiryDateFilter || searchInput;
    const noLotesMessage = isAnyFilterActive
        ? "No se encontraron lotes que coincidan con los filtros. 😢"
        : "No hay lotes disponibles. 😔";
    if (lotes.length === 0 && !loading)
        return (_jsxs(Box, { sx: { p: 3 }, children: [_jsx(FilterControls, { categoryFilter: categoryFilter, setCategoryFilter: setCategoryFilter, expiryDateFilter: expiryDateFilter, setExpiryDateFilter: setExpiryDateFilter, searchFilter: searchInput, setSearchFilter: setSearchInput }), _jsx(Typography, { align: "center", sx: { mt: 5, color: 'text.secondary' }, children: noLotesMessage })] }));
    // --- Lista de Lotes ---
    return (_jsxs(Box, { sx: { flexGrow: 1, p: 3 }, children: [_jsx(Typography, { variant: "h3", component: "h1", gutterBottom: true, sx: { mb: 4, fontWeight: 700, color: 'primary.main' }, children: "\u00A1Rescata Lotes Ahora! \u267B\uFE0F" }), _jsx(FilterControls, { categoryFilter: categoryFilter, setCategoryFilter: setCategoryFilter, expiryDateFilter: expiryDateFilter, setExpiryDateFilter: setExpiryDateFilter, searchFilter: searchInput, setSearchFilter: setSearchInput }), _jsx(Box, { sx: {
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)'
                    },
                    gap: 3,
                    mt: 3
                }, children: lotes.map((lote) => (_jsx(Box, { children: _jsxs(Card, { sx: { height: '100%', borderRadius: 2, boxShadow: 4, display: 'flex', flexDirection: 'column' }, children: [lote.fotos && lote.fotos.length > 0 ? (_jsx(CardMedia, { component: "img", height: "200", image: lote.fotos[0], alt: lote.nombre, sx: { objectFit: 'cover' } })) : (_jsx(Box, { sx: { height: 200, backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#616161', typography: 'subtitle1' }, children: "Sin imagen" })), _jsxs(CardContent, { sx: { flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "h6", component: "div", noWrap: true, title: lote.nombre, children: lote.nombre }), _jsxs(Typography, { variant: "body1", color: "text.secondary", sx: { mt: 0.5, mb: 1.5, fontWeight: 500 }, children: ["Vence: ", new Date(lote.fechaVencimiento).toLocaleDateString()] }), _jsxs(Typography, { variant: "h5", color: "success.main", sx: { fontWeight: 700 }, children: ["$", lote.precioRescate] })] }), _jsx(Button, { variant: "contained", color: "primary", fullWidth: true, sx: { mt: 2 }, onClick: () => navigate(`/${lote._id}`), children: "Ver Detalles" })] })] }) }, lote._id))) })] }));
}
