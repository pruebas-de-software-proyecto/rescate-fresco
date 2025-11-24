import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import { Box } from '@mui/material';
export default function AppLayout() {
    return (_jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', minHeight: '100vh' }, children: [_jsx(NavBar, {}), _jsx(Box, { component: "main", sx: { flexGrow: 1 }, children: _jsx(Outlet, {}) })] }));
}
