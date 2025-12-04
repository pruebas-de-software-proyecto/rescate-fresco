import { Box, Paper, Typography, Stack, LinearProgress } from '@mui/material';

interface EstadoLotesProps {
  vendidos: number;
  vencidos: number;
  cancelados: number;
}

export const EstadoLotes: React.FC<EstadoLotesProps> = ({ vendidos, vencidos, cancelados }) => {
  const total = vendidos + vencidos + cancelados;
  const porcentajeVendidos = total > 0 ? (vendidos / total) * 100 : 0;
  const porcentajeVencidos = total > 0 ? (vencidos / total) * 100 : 0;
  const porcentajeCancelados = total > 0 ? (cancelados / total) * 100 : 0;

  return (
    <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #E0E0E0' }} elevation={0}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Estado de Lotes
      </Typography>

      <Stack spacing={2.5}>
        {/* Vendidos */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="#666">
              Vendidos
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="#1E8E3E">
              {porcentajeVendidos.toFixed(0)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={porcentajeVendidos}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#E8F5E9',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#1E8E3E',
                borderRadius: 4
              }
            }}
          />
          <Typography variant="caption" color="#999" sx={{ mt: 0.5, display: 'block' }}>
            {vendidos} lotes
          </Typography>
        </Box>

        {/* Vencidos */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="#666">
              Vencidos
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="#F57C00">
              {porcentajeVencidos.toFixed(0)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={porcentajeVencidos}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#FFF3E0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#F57C00',
                borderRadius: 4
              }
            }}
          />
          <Typography variant="caption" color="#999" sx={{ mt: 0.5, display: 'block' }}>
            {vencidos} lotes
          </Typography>
        </Box>

        {/* Cancelados */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="#666">
              Cancelados
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="#D32F2F">
              {porcentajeCancelados.toFixed(0)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={porcentajeCancelados}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#FFEBEE',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#D32F2F',
                borderRadius: 4
              }
            }}
          />
          <Typography variant="caption" color="#999" sx={{ mt: 0.5, display: 'block' }}>
            {cancelados} lotes
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default EstadoLotes;
