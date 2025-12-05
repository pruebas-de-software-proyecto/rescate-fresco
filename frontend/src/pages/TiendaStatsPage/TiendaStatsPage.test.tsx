import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { TiendaStatsPage } from './TiendaStatsPage';
import * as api from '../../services/api';

// Crear un contexto mock que reemplaza el useAuth
interface MockAuthContextType {
  user: any;
  isAuthenticated: boolean;
  login?: (token: string, user: any) => void;
  logout?: () => void;
}


// Mock del servicio de API
vi.mock('../../services/api', () => ({
  tiendaAPI: {
    getMetricas: vi.fn(),
  },
  Metricas: {},
}));

// Mock del hook useAuth desde AuthContext
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '123',
      email: 'tienda@test.com',
      nombreTienda: 'Mi Tienda Test',
    },
    isAuthenticated: true,
  }),
}));

// Mock de MUI components para evitar problemas con Recharts
vi.mock('recharts', () => ({
  ComposedChart: ({ children }: any) => <div data-testid="composed-chart">{children}</div>,
  Bar: ({ dataKey }: any) => <div data-testid={`bar-${dataKey}`} />,
  Line: ({ dataKey }: any) => <div data-testid={`line-${dataKey}`} />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ dataKey }: any) => <div data-testid={`pie-${dataKey}`} />,
  Cell: ({ fill }: any) => <div data-testid={`cell-${fill}`} />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
}));

const mockMetricas: api.Metricas = {
  ingresos: 45000,
  kgRescatados: 250,
  tasaRetiro: 85,
  mermaEvitada: 12000,
  totalLotes: 4,
  tiempoPromedio: 4.5,
  evolucionSemanal: [
    { dia: 'Lun', ingresos: 5000, kg: 30 },
    { dia: 'Mar', ingresos: 8000, kg: 50 },
    { dia: 'Mié', ingresos: 6000, kg: 40 },
    { dia: 'Jue', ingresos: 10000, kg: 60 },
    { dia: 'Vie', ingresos: 12000, kg: 50 },
    { dia: 'Sab', ingresos: 4000, kg: 20 },
  ],
  categoriasTop: [
    { categoria: 'Lechuga', cantidad: 80 },
    { categoria: 'Tomate', cantidad: 70 },
    { categoria: 'Cebolla', cantidad: 60 },
    { categoria: 'Zanahoria', cantidad: 40 },
  ],
  estadoLotes: {
    vendidos: 3,
    vencidos: 1,
    disponibles: 0,
  },
};

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <TiendaStatsPage />
    </BrowserRouter>
  );
};

describe('TiendaStatsPage - RF-06: Panel de Métricas de la Tienda', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock useAuth para que siempre retorne un usuario autenticado
    vi.mocked(api.tiendaAPI.getMetricas).mockClear();
  });

  // Test 1: La tienda debe visualizar sus ingresos por rescate
  it('Debe mostrar los ingresos totales de la tienda', async () => {
    vi.mocked(api.tiendaAPI.getMetricas).mockResolvedValueOnce(mockMetricas);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Ingresos')).toBeInTheDocument();
      expect(screen.getByText('$45K')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  // Test 2: La tienda debe visualizar kg rescatados
  it('Debe mostrar los kilogramos rescatados en total', async () => {
    vi.mocked(api.tiendaAPI.getMetricas).mockResolvedValueOnce(mockMetricas);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Kg Rescatados')).toBeInTheDocument();
      expect(screen.getByText('250 kg')).toBeInTheDocument();
      expect(screen.getByText('De 4 lotes')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  // Test 3: La tienda debe visualizar merma evitada
  it('Debe mostrar el valor de merma evitada', async () => {
    vi.mocked(api.tiendaAPI.getMetricas).mockResolvedValueOnce(mockMetricas);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Merma Evitada')).toBeInTheDocument();
      expect(screen.getByText('$12K')).toBeInTheDocument();
      expect(screen.getByText('Valor rescatado')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  // Test 4: La tienda debe visualizar categorías más exitosas
  it('Debe mostrar las categorías de productos más exitosas', async () => {
    vi.mocked(api.tiendaAPI.getMetricas).mockResolvedValueOnce(mockMetricas);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  // Test 5: La tienda debe visualizar evolución de métricas en el tiempo
  it('Debe mostrar la evolución semanal de ingresos y kg rescatados', async () => {
    vi.mocked(api.tiendaAPI.getMetricas).mockResolvedValueOnce(mockMetricas);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Evolución Semanal')).toBeInTheDocument();
      expect(screen.getByTestId('composed-chart')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  // Test 6: La tienda debe visualizar el estado de sus lotes (vendidos, vencidos, cancelados)
  it('Debe mostrar el estado desglosado de los lotes de la tienda', async () => {
    vi.mocked(api.tiendaAPI.getMetricas).mockResolvedValueOnce(mockMetricas);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Estado de Lotes')).toBeInTheDocument();
      expect(screen.getByText('Vendidos')).toBeInTheDocument();
      expect(screen.getByText('Vencidos')).toBeInTheDocument();
      expect(screen.getByText('Disponibles')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  // Tests de comportamiento
  it('Debe mostrar spinner de carga mientras se obtienen métricas', () => {
    vi.mocked(api.tiendaAPI.getMetricas).mockImplementationOnce(
      () => new Promise(() => {}) // Never resolves
    );

    renderComponent();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('Debe mostrar mensaje de error cuando falla la carga de métricas', async () => {
    vi.mocked(api.tiendaAPI.getMetricas).mockRejectedValueOnce(new Error('Error de API'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Error al cargar las métricas/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('Debe mostrar el título y descripción de la página', async () => {
    vi.mocked(api.tiendaAPI.getMetricas).mockResolvedValueOnce(mockMetricas);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Métricas de Mi Tienda')).toBeInTheDocument();
      expect(screen.getByText('Resumen del rendimiento de tu tienda en Rescate Fresco.')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('Debe mostrar la tasa de retiro como KPI', async () => {
    vi.mocked(api.tiendaAPI.getMetricas).mockResolvedValueOnce(mockMetricas);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Tasa de Retiro')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('Debe mostrar tiempo promedio de venta de lotes', async () => {
    vi.mocked(api.tiendaAPI.getMetricas).mockResolvedValueOnce(mockMetricas);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Tiempo Promedio de Venta por lote')).toBeInTheDocument();
      expect(screen.getByText('4.5h desde publicación')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
