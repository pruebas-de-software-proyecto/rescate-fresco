import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Define las props que aceptará este componente
interface ProtectedRouteProps {
  element: React.ReactElement; // Acepta un componente de React (tu página)
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  // 1. Llama al AuthContext para saber si el usuario está logueado
  const { isAuthenticated } = useAuth();

  // 2. Comprueba el estado de autenticación
  if (!isAuthenticated) {
    // 3. Si NO está logueado, lo redirige a la página de login.
    // 'replace' evita que el usuario pueda "volver" a la página protegida
    // con el botón de "atrás" del navegador.
    return <Navigate to="/login" replace />;
  }

  // 4. Si SÍ está logueado, muestra la página que querías renderizar (el 'element')
  return element;
};