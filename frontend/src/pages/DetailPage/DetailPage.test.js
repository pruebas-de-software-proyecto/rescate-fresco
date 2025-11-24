import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import DetailPage from './DetailPage';
vi.mock('axios');
const mockedAxios = axios;
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
    // TEST 1: Producto no encontrado
    it('debería mostrar mensaje de producto no encontrado cuando la API devuelve null', async () => {
        mockedAxios.get.mockResolvedValue({ data: null });
        render(_jsx(MemoryRouter, { initialEntries: ['/lotes/123'], children: _jsx(Routes, { children: _jsx(Route, { path: "/lotes/:id", element: _jsx(DetailPage, {}) }) }) }));
        expect(await screen.findByText('Producto no encontrado.')).toBeInTheDocument();
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        expect(screen.queryByText('Manzanas de Prueba')).not.toBeInTheDocument();
    });
    // TEST 2: Imagen por defecto
    it('debería mostrar imagen por defecto cuando el producto no tiene fotos', async () => {
        const productWithoutPhotos = {
            ...mockProduct,
            fotos: [] // Sin fotos
        };
        mockedAxios.get.mockResolvedValue({ data: productWithoutPhotos });
        render(_jsx(MemoryRouter, { initialEntries: ['/lotes/123'], children: _jsx(Routes, { children: _jsx(Route, { path: "/lotes/:id", element: _jsx(DetailPage, {}) }) }) }));
        expect(await screen.findByText('Manzanas de Prueba')).toBeInTheDocument();
        const productImage = screen.getByAltText('Manzanas de Prueba');
        expect(productImage).toHaveAttribute('src', '/images/default-lote.png');
    });
    // TEST 3: Formateo de fecha de vencimiento
    it('debería formatear correctamente la fecha de vencimiento en español', async () => {
        mockedAxios.get.mockResolvedValue({ data: mockProduct });
        render(_jsx(MemoryRouter, { initialEntries: ['/lotes/123'], children: _jsx(Routes, { children: _jsx(Route, { path: "/lotes/:id", element: _jsx(DetailPage, {}) }) }) }));
        expect(await screen.findByText('Manzanas de Prueba')).toBeInTheDocument();
        expect(screen.getByText('30 de diciembre, 2025')).toBeInTheDocument();
    });
    // TEST 4: Datos completos mostrados
    it('debería mostrar todos los datos esenciales del producto', async () => {
        mockedAxios.get.mockResolvedValue({ data: mockProduct });
        render(_jsx(MemoryRouter, { initialEntries: ['/lotes/123'], children: _jsx(Routes, { children: _jsx(Route, { path: "/lotes/:id", element: _jsx(DetailPage, {}) }) }) }));
        // Esperar a que cargue
        expect(await screen.findByText('Manzanas de Prueba')).toBeInTheDocument();
        // Verificar datos esenciales
        expect(screen.getByText('Manzanas de Prueba')).toBeInTheDocument(); // Nombre
        expect(screen.getByText('$1.000')).toBeInTheDocument(); // Precio rescate
        expect(screen.getByText('Frutas')).toBeInTheDocument(); // Categoría (Chip)
        // Usar data-testid para stock que está fragmentado
        const stockInfo = screen.getByTestId('stock-info');
        expect(stockInfo).toHaveTextContent('Stock: 10 kg');
        expect(screen.getByText('30 de diciembre, 2025')).toBeInTheDocument(); // Vencimiento
        expect(screen.getByText('Frescas y jugosas.')).toBeInTheDocument(); // Descripción
    });
});
