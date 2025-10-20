import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FullLotesAPI from '../services/types';
import LoteCreateDialog from './LoteCreateDialog';

const createMock = vi.spyOn(FullLotesAPI, 'create').mockResolvedValue({
  data: {
    _id: 'test123',
    nombre: 'Peras verdes',
    categoria: 'Frutas',
    descripcion: 'Peras frescas',
    cantidad: 10,
    unidad: 'kg',
    precioOriginal: 4000,
    precioRescate: 1500,
    fechaVencimiento: '2025-12-01',
    ventanaRetiro: '10:00 - 13:00',
    ubicacion: 'Mercado Central',
    proveedor: 'Frutera Don Pepe',
    estado: 'Disponible',
    fotos: [],
  },
});

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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TEST 1: Campo vacío (nombre)
  it('muestra un error si se intenta crear con campos vacíos', async () => {
    renderDialog();

    const submitButton = screen.getByRole('button', { name: /crear lote/i });
    await user.click(submitButton);

    expect(await screen.findByText(/no puede estar vacío/i))
      .toBeInTheDocument();

    expect(createMock).not.toHaveBeenCalled();
  });

  // TEST 2: Números negativos
  it('muestra un error si cantidad o precios son negativos o cero', async () => {
    renderDialog();

    await user.type(screen.getByLabelText(/nombre del producto/i), 'Manzanas');
    await user.type(screen.getByLabelText(/descripción/i), 'Manzanas frescas');
    
    await user.clear(screen.getByLabelText(/cantidad/i));
    await user.type(screen.getByLabelText(/cantidad/i), '-5');
    await user.clear(screen.getByLabelText(/precio original/i));
    await user.type(screen.getByLabelText(/precio original/i), '4000');
    await user.clear(screen.getByLabelText(/precio rescate/i));
    await user.type(screen.getByLabelText(/precio rescate/i), '1500');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedTomorrow = tomorrow.toISOString().split('T')[0];
    
    const fechaInput = screen.getByLabelText(/fecha de vencimiento/i);
    await user.clear(fechaInput);
    await user.type(fechaInput, formattedTomorrow);
    
    await user.type(screen.getByLabelText(/ventana de retiro/i), '10:00 - 13:00');
    await user.type(screen.getByLabelText(/Ubicación de retiro/i), 'Bodega Central');
    await user.type(screen.getByLabelText(/proveedor/i), 'Coop Frutera');

    const submitButton = screen.getByRole('button', { name: /crear lote/i });
    await user.click(submitButton);

    expect(await screen.findByText(/debe ser un número mayor a 0/i))
      .toBeInTheDocument();

    expect(createMock).not.toHaveBeenCalled();
  });

  // TEST 3: Fecha de vencimiento anterior a hoy
  it('muestra un error si la fecha de vencimiento es anterior a hoy', async () => {
    renderDialog();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedYesterday = yesterday.toISOString().split('T')[0];

    await user.type(screen.getByLabelText(/nombre del producto/i), 'Yogurt Natural');
    await user.type(screen.getByLabelText(/descripción/i), 'Yogurt fresco');
    
    const categoriaSelect = screen.getByLabelText(/categoría/i);
    await user.click(categoriaSelect);
    await user.click(screen.getByRole('option', { name: 'Lácteos' }));
    
    await user.clear(screen.getByLabelText(/cantidad/i));
    await user.type(screen.getByLabelText(/cantidad/i), '10');
    await user.clear(screen.getByLabelText(/precio original/i));
    await user.type(screen.getByLabelText(/precio original/i), '5000');
    await user.clear(screen.getByLabelText(/precio rescate/i));
    await user.type(screen.getByLabelText(/precio rescate/i), '2000');
    
    const fechaInput = screen.getByLabelText(/fecha de vencimiento/i);
    await user.clear(fechaInput);
    await user.type(fechaInput, formattedYesterday);
    
    await user.type(screen.getByLabelText(/ventana de retiro/i), '10:00 - 13:00');
    await user.type(screen.getByLabelText(/Ubicación de retiro/i), 'Bodega Central');
    await user.type(screen.getByLabelText(/proveedor/i), 'Colun');

    const submitButton = screen.getByRole('button', { name: /crear lote/i });
    await user.click(submitButton);

    expect(await screen.findByText(/la fecha de vencimiento no puede ser anterior a la fecha actual/i))
      .toBeInTheDocument();

    expect(createMock).not.toHaveBeenCalled();
  });

  // TEST 4: Flujo correcto - Crear lote exitosamente
  it('crea un lote exitosamente cuando todos los campos son válidos', async () => {
    renderDialog();

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const formattedFutureDate = futureDate.toISOString().split('T')[0];

    await user.type(screen.getByLabelText(/nombre del producto/i), 'Peras verdes');
    await user.type(screen.getByLabelText(/descripción/i), 'Peras frescas de temporada');
    
    await user.clear(screen.getByLabelText(/cantidad/i));
    await user.type(screen.getByLabelText(/cantidad/i), '10');
    await user.clear(screen.getByLabelText(/precio original/i));
    await user.type(screen.getByLabelText(/precio original/i), '4000');
    await user.clear(screen.getByLabelText(/precio rescate/i));
    await user.type(screen.getByLabelText(/precio rescate/i), '1500');
    
    const fechaInput = screen.getByLabelText(/fecha de vencimiento/i);
    await user.clear(fechaInput);
    await user.type(fechaInput, formattedFutureDate);
    
    await user.type(screen.getByLabelText(/ventana de retiro/i), '10:00 - 13:00');
    await user.type(screen.getByLabelText(/Ubicación de retiro/i), 'Mercado Central');
    await user.type(screen.getByLabelText(/proveedor/i), 'Frutera Don Pepe');

    const submitButton = screen.getByRole('button', { name: /crear lote/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(createMock).toHaveBeenCalledTimes(1);
    }, { timeout: 10000 });

    const payload = createMock.mock.calls[0][0];
    expect(payload.nombre).toBe('Peras verdes');
    expect(payload.cantidad).toBe(10);
    expect(payload.precioRescate).toBe(1500);
    expect(payload.fotos).toEqual([]);
  }, 10000);
});
