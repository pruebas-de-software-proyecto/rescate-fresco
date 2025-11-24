import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export const ProtectedRoute = ({ element }) => {
    // 1. Llama al AuthContext para saber si el usuario está logueado
    const { isAuthenticated } = useAuth();
    // 2. Comprueba el estado de autenticación
    if (!isAuthenticated) {
        // 3. Si NO está logueado, lo redirige a la página de login.
        // 'replace' evita que el usuario pueda "volver" a la página protegida
        // con el botón de "atrás" del navegador.
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    // 4. Si SÍ está logueado, muestra la página que querías renderizar (el 'element')
    return element;
};
