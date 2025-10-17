import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FullLotesAPI, { FullLote } from '../services/types';
import LoteFormDialog from './LoteFormDialog';

const LoteTable: React.FC = () => {
  const [lotes, setLotes] = useState<FullLote[]>([]);
  const [selectedLote, setSelectedLote] = useState<FullLote | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const fetchLotes = async () => {
    const data = await FullLotesAPI.getAll();
    setLotes(data);
  };

  useEffect(() => {
    fetchLotes();
  }, []);

  const handleEdit = (lote: FullLote) => {
    setSelectedLote(lote);
    setOpenForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Seguro quieres eliminar este lote?')) {
      await FullLotesAPI.delete(id);
      fetchLotes();
    }
  };

  const handleCloseForm = () => {
    setSelectedLote(null);
    setOpenForm(false);
    fetchLotes();
  };

  return (
    <>
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

      {openForm && selectedLote && (
        <LoteFormDialog
          open={openForm}
          onClose={handleCloseForm}
          lote={selectedLote}
        />
      )}
    </>
  );
};

export default LoteTable;
