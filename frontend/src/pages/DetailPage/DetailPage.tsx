import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InventoryIcon from '@mui/icons-material/Inventory';
import {
    Alert,
    Box,
    Button,
    Card,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Typography
} from '@mui/material';
// import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import api from '../../api/lotes';
import { useAuth } from '../../context/AuthContext';

import styles from './DetailPage.module.css';

interface Product {
    _id: string;
    nombre: string;
    categoria: string;
    descripcion: string;
    cantidad: number;
    unidad: string;
    precioOriginal: number;
    precioRescate: number;
    fechaVencimiento: string;
    ventanaRetiro: string;
    ubicacion: string;
    fotos: string[];
    createdAt: string;
    updatedAt: string;
}

export default function DetailPage() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { logout } = useAuth();

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.get(`/lotes/${id}`);
                setProduct(response.data);
            } catch (err: any) {
                setError(err.message || 'No se pudo cargar la información del producto.');
            } finally {
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
        return (
            <Box className={styles.loadingContainer}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" className={styles.container}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!product) {
        return (
            <Container maxWidth="sm" className={styles.container}>
                <Alert severity="warning">Producto no encontrado.</Alert>
            </Container>
        );
    }

    const formatCurrency = (value: number) => 
        new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);

    const formatDate = (dateString: string) => 
        format(new Date(dateString), "dd 'de' MMMM, yyyy", { locale: es });

    return (
        <Container maxWidth="lg" className={styles.container}>
            <Card className={styles.productCard}>
            <img
                className={styles.productImage}
                src={product.fotos && product.fotos.length > 0
                    ? product.fotos[0]
                    : '/images/default-lote.png'
                }
                alt={product.nombre}
            />
                
                <Box className={styles.productDetailsColumn}>
                    <Chip label={product.categoria} color="primary" className={styles.categoryChip} />
                    
                    <Box>
                        <Typography component="h1" variant="h5" fontWeight="medium">
                            {product.nombre}
                        </Typography>
                        <Typography variant="h4" color="info" fontWeight="bold">
                            {formatCurrency(product.precioRescate)}
                        </Typography>
                    </Box>

                    <Divider className={styles.divider} />

                    <Box className={styles.infoSection}>
                        <Box className={styles.infoItem} data-testid="stock-info">
                            <InventoryIcon color="action" />
                            <Typography>
                                <strong>Stock:</strong> {product.cantidad} {product.unidad}
                            </Typography>
                        </Box>
                        <Box className={styles.infoItem}>
                            <CalendarMonthIcon color="action" />
                            <Typography>
                                <strong>Vencimiento:</strong> {formatDate(product.fechaVencimiento)}
                            </Typography>
                        </Box>
                    </Box>

                    <Typography variant="body1" color="text.secondary" fontWeight="medium" paragraph>
                        Descripción:
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        {product.descripcion}
                    </Typography>

                    <Box className={styles.addToCartContainer}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<AddShoppingCartIcon />}
                            onClick={handleAddToCart}
                            className={styles.addToCartButton}
                        >
                            Añadir al Carrito
                        </Button>
                    </Box>
                </Box>
            </Card>
        </Container>
    );
}