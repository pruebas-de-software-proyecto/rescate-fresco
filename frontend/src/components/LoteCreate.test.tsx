import { render, screen, waitFor, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {beforeEach, describe, expect, it, vi, beforeAll} from 'vitest';
import LoteCreateDialog from './LoteCreateDialog';
import tiendasAPI from '../api/user';
import FullLotesAPI from '../services/types';


beforeAll(() => {
  window.scrollTo = vi.fn();
  window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

// Mock de AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'tienda123', nombreTienda: 'Test User' }, // Usuario simulado
    isAuthenticated: true
  })
}));

vi.mock('../services/types', () => ({
  default: {
    create: vi.fn().mockResolvedValue({ data: {} }), 
    getAll: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }
}));


// Mock del FullLotesAPI
// vi.mock('../services/types', () => ({
//   default: {
//     create: vi.fn().mockResolvedValue({
//       data: {
//         _id: 'test123',
//         nombre: 'Peras verdes',
//         categoria: 'Frutas',
//         descripcion: 'Peras frescas',
//         cantidad: 10,
//         unidad: 'kg',
//         precioOriginal: 4000,
//         precioRescate: 1500,
//         fechaVencimiento: '2025-12-01',
//         ventanaRetiro: '10:00 - 13:00',
//         ubicacion: 'Mercado Central',
//         proveedor: 'Frutera Don Pepe',
//         estado: 'Disponible',
//         fotos: [],
//       },
//     }),
//     getAll: vi.fn(),
//     getById: vi.fn(),
//     update: vi.fn(),
//     delete: vi.fn(),
//   }
// }));

// Importar después del mock para obtener la versión mockeada
const mockCreate = vi.mocked(FullLotesAPI.create);

const renderDialog = () =>
  render(
    <LoteCreateDialog
      open={true}
      onClose={vi.fn()}
      onSuccess={vi.fn()}
    />
  );

