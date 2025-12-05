// frontend/src/components/LoteUpdate.test.tsx
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi, beforeAll} from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import FullLotesAPI, { FullLote } from '../services/types';
import LoteTable from './loteTable';
import tiendasAPI from '../api/user';


beforeAll(() => {
  window.scrollTo = vi.fn();
  window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

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

// Mock de AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'tienda123', nombreTienda: 'Colun' }, 
    isAuthenticated: true,
    logout: vi.fn()
  })
}));

// Mock de APIs
vi.mock('../services/types', () => ({
  default: {
    getAllGestion: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getAll: vi.fn(),
    create: vi.fn(),
    getById: vi.fn(),
  }
}));

// Mock de FullLotesAPI
const mockGetAllGestion = vi.mocked(FullLotesAPI.getAllGestion);
const mockUpdate = vi.mocked(FullLotesAPI.update);

describe('Feature Update Lote', () => {
  vi.setConfig({testTimeout: 15000});

  beforeEach(() => {
    vi.clearAllMocks();
    // Configurar los mocks básicos para cada test
    mockGetAllGestion.mockResolvedValue([LoteTest]);
    mockUpdate.mockResolvedValue({
      ...LoteTest,
      precioRescate: 1300,
      descripcion: 'Nueva descripción'
    });

    vi.spyOn(tiendasAPI, 'getMiTienda').mockResolvedValue({
      id: 'tienda123',
      nombreTienda: 'Colun',
      email: 'colun@test.com'
    });
  });

  const waitForTableLoad = async () => {
    await screen.findByText('Leche sin lactosa', {}, { timeout: 5000 });
  };

  const openEditModal = async () => {
    const editButton = screen.getByRole('button', { name: /editar/i });
    fireEvent.click(editButton);
    // Esperamos a que el modal abra buscando un campo del formulario
    await screen.findByLabelText(/Nombre/i); 
  };

  const fillInput = (labelRegex: RegExp | string, value: string) => {
    const input = screen.getByLabelText(labelRegex);
    fireEvent.change(input, { target: { value } });
  };

  describe('Visualización de datos', () => {
    it('carga los lotes en la tabla', async () => {
      render(<LoteTable />);
      await waitForTableLoad();

      expect(screen.getByText('Leche sin lactosa')).toBeInTheDocument();
      // La descripción no se muestra en la tabla, comprobamos la categoría en su lugar
      expect(screen.getByText(/Lácteos/)).toBeInTheDocument();
      expect(screen.getByText(/1.200/)).toBeInTheDocument();
    });

    it('abre el formulario con datos precargados al hacer click en editar', async () => {
      render(<LoteTable />);
      waitForTableLoad();

      const editButton = await screen.findByRole('button', { name: /editar/i });
      fireEvent.click(editButton);

      await screen.findByLabelText(/Nombre/i);

      expect(screen.getByDisplayValue('Leche sin lactosa')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Lácteos')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1200')).toBeInTheDocument();
    });
  });

  describe('Validaciones de edición', () => {
    it('no permite precio de rescate mayor al original', async () => {
      render(<LoteTable />);
      await waitForTableLoad();
      const editButton = await screen.findByRole('button', { name: /editar/i });
      fireEvent.click(editButton);

      fillInput(/precio rescate/i, '7000');

      const submitButton = screen.getByRole('button', { name: /guardar/i });
      fireEvent.click(submitButton);

     expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('verifica la persistencia de múltiples campos actualizados', async () => {
      render(<LoteTable />);
      await waitForTableLoad();
      
      const editButton = await screen.findByRole('button', { name: /editar/i });
      fireEvent.click(editButton);

      fillInput(/precio rescate/i, '1300');
      fillInput(/descripción/i, 'Nueva descripción');

      const submitButton = screen.getByRole('button', { name: /guardar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(FullLotesAPI.update).toHaveBeenCalledWith(
          'test123',
          expect.objectContaining({ 
            precioRescate: 1300,
            descripcion: 'Nueva descripción'
          })
        );
      });
    });

    it('no permite fecha de vencimiento anterior a la actual', async () => {
    render(<LoteTable />);
    await waitForTableLoad();

    const editButton = await screen.findByRole('button', { name: /editar/i });
    fireEvent.click(editButton);
    
    fillInput(/fecha de vencimiento/i, '2020-01-01');

    const submitButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(submitButton);

    expect(mockUpdate).not.toHaveBeenCalled();
  });
  });

  describe('Operaciones de actualización', () => {
    it('permite editar el precio de rescate y llama al endpoint de update', async () => {
      render(<LoteTable />);
      await waitForTableLoad();
      
      const editButton =  screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      fillInput(/precio rescate/i, '1300');
      const submitButton = screen.getByRole('button', { name: /guardar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith(
          'test123',
          expect.objectContaining({ precioRescate: 1300 })
        );
      });
    });

    it('cierra el formulario al guardar', async () => {
      render(<LoteTable />);
      await waitForTableLoad();
      const editButton = await screen.findByRole('button', { name: /edit/i });
      fireEvent.click(editButton);
    

      const submitButton = screen.getByRole('button', { name: /guardar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });
});