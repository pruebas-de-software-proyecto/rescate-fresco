import {
  Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogTitle, MenuItem, TextField, Typography
} from '@mui/material';
import React, { useState } from 'react';
import FullLotesAPI, { FullLote } from '../services/types';

interface LoteCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};
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
  proveedor: '',
  estado: 'Disponible',
  imageUrl: '',
};

const categorias = ['Frutas', 'Verduras', 'Lácteos', 'Carnes', 'Panadería', 'Otros'];
const unidades = ['kg', 'unidades', 'litros'];

const LoteCreateDialog: React.FC<LoteCreateDialogProps> = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<FormDataState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setLoading(true);
    setError(null);

    const numericFields = ['cantidad', 'precioOriginal', 'precioRescate'];
    const negativeField = numericFields.find(field => {
        const val = formData[field as keyof FormDataState];
        return typeof val === 'number' && val <= 0;
    });

    if (negativeField) {
        setError(`El campo '${negativeField}' debe ser un número mayor a 0.`);
        setLoading(false);
        return;
    }

    const requiredFields: (keyof FormDataState)[] = ['nombre', 'categoria', 'cantidad', 'precioOriginal', 'precioRescate', 'fechaVencimiento', 'ventanaRetiro', 'ubicacion', 'proveedor', 'unidad'];
    
    const missingField = requiredFields.find(field => {
        const val = formData[field];
        return val === null || String(val).trim() === '';
    });
    
    if (missingField) {
        setError(`El campo '${missingField}' no puede estar vacío.`);
        setLoading(false);
        return;
    }

    const fechaVencimientoStr = formData.fechaVencimiento as string;
    const fechaVencimiento = new Date(fechaVencimientoStr + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaVencimiento < hoy) {
        setError('La fecha de vencimiento no puede ser anterior a la fecha actual.');
        setLoading(false);
        return;
    }

    // Validar que el precio de rescate sea menor que el precio original
    const precioOriginal = Number(formData.precioOriginal);
    const precioRescate = Number(formData.precioRescate);
    
    if (precioRescate >= precioOriginal) {
        setError('El precio de rescate debe ser menor que el precio original.');
        setLoading(false);
        return;
    }
    
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
        proveedor: loteData.proveedor!,
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
      const apiError = error.response?.data;
      let errorMessage = apiError?.message || 'Error desconocido al crear el lote.';
      
      if (apiError?.errors) {
        const firstErrorPath = Object.keys(apiError.errors)[0];
        const detailedMessage = apiError.errors[firstErrorPath].message;
        errorMessage = `Error de validación: ${firstErrorPath} - ${detailedMessage}`;
      }
      setError(errorMessage);
      console.error('API Error:', error.response?.data || error);
    } finally {
      setLoading(false);
    }
};

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Crear Nuevo Lote</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <TextField 
            autoFocus margin="dense" name="nombre" 
            label="Nombre del Producto" type="text" fullWidth 
            value={formData.nombre} onChange={handleInputChange} 
            required
        />
        <TextField 
            margin="dense" name="descripcion" label="Descripción" 
            type="text" fullWidth multiline rows={3} 
            value={formData.descripcion} onChange={handleInputChange} 
            required
        />
        
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <TextField 
            select label="Categoría" name="categoria" 
            value={formData.categoria} onChange={handleInputChange} fullWidth 
            required
          >
            {categorias.map((cat) => (<MenuItem key={cat} value={cat}>{cat}</MenuItem>))}
          </TextField>
          <TextField 
            name="cantidad" label="Cantidad" 
            type="number" value={formData.cantidad} onChange={handleInputChange} 
            required
          />
          <TextField 
            select label="Unidad" name="unidad" 
            value={formData.unidad} onChange={handleInputChange} 
            required
          >
            {unidades.map((u) => (<MenuItem key={u} value={u}>{u}</MenuItem>))}
          </TextField>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField 
                name="precioOriginal" label="Precio Original" 
                type="number" fullWidth value={formData.precioOriginal} onChange={handleInputChange} 
                required
            />
            <TextField 
                name="precioRescate" label="Precio Rescate" 
                type="number" fullWidth value={formData.precioRescate} onChange={handleInputChange} 
                required
            />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField 
                margin="dense" name="fechaVencimiento" label="Fecha de Vencimiento" 
                type="date" fullWidth value={formData.fechaVencimiento} onChange={handleInputChange} 
                InputLabelProps={{ shrink: true }} 
                required
            />
            <TextField 
                margin="dense" name="proveedor" label="Proveedor" 
                type="text" fullWidth value={formData.proveedor} onChange={handleInputChange} 
                required
            />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
                margin="dense" name="ventanaRetiro"
                label="Ventana de Retiro (Ej: 16:00-18:00)" type="text" fullWidth 
                value={formData.ventanaRetiro} onChange={handleInputChange} 
                required
            />
            <TextField
                margin="dense" name="ubicacion"
                label="Ubicación de Retiro" type="text" fullWidth 
                value={formData.ubicacion} onChange={handleInputChange} 
                required
            />
        </Box>
        
        <Box sx={{ mt: 2, border: '1px dashed grey', p: 2, borderRadius: 1 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>URL de la Imagen (Servidor de Nube)</Typography>
          <TextField
            margin="dense" name="imageUrl" label="Pegar URL aquí" 
            type="url" fullWidth value={formData.imageUrl} onChange={handleInputChange} 
          />
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