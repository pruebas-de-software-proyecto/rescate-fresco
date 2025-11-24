import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import CancelIcon from '@mui/icons-material/Cancel';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { Alert, Box, Button, Card, CardContent, CardMedia, CircularProgress, Container, Divider, Grid, Typography } from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import FullLotesAPI from '../../services/types';
import styles from './ReservationsPage.module.css';
export default function ReservationsPage() {
    const [reservedProducts, setReservedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);
    useEffect(() => {
        fetchReservedProducts();
    }, []);
    const fetchReservedProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            // Obtener todos los productos del backend
            const allProducts = await FullLotesAPI.getAll();
            // Filtrar solo los productos con estado "Reservado"
            const reservedProducts = allProducts.filter(product => product.estado === 'Reservado');
            setReservedProducts(reservedProducts);
        }
        catch (err) {
            setError(err?.message || 'No se pudieron cargar las reservaciones.');
        }
        finally {
            setLoading(false);
        }
    };
    const handleCancelReservation = async (productId, productName) => {
        if (!window.confirm(`¿Estás seguro de que quieres cancelar la reserva de "${productName}"?`)) {
            return;
        }
        try {
            setCancellingId(productId);
            // Actualizar el estado del producto a "Disponible" usando la API
            await FullLotesAPI.update(productId, { estado: 'Disponible' });
            // Actualizar la lista local removiendo el producto cancelado
            setReservedProducts(prev => prev.filter(product => product._id !== productId));
            alert(`La reserva de "${productName}" ha sido cancelada exitosamente.`);
        }
        catch (err) {
            alert(`Error al cancelar la reserva: ${err?.message || 'Error desconocido'}`);
        }
        finally {
            setCancellingId(null);
        }
    };
    const formatCurrency = (value) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), "dd 'de' MMMM, yyyy", { locale: es });
        }
        catch {
            return dateString; // Fallback si la fecha no se puede parsear
        }
    };
    if (loading) {
        return (_jsxs("div", { className: styles.page, children: [_jsx(NavBar, {}), _jsx(Container, { maxWidth: "lg", className: styles.container, children: _jsxs(Box, { className: styles.loadingContainer, children: [_jsx(CircularProgress, {}), _jsx(Typography, { sx: { mt: 2 }, children: "Cargando reservaciones..." })] }) })] }));
    }
    if (error) {
        return (_jsxs("div", { className: styles.page, children: [_jsx(NavBar, {}), _jsxs(Container, { maxWidth: "lg", className: styles.container, children: [_jsx(Alert, { severity: "error", sx: { mt: 2 }, children: error }), _jsx(Button, { onClick: fetchReservedProducts, variant: "contained", sx: {
                                mt: 2,
                                backgroundColor: '#2A7C48',
                                '&:hover': {
                                    backgroundColor: '#236b3e'
                                }
                            }, children: "Reintentar" })] })] }));
    }
    return (_jsxs("div", { className: styles.page, children: [_jsx(NavBar, {}), _jsxs(Container, { maxWidth: "lg", className: styles.container, children: [_jsxs(Box, { className: styles.header, children: [_jsx(Typography, { variant: "h4", component: "h1", fontWeight: "bold", gutterBottom: true, className: styles.headerTitle, children: "Mis Reservaciones" }), _jsx(Typography, { variant: "body1", color: "textSecondary", paragraph: true, children: "Aqu\u00ED puedes ver todos tus productos reservados y gestionar tus reservas." })] }), reservedProducts.length === 0 ? (_jsxs(Box, { className: styles.emptyState, children: [_jsx(Typography, { variant: "h6", color: "textSecondary", gutterBottom: true, children: "No tienes reservaciones activas" }), _jsx(Typography, { variant: "body2", color: "textSecondary", children: "Explora nuestros productos disponibles para hacer una reserva." })] })) : (_jsx(Grid, { container: true, spacing: 3, children: reservedProducts.map((product) => (_jsx(Grid, { size: { xs: 12, sm: 6, md: 4 }, children: _jsxs(Card, { className: styles.reservationCard, children: [_jsx(CardMedia, { component: "img", height: "140", image: product.fotos && product.fotos.length > 0
                                            ? product.fotos[0]
                                            : 'https://www.bupasalud.com/sites/default/files/inline-images/fuji-red.jpg', alt: product.nombre, className: styles.productImage }), _jsxs(CardContent, { className: styles.cardContent, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }, children: [_jsx(Typography, { variant: "h6", component: "h2", gutterBottom: true, children: product.nombre }), _jsx(Box, { className: styles.reservedBadge, children: "Reservado" })] }), _jsx(Typography, { variant: "h5", fontWeight: "bold", className: styles.priceText, gutterBottom: true, children: formatCurrency(product.precioRescate) }), _jsxs(Box, { className: styles.infoSection, children: [_jsxs(Box, { className: styles.infoItem, children: [_jsx(ScheduleIcon, { fontSize: "small", color: "action" }), _jsxs(Typography, { variant: "body2", children: [_jsx("strong", { children: "Retiro:" }), " ", product.ventanaRetiro] })] }), _jsxs(Box, { className: styles.infoItem, children: [_jsx(LocationOnIcon, { fontSize: "small", color: "action" }), _jsxs(Typography, { variant: "body2", children: [_jsx("strong", { children: "Lugar:" }), " ", product.ubicacion] })] }), _jsxs(Box, { className: styles.infoItem, children: [_jsx(StorefrontIcon, { fontSize: "small", color: "action" }), _jsxs(Typography, { variant: "body2", children: [_jsx("strong", { children: "Tienda:" }), " ", product.proveedor] })] })] }), _jsxs(Typography, { variant: "body2", color: "textSecondary", gutterBottom: true, children: [_jsx("strong", { children: "Vencimiento:" }), " ", formatDate(product.fechaVencimiento)] }), _jsx(Divider, { sx: { my: 1.5 } }), _jsx(Button, { variant: "outlined", color: "error", fullWidth: true, startIcon: _jsx(CancelIcon, {}), onClick: () => handleCancelReservation(product._id, product.nombre), disabled: cancellingId === product._id, sx: { textTransform: 'none' }, children: cancellingId === product._id
                                                    ? 'Cancelando...'
                                                    : 'Cancelar Reserva' })] })] }) }, product._id))) }))] })] }));
}
