// frontend/src/components/LoteTable.test.tsx
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi, beforeAll } from 'vitest';
import FullLotesAPI, { FullLote } from '../services/types';
import LoteTable from './loteTable';

beforeAll(() => {
  window.scrollTo = vi.fn();
});

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
  proveedor: 'Mi Tienda',
};

vi.mock('../context/AuthContext', () => {
 const mockUser = { id: 'tienda123', nombreTienda: 'Mi Tienda' };

 return {
   useAuth: () => ({
      user: mockUser, // Usuario logueado
      isAuthenticated: true,
      logout: vi.fn()
    })
  };
});

vi.mock('../services/types', () => ({
  default: {
    getAllGestion: vi.fn(), 
    delete: vi.fn(),
    getAll: vi.fn(), 
    update: vi.fn()
  }
}))


// Mocks
const mockGetAllGestion = vi.mocked(FullLotesAPI.getAllGestion);
const mockDelete = vi.mocked(FullLotesAPI.delete);

describe('Feature Delete Lote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAllGestion.mockResolvedValue([LoteTest]);
    mockDelete.mockResolvedValue(LoteTest);
  });

  const waitForTableLoad = async () => {
    await screen.findByText('Leche sin lactosa', {}, { timeout: 3000 });
  };

  it('muestra diálogo de confirmación al intentar eliminar', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => false);
    render(<LoteTable />);
    await waitForTableLoad();
    const deleteButton = await screen.findByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled()
  });

  it('elimina el lote cuando se confirma la acción', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<LoteTable />);
    await waitForTableLoad();
    
    const deleteButton = await screen.getByRole('button', { name: /delete/i });
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('test123');
    });
    expect(mockGetAllGestion).toHaveBeenCalledTimes(2);
  });

  it('no elimina el lote cuando se cancela la acción', async () => {
    vi.spyOn(window, 'confirm').mockImplementation(() => false);

    render(<LoteTable />);
    await waitForTableLoad();

    const deleteButton = await screen.findByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockDelete).not.toHaveBeenCalled();
  });
});