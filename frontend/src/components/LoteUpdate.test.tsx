// frontend/src/components/LoteUpdate.test.tsx
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import LoteTable from './loteTable';
import FullLotesAPI, { FullLote } from '../services/types';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock de datos de prueba
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

// Mock de FullLotesAPI
vi.spyOn(FullLotesAPI, 'getAll').mockResolvedValue([LoteTest]);
const updateMock = vi.spyOn(FullLotesAPI, 'update').mockResolvedValue(LoteTest);

describe('Feature Update - Lote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('carga los lotes en la tabla', async () => {
    render(<LoteTable />);
    const nombre = await screen.findByText('Leche sin lactosa');
    expect(nombre).toBeInTheDocument();
    expect(screen.getByText('Lácteos')).toBeInTheDocument();
    expect(screen.getByText('1200')).toBeInTheDocument(); // precioRescate
  });

  it('abre el formulario con datos precargados al hacer click en editar', async () => {
    render(<LoteTable />);
    const editButton = await screen.findByRole('button', { name: /edit/i });
    await act(async () => {
      fireEvent.click(editButton);
    });

    expect(screen.getByDisplayValue('Leche sin lactosa')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Lácteos')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1200')).toBeInTheDocument();
  });

  it('permite editar el precio de rescate y llama al endpoint de update', async () => {
    render(<LoteTable />);
    const editButton = await screen.findByRole('button', { name: /edit/i });

    await act(async () => {
      fireEvent.click(editButton);
    });

    const precioInput = screen.getByLabelText(/precio rescate/i);
    await act(async () => {
      fireEvent.change(precioInput, { target: { value: '1300' } });
    });

    const submitButton = screen.getByRole('button', { name: /guardar/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Esperar a que se llame el update
    await waitFor(() => {
      // Ahora se espera que precioRescate sea string
      expect(updateMock).toHaveBeenCalledWith(
        'test123',
        expect.objectContaining({ precioRescate: '1300' })
      );
    });
  });

  it('cierra el formulario al guardar', async () => {
    render(<LoteTable />);
    const editButton = await screen.findByRole('button', { name: /edit/i });

    await act(async () => {
      fireEvent.click(editButton);
    });

    const submitButton = screen.getByRole('button', { name: /guardar/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Esperar a que el formulario desaparezca
    await waitFor(() => {
      expect(screen.queryByLabelText(/precio rescate/i)).not.toBeInTheDocument();
    });
  });
});
