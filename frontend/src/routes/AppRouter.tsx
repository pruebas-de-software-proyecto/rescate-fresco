import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/AppLayout'; // <-- 1. IMPORTA EL LAYOUT
import DetailPage from '../pages/DetailPage/DetailPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import LotesGestionPage from '../pages/LotesGestionPage';
import LotesPage from '../pages/LotesPage';
import PagoPage from '../pages/PagoPage';
import { PinPage } from '../pages/PinPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import { ReservationPageAdmin } from '../pages/ReservationPageAdmin';
import { ReservationsPage } from '../pages/ReservationsPage';
import { TiendaStatsPage } from '../pages/TiendaStatsPage';
import { ProtectedRoute } from './ProtectedRoute';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas de autenticación (sin NavBar) */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas con Layout (incluye NavBar) */}
        <Route element={<AppLayout />}>
          {/* Rutas públicas (con NavBar) */}
          <Route path="/" element={<LotesPage />} />
          <Route path="/lotes/:id" element={<DetailPage />} />
          <Route path="/pago/:id" element={<PagoPage />} />
          <Route path="/pago/:id/:pin" element={<PinPage />} />
          {/* Rutas protegidas (con NavBar y autenticación) */}
          <Route
            path="/gestion-lotes"
            element={<ProtectedRoute element={<LotesGestionPage />} />}
          />
          <Route
            path="/reservation"
            element={<ProtectedRoute element={<ReservationsPage />} />}
          />
          <Route
            path="/reservations-admin"
            element={<ProtectedRoute element={<ReservationPageAdmin />} />}
          />
          <Route
            path="/tienda/metricas"
            element={<ProtectedRoute element={<TiendaStatsPage />} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
