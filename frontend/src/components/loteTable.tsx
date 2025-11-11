import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FullLotesAPI, { FullLote } from '../services/types';
import LoteCreateDialog from './LoteCreateDialog';
import LoteFormDialog from './LoteFormDialog';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoteTable: React.FC = () => {
  const [lotes, setLotes] = useState<FullLote[]>([]);
  const [selectedLote, setSelectedLote] = useState<FullLote | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const { logout } = useAuth(); 

  const handleUnauthorized = (err: any) => {
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

  const handleEdit = (lote: FullLote) => {
    setError(null);
    setSelectedLote(lote);
    setOpenEditDialog(true)
  };

  const handleUpdate = async (id: string, updatedData: Partial<FullLote>) => {
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
        if (updatedData[field as keyof FullLote] === '') {
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
    } catch (err: any) {
      setError('Error al actualizar el lote');
      console.error('Error updating lote:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Seguro quieres eliminar este lote?')) {
      try {
        await FullLotesAPI.delete(id); // <-- Esta llamada ahora puede fallar (401)
        fetchLotes();
      } catch (err: any) { // <-- 3. Añadimos el catch
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
  

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <Box sx={{ mb: 2, textAlign: 'left' }}>
        <Button variant="contained" onClick={() => setOpenCreateDialog(true)}>
          Crear Lote
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Unidad</TableCell>
              <TableCell>Precio Rescate</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lotes.map((lote) => (
              <TableRow key={lote._id}>
                <TableCell>{lote.nombre}</TableCell>
                <TableCell>{lote.categoria}</TableCell>
                <TableCell>{lote.cantidad}</TableCell>
                <TableCell>{lote.unidad}</TableCell>
                <TableCell>{lote.precioRescate}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(lote)} aria-label="edit">
                    <EditIcon />
                  </IconButton>
                  {<IconButton onClick={() => handleDelete(lote._id)} aria-label="delete">
                    <DeleteIcon />
                  </IconButton> }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <LoteCreateDialog
          open={openCreateDialog}
          onClose={handleCloseForm}
          onSuccess={handleLoteCreated} // <-- ¡Propiedad obligatoria añadida!
      />

      {openEditDialog && selectedLote && (
        <LoteFormDialog
          open={openEditDialog}
          onClose={handleCloseForm}
          lote={selectedLote}
          onSubmit={handleUpdate}
          error={error}
        />
      )}

    </>
  );
};

export default LoteTable;
