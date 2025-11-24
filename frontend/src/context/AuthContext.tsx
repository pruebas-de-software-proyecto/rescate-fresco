// src/context/AuthContext.tsx
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// 1. Define el tipo de datos para el Usuario
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
  loading: boolean; // <--- 1. AGREGADO: Exponemos 'loading' por si alguien lo necesita
  login: (token: string, user: User) => void;
  logout: () => void;
}

// 3. Crea el Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Crea el "Proveedor" del Contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  // <--- 2. AGREGADO: Estado de carga inicia en 'true'
  const [loading, setLoading] = useState<boolean>(true);

  // EFECTO DE ARRANQUE
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error al cargar estado de auth desde localStorage", error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      // <--- 3. AGREGADO: Terminamos de cargar pase lo que pase
      setLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const authContextValue = {
    isAuthenticated: !!token,
    token,
    user,
    loading, // <--- 4. AGREGADO: Pasamos el estado al contexto
    login,
    logout
  };

  // <--- 5. AGREGADO (CRUCIAL): Si está cargando, NO pintamos la App todavía.
  // Esto evita que el Router te expulse al Login antes de tiempo.
  if (loading) {
    // Puedes cambiar esto por un componente <Spinner /> bonito si tienes uno
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        Cargando sesión...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 6. Hook Personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};