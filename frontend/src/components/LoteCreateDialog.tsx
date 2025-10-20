// frontend/src/components/LoteCreateDialog.tsx

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
  fechaVencimiento: new Date().toISOString().split('T')[0], // YYYY-MM-DD
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
    
    let finalValue: string | number;

    if (numericFields.includes(name) || type === 'number') {
        finalValue = parseFloat(value) || 0;

        if (value.trim() === '') {
            finalValue = 0;
        }

    } else {
        finalValue = value;
    }
  
    setFormData((prev) => ({ ...prev, [name]: finalValue as any }));
  };

const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // --- 1. VALIDACIÓN DE CAMPOS REQUERIDOS (Cliente) ---
    // (Esta validación asegura que los campos necesarios no son null)
    const requiredFields: (keyof FormDataState)[] = ['nombre', 'categoria', 'cantidad', 'precioOriginal', 'precioRescate', 'fechaVencimiento', 'ventanaRetiro', 'ubicacion', 'proveedor'];
    
    const missingField = requiredFields.find(field => {
        const val = formData[field];
        // Comprobación: null, cadena vacía o número <= 0
        return val === null || String(val).trim() === '' || (typeof val === 'number' && val <= 0);
    });
    
    if (missingField) {
        setError(`El campo '${missingField}' es obligatorio o tiene un valor inválido.`);
        setLoading(false);
        return;
    }
    // ---------------------------------------------------
    
    try {
      const { imageUrl, ...loteData } = formData;
      
      // --- 2. CONSTRUCCIÓN DEL PAYLOAD FINAL SIN NULLS ---
      // Usamos el operador '!' (Non-null assertion) para decirle a TypeScript
      // que sabemos que estos valores no son null gracias a la validación anterior.
      const lotePayload: Omit<FullLote, "_id" | "createdAt" | "updatedAt"> = {
        
        // Campos de texto y selección obligatorios: Usamos '!'
        nombre: loteData.nombre!, 
        categoria: loteData.categoria!,
        descripcion: loteData.descripcion!,
        unidad: loteData.unidad!,
        fechaVencimiento: loteData.fechaVencimiento!,
        ventanaRetiro: loteData.ventanaRetiro!,
        ubicacion: loteData.ubicacion!,
        proveedor: loteData.proveedor!,
        estado: loteData.estado!,

        // Campos numéricos obligatorios: Ya los manejamos como Number o null, 
        // pero Number() nos asegura el tipo final, y el '!' asegura que no es null.
        cantidad: Number(loteData.cantidad)!,
        precioOriginal: Number(loteData.precioOriginal)!,
        precioRescate: Number(loteData.precioRescate)!,
        
        // Fotos
        fotos: imageUrl ? [imageUrl] : [], 
      };

      // 3. Llamar al servicio con el tipo correcto
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