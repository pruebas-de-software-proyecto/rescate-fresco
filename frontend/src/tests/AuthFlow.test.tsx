import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, Mocked } from 'vitest';

import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import AppLayout from '../components/AppLayout';
import LoginPage from '../pages/LoginPage/LoginPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';


const LotesPageMock = () => <div>Página de Lotes (Consumidor)</div>;
const GestionLotesMock = () => <div>Página de Gestión (Tienda)</div>;

import api from '../api/lotes';
vi.mock('../api/lotes');
const mockedApi = api as Mocked<typeof api>;


const mockTiendaUser = {
  token: 'jwt.token.tienda',
  user: { id: '1', email: 'tienda@test.com', role: 'TIENDA' }
};
const mockConsumidorUser = {
  token: 'jwt.token.consumidor',
  user: { id: '2', email: 'consumidor@test.com', role: 'CONSUMIDOR' }
};

const TestRouter = () => (
  <Routes>
    {/* Rutas públicas sin Layout */}
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/login" element={<LoginPage />} />

    {/* Rutas protegidas con Layout */}
    <Route element={<AppLayout />}>
      <Route path="/" element={<ProtectedRoute element={<LotesPageMock />} />} />
      <Route path="/gestion-lotes" element={<ProtectedRoute element={<GestionLotesMock />} />} />
    </Route>
  </Routes>
);

const renderTestApp = (initialRoute: string) => {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <TestRouter />
      </MemoryRouter>
    </AuthProvider>
  );
};


beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe('RF-02: Autenticación y Flujo de Login', () => {
  
  it('TEST-T1-03: Redirige a /login al intentar acceder a / (ruta protegida)', async () => {
    renderTestApp('/'); 
    expect(await screen.findByText('Iniciar sesión')).toBeInTheDocument();
    expect(screen.queryByText('Página de Lotes (Consumidor)')).not.toBeInTheDocument();
  });

  it('TEST-T1-02: Muestra error con credenciales inválidas', async () => {
    mockedApi.post.mockRejectedValue({ response: { data: { message: 'Credenciales inválidas' } } });
    
    renderTestApp('/login');
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'mala' } });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));

    expect(await screen.findByText(/Email o contraseña incorrectos/i)).toBeInTheDocument();
    expect(mockedApi.post).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Página de Lotes (Consumidor)')).not.toBeInTheDocument();
  });

  it('TEST-T2-01: Página de Login para Invitado es correcta (SIN NavBar)', async () => {
    renderTestApp('/login');
    
    // Espera a que la página cargue
    expect(await screen.findByText('Iniciar sesión')).toBeInTheDocument();
    
    // Verifica los elementos de la PÁGINA DE LOGIN
    // Busca el botón "Iniciar Sesión" del formulario
    expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
    // Busca el link "Regístrate" (con tilde)
    expect(screen.getByText('Regístrate')).toBeInTheDocument();
    
    // Verifica que los links de la NavBar NO están (porque AppLayout no se renderiza)
    expect(screen.queryByText('Productos')).not.toBeInTheDocument();
    expect(screen.queryByText('Gestión de Lotes')).not.toBeInTheDocument();
  });

});

describe('T2: Flujo de Roles Post-Login', () => {

  it('TEST-T2-02: Login como TIENDA muestra la NavBar correcta y redirige', async () => {
    mockedApi.post.mockResolvedValue({ data: mockTiendaUser });

    renderTestApp('/login');

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'tienda@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));

    await waitFor(() => {
      expect(screen.getByText('Página de Lotes (Consumidor)')).toBeInTheDocument();
    });
    
    expect(mockedApi.post).toHaveBeenCalledWith('/auth/login', {
      email: 'tienda@test.com',
      password: '123456'
    });

    expect(screen.getByText('Gestión de Lotes')).toBeInTheDocument();
    expect(screen.queryByText('Productos')).not.toBeInTheDocument();
    expect(screen.queryByText('Iniciar Sesión')).not.toBeInTheDocument();
  });

  it('TEST-T2-03: Login como CONSUMIDOR muestra la NavBar correcta', async () => {
    mockedApi.post.mockResolvedValue({ data: mockConsumidorUser });

    renderTestApp('/login');

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'consumidor@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));

    await waitFor(() => {
      expect(screen.getByText('Página de Lotes (Consumidor)')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.queryByText('Gestión de Lotes')).not.toBeInTheDocument();
  });
  
  it('TEST-T2-04: El botón de Cerrar Sesión funciona', async () => {
    mockedApi.post.mockResolvedValue({ data: mockTiendaUser });
    renderTestApp('/login');

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'tienda@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));
    
    expect(await screen.findByText('Gestión de Lotes')).toBeInTheDocument();

    // 1. Abrimos el menú de usuario (usando 'getByTestId' en el icono)
    fireEvent.click(screen.getByTestId('AccountCircleOutlinedIcon'));
    
    // 2. Clickeamos "Cerrar Sesión" (que aparece en el menú)
    fireEvent.click(await screen.findByText('Cerrar Sesión'));

    // 3. Verificamos que fuimos redirigidos a /login
    expect(await screen.findByText('Iniciar sesión')).toBeInTheDocument();
    
    // 4. Verificamos que la NavBar NO está
    expect(screen.queryByText('Gestión de Lotes')).not.toBeInTheDocument();
  });

});