import CancelIcon from '@mui/icons-material/Cancel';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import StorefrontIcon from '@mui/icons-material/Storefront';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Typography
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import FullLotesAPI from '../../services/types';
import styles from './ReservationsPage.module.css';

interface Product {
    _id: string;
    nombre: string;
    estado: string;
    precioRescate: number;
    ventanaRetiro: string;
    ubicacion: string;
    proveedor: string;
    fechaVencimiento: string;
    codigoRetiro?: string;
    fotos?: string[];
}

export default function ReservationsPage() {
    const [reservedProducts, setReservedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchReservedProducts();
    }, []);

    const fetchReservedProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const allProducts = await FullLotesAPI.getAll();
            console.log("🔍 Todos los productos:", allProducts);
            
            const reservedProducts = allProducts.filter(
                (product) => product.estado === 'Reservado'
            );
            console.log("✅ Productos reservados:", reservedProducts);
            
            setReservedProducts(reservedProducts);
        } catch (err: any) {
            setError(err?.message || 'No se pudieron cargar las reservaciones.');
        } finally {
            setLoading(false);
        }
    };

    const handleCodigoRetiro = (codigoRetiro?: string, productId?: string) => {
        navigate(`/pago/${productId}/${codigoRetiro}`);
    }

    const handleCancelReservation = async (productId: string, productName: string) => {
        if (!window.confirm(`¿Estás seguro de que quieres cancelar la reserva de "${productName}"?`)) {
            return;
        }

        try {
            setCancellingId(productId);
            
            // Actualizar el estado del producto a "Disponible" usando la API
            await FullLotesAPI.update(productId, { estado: 'Disponible' });
            
            setReservedProducts(prev => prev.filter(product => product._id !== productId));
            
            alert(`La reserva de "${productName}" ha sido cancelada exitosamente.`);
        } catch (err: any) {
            alert(`Error al cancelar la reserva: ${err?.message || 'Error desconocido'}`);
        } finally {
            setCancellingId(null);
        }
    };



    const formatCurrency = (value: number) => 
        new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "dd 'de' MMMM, yyyy", { locale: es });
        } catch {
            return dateString; // Fallback si la fecha no se puede parsear
        }
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <Container maxWidth="lg" className={styles.container}>
                    <Box className={styles.loadingContainer}>
                        <CircularProgress />
                        <Typography sx={{ mt: 2 }}>Cargando reservaciones...</Typography>
                    </Box>
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.page}>
                <Container maxWidth="lg" className={styles.container}>
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                    <Button 
                        onClick={fetchReservedProducts} 
                        variant="contained" 
                        sx={{ 
                            mt: 2,
                            backgroundColor: '#2A7C48',
                            '&:hover': {
                                backgroundColor: '#236b3e'
                            }
                        }}
                    >
                        Reintentar
                    </Button>
                </Container>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <Container maxWidth="lg" className={styles.container}>
                <Box className={styles.header}>
                    <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom className={styles.headerTitle}>
                        Mis Reservas
                    </Typography>
                    <Typography variant="body1" color="textSecondary" paragraph>
                        Aquí puedes ver todos tus productos reservados y gestionar tus reservas.
                    </Typography>
                </Box>

                {reservedProducts.length === 0 ? (
                    <Box className={styles.emptyState}>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                            No tienes reservaciones activas
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Explora nuestros productos disponibles para hacer una reserva.
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {reservedProducts.map((product) => (
                            <Grid key={product._id} size={{ xs: 12, sm: 6, md: 4 }}>
                                <Card className={styles.reservationCard}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={product.fotos && product.fotos.length > 0 
                                            ? product.fotos[0] 
                                            : 'https://www.bupasalud.com/sites/default/files/inline-images/fuji-red.jpg'
                                        }
                                        alt={product.nombre}
                                        className={styles.productImage}
                                    />
                                    <CardContent className={styles.cardContent}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                            <Typography variant="h6" component="h2" gutterBottom>
                                                {product.nombre}
                                            </Typography>
                                            <Box className={styles.reservedBadge}>
                                                Reservado
                                            </Box>
                                        </Box>
                                        
                                        <Typography variant="h5" fontWeight="bold" className={styles.priceText} gutterBottom>
                                            {formatCurrency(product.precioRescate)}
                                        </Typography>

                                        <Box className={styles.infoSection}>
                                            <Box className={styles.infoItem}>
                                                <ScheduleIcon fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    <strong>Retiro:</strong> {product.ventanaRetiro}
                                                </Typography>
                                            </Box>

                                            <Box className={styles.infoItem}>
                                                <LocationOnIcon fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    <strong>Lugar:</strong> {product.ubicacion}
                                                </Typography>
                                            </Box>

                                            <Box className={styles.infoItem}>
                                                <StorefrontIcon fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    <strong>Tienda:</strong> {product.proveedor}
                                                </Typography>
                                            </Box>

                                        </Box>

                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            <strong>Vencimiento:</strong> {formatDate(product.fechaVencimiento)}
                                        </Typography>

                                        <Divider sx={{ my: 1.5 }} />
                                        
                                        <Button
                                            variant='outlined'
                                            sx={{ backgroundColor: '#2E7D32', borderColor: '#2E7D32', color: 'white', mb: 1 }}
                                            fullWidth
                                            onClick={() => handleCodigoRetiro(product.codigoRetiro, product._id)}>
                                            Ver código de retiro
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            fullWidth
                                            startIcon={<CancelIcon />}
                                            onClick={() => handleCancelReservation(product._id, product.nombre)}
                                            disabled={cancellingId === product._id}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            {cancellingId === product._id 
                                                ? 'Cancelando...' 
                                                : 'Cancelar Reserva'
                                            }
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </div>
    );
}
