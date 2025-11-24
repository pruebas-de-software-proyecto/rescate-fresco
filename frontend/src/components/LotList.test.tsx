import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LotList from './LotList';
import { fetchLotes, Lote } from '../api/lotes';

// Mock del m贸dulo de navegaci贸n
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock de la API
vi.mock('../api/lotes', () => ({
  fetchLotes: vi.fn()
}));

// Datos de prueba
const mockLotes: Lote[] = [
  {
    _id: '1',
    nombre: 'Leche Descremada',
    descripcion: 'Leche descremada marca Colun',
    cantidad: 2,
    unidad: 'litros', // debe ser uno de los valores literales permitidos
    precioOriginal: 2000,
    precioRescate: 1200,
    fechaVencimiento: '2024-12-31',
    ventanaRetiro: '10:00 - 13:00',
    ubicacion: 'Supermercado A',
    fotos: ['http://example.com/leche.jpg'],
    categoria: 'L谩cteos',
  },
  {
    _id: '2',
    nombre: 'Pan Integral',
    descripcion: 'Pan integral reci茅n horneado',
    cantidad: 1,
    unidad: 'unidades', // debe ser uno de los valores literales permitidos
    precioOriginal: 1500,
    precioRescate: 800,
    fechaVencimiento: '2024-12-30',
    ventanaRetiro: '14:00 - 16:00',
    ubicacion: 'Panader铆a B',
    fotos: [],
    categoria: 'Panader铆a',
  }
] as const;

describe('LotList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Estados de carga', () => {
    it('muestra el indicador de carga mientras obtiene los datos', async () => {
      vi.mocked(fetchLotes).mockImplementation(() => new Promise(() => {}));
      
      render(
        <BrowserRouter>
          <LotList />
        </BrowserRouter>
      );

      expect(screen.getByText('Cargando lotes...')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('muestra mensaje cuando no hay lotes disponibles', async () => {
      vi.mocked(fetchLotes).mockResolvedValue([]);
      
      render(
        <BrowserRouter>
          <LotList />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('No hay lotes disponibles. 馃様')).toBeInTheDocument();
      });
    });
  });

  describe('Visualizaci贸n de lotes', () => {
    beforeEach(() => {
      vi.mocked(fetchLotes).mockResolvedValue(mockLotes);
    });

    it('muestra correctamente los datos de cada lote', async () => {
      render(
        <BrowserRouter>
          <LotList />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Leche Descremada')).toBeInTheDocument();
        expect(screen.getByText('Pan Integral')).toBeInTheDocument();
        expect(screen.getAllByText(/\$\d+/).length).toBe(2);
      });

      // Verificar fechas formateadas
      const fecha = new Date('2024-12-31').toLocaleDateString();
      expect(screen.getByText(`Vence: ${fecha}`)).toBeInTheDocument();
    });

    it('maneja correctamente los lotes sin im谩genes', async () => {
      render(
        <BrowserRouter>
          <LotList />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Sin imagen')).toBeInTheDocument();
      });
    });
  });

  describe('Navegaci贸n', () => {
    beforeEach(() => {
      vi.mocked(fetchLotes).mockResolvedValue(mockLotes);
    });

    it('navega a la p谩gina de detalles al hacer click en Ver Detalles', async () => {
      render(
        <BrowserRouter>
          <LotList />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByText('Ver Detalles')).toHaveLength(2);
      });

      const primerBoton = screen.getAllByText('Ver Detalles')[0];
      fireEvent.click(primerBoton);

      expect(mockNavigate).toHaveBeenCalledWith('/1');
    });
  });

 
});
