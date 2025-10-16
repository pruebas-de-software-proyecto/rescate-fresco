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
} from '@mui/material';
import FullLotesAPI, { FullLote } from '../services/types';

interface Props {
  open: boolean;
  onClose: () => void;
  lote: FullLote;
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

const estados = ['Disponible', 'Reservado', 'Donado', 'Vencido'];

const LoteFormDialog: React.FC<Props> = ({ open, onClose, lote }) => {
  const [form, setForm] = useState<Partial<FullLote>>({});

  useEffect(() => {
    setForm(lote);
  }, [lote]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!lote._id) return;

    await FullLotesAPI.update(lote._id, form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Lote</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Nombre"
          name="nombre"
          fullWidth
          value={form.nombre || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Descripción"
          name="descripcion"
          fullWidth
          value={form.descripcion || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Categoría"
          name="categoria"
          select
          fullWidth
          value={form.categoria || ''}
          onChange={handleChange}
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
        />
        <TextField
          margin="dense"
          label="Unidad"
          name="unidad"
          select
          fullWidth
          value={form.unidad || ''}
          onChange={handleChange}
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
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoteFormDialog;
