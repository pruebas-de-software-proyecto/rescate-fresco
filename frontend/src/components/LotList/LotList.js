import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchLotes } from "../../api/lotes";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../useDebounce";
import { FilterSidebar } from "./FilterSidebar";
import { LoteCard } from "./LoteCard";
import { SearchBar } from "./SearchBar";
import axios from "axios";
const DEFAULT_CATEGORY = "Todos";
export default function LotList() {
    const [lotes, setLotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [categoryFilter, setCategoryFilter] = useState(DEFAULT_CATEGORY);
    const [expiryDateFilter, setExpiryDateFilter] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearchFilter = useDebounce(searchInput, 500);
    useEffect(() => {
        const loadLotes = async () => {
            setLoading(true);
            const filters = {};
            if (categoryFilter && categoryFilter !== DEFAULT_CATEGORY) {
                filters.categoria = categoryFilter;
            }
            if (expiryDateFilter) {
                filters.vencimientoAntesDe = new Date(expiryDateFilter).toISOString();
            }
            if (debouncedSearchFilter && debouncedSearchFilter.trim()) {
                filters.nombre = debouncedSearchFilter.trim();
            }
            try {
                const data = await fetchLotes(filters);
                setLotes(data || []);
            }
            catch (error) {
                console.error("Error al cargar lotes:", error);
                setLotes([]);
            }
            finally {
                setLoading(false);
            }
        };
        loadLotes();
    }, [categoryFilter, expiryDateFilter, debouncedSearchFilter]);
    const handleReserve = async (lote) => {
        try {
            const response = await axios.post(`/api/reservas`, { loteId: lote._id });
            navigate(`/pago/${response.data.reservaId}`);
        }
        catch (error) {
            alert("Error al reservar el lote. Puede que ya esté reservado.");
            console.error(error);
        }
    };
    if (loading)
        return (_jsxs(Box, { sx: { textAlign: "center", mt: 5 }, children: [_jsx(CircularProgress, {}), _jsx(Typography, { sx: { mt: 2 }, children: "Cargando lotes..." })] }));
    return (_jsxs(Box, { sx: { px: 6, py: 4 }, children: [_jsx(Box, { sx: { display: "flex", justifyContent: "center", mb: 4 }, children: _jsx(SearchBar, { value: searchInput, onChange: setSearchInput, placeholder: "Buscar productos..." }) }), _jsxs(Box, { sx: { display: "flex", alignItems: "flex-start", gap: 4 }, children: [_jsx(FilterSidebar, { categoryFilter: categoryFilter, setCategoryFilter: setCategoryFilter, expiryDateFilter: expiryDateFilter, setExpiryDateFilter: setExpiryDateFilter }), _jsx(Box, { sx: {
                            flexGrow: 1,
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                md: "repeat(3, 1fr)",
                                lg: "repeat(4, 1fr)",
                            },
                            gap: 3,
                        }, children: lotes.map((lote) => (_jsx(LoteCard, { lote: lote, onView: () => navigate(`/${lote._id}`), onReserve: () => handleReserve(lote) }, lote._id))) })] })] }));
}
