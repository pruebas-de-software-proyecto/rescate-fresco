import React, { useEffect, useState } from 'react';
import {
  Box, Button, IconButton, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Alert, Typography, Chip, Stack, Avatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'; 
import ReportProblemIcon from '@mui/icons-material/ReportProblem'; 
import FullLotesAPI, { FullLote } from '../services/types';
import LoteCreateDialog from './LoteCreateDialog';
import LoteFormDialog from './LoteFormDialog';
import { useAuth } from '../context/AuthContext';

// Helpers
const formatCLP = (amount: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount); //  para formatear precio a CLP

const formatDateShort = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(date);
};

const calculateDiscount = (original: number, rescate: number) => {
  if (!original || original === 0) return 0;
  return Math.round(((original - rescate) / original) * 100);
};

const isDateExpired = (dateString: string) => {
    if (!dateString) return false;

    const vencimiento = new Date(dateString);
    const hoy = new Date();
    const hoyMidnight = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    const vencimientoMidnight = new Date(
        vencimiento.getUTCFullYear(), 
        vencimiento.getUTCMonth(), 
        vencimiento.getUTCDate()
    );
    return vencimientoMidnight.getTime() < hoyMidnight.getTime();
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'disponible': return { bg: '#E6F4EA', color: '#1E8E3E' }; 
    case 'reservado': return { bg: '#FCE8E6', color: '#C5221F' }; 
    case 'retirado': return { bg: '#F1F3F4', color: '#5F6368' }; 
    case 'vencido': return { bg: '#FEF7E0', color: '#EA8600' }; 
    default: return { bg: '#F1F3F4', color: '#000' };
  }
};

const LoteTable: React.FC = () => {
  const [lotes, setLotes] = useState<FullLote[]>([]);
  const [selectedLote, setSelectedLote] = useState<FullLote | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { logout, user } = useAuth();

  const handleUnauthorized = (err: any) => {
    if (err.response && err.response.status === 401) {
      setError('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
      logout();
      return true;
    }
    return false;
  };

  const fetchLotes = async () => {
    try {
      const data = await FullLotesAPI.getAllGestion();
      
      setLotes(data);

    } catch (err: any) {
        handleUnauthorized(err);
    }
  };

  useEffect(() => {
    if (user) fetchLotes();
  }, [user]);

  const handleCreate = () => {
    setSelectedLote(null);
    setOpenCreateDialog(true);
  };

  const handleEdit = (lote: FullLote) => {
    setError(null);
    setSelectedLote(lote);
    setOpenEditDialog(true);
  };

  const handleUpdate = async (id: string, updatedData: Partial<FullLote>) => {
    try {
       if (selectedLote && updatedData.precioRescate) {
            const precioRescate = Number(updatedData.precioRescate);
            const precioOriginal = selectedLote.precioOriginal;
            if (precioRescate >= precioOriginal) {
               setError('El precio de rescate debe ser menor al precio original');
               return;
            }
       }
       await FullLotesAPI.update(id, updatedData);
       setError(null);
       handleCloseForm();
       await fetchLotes();
    } catch (err: any) {
       setError('Error al actualizar el lote');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Seguro quieres eliminar este lote?')) {
      try {
        await FullLotesAPI.delete(id);
        fetchLotes();
      } catch (err: any) {
        if (!handleUnauthorized(err)) {
          setError('Error al eliminar el lote');
        }
      }
    }
  };

  const handleLoteCreated = () => {
    handleCloseForm();
    fetchLotes();
  };

  const handleCloseForm = () => {
    setOpenCreateDialog(false);
    setOpenEditDialog(false);
    setSelectedLote(null);
    fetchLotes(); 
  };

  return (
    <>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

      <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 5, mt: 2 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: '600', color: '#565656' }}>Gestión de Lotes</Typography>
        <Button 
            variant="contained" onClick={handleCreate}
            sx={{ 
                position: 'absolute', right: 0, backgroundColor: '#1E8E3E', 
                textTransform: 'none', borderRadius: '6px', px: 2,
                '&:hover': { backgroundColor: '#166E2F' }
            }}
        >
          Crear Lote +
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E0E0E0' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead></TableHead>
          <TableBody>
            {lotes.map((lote) => {
                const discount = calculateDiscount(lote.precioOriginal, lote.precioRescate);
                const expired = isDateExpired(lote.fechaVencimiento.toString());
                
                // CORRECCIÓN 2: Tipado explícito como 'string' para evitar error de Enum
                let effectiveState: string = lote.estado; 
                
                if (lote.estado === 'Disponible' && expired) {
                    effectiveState = 'vencido';
                }

                let displayLabel: string = effectiveState;
                if (effectiveState.toLowerCase() === 'vencido') {
                    displayLabel = 'Caducado';
                }

                const statusStyle = getStatusColor(effectiveState);

                return (
                  <TableRow key={lote._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar variant="rounded" src={lote.fotos?.[0] || ''} sx={{ width: 56, height: 56, bgcolor: '#f0f0f0' }}>
                            {!lote.fotos?.[0] && lote.nombre.charAt(0)} 
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold">{lote.nombre}</Typography>
                            <Typography variant="body2" color="#757575">{lote.categoria} • ID: {lote._id.slice(-4)}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                        <Box>
                            <Typography variant="subtitle2" color="#9E9E9E" fontSize="0.75rem">Stock</Typography>
                            <Typography variant="h6" fontWeight="bold">{lote.cantidad} {lote.unidad === 'unidades' ? 'un.' : lote.unidad}</Typography>
                        </Box>
                    </TableCell>
                    <TableCell>
                        <Stack direction="column" alignItems="flex-start" spacing={0.5}>
                            <Chip label={displayLabel} size="small" sx={{ 
                                backgroundColor: statusStyle.bg, color: statusStyle.color, 
                                fontWeight: 'bold', borderRadius: '6px', textTransform: 'capitalize' 
                            }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#DA0303' }}>
                                <ReportProblemIcon sx={{ fontSize: 16 }} />
                                <Typography variant="caption" fontWeight="bold">Vence: {formatDateShort(lote.fechaVencimiento.toString())}</Typography>
                            </Box>
                        </Stack>
                    </TableCell>
                    <TableCell>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">{formatCLP(lote.precioRescate)}</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Typography variant="caption" sx={{ textDecoration: 'line-through', color: '#9E9E9E' }}>{formatCLP(lote.precioOriginal)}</Typography>
                                <Typography variant="caption" color="#1E8E3E" fontWeight="bold">-{discount}%</Typography>
                            </Box>
                        </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button startIcon={<EditIcon />} onClick={() => handleEdit(lote)} sx={{ textTransform: 'none', color: '#1E8E3E', fontWeight: 'bold' }}>Editar</Button>
                        <IconButton onClick={() => handleDelete(lote._id)} sx={{ color: '#D32F2F' }}><DeleteOutlineIcon /></IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                )})}
          </TableBody>
        </Table>
      </TableContainer>
      <LoteCreateDialog open={openCreateDialog} onClose={handleCloseForm} onSuccess={handleLoteCreated} />
      {openEditDialog && selectedLote && (
        <LoteFormDialog open={openEditDialog} onClose={handleCloseForm} lote={selectedLote} onSubmit={handleUpdate} error={error} />
      )}
    </>
  );
};

export default LoteTable;