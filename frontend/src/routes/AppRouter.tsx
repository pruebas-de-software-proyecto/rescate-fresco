import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DetailPage from '../pages/DetailPage/DetailPage';
import LotesGestionPage from '../pages/LotesGestionPage';
import LotesPage from '../pages/LotesPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import AppLayout from '../components/AppLayout'; // <-- 1. IMPORTA EL LAYOUT

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* --- 2. ENVUELVE TODAS LAS RUTAS CON 'AppLayout' --- */}
        <Route element={<AppLayout />}>

          {/* --- Rutas Públicas (ahora tienen NavBar) --- */}
          

          {/* --- Rutas Privadas (tienen NavBar y están protegidas) --- */}
          <Route
            path="/"
            element={<ProtectedRoute element={<LotesPage />} />}
          />
          <Route
            path="/:id"
            element={<ProtectedRoute element={<DetailPage />} />}
          />
          <Route
            path="/gestion-lotes"
            element={<ProtectedRoute element={<LotesGestionPage />} />}
          />

          {/* Aquí puedes añadir las rutas de /perfil y /contacto */}

        </Route>
      </Routes>
    </BrowserRouter>
  );
}