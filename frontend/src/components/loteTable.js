import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FullLotesAPI from '../services/types';
import LoteCreateDialog from './LoteCreateDialog';
import LoteFormDialog from './LoteFormDialog';
import { useAuth } from '../context/AuthContext';
const LoteTable = () => {
    const [lotes, setLotes] = useState([]);
    const [selectedLote, setSelectedLote] = useState(null);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { logout } = useAuth();
    const handleUnauthorized = (err) => {
        if (err.response && err.response.status === 401) {
            setError('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
            logout();
            return true; // Devuelve 'true' si fue un error 401
        }
        return false; // No fue un error 401
    };
    const fetchLotes = async () => {
        const data = await FullLotesAPI.getAll();
        setLotes(data);
    };
    useEffect(() => {
        fetchLotes();
    }, []);
    const handleCreate = () => {
        setSelectedLote(null);
        setOpenCreateDialog(true);
    };
    const handleEdit = (lote) => {
        setError(null);
        setSelectedLote(lote);
        setOpenEditDialog(true);
    };
    const handleUpdate = async (id, updatedData) => {
        try {
            // Validar precio de rescate
            if (selectedLote && updatedData.precioRescate) {
                const precioRescate = Number(updatedData.precioRescate);
                const precioOriginal = selectedLote.precioOriginal;
                if (precioRescate >= precioOriginal) {
                    setError('El precio de rescate debe ser menor al precio original');
                    return;
                }
            }
            // Validar campos vacíos
            const requiredFields = ['nombre', 'descripcion', 'precioRescate'];
            for (const field of requiredFields) {
                if (updatedData[field] === '') {
                    setError(`El campo ${field} no puede estar vacío`);
                    return;
                }
            }
            if (updatedData.fechaVencimiento) {
                const fechaVencimiento = new Date(updatedData.fechaVencimiento);
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0); // Reset hora a 00:00:00
                if (fechaVencimiento < hoy) {
                    setError('La fecha de vencimiento debe ser posterior a hoy');
                    return;
                }
            }
            // Si pasa las validaciones, actualizar
            await FullLotesAPI.update(id, updatedData);
            setError(null);
            handleCloseForm();
            await fetchLotes();
        }
        catch (err) {
            setError('Error al actualizar el lote');
            console.error('Error updating lote:', err);
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro quieres eliminar este lote?')) {
            try {
                await FullLotesAPI.delete(id); // <-- Esta llamada ahora puede fallar (401)
                fetchLotes();
            }
            catch (err) { // <-- 3. Añadimos el catch
                if (!handleUnauthorized(err)) {
                    setError('Error al eliminar el lote');
                }
                console.error('Error deleting lote:', err);
            }
        }
    };
    const handleLoteCreated = () => {
        // 1. Cierra el diálogo/formulario (si no lo haces ya en onClose)
        handleCloseForm();
        // 2. Lógica para recargar la lista de lotes
        console.log("Lote creado, recargando datos...");
        // Por ejemplo: refetchLotes(); 
    };
    const handleCloseForm = () => {
        setOpenCreateDialog(false);
        setOpenEditDialog(false);
        setSelectedLote(null);
        fetchLotes();
    };
    return (_jsxs(_Fragment, { children: [error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, onClose: () => setError(null), children: error })), _jsx(Box, { sx: { mb: 2, textAlign: 'left' }, children: _jsx(Button, { variant: "contained", onClick: () => setOpenCreateDialog(true), children: "Crear Lote" }) }), _jsx(TableContainer, { component: Paper, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Nombre" }), _jsx(TableCell, { children: "Categor\u00EDa" }), _jsx(TableCell, { children: "Cantidad" }), _jsx(TableCell, { children: "Unidad" }), _jsx(TableCell, { children: "Precio Rescate" }), _jsx(TableCell, { children: "Acciones" })] }) }), _jsx(TableBody, { children: lotes.map((lote) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: lote.nombre }), _jsx(TableCell, { children: lote.categoria }), _jsx(TableCell, { children: lote.cantidad }), _jsx(TableCell, { children: lote.unidad }), _jsx(TableCell, { children: lote.precioRescate }), _jsxs(TableCell, { children: [_jsx(IconButton, { onClick: () => handleEdit(lote), "aria-label": "edit", children: _jsx(EditIcon, {}) }), _jsx(IconButton, { onClick: () => handleDelete(lote._id), "aria-label": "delete", children: _jsx(DeleteIcon, {}) })] })] }, lote._id))) })] }) }), _jsx(LoteCreateDialog, { open: openCreateDialog, onClose: handleCloseForm, onSuccess: handleLoteCreated }), openEditDialog && selectedLote && (_jsx(LoteFormDialog, { open: openEditDialog, onClose: handleCloseForm, lote: selectedLote, onSubmit: handleUpdate, error: error }))] }));
};
export default LoteTable;
