import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import FullLotesAPI from '../services/types';
const initialState = {
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
const LoteCreateDialog = ({ open, onClose, onSuccess }) => {
    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const numericFields = ['cantidad', 'precioOriginal', 'precioRescate'];
        let finalValue = value;
        if (numericFields.includes(name) || type === 'number') {
            if (value.trim() === '') {
                finalValue = null;
            }
            else {
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
            const val = formData[field];
            return typeof val === 'number' && val <= 0;
        });
        if (negativeField) {
            setError(`El campo '${negativeField}' debe ser un número mayor a 0.`);
            setLoading(false);
            return;
        }
        const requiredFields = ['nombre', 'categoria', 'cantidad', 'precioOriginal', 'precioRescate', 'fechaVencimiento', 'ventanaRetiro', 'ubicacion', 'proveedor', 'unidad'];
        const missingField = requiredFields.find(field => {
            const val = formData[field];
            return val === null || String(val).trim() === '';
        });
        if (missingField) {
            setError(`El campo '${missingField}' no puede estar vacío.`);
            setLoading(false);
            return;
        }
        const fechaVencimientoStr = formData.fechaVencimiento;
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
            const lotePayload = {
                nombre: loteData.nombre,
                categoria: loteData.categoria,
                descripcion: loteData.descripcion,
                unidad: loteData.unidad,
                fechaVencimiento: loteData.fechaVencimiento,
                ventanaRetiro: loteData.ventanaRetiro,
                ubicacion: loteData.ubicacion,
                proveedor: loteData.proveedor,
                estado: loteData.estado,
                cantidad: Number(loteData.cantidad),
                precioOriginal: Number(loteData.precioOriginal),
                precioRescate: Number(loteData.precioRescate),
                fotos: imageUrl ? [imageUrl] : [],
            };
            await FullLotesAPI.create(lotePayload);
            setFormData(initialState);
            onSuccess();
            onClose();
        }
        catch (error) {
            const apiError = error.response?.data;
            let errorMessage = apiError?.message || 'Error desconocido al crear el lote.';
            if (apiError?.errors) {
                const firstErrorPath = Object.keys(apiError.errors)[0];
                const detailedMessage = apiError.errors[firstErrorPath].message;
                errorMessage = `Error de validación: ${firstErrorPath} - ${detailedMessage}`;
            }
            setError(errorMessage);
            console.error('API Error:', error.response?.data || error);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(Dialog, { open: open, onClose: onClose, fullWidth: true, maxWidth: "md", children: [_jsx(DialogTitle, { children: "Crear Nuevo Lote" }), _jsxs(DialogContent, { children: [error && _jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error }), _jsx(TextField, { autoFocus: true, margin: "dense", name: "nombre", label: "Nombre del Producto", type: "text", fullWidth: true, value: formData.nombre, onChange: handleInputChange, required: true }), _jsx(TextField, { margin: "dense", name: "descripcion", label: "Descripci\u00F3n", type: "text", fullWidth: true, multiline: true, rows: 3, value: formData.descripcion, onChange: handleInputChange, required: true }), _jsxs(Box, { sx: { display: 'flex', gap: 2, mt: 1 }, children: [_jsx(TextField, { select: true, label: "Categor\u00EDa", name: "categoria", value: formData.categoria, onChange: handleInputChange, fullWidth: true, required: true, children: categorias.map((cat) => (_jsx(MenuItem, { value: cat, children: cat }, cat))) }), _jsx(TextField, { name: "cantidad", label: "Cantidad", type: "number", value: formData.cantidad, onChange: handleInputChange, required: true }), _jsx(TextField, { select: true, label: "Unidad", name: "unidad", value: formData.unidad, onChange: handleInputChange, required: true, children: unidades.map((u) => (_jsx(MenuItem, { value: u, children: u }, u))) })] }), _jsxs(Box, { sx: { display: 'flex', gap: 2, mt: 2 }, children: [_jsx(TextField, { name: "precioOriginal", label: "Precio Original", type: "number", fullWidth: true, value: formData.precioOriginal, onChange: handleInputChange, required: true }), _jsx(TextField, { name: "precioRescate", label: "Precio Rescate", type: "number", fullWidth: true, value: formData.precioRescate, onChange: handleInputChange, required: true })] }), _jsxs(Box, { sx: { display: 'flex', gap: 2, mt: 2 }, children: [_jsx(TextField, { margin: "dense", name: "fechaVencimiento", label: "Fecha de Vencimiento", type: "date", fullWidth: true, value: formData.fechaVencimiento, onChange: handleInputChange, InputLabelProps: { shrink: true }, required: true }), _jsx(TextField, { margin: "dense", name: "proveedor", label: "Proveedor", type: "text", fullWidth: true, value: formData.proveedor, onChange: handleInputChange, required: true })] }), _jsxs(Box, { sx: { display: 'flex', gap: 2, mt: 2 }, children: [_jsx(TextField, { margin: "dense", name: "ventanaRetiro", label: "Ventana de Retiro (Ej: 16:00-18:00)", type: "text", fullWidth: true, value: formData.ventanaRetiro, onChange: handleInputChange, required: true }), _jsx(TextField, { margin: "dense", name: "ubicacion", label: "Ubicaci\u00F3n de Retiro", type: "text", fullWidth: true, value: formData.ubicacion, onChange: handleInputChange, required: true })] }), _jsxs(Box, { sx: { mt: 2, border: '1px dashed grey', p: 2, borderRadius: 1 }, children: [_jsx(Typography, { variant: "body2", sx: { mb: 1 }, children: "URL de la Imagen (Servidor de Nube)" }), _jsx(TextField, { margin: "dense", name: "imageUrl", label: "Pegar URL aqu\u00ED", type: "url", fullWidth: true, value: formData.imageUrl, onChange: handleInputChange })] })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onClose, disabled: loading, children: "Cancelar" }), _jsx(Button, { onClick: handleSubmit, variant: "contained", disabled: loading, startIcon: loading ? _jsx(CircularProgress, { size: 20 }) : null, children: "Crear Lote" })] })] }));
};
export default LoteCreateDialog;
