import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Alert, Box
} from '@mui/material';
import { FullLote } from '../services/types';
import { useAuth } from '../context/AuthContext';
import tiendasAPI from '../api/user';

interface Props {
  open: boolean;
  onClose: () => void;
  lote: FullLote;
  onSubmit: (id: string, data: Partial<FullLote>) => Promise<void>;
  error?: string | null;
}

const categorias = ['Frutas', 'Verduras', 'Lácteos', 'Carnes', 'Panadería', 'Otros'];
const unidades = ['kg', 'unidades', 'litros'];
// Estados permitidos por tu base de datos
const estados = ['Disponible', 'Reservado', 'Retirado', 'Vencido'];

const LoteFormDialog: React.FC<Props> = ({ open, onClose, lote, onSubmit, error}) => {
  const [form, setForm] = useState<Partial<FullLote>>({});

  // Estado local para editar la URL de la primera imagen
  const [editImageUrl, setEditImageUrl] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  

  useEffect(() => {
    setForm(lote);
    // Cargar la primera foto si existe
    if (lote.fotos && lote.fotos.length > 0) {
        setEditImageUrl(lote.fotos[0]);
    } else {
        setEditImageUrl('');
    }
  }, [lote]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Manejo especial para la URL de la foto (no está directo en el root de FullLote)
    if (name === 'imageUrl') {
        setEditImageUrl(value);
        return;
    }

    if (name === 'fechaVencimiento') {
        const fechaVencimiento = new Date(value);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (fechaVencimiento < hoy) {
            setValidationErrors(prev => ({ ...prev, fechaVencimiento: 'La fecha debe ser posterior a hoy' }));
        } else {
            setValidationErrors(prev => ({ ...prev, fechaVencimiento: '' }));
        }
    }
    
    if (name === 'precioRescate' || name === 'cantidad') {
        setForm(prev => ({ ...prev, [name]: Number(value) }));
        return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!lote._id) return;
    if (!form.cantidad || Number(form.cantidad) <= 0) return;

    // Actualizamos el array de fotos con la nueva URL antes de enviar
    const dataToSend = {
        ...form,
        fotos: editImageUrl ? [editImageUrl] : []
    };

    await onSubmit(lote._id, dataToSend);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Lote</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
            margin="dense" label="Tienda" fullWidth value={form.proveedor || ''} disabled variant="filled" sx={{ mb: 2 }}
        />
        <TextField margin="dense" label="Nombre" name="nombre" fullWidth value={form.nombre || ''} onChange={handleChange} required />
        <TextField margin="dense" label="Descripción" name="descripcion" fullWidth value={form.descripcion || ''} onChange={handleChange} required />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField margin="dense" label="Categoría" name="categoria" select fullWidth value={form.categoria || ''} onChange={handleChange} required >
            {categorias.map((cat) => (<MenuItem key={cat} value={cat}>{cat}</MenuItem>))}
            </TextField>
            <TextField margin="dense" label="Estado" name="estado" select fullWidth value={form.estado || 'Disponible'} onChange={handleChange} required >
            {estados.map((est) => (<MenuItem key={est} value={est}>{est}</MenuItem>))}
            </TextField>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField margin="dense" label="Cantidad" name="cantidad" type="number" fullWidth value={form.cantidad || ''} onChange={handleChange} required error={Boolean(validationErrors.cantidad)} helperText={validationErrors.cantidad} />
            <TextField margin="dense" label="Unidad" name="unidad" select fullWidth value={form.unidad || ''} onChange={handleChange} required >
            {unidades.map((u) => (<MenuItem key={u} value={u}>{u}</MenuItem>))}
            </TextField>
        </Box>

        <TextField margin="dense" label="Precio Rescate" name="precioRescate" type="number" fullWidth value={form.precioRescate || ''} onChange={handleChange} required helperText={`Precio original: ${lote.precioOriginal}`} />
        
        <TextField margin="dense" label="Fecha de Vencimiento" name="fechaVencimiento" type="date" fullWidth InputLabelProps={{ shrink: true }} value={form.fechaVencimiento?.toString().split('T')[0] || ''} onChange={handleChange} required error={Boolean(validationErrors.fechaVencimiento)} helperText={validationErrors.fechaVencimiento} />
        
        {/* Campo para editar la URL de la imagen */}
        <TextField margin="dense" label="URL de Imagen" name="imageUrl" type="url" fullWidth value={editImageUrl} onChange={handleChange} helperText="Edita el enlace de la foto principal" />

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoteFormDialog;