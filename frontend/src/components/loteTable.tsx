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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FullLotesAPI, { FullLote } from '../services/types';
import LoteCreateDialog from './LoteCreateDialog';
import LoteFormDialog from './LoteFormDialog';

const LoteTable: React.FC = () => {
  const [lotes, setLotes] = useState<FullLote[]>([]);
  const [selectedLote, setSelectedLote] = useState<FullLote | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

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
    setSelectedLote(lote);
    setOpenEditDialog(true)
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Seguro quieres eliminar este lote?')) {
      await FullLotesAPI.delete(id);
      fetchLotes();
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
        />
      )}

    </>
  );
};

export default LoteTable;
