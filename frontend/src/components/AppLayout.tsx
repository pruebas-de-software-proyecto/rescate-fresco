import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import { Box } from '@mui/material';

export default function AppLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 1. La NavBar siempre estará arriba */}
      <NavBar />
      
      {/* 2. El contenido de la página (Lotes, Detalle, Login) se renderiza aquí */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
}