// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// 1. Define el tipo de datos para el Usuario
// (Esto debe coincidir con lo que tu backend devuelve en el login)
interface User {
  id: string;
  email: string;
  role: 'CONSUMIDOR' | 'TIENDA';
}

// 2. Define el tipo de datos para el Contexto
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

// 3. Crea el Contexto
// (Le decimos que puede ser 'undefined' al inicio)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Crea el "Proveedor" del Contexto
// Este componente envolverá tu aplicación (en main.tsx)
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // EFECTO DE ARRANQUE:
  // Esto revisa localStorage UNA VEZ cuando la app carga.
  // Es lo que permite que la sesión "persista" después de recargar la página.
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser)); // Convierte el string de vuelta a objeto
      }
    } catch (error) {
      // Si localStorage está corrupto o algo falla, limpia todo
      console.error("Error al cargar estado de auth desde localStorage", error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, []); // El array vacío [] significa que solo se ejecuta al montar

  // Función LOGIN:
  // Se llama desde LoginPage.tsx cuando el backend responde OK
  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    // Guarda en localStorage para persistir la sesión
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser)); // Convierte el objeto a string
  };

  // Función LOGOUT:
  // Se llama desde un botón de "Cerrar Sesión" o si la API da error 401
  const logout = () => {
    setToken(null);
    setUser(null);
    // Limpia localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // 5. Define el valor que compartirás
  const authContextValue = {
    isAuthenticated: !!token, // !! convierte el string (o null) a un booleano
    token,
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 6. Hook Personalizado (Hook)
// Esto es para que en otros archivos solo tengas que escribir: const { login } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};