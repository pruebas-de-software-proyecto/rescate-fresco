import {
  Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogTitle, MenuItem, TextField, Typography
} from '@mui/material';
import React, { useState, useEffect} from 'react';
import FullLotesAPI, { FullLote } from '../services/types';
import { useAuth } from '../context/AuthContext';
import tiendasAPI from '../api/user';

interface LoteCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Nullable<T> = { [P in keyof T]: T[P] | null; };
type FormDataState = Nullable<Omit<FullLote, '_id' | 'createdAt' | 'updatedAt' | 'fotos'>> & {
  imageUrl: string;
};

const initialState: FormDataState = {
  nombre: '',
  categoria: 'Frutas',
  descripcion: '',
  cantidad: null,
  unidad: 'kg',
  precioOriginal: null,
  precioRescate: null,
  fechaVencimiento: new Date().toISOString().split('T')[0],
  ventanaRetiro: '',
  ubicacion: '',
  proveedor: '', // Ya no importa, el backend lo llena
  estado: 'Disponible',
  imageUrl: '',
};

const categorias = ['Frutas', 'Verduras', 'Lácteos', 'Carnes', 'Panadería', 'Otros'];
const unidades = ['kg', 'unidades', 'litros'];

const LoteCreateDialog: React.FC<LoteCreateDialogProps> = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<FormDataState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nombreTiendaReal, setNombreTiendaReal] = useState('Cargando...');


  useEffect(() => {
    if (open) {
        const fetchNombreTienda = async () => {
            try {
                // Llamamos al endpoint /tiendas/me que ya tenías configurado
                const perfil = await tiendasAPI.getMiTienda();
                if (perfil && perfil.nombreTienda) {
                    setNombreTiendaReal(perfil.nombreTienda);
                } else {
                    setNombreTiendaReal('Tienda Desconocida');
                }
            } catch (err) {
                console.error("Error cargando nombre de tienda:", err);
                setNombreTiendaReal('Error al cargar nombre');
            }
        };
        fetchNombreTienda();
    }
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const numericFields = ['cantidad', 'precioOriginal', 'precioRescate'];
    let finalValue: string | number | null = value;

    if (numericFields.includes(name) || type === 'number') {
        if (value.trim() === '') {
            finalValue = null;
        } else {
            const numValue = parseFloat(value);
            finalValue = isNaN(numValue) ? null : numValue;
        }
    }
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    setError(null);
  };

  const handleSubmit = async () => {

    setError(null);


    const requiredFields: (keyof FormDataState)[] = [
        'nombre', 'categoria', 'descripcion', 'cantidad', 'unidad', 
        'precioOriginal', 'precioRescate', 'fechaVencimiento', 
        'ventanaRetiro', 'ubicacion'
    ];
    
    const missingField = requiredFields.find(field => {
        const val = formData[field];
        return val === null || String(val).trim() === '';
    });
    
    if (missingField) {
        setError(`El campo '${missingField}' es obligatorio.`);
        return;
    }

    if (Number(formData.cantidad) <= 0) {
        setError('La cantidad debe ser mayor a 0.');
        return;
    }
    if (Number(formData.precioRescate) >= Number(formData.precioOriginal)) {
        setError('El precio de rescate debe ser menor que el original.');
        return;
    }

    setLoading(true);
    
    try {
      const { imageUrl, ...loteData } = formData;
      
      const lotePayload: Omit<FullLote, "_id" | "createdAt" | "updatedAt"> = {
        nombre: loteData.nombre!,
        categoria: loteData.categoria!,
        descripcion: loteData.descripcion!,
        unidad: loteData.unidad!,
        fechaVencimiento: loteData.fechaVencimiento!,
        ventanaRetiro: loteData.ventanaRetiro!,
        ubicacion: loteData.ubicacion!,
        
        proveedor: nombreTiendaReal,
        
        estado: loteData.estado!,
        cantidad: Number(loteData.cantidad)!,
        precioOriginal: Number(loteData.precioOriginal)!,
        precioRescate: Number(loteData.precioRescate)!,
        fotos: imageUrl ? [imageUrl] : [],
      };

      await FullLotesAPI.create(lotePayload);
      
      setFormData(initialState);
      onSuccess();
      onClose();
    } catch (error: any) {
      // Manejo de errores más limpio
      const msg = error.response?.data?.message || error.message || 'Error al crear';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Crear Nuevo Lote</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField margin="dense" label="Tienda" fullWidth value={nombreTiendaReal} disabled variant="filled" InputProps={{ readOnly: true }} sx={{ mb: 2 }}
        />
        <TextField autoFocus margin="dense" name="nombre" label="Nombre del Producto" fullWidth value={formData.nombre} onChange={handleInputChange} required />
        <TextField margin="dense" name="descripcion" label="Descripción" fullWidth multiline rows={3} value={formData.descripcion} onChange={handleInputChange} required />
        
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <TextField select label="Categoría" name="categoria" fullWidth value={formData.categoria} onChange={handleInputChange} required >
            {categorias.map((cat) => (<MenuItem key={cat} value={cat}>{cat}</MenuItem>))}
          </TextField>
          <TextField name="cantidad" label="Cantidad" type="number" fullWidth value={formData.cantidad || ''} onChange={handleInputChange} required />
          <TextField select label="Unidad" name="unidad" fullWidth value={formData.unidad} onChange={handleInputChange} required >
            {unidades.map((u) => (<MenuItem key={u} value={u}>{u}</MenuItem>))}
          </TextField>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField name="precioOriginal" label="Precio Original" type="number" fullWidth value={formData.precioOriginal || ''} onChange={handleInputChange} required />
            <TextField name="precioRescate" label="Precio Rescate" type="number" fullWidth value={formData.precioRescate || ''} onChange={handleInputChange} required />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField margin="dense" name="fechaVencimiento" label="Fecha de Vencimiento" type="date" fullWidth value={formData.fechaVencimiento} onChange={handleInputChange} InputLabelProps={{ shrink: true }} required />
            
            {/* YA NO HAY CAMPO DE PROVEEDOR AQUÍ */}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField margin="dense" name="ventanaRetiro" label="Ventana de Retiro (Ej: 16:00-18:00)" fullWidth value={formData.ventanaRetiro} onChange={handleInputChange} required />
            <TextField margin="dense" name="ubicacion" label="Ubicación" fullWidth value={formData.ubicacion} onChange={handleInputChange} required />
        </Box>
        
        <Box sx={{ mt: 2, border: '1px dashed grey', p: 2, borderRadius: 1 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>URL de la Imagen (Opcional)</Typography>
          <TextField margin="dense" name="imageUrl" label="Pegar URL aquí" type="url" fullWidth value={formData.imageUrl} onChange={handleInputChange} />
        </Box>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : null}>
          Crear Lote
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoteCreateDialog;