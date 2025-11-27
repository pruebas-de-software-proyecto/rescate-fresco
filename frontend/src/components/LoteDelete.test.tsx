// frontend/src/components/LoteTable.test.tsx
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import FullLotesAPI, { FullLote } from '../services/types';
import LoteTable from './loteTable';

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

// Helper para renderizar con providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  );
};

// Mocks
vi.spyOn(FullLotesAPI, 'getAll').mockResolvedValue([LoteTest]);
const deleteMock = vi.spyOn(FullLotesAPI, 'delete').mockResolvedValue(LoteTest);

describe('Feature Delete Lote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra diálogo de confirmación al intentar eliminar', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm');
    renderWithProviders(<LoteTable />);
    
    const deleteButton = await screen.findByRole('button', { name: /delete/i });
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    expect(confirmSpy).toHaveBeenCalled();
  });

  it('elimina el lote cuando se confirma la acción', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderWithProviders(<LoteTable />);
    
    const deleteButton = await screen.findByRole('button', { name: /delete/i });
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(deleteMock).toHaveBeenCalledWith('test123');
    });
  });

  it('no elimina el lote cuando se cancela la acción', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderWithProviders(<LoteTable />);
    
    const deleteButton = await screen.findByRole('button', { name: /delete/i });
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    expect(deleteMock).not.toHaveBeenCalled();
  });
});