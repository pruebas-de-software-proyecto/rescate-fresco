import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { Box, Paper, Typography } from '@mui/material';

interface EvolucionData {
  dia: string;
  ingresos: number;
  kg: number;
}

interface EvolucionSemanalProps {
  data: EvolucionData[];
}

export const EvolucionSemanal: React.FC<EvolucionSemanalProps> = ({ data }) => {
  return (
    <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #E0E0E0' }} elevation={0}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Evolución Semanal
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <XAxis dataKey="dia" />
          <YAxis yAxisId="left" label={{ value: 'Ingresos ($)', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Kg Rescatados', angle: 90, position: 'insideRight' }} />
          <Tooltip 
            formatter={(value: any) => value.toLocaleString('es-CL')}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #E0E0E0', borderRadius: '8px' }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="ingresos" fill="#1E8E3E" name="Ingresos ($)" />
          <Bar yAxisId="right" dataKey="kg" fill="#2196F3" name="Kg Rescatados" />
        </ComposedChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default EvolucionSemanal;
