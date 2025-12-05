import CancelIcon from '@mui/icons-material/Cancel';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
// 1. IMPORTS NUEVOS PARA EL MODAL
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Container,
    // Componentes del Modal
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    TextField,
    Typography
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FullLotesAPI from '../../services/types';

// Importamos las APIs
import tiendasAPI from '../../api/user'; // Tu API de tiendas
import styles from './ReservationPage.module.css';

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


export default function AdminReservationsPage() {
    const [reservedProducts, setReservedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [miNombreTienda, setMiNombreTienda] = useState<string | null>(null);
    const navigate = useNavigate();

    // 2. ESTADOS PARA EL MODAL
    const [openModal, setOpenModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [inputCode, setInputCode] = useState('');
    const [validationStatus, setValidationStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        fetchReservedProducts();
    }, []);

    // 3. FUNCIONES DEL MODAL
    const handleOpenValidation = (product: Product) => {
        setSelectedProduct(product);
        setInputCode('');
        setValidationStatus('idle');
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedProduct(null);
    };

    const handleValidateCode = () => {
        if (!selectedProduct) return;

        const codigoIngresado = inputCode.trim().toUpperCase();
        const codigoReal = (selectedProduct.codigoRetiro || "").trim().toUpperCase();

        if (codigoIngresado && codigoIngresado === codigoReal) {
            setValidationStatus('success');
        } else {
            setValidationStatus('error');
        }
    };

    const handleCodigoRetiro = (codigoRetiro?: string, productId?: string) => {
      navigate(`/pago/${productId}/${codigoRetiro}`);
    }

    const fetchReservedProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const perfilTienda = await tiendasAPI.getMiTienda();
            console.log("🏪 Soy la tienda:", perfilTienda.nombreTienda);
            setMiNombreTienda(perfilTienda.nombreTienda || "Desconocida");

            if (!perfilTienda.nombreTienda) {
                setError("No tienes un nombre de tienda configurado.");
                return;
            }

            const allProducts = await FullLotesAPI.getAll();
            console.log("🔍 Todos los productos:", allProducts);

            const reservedProducts = allProducts.filter(
                (product) => product.estado === 'Reservado'
            );
            
            console.log("📦 Total reservados en el sistema:", reservedProducts);

            const listaProductos = Array.isArray(reservedProducts) ? reservedProducts : (reservedProducts || []);

            const misProductos = listaProductos.filter((lote: Product) => {
                const tiendaLote = (lote.proveedor || "").trim().toLowerCase();
                const miTienda = (perfilTienda.nombreTienda || "").trim().toLowerCase();
                
                return tiendaLote === miTienda;
            });

            console.log("✅ Mis productos filtrados:", misProductos);
            setReservedProducts(misProductos);

        } catch (err: any) {
            console.error(err);
            setError(err?.message || 'No se pudieron cargar las reservaciones.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelReservation = async (productId: string, productName: string) => {
        if (!window.confirm(`¿Estás seguro de que quieres cancelar la reserva de "${productName}"?`)) {
            return;
        }

        try {
            setCancellingId(productId);
            // Actualizar estado a "Disponible"
            await FullLotesAPI.update(productId, { estado: 'Disponible' });
            
            // Remover de la lista visualmente
            setReservedProducts(prev => prev.filter(product => product._id !== productId));
            
            alert(`Reserva cancelada.`);
        } catch (err: any) {
            alert(`Error al cancelar: ${err?.message}`);
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
            return dateString;
        }
    };

    if (loading) return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Cargando reservas de {miNombreTienda}...</Typography>
        </Box>
    );

    if (error) return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;

    return (
            <div className={styles.page}>
                <Container maxWidth="lg" className={styles.container}>
                    <Box className={styles.header}>
                        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom className={styles.headerTitle}>
                            Reservas de mi tienda
                        </Typography>
                        <Typography variant="body1" color="textSecondary" paragraph>
                            Gestiona los pedidos pendientes que los usuarios han realizado en tu tienda
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
  
    
                                            </Box>
    
                                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                                <strong>Vencimiento:</strong> {formatDate(product.fechaVencimiento)}
                                            </Typography>
    
                                            <Divider sx={{ my: 1.5 }} />
                                            
                                            {/* 4. CAMBIO EN EL BOTÓN: Abrimos el modal en lugar de navegar */}
                                            <Button
                                                variant='outlined'
                                                sx={{ backgroundColor: '#2E7D32', borderColor: '#2E7D32', color: 'white', mb: 1 }}
                                                fullWidth
                                                onClick={() => handleOpenValidation(product)}>
                                                Válidar código de retiro
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

                {/* 5. MODAL DE VALIDACIÓN */}
                <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xs" fullWidth>
                    <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        Validar Entrega
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <Typography variant="body2" color="textSecondary">
                                Producto:
                            </Typography>
                            <Typography variant="h6" color="primary">
                                {selectedProduct?.nombre}
                            </Typography>
                        </Box>

                        <TextField
                            autoFocus
                            margin="dense"
                            label="Ingresa el PIN del cliente"
                            placeholder="Ej: A1B2C3"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={inputCode}
                            onChange={(e) => {
                                setInputCode(e.target.value);
                                setValidationStatus('idle');
                            }}
                            inputProps={{ 
                                style: { textTransform: 'uppercase', textAlign: 'center', letterSpacing: '2px' },
                                maxLength: 6 
                            }}
                        />

                        {/* Mensajes de Feedback */}
                        {validationStatus === 'success' && (
                            <Box sx={{ mt: 2, textAlign: 'center', color: 'success.main', bgcolor: '#e8f5e9', p: 1, borderRadius: 1 }}>
                                <CheckCircleIcon sx={{ fontSize: 40 }} />
                                <Typography variant="h6">¡Código Correcto!</Typography>
                                <Typography variant="body2">Puedes entregar el producto.</Typography>
                            </Box>
                        )}

                        {validationStatus === 'error' && (
                            <Box sx={{ mt: 2, textAlign: 'center', color: 'error.main', bgcolor: '#ffebee', p: 1, borderRadius: 1 }}>
                                <ErrorIcon sx={{ fontSize: 40 }} />
                                <Typography variant="h6">Código Incorrecto</Typography>
                                <Typography variant="body2">Verifica e inténtalo de nuevo.</Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                        <Button onClick={handleCloseModal} color="inherit">
                            Cerrar
                        </Button>
                        {validationStatus !== 'success' && (
                            <Button onClick={handleValidateCode} variant="contained" color="primary">
                                Validar
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>

                </Container>
            </div>
        );
}