import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FilterControls, FilterControlsProps } from './FilterControls';

const defaultProps: FilterControlsProps = {
  categoryFilter: 'Todos',
  setCategoryFilter: vi.fn(),
  expiryDateFilter: '',
  setExpiryDateFilter: vi.fn(),
  searchFilter: '',
  setSearchFilter: vi.fn(),
};

const renderFilterControls = (props: Partial<FilterControlsProps> = {}) => {
  return render(<FilterControls {...defaultProps} {...props} />);
};

describe('FilterControls', () => {
  const user = userEvent.setup();

  // TEST 1: Renderizado inicial
  it('debería renderizar todos los elementos de filtro correctamente', () => {
    renderFilterControls();

    expect(screen.getByLabelText(/buscar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/categoría/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/vence luego de/i)).toBeInTheDocument();
    
    // El botón reset no debería aparecer inicialmente
    expect(screen.queryByText('Resetear')).not.toBeInTheDocument();
  });

  // TEST 2: Búsqueda por texto
  it('debería llamar setSearchFilter cuando se escribe en el campo de búsqueda', async () => {
    const setSearchFilter = vi.fn();
    const setCategoryFilter = vi.fn();
    const setExpiryDateFilter = vi.fn();

    render(
      <FilterControls 
        searchFilter=""
        categoryFilter=""
        expiryDateFilter=""
        setSearchFilter={setSearchFilter}
        setCategoryFilter={setCategoryFilter}
        setExpiryDateFilter={setExpiryDateFilter}
      />
    );

    const searchInput = screen.getByLabelText(/buscar/i);
    await user.type(searchInput, 'manzanas');

    // Verificar que la función fue llamada múltiples veces (una por cada carácter)
    expect(setSearchFilter).toHaveBeenCalledTimes(8);
    // Verificar que cada carácter fue enviado individualmente como es normal en userEvent.type
    expect(setSearchFilter).toHaveBeenNthCalledWith(1, 'm');
    expect(setSearchFilter).toHaveBeenNthCalledWith(2, 'a');
    expect(setSearchFilter).toHaveBeenNthCalledWith(3, 'n');
  });

  // TEST 3: Filtro de categoría
  it('debería llamar setCategoryFilter cuando se selecciona una categoría', async () => {
    const setCategoryFilter = vi.fn();
    renderFilterControls({ setCategoryFilter });

    const categorySelect = screen.getByLabelText(/categoría/i);
    await user.click(categorySelect);
    
    const frutasOption = screen.getByRole('option', { name: 'Frutas' });
    await user.click(frutasOption);

    expect(setCategoryFilter).toHaveBeenCalledWith('Frutas');
  });

  // TEST 4: Filtro de fecha de vencimiento
  it('debería llamar setExpiryDateFilter cuando se selecciona una fecha', async () => {
    const setExpiryDateFilter = vi.fn();
    renderFilterControls({ setExpiryDateFilter });

    const dateInput = screen.getByLabelText(/vence luego de/i);
    await user.type(dateInput, '2025-12-31');

    expect(setExpiryDateFilter).toHaveBeenCalledWith('2025-12-31');
  });

  // TEST 5: Mostrar botón reset cuando hay filtros activos
  it('debería mostrar el botón resetear cuando hay filtros activos', () => {
    renderFilterControls({ 
      categoryFilter: 'Frutas' 
    });

    expect(screen.getByText('Resetear')).toBeInTheDocument();
  });

  // TEST 6: Mostrar botón reset con filtro de búsqueda
  it('debería mostrar el botón resetear cuando hay texto de búsqueda', () => {
    renderFilterControls({ 
      searchFilter: 'manzanas' 
    });

    expect(screen.getByText('Resetear')).toBeInTheDocument();
  });

  // TEST 7: Mostrar botón reset con filtro de fecha
  it('debería mostrar el botón resetear cuando hay filtro de fecha', () => {
    renderFilterControls({ 
      expiryDateFilter: '2025-12-31' 
    });

    expect(screen.getByText('Resetear')).toBeInTheDocument();
  });

  // TEST 8: Funcionalidad del botón reset
  it('debería resetear todos los filtros cuando se hace click en resetear', async () => {
    const setCategoryFilter = vi.fn();
    const setExpiryDateFilter = vi.fn();
    const setSearchFilter = vi.fn();

    renderFilterControls({ 
      categoryFilter: 'Frutas',
      searchFilter: 'manzanas',
      expiryDateFilter: '2025-12-31',
      setCategoryFilter,
      setExpiryDateFilter,
      setSearchFilter
    });

    const resetButton = screen.getByText('Resetear');
    await user.click(resetButton);

    expect(setCategoryFilter).toHaveBeenCalledWith('Todos');
    expect(setExpiryDateFilter).toHaveBeenCalledWith('');
    expect(setSearchFilter).toHaveBeenCalledWith('');
  });

  // TEST 9: Todas las opciones de categoría disponibles
  it('debería mostrar todas las categorías disponibles en el select', async () => {
    renderFilterControls();

    const categorySelect = screen.getByLabelText(/categoría/i);
    await user.click(categorySelect);

    const expectedCategories = ['Todos', 'Frutas', 'Verduras', 'Lácteos', 'Panadería', 'Carnes'];
    
    expectedCategories.forEach(category => {
      expect(screen.getByRole('option', { name: category })).toBeInTheDocument();
    });
  });

  // TEST 10: Estado inicial sin filtros activos
  it('no debería mostrar el botón resetear en estado inicial', () => {
    renderFilterControls();

    expect(screen.queryByText('Resetear')).not.toBeInTheDocument();
  });

  // TEST 11: Iconos presentes
  it('debería mostrar los iconos correspondientes', () => {
    renderFilterControls();

    // Verificar que el icono de búsqueda esté presente
    expect(screen.getByTestId('SearchIcon')).toBeInTheDocument();
  });

  // TEST 12: Múltiples cambios de filtros
  it('debería manejar múltiples cambios de filtros correctamente', async () => {
    const setCategoryFilter = vi.fn();
    const setSearchFilter = vi.fn();
    
    renderFilterControls({ 
      setCategoryFilter,
      setSearchFilter 
    });

    // Cambiar búsqueda
    const searchInput = screen.getByLabelText(/buscar/i);
    await user.type(searchInput, 'test');
    
    // Cambiar categoría
    const categorySelect = screen.getByLabelText(/categoría/i);
    await user.click(categorySelect);
    await user.click(screen.getByRole('option', { name: 'Verduras' }));

    // Verificar que setSearchFilter fue llamado 4 veces (una por cada letra de 'test')
    expect(setSearchFilter).toHaveBeenCalledTimes(4);
    // Verificar que cada carácter fue enviado individualmente
    expect(setSearchFilter).toHaveBeenNthCalledWith(1, 't');
    expect(setSearchFilter).toHaveBeenNthCalledWith(2, 'e');
    expect(setCategoryFilter).toHaveBeenCalledWith('Verduras');
  });
});