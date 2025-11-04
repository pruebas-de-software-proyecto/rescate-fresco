import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchLotes, Lote, LoteFilters } from "../../api/lotes";
import { FilterControls } from "../FilterControls";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../useDebounce";

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

  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Cargando lotes...</Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 4,
        px: 5,
        py: 4,
      }}
    >
      {/* 🧭 Barra lateral (Filtros) */}
      <Box
        sx={{
          width: "250px",
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 1,
          p: 2,
          position: "sticky",
          top: "100px",
          height: "fit-content",
        }}
      >
        <FilterControls
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          expiryDateFilter={expiryDateFilter}
          setExpiryDateFilter={setExpiryDateFilter}
          searchFilter={searchInput}
          setSearchFilter={setSearchInput}
        />
      </Box>

      {/* 🧃 Grid de productos */}
      <Box
        sx={{
          flexGrow: 1,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {lotes.map((lote) => (
          <Card
            key={lote._id}
            sx={{
              height: "100%",
              borderRadius: 2,
              boxShadow: 3,
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.02)" },
            }}
          >
            {lote.fotos && lote.fotos.length > 0 ? (
              <CardMedia
                component="img"
                height="180"
                image={lote.fotos[0]}
                alt={lote.nombre}
                sx={{ objectFit: "cover" }}
              />
            ) : (
              <Box
                sx={{
                  height: 180,
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#999",
                }}
              >
                Sin imagen
              </Box>
            )}

            <CardContent
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="h6" noWrap>
                  {lote.nombre}
                </Typography>

                <Box sx={{ mt: 1 }}>
                  <Typography
                    variant="h6"
                    color="success.main"
                    sx={{ fontWeight: "bold" }}
                  >
                    ${lote.precioRescate}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      textDecoration: "line-through",
                      color: "text.disabled",
                    }}
                  >
                    ${lote.precioOriginal}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Fecha vencimiento:{" "}
                  {new Date(lote.fechaVencimiento).toLocaleDateString()}
                </Typography>
              </Box>

              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  color="success"
                  fullWidth
                  onClick={() => navigate(`/${lote._id}`)}
                >
                  Ver detalle
                </Button>
                <Button variant="contained" color="success" fullWidth>
                  Agregar al carrito
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
