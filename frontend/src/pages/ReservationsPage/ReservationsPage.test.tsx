import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FullLotesAPI from '../../services/types';
import ReservationsPage from './ReservationsPage';

// Mock del API
vi.mock('../../services/types', () => ({
  default: {
    getAll: vi.fn(),
    update: vi.fn(),
  },
}));

// Mock del NavBar
vi.mock('../../components/NavBar', () => ({
  default: () => <div data-testid="navbar">NavBar</div>,
}));

// Mock de window.confirm y window.alert
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: vi.fn(() => true),
});

Object.defineProperty(window, 'alert', {
  writable: true,
  value: vi.fn(),
});

const mockReservedProducts = [
  {
    _id: 'reserved-1',
    nombre: 'Manzanas Rojas Premium',
    categoria: 'Frutas' as const,
    descripcion: 'Manzanas frescas y crujientes',
    cantidad: 2,
    unidad: 'kg' as const,
    precioOriginal: 3000,
    precioRescate: 1500,
    fechaVencimiento: '2025-11-15T00:00:00.000Z',
    ventanaRetiro: '14:00 - 18:00',
    ubicacion: 'Sucursal Plaza de Armas',
    fotos: ['/images/manzanas.jpg'],
    estado: 'Reservado' as const,
    proveedor: 'FrutasMart',
    createdAt: '2025-11-10T10:00:00.000Z',
    updatedAt: '2025-11-10T12:00:00.000Z'
  },
  {
    _id: 'reserved-2',
    nombre: 'Pan Artesanal Integral',
    categoria: 'Panadería' as const,
    descripcion: 'Pan integral recién horneado',
    cantidad: 3,
    unidad: 'unidades' as const,
    precioOriginal: 2500,
    precioRescate: 1200,
    fechaVencimiento: '2025-11-12T00:00:00.000Z',
    ventanaRetiro: '08:00 - 12:00',
    ubicacion: 'Panadería Central',
    fotos: ['/images/pan-integral.jpg'],
    estado: 'Reservado' as const,
    proveedor: 'Panadería Artesanal',
    createdAt: '2025-11-10T09:30:00.000Z',
    updatedAt: '2025-11-10T11:45:00.000Z'
  }
];

const mockAllProducts = [
  ...mockReservedProducts,
  {
    _id: 'available-1',
    nombre: 'Tomates Cherry',
    categoria: 'Verduras' as const,
    descripcion: 'Tomates cherry frescos',
    cantidad: 1,
    unidad: 'kg' as const,
    precioOriginal: 2000,
    precioRescate: 1000,
    fechaVencimiento: '2025-11-13T00:00:00.000Z',
    ventanaRetiro: '16:00 - 20:00',
    ubicacion: 'Supermercado Norte',
    fotos: [],
    estado: 'Disponible' as const,
    proveedor: 'Verdulería Fresh',
    createdAt: '2025-11-10T11:00:00.000Z',
    updatedAt: '2025-11-10T11:00:00.000Z'
  }
];