describe('Feature Create - LoteCreateDialog', () => {
  const user = userEvent.setup();

  vi.setConfig({ testTimeout: 15000 });

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(tiendasAPI, 'getMiTienda').mockResolvedValue({
      id: 'tienda123',
      nombreTienda: 'Frutera Don Pepe',
      email: 'test@tienda.com'
    });
  });

  const waitForStoreLoad = async () => {
    // Esperar a que aparezca la tienda en el campo disabled
    await screen.findByDisplayValue('Frutera Don Pepe', {}, { timeout: 5000 });
  };

  const selectOptionFast = async (labelText: RegExp | string, optionText: string) => {
    const trigger = screen.getByLabelText(labelText);
    await user.click(trigger); 
    
    // Esperar a que el dropdown se abra y encuentre la opción
    const option = await screen.findByRole('option', { name: optionText }, { timeout: 5000 });
    await user.click(option);
    
    // Pequeño delay para asegurar que el menú se cierre
    await waitFor(() => {
      expect(screen.queryByRole('option', { name: optionText })).not.toBeInTheDocument();
    }, { timeout: 2000 });
  };


  // TEST 1: Campo vacío 
  it('muestra un error si se intenta crear con campos vacíos', async () => {
    renderDialog();
    await waitForStoreLoad();

    const submitButton = screen.getByRole('button', { name: /crear lote/i });
    await user.click(submitButton);

    expect(await screen.findByText(/es obligatorio/i)).toBeInTheDocument();
    expect(mockCreate).not.toHaveBeenCalled();
  });


  // TEST 2: Números negativos
  it('muestra un error si cantidad o precios son negativos o cero', async () => {
    renderDialog();
    await waitForStoreLoad();
    
    await user.type(screen.getByLabelText(/nombre del producto/i), 'Manzanas');
    await user.type(screen.getByLabelText(/descripción/i), 'Manzanas frescas');

    await selectOptionFast(/categoría/i, 'Frutas');
    await selectOptionFast(/unidad/i, 'kg');

    await user.clear(screen.getByLabelText(/cantidad/i));
    await user.type(screen.getByLabelText(/cantidad/i), '-5');

    await user.type(screen.getByLabelText(/precio original/i), '4000');
    await user.type(screen.getByLabelText(/precio rescate/i), '1500');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedTomorrow = tomorrow.toISOString().split('T')[0];
    
    const fechaInput = screen.getByLabelText(/fecha de vencimiento/i);
    fireEvent.change(fechaInput, { target: { value: formattedTomorrow } });

    
    await user.type(screen.getByLabelText(/ventana de retiro/i), '10:00 - 13:00');
    await user.type(screen.getByLabelText(/ubicación/i), 'Bodega Central');

    const submitButton = screen.getByRole('button', { name: /crear lote/i });
    await user.click(submitButton);

    expect(await screen.findByText(/debe ser mayor a 0/i)).toBeInTheDocument();
    expect(mockCreate).not.toHaveBeenCalled();

  });

  // TEST 3: Fecha de vencimiento anterior a hoy
  it('muestra un error si la fecha de vencimiento es anterior a hoy', async () => {
    renderDialog();
    await waitForStoreLoad();

    await user.type(screen.getByLabelText(/nombre del producto/i), 'Yogurt');
    await user.type(screen.getByLabelText(/descripción/i), 'Yogurt fresco');
    
    await selectOptionFast(/categoría/i, 'Lácteos');
    await selectOptionFast(/unidad/i, 'unidades');

    await user.type(screen.getByLabelText(/cantidad/i), '10');
    await user.type(screen.getByLabelText(/precio original/i), '5000');
    await user.type(screen.getByLabelText(/precio rescate/i), '2000');
    
    // Fecha Pasada
    const fechaInput = screen.getByLabelText(/fecha de vencimiento/i);
    fireEvent.change(fechaInput, { target: { value: '2024-10-09' } });
    
    await user.type(screen.getByLabelText(/ventana de retiro/i), '10:00 - 13:00');
    await user.type(screen.getByLabelText(/ubicación/i), 'Bodega Central');

    const submitButton = screen.getByRole('button', { name: /crear lote/i });
    await user.click(submitButton);

    expect(await screen.findByText(/La fecha de vencimiento no puede ser anterior a la fecha actual/i)).toBeInTheDocument();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  // TEST 4: Precio de rescate mayor o igual al precio original
  it('muestra un error si el precio de rescate es mayor o igual al precio original', async () => {
    renderDialog();

    await waitForStoreLoad();
    // Llenar todos los campos requeridos
    await user.type(screen.getByLabelText(/nombre del producto/i), 'Leche');
    await user.type(screen.getByLabelText(/descripción/i), 'Leche fresca de vaca');

    await selectOptionFast(/categoría/i, 'Lácteos');
    await selectOptionFast(/unidad/i, 'litros');
    

    await user.type(screen.getByLabelText(/cantidad/i), '5');
    await user.type(screen.getByLabelText(/precio original/i), '3000');
    await user.type(screen.getByLabelText(/precio rescate/i), '3000'); // Igual al precio original
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedTomorrow = tomorrow.toISOString().split('T')[0];
    
    const fechaInput = screen.getByLabelText(/fecha de vencimiento/i);
    fireEvent.change(fechaInput, { target: { value: formattedTomorrow } });
    

    await user.type( screen.getByLabelText(/ventana de retiro/i), '14:00 - 18:00');
    await user.type(screen.getByLabelText(/Ubicación/i) , 'Supermercado Centro');
    

    const submitButton = screen.getByRole('button', { name: /crear lote/i });
    await user.click(submitButton);

    // Buscar el mensaje de error
    expect(await screen.findByText(/precio de rescate debe ser menor/i)).toBeInTheDocument();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  // TEST 5: Flujo correcto - Crear lote exitosamente
  it('crea un lote exitosamente cuando todos los campos son válidos', async () => {
    renderDialog();

    await waitForStoreLoad();

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const formattedFutureDate = futureDate.toISOString().split('T')[0];

    await user.type(screen.getByLabelText(/nombre del producto/i), 'Peras verdes');
    await user.type(screen.getByLabelText(/descripción/i), 'Peras frescas de temporada');

    await selectOptionFast(/categoría/i, 'Frutas');
    await selectOptionFast(/unidad/i, 'kg');
    
    await user.type(screen.getByLabelText(/cantidad/i), '10');
    await user.type(screen.getByLabelText(/precio original/i), '4000');
    await user.type(screen.getByLabelText(/precio rescate/i), '1500');
    
    const fechaInput = screen.getByLabelText(/fecha de vencimiento/i);
    fireEvent.change(fechaInput, { target: { value: formattedFutureDate  } });
    
    await user.type(screen.getByLabelText(/ventana de retiro/i), '10:00 - 13:00');
    
    const ubicacionInput = screen.getByLabelText(/ubicación/i);
    await user.type(ubicacionInput, 'Mercado Central');

    const submitButton = screen.getByRole('button', { name: /crear lote/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    const payload = mockCreate.mock.calls[0][0];
    expect(payload.nombre).toBe('Peras verdes');
    expect(payload.cantidad).toBe(10);
    expect(payload.precioRescate).toBe(1500);
    expect(payload.fotos).toEqual([]);
    expect(payload.proveedor).toBe('Frutera Don Pepe'); 
  });
  
});
