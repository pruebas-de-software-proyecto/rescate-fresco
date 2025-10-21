// frontend/src/components/LoteFormDialog.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import { FullLote } from '../services/types';

interface Props {
  open: boolean;
  onClose: () => void;
  lote: FullLote;
  onSubmit: (id: string, data: Partial<FullLote>) => Promise<void>;
  error?: string | null;
}

const categorias = [
  'Frutas',
  'Verduras',
  'Lácteos',
  'Carnes',
  'Panadería',
  'Otros',
];

const unidades = ['kg', 'unidades', 'litros'];

const LoteFormDialog: React.FC<Props> = ({ open, onClose, lote, onSubmit, error}) => {
  const [form, setForm] = useState<Partial<FullLote>>({});
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    setForm(lote);
  }, [lote]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'fechaVencimiento') {
    const fechaVencimiento = new Date(value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaVencimiento < hoy) {
      setValidationErrors(prev => ({
        ...prev,
        fechaVencimiento: 'La fecha debe ser posterior a hoy'
      }));
      } else {
        setValidationErrors(prev => ({
          ...prev,
          fechaVencimiento: ''
        }));
      }
    }

    if (name === 'precioRescate') {
      setForm(prev => ({ 
        ...prev, 
        [name]: Number(value) // Convertir a número
      }));
      return;
    }

    if(name == 'cantidad'){

      if (value === '') {
        setForm(prev => ({ ...prev, cantidad: undefined }));
        return;
      }

      const numValue = Number(value);
      if(numValue <= 0) {
        setValidationErrors(prev => ({
          ...prev,
          cantidad: "La cantidad debe ser mayor a 0"
        }));
        return;
      } else {
        setValidationErrors(prev => ({
          ...prev,
          cantidad: ''
        }));
      }
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!lote._id) return;

    if (!form.cantidad || Number(form.cantidad) <= 0) {
      setValidationErrors(prev => ({
        ...prev,
        cantidad: 'La cantidad debe ser mayor a 0'
      }));
      return;
    }

    await onSubmit(lote._id, form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Lote</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          margin="dense"
          label="Nombre"
          name="nombre"
          fullWidth
          value={form.nombre || ''}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          label="Descripción"
          name="descripcion"
          fullWidth
          value={form.descripcion || ''}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          label="Categoría"
          name="categoria"
          select
          fullWidth
          value={form.categoria || ''}
          onChange={handleChange}
          required
        >
          {categorias.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          label="Cantidad"
          name="cantidad"
          type="number"
          fullWidth
          value={form.cantidad || ''}
          onChange={handleChange}
          required
          error={Boolean(validationErrors.cantidad)}
          helperText={validationErrors.cantidad}
          InputProps={{
            inputProps: { 
              min: 1,
              step: 1
            }
          }}
          
        />
        <TextField
          margin="dense"
          label="Unidad"
          name="unidad"
          select
          fullWidth
          value={form.unidad || ''}
          onChange={handleChange}
          required
        >
          {unidades.map((u) => (
            <MenuItem key={u} value={u}>
              {u}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          label="Precio Rescate"
          name="precioRescate"
          type="number"
          fullWidth
          value={form.precioRescate || ''}
          onChange={handleChange}
          required
          InputProps={{
            inputProps: { 
              min: 0,
              step: 1
            }
          }}
          helperText={`Precio original: ${lote.precioOriginal}`}
          
        />
        <TextField
          margin="dense"
          label="Fecha de Vencimiento"
          name="fechaVencimiento"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={form.fechaVencimiento?.toString().split('T')[0] || ''}
          onChange={handleChange}
          required
          error={Boolean(validationErrors.fechaVencimiento)}
          helperText={validationErrors.fechaVencimiento}
          InputProps={{
            inputProps: { 
              min: new Date().toISOString().split('T')[0]  // Establece el mínimo como hoy
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoteFormDialog;
