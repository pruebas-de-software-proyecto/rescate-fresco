// frontend/src/components/LoteCreateDialog.tsx

import {
  Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogTitle, MenuItem, TextField, Typography
} from '@mui/material';
import React, { useState } from 'react';
import FullLotesAPI, { FullLote } from '../services/types'; // Asumo la importación correcta

interface LoteCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // Para refrescar la lista después de crear
}

// Estado del formulario: Incluye la URL temporal para entrada del usuario
type FormDataState = Omit<FullLote, '_id' | 'createdAt' | 'updatedAt' | 'fotos'> & {
    imageUrl: string; 
};

const initialState: FormDataState = {
  nombre: '',
  categoria: 'Frutas',
  descripcion: '',
  cantidad: 0,
  unidad: 'kg',
  precioOriginal: 0,
  precioRescate: 0,
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
    let finalValue: string | number = value;

    // Convertir números correctamente
    if (type === 'number' || ['cantidad', 'precioOriginal', 'precioRescate'].includes(name)) {
        finalValue = parseFloat(value) || 0;
    }
    
    // Asegurar que valores de selects y fechas no se traten como números
    const finalFinalValue = (e.target.nodeName === 'SELECT' || name === 'fechaVencimiento' || name === 'descripcion') ? value : finalValue; 
    
    setFormData((prev) => ({ ...prev, [name]: finalFinalValue as any }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // --- Validación de Campos Requeridos (Cliente) ---
    const requiredFields: (keyof FormDataState)[] = ['nombre', 'categoria', 'cantidad', 'precioOriginal', 'precioRescate', 'fechaVencimiento', 'ventanaRetiro', 'ubicacion', 'proveedor'];
    const missingField = requiredFields.find(field => !formData[field] || String(formData[field]).trim() === '' || (typeof formData[field] === 'number' && formData[field] <= 0));
    
    if (missingField) {
        setError(`El campo '${missingField}' es obligatorio o tiene un valor inválido.`);
        setLoading(false);
        return;
    }
    // ---------------------------------------------------
    
    try {
      // 1. Preparar el payload JSON
      const { imageUrl, ...loteData } = formData;
      
      const lotePayload = {
        ...loteData,
        // Incluir la URL pública en el array 'fotos'.
        fotos: imageUrl ? [imageUrl] : [], 
      };

      // 2. Llamar al servicio (asumiendo que FullLotesAPI.create envía JSON cuando no hay File)
      await FullLotesAPI.create(lotePayload); 
      
      setFormData(initialState);
      onSuccess(); 
      onClose();
    } catch (error: any) {
      // Manejo de errores de la API
      const apiError = error.response?.data;
      const errorMessage = apiError?.message || 'Error desconocido al crear el lote.';
      
      if (apiError?.errors) {
        // Mostrar el error más relevante de Mongoose
        const firstErrorPath = Object.keys(apiError.errors)[0];
        const detailedMessage = apiError.errors[firstErrorPath].message;
        setError(`Error de validación de Mongoose: ${firstErrorPath} - ${detailedMessage}`);
      } else {
        setError(errorMessage);
      }
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
        
        {/* FILA 1: NOMBRE / DESCRIPCIÓN */}
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
        
        {/* FILA 2: CATEGORÍA / CANTIDAD / UNIDAD */}
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
        
        {/* FILA 3: PRECIOS */}
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
        
        {/* FILA 4: VENCIMIENTO / PROVEEDOR */}
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
        
        {/* FILA 5: VENTANA DE RETIRO / UBICACIÓN (Los que fallaron antes) */}
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
        
        {/* CAMPO URL DE IMAGEN */}
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