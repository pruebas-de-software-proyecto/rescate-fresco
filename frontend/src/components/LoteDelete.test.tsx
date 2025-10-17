// frontend/src/components/LoteTable.test.tsx
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import LoteTable from './loteTable';
import FullLotesAPI, { FullLote } from '../services/types';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Lote de prueba
const LoteTest: FullLote = {
  _id: 'test123',
  nombre: 'Leche sin lactosa',
  categoria: 'Lácteos',
  descripcion: 'Leche deslactosada 1L marca Colun',
  cantidad: 5,
  unidad: 'litros',
  precioOriginal: 6000,
  precioRescate: 1200,
  fechaVencimiento: '2025-12-01',
  ventanaRetiro: '10:00 - 13:00',
  ubicacion: 'Tienda Vaquita Feliz',
  fotos: ['https://example.com/peras.jpg'],
  estado: 'Disponible',    
  proveedor: 'Colun',
};

// Mocks
vi.spyOn(FullLotesAPI, 'getAll').mockResolvedValue([LoteTest]);
const deleteMock = vi.spyOn(FullLotesAPI, 'delete').mockResolvedValue(LoteTest);

describe('Feature Delete - Lote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock de confirm para que siempre devuelva true
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  it('permite eliminar un lote y llama al endpoint de delete', async () => {
    render(<LoteTable />);

    // Esperar a que cargue el lote
    const deleteButton = await screen.findByRole('button', { name: /delete/i });

    // Hacer click en eliminar
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Esperar a que se llame al delete
    await waitFor(() => {
      expect(deleteMock).toHaveBeenCalledWith('test123');
    });
  });

  it('no llama a delete si el usuario cancela', async () => {
    // Sobrescribimos confirm para que devuelva false
    vi.spyOn(window, 'confirm').mockReturnValueOnce(false);

    render(<LoteTable />);
    const deleteButton = await screen.findByRole('button', { name: /delete/i });

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(deleteMock).not.toHaveBeenCalled();
    });
  });
});