describe('ReservationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (window.confirm as any).mockReturnValue(true);
    (window.alert as any).mockClear();
  });

  // 1. Estado de carga inicial
  it('muestra el estado de carga inicial', () => {
    vi.mocked(FullLotesAPI.getAll).mockImplementation(() => new Promise(() => {}));
    
    render(<ReservationsPage />);
    
    expect(screen.getByText('Cargando reservaciones...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  // 2. Carga exitosa de reservaciones
  it('carga y muestra las reservaciones correctamente', async () => {
    vi.mocked(FullLotesAPI.getAll).mockResolvedValue(mockAllProducts);
    
    render(<ReservationsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Manzanas Rojas Premium')).toBeInTheDocument();
      expect(screen.getByText('Pan Artesanal Integral')).toBeInTheDocument();
    });
    
    expect(screen.queryByText('Tomates Cherry')).not.toBeInTheDocument();
  });

  // 3. Filtrado correcto de productos reservados
  it('filtra correctamente solo productos reservados', async () => {
    vi.mocked(FullLotesAPI.getAll).mockResolvedValue(mockAllProducts);
    
    render(<ReservationsPage />);
    
    await waitFor(() => {
      const reservationCards = screen.getAllByText('Cancelar Reserva');
      expect(reservationCards).toHaveLength(2);
    });
  });

  // 4. Estado vacío - sin reservaciones
  it('muestra mensaje cuando no hay reservaciones', async () => {
    vi.mocked(FullLotesAPI.getAll).mockResolvedValue([mockAllProducts[2]]);
    
    render(<ReservationsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('No tienes reservaciones activas')).toBeInTheDocument();
    });
  });

  // 5. Lista completamente vacía
  it('muestra mensaje cuando la lista está completamente vacía', async () => {
    vi.mocked(FullLotesAPI.getAll).mockResolvedValue([]);
    
    render(<ReservationsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('No tienes reservaciones activas')).toBeInTheDocument();
    });
  });

  // 6. Error en carga de datos
  it('muestra error cuando falla la carga de datos', async () => {
    const errorMessage = 'Error de conexión';
    vi.mocked(FullLotesAPI.getAll).mockRejectedValue(new Error(errorMessage));
    
    render(<ReservationsPage />);
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByText('Reintentar')).toBeInTheDocument();
    });
  });

  // 7. Funcionalidad de reintentar
  it('permite reintentar después de un error', async () => {
    const user = userEvent.setup();
    
    vi.mocked(FullLotesAPI.getAll)
      .mockRejectedValueOnce(new Error('Error de conexión'))
      .mockResolvedValueOnce(mockAllProducts);
    
    render(<ReservationsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Error de conexión')).toBeInTheDocument();
    });
    
    await user.click(screen.getByText('Reintentar'));
    
    await waitFor(() => {
      expect(screen.getByText('Manzanas Rojas Premium')).toBeInTheDocument();
    });
  });

  // 8. Cancelación exitosa de reserva
  it('permite cancelar una reserva exitosamente', async () => {
    const user = userEvent.setup();
    vi.mocked(FullLotesAPI.getAll).mockResolvedValue(mockAllProducts);
    vi.mocked(FullLotesAPI.update).mockResolvedValue({
      ...mockReservedProducts[0],
      estado: 'Disponible'
    });
    
    render(<ReservationsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Manzanas Rojas Premium')).toBeInTheDocument();
    });
    
    const cancelButtons = screen.getAllByText('Cancelar Reserva');
    await user.click(cancelButtons[0]);
    
    await waitFor(() => {
      expect(FullLotesAPI.update).toHaveBeenCalledWith('reserved-1', { estado: 'Disponible' });
    });
    
    expect(window.alert).toHaveBeenCalledWith('La reserva de "Manzanas Rojas Premium" ha sido cancelada exitosamente.');
  });

  // 9. Estado de carga durante cancelación
  it('muestra estado de carga durante la cancelación', async () => {
    const user = userEvent.setup();
    vi.mocked(FullLotesAPI.getAll).mockResolvedValue(mockAllProducts);
    
    let resolveUpdate: (value: any) => void;
    vi.mocked(FullLotesAPI.update).mockImplementation(() => 
      new Promise(resolve => { resolveUpdate = resolve; })
    );
    
    render(<ReservationsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Manzanas Rojas Premium')).toBeInTheDocument();
    });
    
    const cancelButtons = screen.getAllByText('Cancelar Reserva');
    await user.click(cancelButtons[0]);
    
    expect(screen.getByText('Cancelando...')).toBeInTheDocument();
    
    resolveUpdate!({ ...mockReservedProducts[0], estado: 'Disponible' });
    
    await waitFor(() => {
      expect(screen.queryByText('Cancelando...')).not.toBeInTheDocument();
    });
  });

  // 10. Usuario no confirma cancelación
  it('no cancela la reserva si el usuario no confirma', async () => {
    const user = userEvent.setup();
    (window.confirm as any).mockReturnValue(false);
    vi.mocked(FullLotesAPI.getAll).mockResolvedValue(mockAllProducts);
    
    render(<ReservationsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Manzanas Rojas Premium')).toBeInTheDocument();
    });
    
    const cancelButtons = screen.getAllByText('Cancelar Reserva');
    await user.click(cancelButtons[0]);
    
    expect(FullLotesAPI.update).not.toHaveBeenCalled();
    expect(screen.getByText('Manzanas Rojas Premium')).toBeInTheDocument();
  });

  // 11. Error durante cancelación
  it('maneja errores durante la cancelación', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Error del servidor';
    vi.mocked(FullLotesAPI.getAll).mockResolvedValue(mockAllProducts);
    vi.mocked(FullLotesAPI.update).mockRejectedValue(new Error(errorMessage));
    
    render(<ReservationsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Manzanas Rojas Premium')).toBeInTheDocument();
    });
    
    const cancelButtons = screen.getAllByText('Cancelar Reserva');
    await user.click(cancelButtons[0]);
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(`Error al cancelar la reserva: ${errorMessage}`);
    });
  });

  // 12. Mensaje de confirmación personalizado
  it('muestra mensaje de confirmación con el nombre del producto', async () => {
    const user = userEvent.setup();
    vi.mocked(FullLotesAPI.getAll).mockResolvedValue(mockAllProducts);
    
    render(<ReservationsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Manzanas Rojas Premium')).toBeInTheDocument();
    });
    
    const cancelButtons = screen.getAllByText('Cancelar Reserva');
    await user.click(cancelButtons[0]);
    
    expect(window.confirm).toHaveBeenCalledWith(
      '¿Estás seguro de que quieres cancelar la reserva de "Manzanas Rojas Premium"?'
    );
  });

  // 13. Formato de fechas
  it('formatea correctamente las fechas', async () => {
    vi.mocked(FullLotesAPI.getAll).mockResolvedValue(mockAllProducts);
    
    render(<ReservationsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Manzanas Rojas Premium')).toBeInTheDocument();
    });
    
    // Verificar que las fechas se muestran correctamente (hay múltiples productos)
    const vencimientoElements = screen.getAllByText(/Vencimiento:/);
    const noviembreElements = screen.getAllByText(/noviembre/);
    
    expect(vencimientoElements.length).toBeGreaterThan(0);
    expect(noviembreElements.length).toBeGreaterThan(0);
  });

  // 14. Formato de precios
  it('formatea correctamente los precios', async () => {
    vi.mocked(FullLotesAPI.getAll).mockResolvedValue(mockAllProducts);
    
    render(<ReservationsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('$1.500')).toBeInTheDocument();
      expect(screen.getByText('$1.200')).toBeInTheDocument();
    });
  });

  // 15. Información del producto
  it('muestra correctamente la información del producto', async () => {
    vi.mocked(FullLotesAPI.getAll).mockResolvedValue(mockAllProducts);
    
    render(<ReservationsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('14:00 - 18:00')).toBeInTheDocument();
      expect(screen.getByText('Sucursal Plaza de Armas')).toBeInTheDocument();
      expect(screen.getByText('FrutasMart')).toBeInTheDocument();
    });
  });

  // 16. Productos sin fotos
  it('maneja productos sin fotos usando imagen por defecto', async () => {
    const productsWithoutPhotos = [{
      ...mockReservedProducts[0],
      fotos: []
    }];
    
    vi.mocked(FullLotesAPI.getAll).mockResolvedValue(productsWithoutPhotos);
    
    render(<ReservationsPage />);
    
    await waitFor(() => {
      const images = screen.getAllByRole('img');
      const productImage = images.find(img => 
        img.getAttribute('src')?.includes('bupasalud.com')
      );
      expect(productImage).toBeInTheDocument();
    });
  });

  // 17. Renderizado del navbar
  it('renderiza el navbar', () => {
    vi.mocked(FullLotesAPI.getAll).mockResolvedValue([]);
    
    render(<ReservationsPage />);
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  // 18. Título y descripción
  it('muestra el título y descripción correctos', async () => {
    vi.mocked(FullLotesAPI.getAll).mockResolvedValue([]);
    
    render(<ReservationsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Mis Reservaciones')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Aquí puedes ver todos tus productos reservados y gestionar tus reservas.')).toBeInTheDocument();
  });

  // 19. Badges de reservado
  it('muestra badges de "Reservado" en cada producto', async () => {
    vi.mocked(FullLotesAPI.getAll).mockResolvedValue(mockAllProducts);
    
    render(<ReservationsPage />);
    
    await waitFor(() => {
      const badges = screen.getAllByText('Reservado');
      expect(badges).toHaveLength(2);
    });
  });

  // 20. Error sin mensaje específico
  it('muestra mensaje por defecto cuando el error no tiene mensaje', async () => {
    vi.mocked(FullLotesAPI.getAll).mockRejectedValue({});
    
    render(<ReservationsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('No se pudieron cargar las reservaciones.')).toBeInTheDocument();
    });
  });
});
