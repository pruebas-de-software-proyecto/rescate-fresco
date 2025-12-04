import { Box, Paper, Typography, Stack, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface MetricaCardProps {
  titulo: string;
  valor: string | number;
  unidad?: string;
  icon?: React.ReactNode;
  subtitulo?: string;
  trend?: number;
  bgColor?: string;
}

export const MetricaCard: React.FC<MetricaCardProps> = ({
  titulo,
  valor,
  unidad,
  icon,
  subtitulo,
  trend,
  bgColor = '#F4FAF4'
}) => {
  return (
    <Paper
      sx={{
        p: 3,
        backgroundColor: bgColor,
        border: '1px solid #E0E0E0',
        borderRadius: '12px',
        flex: 1,
        minWidth: '200px'
      }}
      elevation={0}
    >
      <Stack spacing={1.5}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon}
          <Typography variant="caption" color="#666" fontWeight={500}>
            {titulo}
          </Typography>
        </Box>

        <Typography variant="h5" fontWeight="bold" color="#000">
          {typeof valor === 'number' ? valor.toLocaleString('es-CL') : valor}
          {unidad && <span style={{ fontSize: '0.6em', marginLeft: '4px' }}>{unidad}</span>}
        </Typography>

        {subtitulo && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {trend !== undefined && (
              <>
                {trend >= 0 ? (
                  <TrendingUpIcon sx={{ fontSize: '14px', color: '#1E8E3E' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: '14px', color: '#D32F2F' }} />
                )}
              </>
            )}
            <Typography variant="caption" color="#666">
              {subtitulo}
            </Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

export default MetricaCard;
