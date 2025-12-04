import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Box, Paper, Typography, Stack, Chip } from '@mui/material';

interface CategoriaData {
  categoria: string;
  cantidad: number;
  [key: string]: string | number;
}

interface CategoriasTopProps {
  data: CategoriaData[];
}

const COLORS = ['#1E8E3E', '#66BB6A', '#81C784', '#A5D6A7'];

export const CategoriasTop: React.FC<CategoriasTopProps> = ({ data }) => {
  return (
    <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #E0E0E0' }} elevation={0}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, textAlign: 'center' }}>
        Categorías Top
      </Typography>

      {data.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="cantidad"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <Stack direction="row" justifyContent="center" gap={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
            {data.map((item, index) => (
              <Chip
                key={item.categoria}
                label={item.categoria}
                sx={{
                  backgroundColor: COLORS[index % COLORS.length],
                  color: '#fff',
                  fontWeight: 'bold'
                }}
              />
            ))}
          </Stack>
        </>
      ) : (
        <Typography variant="body2" color="#999" sx={{ textAlign: 'center', py: 4 }}>
          Sin datos disponibles
        </Typography>
      )}
    </Paper>
  );
};

export default CategoriasTop;
