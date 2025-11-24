import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Alert, Box, Button, CircularProgress, Container, Divider, Typography } from '@mui/material';
// import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLoteById } from '../../api/lotes';
import { useAuth } from '../../context/AuthContext';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import styles from './DetailPage.module.css';
export default function DetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imgIndex, setImgIndex] = useState(0);
    const { logout } = useAuth();
    useEffect(() => {
        if (!id)
            return;
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getLoteById(id);
                setProduct(response);
            }
            catch (err) {
                setError(err?.message || 'No se pudo cargar la información del producto.');
            }
            finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, logout]);
    const handleAddToCart = () => {
        console.log(`Producto ${product?.nombre} añadido al carrito.`);
        alert(`¡${product?.nombre} ha sido añadido al carrito!`);
    };
    if (loading) {
        return (_jsx("div", { className: styles.page, children: _jsx(Box, { className: styles.loadingContainer, children: _jsx(CircularProgress, {}) }) }));
    }
    if (error) {
        return (_jsx("div", { className: styles.page, children: _jsx(Container, { maxWidth: "sm", className: styles.container, children: _jsx(Alert, { severity: "error", children: error }) }) }));
    }
    if (!product) {
        return (_jsx("div", { className: styles.page, children: _jsx(Container, { maxWidth: "sm", className: styles.container, children: _jsx(Alert, { severity: "warning", children: "Producto no encontrado." }) }) }));
    }
    const totalImages = product?.fotos?.length ?? 0;
    const formatCurrency = (value) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
    const formatDate = (dateString) => format(new Date(dateString), "dd 'de' MMMM, yyyy", { locale: es });
    const prevImage = () => {
        if (!product?.fotos || product.fotos.length === 0)
            return;
        setImgIndex((i) => (i - 1 + product.fotos.length) % product.fotos.length);
    };
    const nextImage = () => {
        if (!product?.fotos || product.fotos.length === 0)
            return;
        setImgIndex((i) => (i + 1) % product.fotos.length);
    };
    return (_jsx("div", { className: styles.page, children: _jsxs(Container, { maxWidth: "lg", className: styles.container, children: [_jsxs(Box, { className: styles.productCard, sx: { display: 'flex', gap: 4, alignItems: 'center' }, children: [_jsxs(Box, { sx: { width: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }, className: styles.carouselLeft, children: [_jsxs(Box, { sx: { position: 'relative', display: 'inline-block' }, children: [_jsx("img", { className: styles.productImage, src: product.fotos && product.fotos.length > 0 ? product.fotos[imgIndex] : '/images/default-lote.png', alt: product.nombre, style: { width: '400px', height: '320px', objectFit: 'cover', borderRadius: 8 } }), _jsx(Button, { "aria-label": "anterior", onClick: prevImage, sx: {
                                                position: 'absolute',
                                                left: 8,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                minWidth: 40,
                                                width: 40,
                                                height: 40,
                                                backgroundColor: 'rgba(128, 128, 128, 0.8)',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(128, 128, 128, 0.9)',
                                                },
                                                borderRadius: '8px'
                                            }, children: _jsx(ArrowBack, {}) }), _jsx(Button, { "aria-label": "siguiente", onClick: nextImage, sx: {
                                                position: 'absolute',
                                                right: 8,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                minWidth: 40,
                                                width: 40,
                                                height: 40,
                                                backgroundColor: 'rgba(128, 128, 128, 0.8)',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(128, 128, 128, 0.9)',
                                                },
                                                borderRadius: '8px'
                                            }, children: _jsx(ArrowForward, {}) })] }), totalImages > 1 && (_jsxs(_Fragment, { children: [_jsxs(Typography, { variant: "caption", sx: { mt: 1 }, children: [imgIndex + 1, " / ", totalImages] }), _jsx("div", { className: styles.thumbnailRow, children: product.fotos.map((f, i) => (_jsx("img", { src: f, alt: `thumb-${i}`, className: `${styles.thumbnail} ${i === imgIndex ? styles.active : ''}`, onClick: () => setImgIndex(i) }, f + i))) })] }))] }), _jsxs(Box, { className: styles.productDetailsColumn, children: [_jsxs("div", { className: styles.productHeader, children: [_jsx(Typography, { component: "h1", variant: "h5", fontWeight: "medium", children: product.nombre }), _jsx("div", { className: styles.categoryChip, children: product.categoria }), _jsx(Typography, { variant: "h3", fontWeight: "bold", sx: { mb: 2 }, children: formatCurrency(product.precioRescate) })] }), _jsx(Divider, { sx: { mb: 1.5 } }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsxs(Typography, { color: "textSecondary", children: [_jsx("strong", { children: "Cantidad:" }), " ", product.cantidad, " ", product.unidad] }), _jsxs(Typography, { color: "textSecondary", children: [_jsx("strong", { children: "Vencimiento:" }), " ", formatDate(product.fechaVencimiento)] })] }), _jsx(Button, { variant: "contained", color: "inherit", size: "large", startIcon: _jsx(AddShoppingCartIcon, {}), onClick: handleAddToCart, className: styles.addToCartButton, sx: {
                                        backgroundColor: '#2A7C48',
                                        color: '#ffffff',
                                        '&:hover': { backgroundColor: '#0d3d1eff' },
                                        boxShadow: 'none',
                                        width: '100%',
                                        textTransform: 'none',
                                        mb: 2.5
                                    }, children: "A\u00F1adir al Carrito" }), _jsx(Typography, { variant: "body1", color: "text.secondary", fontWeight: "medium", sx: { mb: 0.5 }, children: _jsx("strong", { children: "Descripci\u00F3n:" }) }), _jsx(Typography, { variant: "body1", color: "text.secondary", paragraph: true, children: product.descripcion })] })] }), _jsx("div", { className: styles.divider })] }) }));
}
