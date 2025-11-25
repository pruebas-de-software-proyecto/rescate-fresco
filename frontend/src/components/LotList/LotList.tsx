import { Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLotes, Lote, LoteFilters } from "../../api/lotes";
import { useDebounce } from "../../useDebounce";
import { FilterSidebar } from "./FilterSidebar";
import { LoteCard } from "./LoteCard";
import { SearchBar } from "./SearchBar";

const DEFAULT_CATEGORY = "Todos";

export default function LotList() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [categoryFilter, setCategoryFilter] = useState<string>(DEFAULT_CATEGORY);
  const [expiryDateFilter, setExpiryDateFilter] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");

  const debouncedSearchFilter = useDebounce(searchInput, 500);

  useEffect(() => {
    const loadLotes = async () => {
      setLoading(true);
      const filters: LoteFilters = {};

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
      } catch (error) {
        console.error("Error al cargar lotes:", error);
        setLotes([]);
      } finally {
        setLoading(false);
      }
    };

    loadLotes();
  }, [categoryFilter, expiryDateFilter, debouncedSearchFilter]);

  const handleReserve = async (lote: Lote) => {
    try {
      const response = await axios.post(`/api/reservas`, { loteId: lote._id });
      navigate(`/pago/${response.data.reservaId}`);
    } catch (error) {
      alert("Error al reservar el lote. Puede que ya esté reservado.");
      console.error(error);
    }
  };

  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Cargando lotes...</Typography>
      </Box>
    );

  return (
    <Box sx={{ px: 6, py: 4 }}>
      {/* 🔍 Barra superior */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <SearchBar value={searchInput} onChange={setSearchInput} placeholder="Buscar productos..." />
      </Box>

      {/* 🧭 Layout principal */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 4 }}>
        {/* Filtros */}
        <FilterSidebar
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          expiryDateFilter={expiryDateFilter}
          setExpiryDateFilter={setExpiryDateFilter}
        />

        {/* 🧃 Grid */}
        <Box
          sx={{
            flexGrow: 1,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {lotes.map((lote) => (
            <LoteCard
              key={lote._id}
              lote={lote}
              onView={() => navigate(`/lotes/${lote._id}`)}
              onReserve={() => handleReserve(lote)} 
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
