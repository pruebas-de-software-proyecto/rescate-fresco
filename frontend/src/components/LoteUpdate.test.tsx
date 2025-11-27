// frontend/src/components/LoteUpdate.test.tsx
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import FullLotesAPI, { FullLote } from '../services/types';
import LoteTable from './loteTable';

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

// Helper para renderizar con providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  );
};

// Mock de FullLotesAPI
vi.spyOn(FullLotesAPI, 'getAll').mockResolvedValue([LoteTest]);
const updateMock = vi.spyOn(FullLotesAPI, 'update').mockResolvedValue(LoteTest);

describe('Feature Update Lote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Configurar los mocks básicos para cada test
    vi.spyOn(FullLotesAPI, 'getAll').mockResolvedValue([LoteTest]);
    vi.spyOn(FullLotesAPI, 'update').mockResolvedValue({
      ...LoteTest,
      precioRescate: 1300,
      descripcion: 'Nueva descripción'
    });
  });

  describe('Visualización de datos', () => {
    it('carga los lotes en la tabla', async () => {
      renderWithProviders(<LoteTable />);
      const nombre = await screen.findByText('Leche sin lactosa');
      expect(nombre).toBeInTheDocument();
      expect(screen.getByText('Lácteos')).toBeInTheDocument();
      expect(screen.getByText('1200')).toBeInTheDocument();
    });

    it('abre el formulario con datos precargados al hacer click en editar', async () => {
      renderWithProviders(<LoteTable />);
      const editButton = await screen.findByRole('button', { name: /edit/i });
      await act(async () => {
        fireEvent.click(editButton);
      });

      expect(screen.getByDisplayValue('Leche sin lactosa')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Lácteos')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1200')).toBeInTheDocument();
    });
  });

  describe('Validaciones de edición', () => {
    it('no permite precio de rescate mayor al original', async () => {
      renderWithProviders(<LoteTable />);
      const editButton = await screen.findByRole('button', { name: /edit/i });
      
      await act(async () => {
        fireEvent.click(editButton);
      });

      const precioInput = screen.getByLabelText(/precio rescate/i);
      await act(async () => {
        fireEvent.change(precioInput, { target: { value: '7000' } });
      });

      const submitButton = screen.getByRole('button', { name: /guardar/i });
      await act(async () => {
        fireEvent.click(submitButton);
      });

      const errorMessages = screen.queryAllByText(/El precio de rescate debe ser menor al precio original/i);
      expect(errorMessages.length).toBeGreaterThan(0);
      expect(updateMock).not.toHaveBeenCalled();
    });

    it('verifica la persistencia de múltiples campos actualizados', async () => {

      const updatedLote = {
        ...LoteTest,
        precioRescate: 1300,
        descripcion: 'Nueva descripción'
      };
      
      const updateMock = vi.spyOn(FullLotesAPI, 'update')
        .mockResolvedValue(updatedLote);

      renderWithProviders(<LoteTable />);
      await screen.findByText('Leche sin lactosa');
      const editButton = await screen.findByRole('button', { name: /edit/i });

      await act(async () => {
        fireEvent.click(editButton);
      });

      const precioInput = screen.getByLabelText(/Precio Rescate/i);
      const descripcionInput = screen.getByLabelText(/Descripción/i);

      await act(async () => {
        fireEvent.change(precioInput, { target: { value: 1300} });
        fireEvent.change(descripcionInput, { target: { value: 'Nueva descripción' } });
      });

      const submitButton = screen.getByRole('button', { name: /guardar/i });
      await act(async () => {
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(FullLotesAPI.update).toHaveBeenCalledWith(
          'test123',
          expect.objectContaining({ 
            precioRescate: 1300,
            descripcion: 'Nueva descripción'
          })
        );
      });

      // Verificar que los cambios se reflejan en la UI
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });// Aumentar el timeout si es necesario
    });
    
    it('no permite fecha de vencimiento anterior a la actual', async () => {
    renderWithProviders(<LoteTable />);
    const editButton = await screen.findByRole('button', { name: /edit/i });
    
    await act(async () => {
      fireEvent.click(editButton);
    });

    const fechaInput = screen.getByLabelText(/Fecha de Vencimiento/i);
    const fechaPasada = '2023-01-01';
    
    await act(async () => {
      fireEvent.change(fechaInput, { target: { value: fechaPasada } });
    });

    const submitButton = screen.getByRole('button', { name: /guardar/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    const errorMessages = screen.queryAllByText(/La fecha de vencimiento debe ser posterior a hoy/i);
    expect(errorMessages.length).toBeGreaterThan(0);
    expect(updateMock).not.toHaveBeenCalled();
  });
  });

  describe('Operaciones de actualización', () => {
    it('permite editar el precio de rescate y llama al endpoint de update', async () => {
      const updateMock = vi.spyOn(FullLotesAPI, 'update')
        .mockResolvedValue({
          ...LoteTest,
          precioRescate: 1300
        });

      renderWithProviders(<LoteTable />);
      await screen.findByText('Leche sin lactosa');
      const editButton = await screen.getByRole('button', { name: /edit/i });

      await act(async () => {
        fireEvent.click(editButton);
      });

      const precioInput = screen.getByLabelText(/precio rescate/i);
      await act(async () => {
        fireEvent.change(precioInput, { target: { value: 1300 } });
      });

      const submitButton = screen.getByRole('button', { name: /guardar/i });
      await act(async () => {
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(updateMock).toHaveBeenCalledWith(
          'test123',
          expect.objectContaining({ precioRescate: 1300 })
        );
      });
    });

    it('cierra el formulario al guardar', async () => {
      renderWithProviders(<LoteTable />);
      const editButton = await screen.findByRole('button', { name: /edit/i });

      await act(async () => {
        fireEvent.click(editButton);
      });

      const submitButton = screen.getByRole('button', { name: /guardar/i });
      await act(async () => {
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.queryByLabelText(/precio rescate/i)).not.toBeInTheDocument();
      });
    });
  });
});