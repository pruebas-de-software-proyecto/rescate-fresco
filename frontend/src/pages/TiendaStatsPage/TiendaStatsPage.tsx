import { useEffect, useState } from 'react';
import { Box, Container, Typography, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { tiendaAPI, Metricas } from '../../services/api';
import { MetricaCard } from './components/MetricaCard';
import { EvolucionSemanal } from './components/EvolucionSemanal';
import { CategoriasTop } from './components/CategoriasTop';
import { EstadoLotes } from './components/EstadoLotes';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BalanceIcon from '@mui/icons-material/Balance';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import styles from './TiendaStatsPage.module.css';

export const TiendaStatsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        if (!isAuthenticated || !user) {
          setError('Debes estar autenticado');
          setLoading(false);
          return;
        }

        const data = await tiendaAPI.getMetricas();
        setMetricas(data);
        setError(null);
      } catch (err) {
        console.error('Error al obtener métricas:', err);
        if (err instanceof Error) {
          console.error('Detalles del error:', err.message);
        }
        setError('Error al cargar las métricas. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchMetricas();
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!metricas) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">No hay datos disponibles</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="500" sx={{ mb: 1 }} color = "#565656">
          Métricas de Mi Tienda
        </Typography>
        <Typography variant="body2" color="#666">
          Resumen del rendimiento de tu tienda en Rescate Fresco.
        </Typography>
      </Box>

      {/* Tarjetas de Métricas Principales */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
        <MetricaCard
          titulo="Ingresos"
          valor={`$${metricas.ingresos >= 1000 ? (metricas.ingresos / 1000).toFixed(0) + 'K' : metricas.ingresos.toFixed(0)}`}
          icon={<AttachMoneyIcon sx={{ color: '#1E8E3E', fontSize: 24 }} />}
          subtitulo={`Total de lotes pagados`}
          trend={0}
          bgColor="#F4FAF4"
        />

        <MetricaCard
          titulo="Kg Rescatados"
          valor={`${metricas.kgRescatados.toFixed(0)} kg`}
          icon={<BalanceIcon sx={{ color: '#1976D2', fontSize: 24 }} />}
          subtitulo={`De ${metricas.totalLotes} lotes`}
          bgColor="#F4FAF4"
        />

        <MetricaCard
          titulo="Tasa de Retiro"
          valor={`${metricas.tasaRetiro}%`}
          icon={<TaskAltIcon sx={{ color: '#ED6C02', fontSize: 24 }} />}
          subtitulo="De ingresos totales"
          bgColor="#F4FAF4"
        />

        <MetricaCard
          titulo="Merma Evitada"
          valor={`$${(metricas.mermaEvitada / 1000).toFixed(0)}K`}
          icon={<DeleteOutlineIcon sx={{ color: '#D32F2F', fontSize: 24 }} />}
          subtitulo="Valor rescatado"
          bgColor="#F4FAF4"
        />
      </Box>

      

      {/* Gráficos */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3, mb: 4 }}>
        <EvolucionSemanal data={metricas.evolucionSemanal} />
        <CategoriasTop data={metricas.categoriasTop} />
      </Box>

      {/* Tiempo Promedio de Venta y Estado de Lotes */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Tiempo Promedio de Venta */}
        <Box
          sx={{
            p: 3,
            backgroundColor: '#FFF',
            border: '1px solid #E0E0E0',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2
          }}
        >
          <AccessTimeIcon sx={{ fontSize: 40, color: '#1E8E3E', mt: 0.5, flexShrink: 0 }} />
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              Tiempo Promedio de Venta por lote
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="#1E8E3E" sx={{ mb: 0.5 }}>
              {metricas.tiempoPromedio}h desde publicación
            </Typography>

          </Box>
        </Box>

        {/* Estado de Lotes */}
        <EstadoLotes
          vendidos={metricas.estadoLotes.vendidos}
          vencidos={metricas.estadoLotes.vencidos}
          disponibles={metricas.estadoLotes.disponibles}
        />
      </Box>
    </Container>
  );
};

export default TiendaStatsPage;
