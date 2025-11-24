import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/AppLayout'; // <-- 1. IMPORTA EL LAYOUT
import DetailPage from '../pages/DetailPage/DetailPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import LotesGestionPage from '../pages/LotesGestionPage';
import LotesPage from '../pages/LotesPage';
import PagoPage from '../pages/PagoPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import { ReservationsPage } from '../pages/ReservationsPage';
import { ProtectedRoute } from './ProtectedRoute';
export default function AppRouter() {
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/register", element: _jsx(RegisterPage, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsxs(Route, { element: _jsx(AppLayout, {}), children: [_jsx(Route, { path: "/", element: _jsx(LotesPage, {}) }), _jsx(Route, { path: "/lotes/:id", element: _jsx(DetailPage, {}) }), _jsx(Route, { path: "/pago/:id", element: _jsx(PagoPage, {}) }), _jsx(Route, { path: "/lotes-gestion", element: _jsx(ProtectedRoute, { element: _jsx(LotesGestionPage, {}) }) }), _jsx(Route, { path: "/reservation", element: _jsx(ProtectedRoute, { element: _jsx(ReservationsPage, {}) }) })] })] }) }));
}
