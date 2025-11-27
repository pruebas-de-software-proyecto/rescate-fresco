import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import DetailPage from './DetailPage';

// Mock global para todos los íconos de Material-UI
vi.mock('@mui/icons-material', () => ({
  __esModule: true,
  default: () => 'Icon',
  AddShoppingCart: () => 'AddShoppingCart',
  ArrowBack: () => 'ArrowBack', 
  ArrowForward: () => 'ArrowForward'
}));

// Mock del contexto de autenticación con función estable
const mockLogout = vi.fn();
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    logout: mockLogout,
    token: 'mock-token',
    user: { name: 'Test User' }
  }))
}));

// Mock de la API
vi.mock("../../api/lotes", () => ({
  getLoteById: vi.fn(),
  fetchLotes: vi.fn(),
  reservarLote: vi.fn(),
  generarPin: vi.fn(),
  default: {}
}));

// Importar después del mock para obtener la versión mockeada
import { getLoteById } from '../../api/lotes';
const mockGetLoteById = vi.mocked(getLoteById);

const mockProduct = {
  _id: '123',
  nombre: 'Manzanas de Prueba',
  descripcion: 'Frescas y jugosas.',
  fotos: ['test-image.jpg'],
  categoria: 'Frutas' as const,
  cantidad: 10,
  unidad: 'kg' as const,
  precioOriginal: 2000,
  precioRescate: 1000,
  fechaVencimiento: '2025-12-31T00:00:00.000Z',
  ventanaRetiro: '09:00 - 12:00',
  ubicacion: 'Tienda Central',
  estado: 'Disponible' as const,
  proveedor: 'Proveedor Test',
  createdAt: '2025-10-15T17:28:20.503Z',
  updatedAt: '2025-10-15T17:28:20.503Z',
};

describe('DetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TEST 1: Producto no encontrado
  it('debería mostrar mensaje de producto no encontrado cuando la API devuelve null', async () => {
    mockGetLoteById.mockRejectedValue(new Error('Not found'));

    render(
      <MemoryRouter initialEntries={['/lotes/123']}>
        <Routes>
          <Route path="/lotes/:id" element={<DetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Esperar a que aparezca el mensaje de error
    await waitFor(
      () => {
        expect(screen.getByText(/Not found|No se pudo cargar la información del producto/)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  // TEST 2: Imagen por defecto
  it('debería mostrar imagen por defecto cuando el producto no tiene fotos', async () => {
    const productWithoutPhotos = {
      ...mockProduct,
      fotos: [] // Sin fotos
    };
    mockGetLoteById.mockResolvedValue(productWithoutPhotos);

    render(
      <MemoryRouter initialEntries={['/lotes/123']}>
        <Routes>
          <Route path="/lotes/:id" element={<DetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Manzanas de Prueba')).toBeInTheDocument();
    
    const productImage = screen.getByAltText('Manzanas de Prueba');
    expect(productImage).toHaveAttribute('src', '/images/default-lote.png');
  });

  // TEST 3: Formateo de fecha de vencimiento
  it('debería formatear correctamente la fecha de vencimiento en español', async () => {
    mockGetLoteById.mockResolvedValue(mockProduct);

    render(
      <MemoryRouter initialEntries={['/lotes/123']}>
        <Routes>
          <Route path="/lotes/:id" element={<DetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Manzanas de Prueba')).toBeInTheDocument();
    expect(screen.getByText('30 de diciembre, 2025')).toBeInTheDocument();
  });

  // TEST 4: Datos completos mostrados
  it('debería mostrar todos los datos esenciales del producto', async () => {
    mockGetLoteById.mockResolvedValue(mockProduct);

    render(
      <MemoryRouter initialEntries={['/lotes/123']}>
        <Routes>
          <Route path="/lotes/:id" element={<DetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Esperar a que cargue
    expect(await screen.findByText('Manzanas de Prueba')).toBeInTheDocument();

    // Verificar datos esenciales
    expect(screen.getByText('Manzanas de Prueba')).toBeInTheDocument(); // Nombre
    expect(screen.getByText('$1.000')).toBeInTheDocument(); // Precio rescate
    expect(screen.getByText('Frutas')).toBeInTheDocument(); // Categoría (Chip)
    
    // Verificar cantidad - buscar el texto que contiene "Cantidad:" y "10" y "kg"
    expect(screen.getByText((content, element) => {
      return element?.textContent === 'Cantidad: 10 kg';
    })).toBeInTheDocument();
    
    expect(screen.getByText('30 de diciembre, 2025')).toBeInTheDocument(); // Vencimiento
    expect(screen.getByText('Frescas y jugosas.')).toBeInTheDocument(); // Descripción
  });
});