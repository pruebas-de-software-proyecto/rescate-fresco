import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { CssBaseline, Container, Box, Typography } from '@mui/material';
const DashboardLayout = ({ title, children }) => {
    return (_jsxs(_Fragment, { children: [_jsx(CssBaseline, {}), _jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', height: '100vh' }, children: [_jsx(Box, { sx: { backgroundColor: '#11904aff', color: 'white', p: 2 }, children: _jsx(Typography, { variant: "h5", children: title }) }), _jsx(Container, { sx: { mt: 4, mb: 4, flexGrow: 1 }, children: children })] })] }));
};
export default DashboardLayout;
