import { jsx as _jsx } from "react/jsx-runtime";
// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
// 3. Crea el Contexto
// (Le decimos que puede ser 'undefined' al inicio)
const AuthContext = createContext(undefined);
// 4. Crea el "Proveedor" del Contexto
// Este componente envolverá tu aplicación (en main.tsx)
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
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
        }
        catch (error) {
            // Si localStorage está corrupto o algo falla, limpia todo
            console.error("Error al cargar estado de auth desde localStorage", error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }, []); // El array vacío [] significa que solo se ejecuta al montar
    // Función LOGIN:
    // Se llama desde LoginPage.tsx cuando el backend responde OK
    const login = (newToken, newUser) => {
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
    return (_jsx(AuthContext.Provider, { value: authContextValue, children: children }));
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
