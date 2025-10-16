import { render, screen } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Mocked, vi } from 'vitest';
import DetailPage from './DetailPage';

vi.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;

const mockProduct = {
  _id: '123',
  nombre: 'Manzanas de Prueba',
  descripcion: 'Frescas y jugosas.',
  fotos: ['test-image.jpg'],
  categoria: 'Frutas',
  cantidad: 10,
  unidad: 'kg',
  precioOriginal: 2000,
  precioRescate: 1000,
  fechaVencimiento: '2025-12-31T00:00:00.000Z',
  ventanaRetiro: '09:00 - 12:00',
  ubicacion: 'Tienda Central',
  createdAt: '2025-10-15T17:28:20.503Z',
  updatedAt: '2025-10-15T17:28:20.503Z',
};

describe('DetailPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('debería mostrar los detalles del producto después de una carga exitosa', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockProduct });

    render(
      <MemoryRouter initialEntries={['/lotes/123']}>
        <Routes>
          <Route path="/lotes/:id" element={<DetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByText('Manzanas de Prueba')).toBeInTheDocument();

    const stockInfo = screen.getByTestId('stock-info');
    expect(stockInfo).toHaveTextContent('Stock: 10 kg');
    // -------------------------

    expect(screen.getByText('Frescas y jugosas.')).toBeInTheDocument();
    expect(screen.getByText('$1.000')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  // --- TEST 2: Escenario de carga ---
  it('debería mostrar un indicador de carga inicialmente', () => {
    mockedAxios.get.mockResolvedValue({ data: mockProduct });

    render(
      <MemoryRouter initialEntries={['/lotes/123']}>
        <Routes>
          <Route path="/lotes/:id" element={<DetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('debería mostrar un mensaje de error si la llamada a la API falla', async () => {
    const errorMessage = 'Network Error';
    mockedAxios.get.mockRejectedValue(new Error(errorMessage));

    render(
      <MemoryRouter initialEntries={['/lotes/123']}>
        <Routes>
          <Route path="/lotes/:id" element={<DetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Network Error/i)).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.queryByText('Manzanas de Prueba')).not.toBeInTheDocument();
  });
});