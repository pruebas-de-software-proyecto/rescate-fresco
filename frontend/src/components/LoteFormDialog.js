import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// frontend/src/components/LoteFormDialog.tsx
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Alert, } from '@mui/material';
const categorias = [
    'Frutas',
    'Verduras',
    'Lácteos',
    'Carnes',
    'Panadería',
    'Otros',
];
const unidades = ['kg', 'unidades', 'litros'];
const LoteFormDialog = ({ open, onClose, lote, onSubmit, error }) => {
    const [form, setForm] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    useEffect(() => {
        setForm(lote);
    }, [lote]);
    const handleChange = (e) => {
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
            }
            else {
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
        if (name == 'cantidad') {
            if (value === '') {
                setForm(prev => ({ ...prev, cantidad: undefined }));
                return;
            }
            const numValue = Number(value);
            if (numValue <= 0) {
                setValidationErrors(prev => ({
                    ...prev,
                    cantidad: "La cantidad debe ser mayor a 0"
                }));
                return;
            }
            else {
                setValidationErrors(prev => ({
                    ...prev,
                    cantidad: ''
                }));
            }
        }
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async () => {
        if (!lote._id)
            return;
        if (!form.cantidad || Number(form.cantidad) <= 0) {
            setValidationErrors(prev => ({
                ...prev,
                cantidad: 'La cantidad debe ser mayor a 0'
            }));
            return;
        }
        await onSubmit(lote._id, form);
    };
    return (_jsxs(Dialog, { open: open, onClose: onClose, fullWidth: true, maxWidth: "sm", children: [_jsx(DialogTitle, { children: "Editar Lote" }), _jsxs(DialogContent, { children: [error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error })), _jsx(TextField, { margin: "dense", label: "Nombre", name: "nombre", fullWidth: true, value: form.nombre || '', onChange: handleChange, required: true }), _jsx(TextField, { margin: "dense", label: "Descripci\u00F3n", name: "descripcion", fullWidth: true, value: form.descripcion || '', onChange: handleChange, required: true }), _jsx(TextField, { margin: "dense", label: "Categor\u00EDa", name: "categoria", select: true, fullWidth: true, value: form.categoria || '', onChange: handleChange, required: true, children: categorias.map((cat) => (_jsx(MenuItem, { value: cat, children: cat }, cat))) }), _jsx(TextField, { margin: "dense", label: "Cantidad", name: "cantidad", type: "number", fullWidth: true, value: form.cantidad || '', onChange: handleChange, required: true, error: Boolean(validationErrors.cantidad), helperText: validationErrors.cantidad, InputProps: {
                            inputProps: {
                                min: 1,
                                step: 1
                            }
                        } }), _jsx(TextField, { margin: "dense", label: "Unidad", name: "unidad", select: true, fullWidth: true, value: form.unidad || '', onChange: handleChange, required: true, children: unidades.map((u) => (_jsx(MenuItem, { value: u, children: u }, u))) }), _jsx(TextField, { margin: "dense", label: "Precio Rescate", name: "precioRescate", type: "number", fullWidth: true, value: form.precioRescate || '', onChange: handleChange, required: true, InputProps: {
                            inputProps: {
                                min: 0,
                                step: 1
                            }
                        }, helperText: `Precio original: ${lote.precioOriginal}` }), _jsx(TextField, { margin: "dense", label: "Fecha de Vencimiento", name: "fechaVencimiento", type: "date", fullWidth: true, InputLabelProps: { shrink: true }, value: form.fechaVencimiento?.toString().split('T')[0] || '', onChange: handleChange, required: true, error: Boolean(validationErrors.fechaVencimiento), helperText: validationErrors.fechaVencimiento, InputProps: {
                            inputProps: {
                                min: new Date().toISOString().split('T')[0] // Establece el mínimo como hoy
                            }
                        } })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onClose, children: "Cancelar" }), _jsx(Button, { onClick: handleSubmit, variant: "contained", color: "primary", children: "Guardar" })] })] }));
};
export default LoteFormDialog;
