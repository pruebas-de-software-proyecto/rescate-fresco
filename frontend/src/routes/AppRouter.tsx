import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DetailPage from '../pages/DetailPage/DetailPage';
import LotesGestionPage from '../pages/LotesGestionPage';
import LotesPage from '../pages/LotesPage';
import PagoPage from '../pages/PagoPage'; 
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import AppLayout from '../components/AppLayout'; // <-- 1. IMPORTA EL LAYOUT
import { ReservationsPage } from '../pages/ReservationsPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LotesPage />} />
        <Route path="/:id" element={<DetailPage />} />
        <Route path="/reservation" element={<ReservationsPage />} />
        <Route path="/lotes-gestion" element={<LotesGestionPage />} />
        <Route path="/pago/:id" element={<PagoPage />} /> 
      </Routes>
    </BrowserRouter>
  )
}
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
           <Route path="/reservation" element={<ReservationsPage />} />

          {/* Aquí puedes añadir las rutas de /perfil y /contacto */}

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
