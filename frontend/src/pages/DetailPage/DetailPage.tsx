import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import {
    Alert,
    Box,
    Button,
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
import { getLoteById } from '../../api/lotes';
import { useAuth } from '../../context/AuthContext';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { FullLote } from '../../services/types';

import styles from './DetailPage.module.css';


export default function DetailPage() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<FullLote | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imgIndex, setImgIndex] = useState(0);
    const { user } = useAuth();


    const formatDateShort = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'long', year: 'numeric' ,timeZone: 'UTC' }).format(date);
    };

    const { logout } = useAuth();

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getLoteById(id!);
                setProduct(response);
            } catch (err: any) {
                setError(err?.message || 'No se pudo cargar la información del producto.');
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
            <div className={styles.page}>
                <Box className={styles.loadingContainer}>
                    <CircularProgress />
                </Box>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.page}>
                <Container maxWidth="sm" className={styles.container}>
                    <Alert severity="error">{error}</Alert>
                </Container>
            </div>
        );
    }

    if (!product) {
        return (
            <div className={styles.page}>
                <Container maxWidth="sm" className={styles.container}>
                    <Alert severity="warning">Producto no encontrado.</Alert>
                </Container>
            </div>
        );
    }

    const totalImages = product?.fotos?.length ?? 0;

    const formatCurrency = (value: number) => 
        new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);

    const formatDate = (dateString: string) => 
        format(new Date(dateString), "dd 'de' MMMM, yyyy", { locale: es });

    const prevImage = () => {
        if (!product?.fotos || product.fotos.length === 0) return;
        setImgIndex((i) => (i - 1 + product.fotos.length) % product.fotos.length);
    };

    const nextImage = () => {
        if (!product?.fotos || product.fotos.length === 0) return;
        setImgIndex((i) => (i + 1) % product.fotos.length);
    };

    return (
        <div className={styles.page}>
            <Container maxWidth="lg" className={styles.container}>
                <Box className={styles.productCard} sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <Box sx={{ width: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={styles.carouselLeft}>
                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                            <img
                                className={styles.productImage}
                                src={product.fotos && product.fotos.length > 0 ? product.fotos[imgIndex] : '/images/default-lote.png'}
                                alt={product.nombre}
                                style={{ width: '400px', height: '320px', objectFit: 'cover', borderRadius: 8 }}
                            />
                            
                            {/* Flecha izquierda */}
                            <Button 
                                aria-label="anterior" 
                                onClick={prevImage}
                                sx={{
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
                                }}
                            >
                                <ArrowBack />
                            </Button>

                            {/* Flecha derecha */}
                            <Button 
                                aria-label="siguiente" 
                                onClick={nextImage}
                                sx={{
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
                                }}
                            >
                                <ArrowForward />
                            </Button>
                        </Box>

                        {/* Indicador de posición */}
                        {totalImages > 1 && (
                            <>
                                <Typography variant="caption" sx={{ mt: 1 }}>
                                    {imgIndex + 1} / {totalImages}
                                </Typography>

                                <div className={styles.thumbnailRow}>
                                    {product.fotos.map((f, i) => (
                                        <img
                                            key={f + i}
                                            src={f}
                                            alt={`thumb-${i}`}
                                            className={`${styles.thumbnail} ${i === imgIndex ? styles.active : ''}`}
                                            onClick={() => setImgIndex(i)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </Box>

                    {/* Columna derecha - Detalles del producto */}
                    <Box className={styles.productDetailsColumn}>
                        <div className={styles.productHeader}>
                            <Typography component="h1" variant="h5" fontWeight="medium">
                                {product.nombre}
                            </Typography>
                            <div className={styles.categoryChip}>{product.categoria}</div>
                            <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
                                {formatCurrency(product.precioRescate)}
                            </Typography>
                        </div>

                        <Divider sx={{ mb: 1.5 }} />

                        <div style={{ marginBottom: '16px' }}>
                            <Typography color="textSecondary">
                                <strong>Cantidad:</strong> {product.cantidad} {product.unidad}
                            </Typography>
                            <Typography color="textSecondary">
                                <strong>Vencimiento:</strong> {formatDateShort(product.fechaVencimiento.toString())}
                            </Typography>
                        </div>

                        {user?.role === 'CONSUMIDOR' && (
                            <Button
                                variant="contained"
                                color="inherit"
                                size="large"
                                startIcon={<AddShoppingCartIcon />}
                                onClick={handleAddToCart}
                                className={styles.addToCartButton}
                                sx={{
                                    backgroundColor: '#2A7C48',
                                    color: '#ffffff',
                                    '&:hover': { backgroundColor: '#0d3d1eff' },
                                    boxShadow: 'none',
                                    width: '100%',
                                    textTransform: 'none',
                                    mb: 2.5
                                }}
                            >
                                Añadir al Carrito
                            </Button>
                        )}


                        <Typography variant="body1" color="text.secondary" fontWeight="medium" sx={{ mb: 0.5 }}>
                            <strong>Descripción:</strong>
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            {product.descripcion}
                        </Typography>
                    </Box>
                </Box>
                <div className={styles.divider} />
            </Container>
        </div>
    );
}