import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, // <-- Importado
MenuItem // <-- Importado
 } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EmojiNatureOutlinedIcon from "@mui/icons-material/EmojiNatureOutlined";
import { useNavigate } from 'react-router-dom'; // <-- Importado
import { useAuth } from '../context/AuthContext'; // <-- Importado
export default function NavBar() {
    // --- LÓGICA DE AUTENTICACIÓN Y NAVEGACIÓN ---
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    // --- LÓGICA PARA EL MENÚ DE USUARIO ---
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        logout();
        navigate('/login');
        handleClose();
    };
    // -----------------------------------------
    return (_jsx(AppBar, { position: "static", sx: {
            backgroundColor: "#2E7D32", // verde oscuro
            boxShadow: "none",
            width: "100%",
        }, children: _jsxs(Toolbar, { sx: { justifyContent: "space-between" }, children: [_jsxs(Box, { display: "flex", alignItems: "center", gap: 1, onClick: () => navigate('/'), sx: { cursor: 'pointer' }, children: [_jsx(EmojiNatureOutlinedIcon, { sx: { color: "#FFF9C4" } }), _jsx(Typography, { variant: "h6", sx: { color: "#FFF9C4", fontWeight: 500, letterSpacing: "0.5px" }, children: "RescateFresco" })] }), _jsx(Box, { display: "flex", alignItems: "center", gap: 3, children: isAuthenticated ? (_jsxs(_Fragment, { children: [user?.role === 'TIENDA' ? (_jsx(Typography, { variant: "body2", sx: { color: "white", cursor: "pointer", "&:hover": { opacity: 0.8 } }, onClick: () => navigate('/gestion-lotes'), children: "Gesti\u00F3n de Lotes" })) : (_jsx(Typography, { variant: "body2", sx: { color: "white", cursor: "pointer", "&:hover": { opacity: 0.8 } }, onClick: () => navigate('/'), children: "Productos" })), _jsx(IconButton, { size: "small", sx: { color: "white" }, children: _jsx(ShoppingCartOutlinedIcon, {}) }), _jsx(IconButton, { size: "small", sx: { color: "white" }, onClick: handleMenu, children: _jsx(AccountCircleOutlinedIcon, {}) }), _jsx(Menu, { anchorEl: anchorEl, open: open, onClose: handleClose, children: _jsx(MenuItem, { onClick: handleLogout, children: "Cerrar Sesi\u00F3n" }) })] })) : (
                    /* --- SI NO ESTÁ AUTENTICADO --- */
                    _jsxs(_Fragment, { children: [_jsx(Typography, { variant: "body2", sx: { color: "white", cursor: "pointer", "&:hover": { opacity: 0.8 } }, onClick: () => navigate('/login'), children: "Iniciar Sesi\u00F3n" }), _jsx(Typography, { variant: "body2", sx: { color: "white", cursor: "pointer", "&:hover": { opacity: 0.8 } }, onClick: () => navigate('/register'), children: "Registrarse" })] })) })] }) }));
}
