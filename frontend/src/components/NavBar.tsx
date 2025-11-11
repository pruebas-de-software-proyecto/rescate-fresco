import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton,
  Menu,       // <-- Importado
  MenuItem    // <-- Importado
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
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

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#2E7D32", // verde oscuro
        boxShadow: "none",
        width: "100%",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo e Identidad (clicable, te lleva a la home) */}
        <Box 
          display="flex" 
          alignItems="center" 
          gap={1} 
          onClick={() => navigate('/')} // <-- Clicable
          sx={{ cursor: 'pointer' }}
        >
          <EmojiNatureOutlinedIcon sx={{ color: "#FFF9C4" }} />
          <Typography
            variant="h6"
            sx={{ color: "#FFF9C4", fontWeight: 500, letterSpacing: "0.5px" }}
          >
            RescateFresco
          </Typography>
        </Box>

        {/* Navegación (AHORA ES DINÁMICA) */}
        <Box display="flex" alignItems="center" gap={3}>

          {/* --- SI ESTÁ AUTENTICADO --- */}
          {isAuthenticated ? (
            <>
              {/* Navegación basada en ROL */}
              {user?.role === 'TIENDA' ? (
                <Typography
                  variant="body2"
                  sx={{ color: "white", cursor: "pointer", "&:hover": { opacity: 0.8 } }}
                  onClick={() => navigate('/gestion-lotes')} // <-- Funcional
                >
                  Gestión de Lotes
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  sx={{ color: "white", cursor: "pointer", "&:hover": { opacity: 0.8 } }}
                  onClick={() => navigate('/')} // <-- Funcional
                >
                  Productos
                </Typography>
              )}
            
              {/* Íconos */}
              <IconButton size="small" sx={{ color: "white" }}>
                <ShoppingCartOutlinedIcon />
              </IconButton>
              
              {/* Botón de Menú de Usuario */}
              <IconButton 
                size="small" 
                sx={{ color: "white" }}
                onClick={handleMenu} // <-- ABRE EL MENÚ
              >
                <AccountCircleOutlinedIcon />
              </IconButton>

              {/* El Menú de Logout */}
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                {/* <MenuItem onClick={() => navigate('/perfil')}>Mi Perfil</MenuItem> */}
                <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
              </Menu>
            </>
          ) : (
            /* --- SI NO ESTÁ AUTENTICADO --- */
            <>
              <Typography
                variant="body2"
                sx={{ color: "white", cursor: "pointer", "&:hover": { opacity: 0.8 } }}
                onClick={() => navigate('/login')} // <-- Funcional
              >
                Iniciar Sesión
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "white", cursor: "pointer", "&:hover": { opacity: 0.8 } }}
                onClick={() => navigate('/register')} // <-- Funcional
              >
                Registrarse
              </Typography>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}