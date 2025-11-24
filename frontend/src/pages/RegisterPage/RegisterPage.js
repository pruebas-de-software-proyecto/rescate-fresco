import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { TextField, Button, Typography, Link, ToggleButton, ToggleButtonGroup, Alert, } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import styles from './RegisterPage.module.css';
import fondoConsumidor from '../../assets/images/fondo_consumidor.png';
import fondoTienda from '../../assets/images/fondo_tienda.png';
import Logo from '../../components/Logo';
import api from '../../api/lotes';
export default function RegisterPage() {
    const [role, setRole] = useState('consumidor'); // Queda seteado por defecto el rol de consumidor
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nombreConsumidor: '',
        nombreTienda: '',
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const handleRoleChange = (event, newRole) => {
        if (newRole !== null) {
            setRole(newRole);
        }
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null); // Limpiar errores anteriores
        let dataParaBackend;
        // Tu lógica de roles (¡está perfecta!)
        if (role === 'consumidor') {
            dataParaBackend = {
                role: 'CONSUMIDOR',
                email: formData.email,
                password: formData.password,
                nombre: formData.nombreConsumidor,
            };
        }
        else {
            dataParaBackend = {
                role: 'TIENDA',
                email: formData.email,
                password: formData.password,
                nombreTienda: formData.nombreTienda,
            };
        }
        console.log('Enviando al backend:', dataParaBackend);
        try {
            // Llamamos a la API de registro
            await api.post('/auth/register', dataParaBackend);
            // Si el registro es exitoso:
            alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
            navigate('/login'); // Redirigir a la página de login
        }
        catch (err) {
            console.error('Error en el registro:', err);
            // Mostrar error (ej: "El email ya está en uso")
            setError(err.response?.data?.message || 'Ocurrió un error al registrarse');
        }
    };
    return (_jsxs("div", { className: styles.container, children: [_jsx("div", { className: styles.formSection, children: _jsxs("div", { className: styles.formContainer, children: [_jsx(Typography, { variant: "h4", fontWeight: 600, className: styles.title, children: "Reg\u00EDstrate" }), _jsxs("div", { className: styles.loginLink, children: [_jsxs(Typography, { component: "span", color: "text.secondary", children: ["\u00BFYa tienes una cuenta?", ' '] }), _jsx(Link, { href: "/login", underline: "hover", color: "#43A047", children: "Inicia sesi\u00F3n" })] }), _jsxs(ToggleButtonGroup, { value: role, exclusive: true, onChange: handleRoleChange, fullWidth: true, className: styles.toggleButtons, children: [_jsxs(ToggleButton, { value: "consumidor", className: role === 'consumidor' ? styles.toggleButtonSelected : styles.toggleButton, sx: { textTransform: 'none' }, children: [_jsx(ShoppingBagOutlinedIcon, {}), "Quiero Comprar"] }), _jsxs(ToggleButton, { value: "tienda", className: role === 'tienda' ? styles.toggleButtonSelected : styles.toggleButton, sx: { textTransform: 'none' }, children: [_jsx(StorefrontOutlinedIcon, {}), "Quiero Vender"] })] }), _jsxs("form", { onSubmit: handleSubmit, children: [error && (_jsx(Alert, { severity: "error", sx: { my: 2 }, children: error })), role === 'consumidor' ? (_jsxs("div", { className: styles.inputGroup, children: [_jsx(Typography, { component: "label", htmlFor: "nombreConsumidor", className: styles.inputLabel, children: "Nombre" }), _jsx(TextField, { fullWidth: true, id: "nombreConsumidor", name: "nombreConsumidor", placeholder: "Juan" // <-- Usamos placeholder
                                            , value: formData.nombreConsumidor, onChange: handleInputChange, required: true })] })) : (_jsxs("div", { className: styles.inputGroup, children: [_jsx(Typography, { component: "label", htmlFor: "nombreTienda", className: styles.inputLabel, children: "Nombre de la tienda" }), _jsx(TextField, { fullWidth: true, id: "nombreTienda", name: "nombreTienda", placeholder: "Pasteler\u00EDa Rosa" // <-- Usamos placeholder
                                            , value: formData.nombreTienda, onChange: handleInputChange, required: true })] })), _jsxs("div", { className: styles.inputGroup, children: [_jsx(Typography, { component: "label", htmlFor: "email", className: styles.inputLabel, children: "Email" }), _jsx(TextField, { fullWidth: true, id: "email", name: "email", type: "email", placeholder: "juanperez@example.com" // <-- Usamos placeholder
                                            , value: formData.email, onChange: handleInputChange, required: true })] }), _jsxs("div", { className: styles.inputGroup, children: [_jsx(Typography, { component: "label", htmlFor: "password", className: styles.inputLabel, children: "Contrase\u00F1a" }), _jsx(TextField, { fullWidth: true, id: "password", name: "password", type: "password", placeholder: "Value" // <-- Placeholder (o déjalo vacío)
                                            , value: formData.password, onChange: handleInputChange, required: true })] }), _jsx(Button, { type: "submit", variant: "contained", className: styles.submitButton, sx: { textTransform: 'none' }, children: "Registrarse" })] }), _jsx("div", { className: styles.logoContainer, children: _jsx(Logo, { className: styles.logo }) })] }) }), _jsx("div", { className: styles.backgroundSection, style: {
                    backgroundImage: `url(${role === 'consumidor' ? fondoConsumidor : fondoTienda})`
                } })] }));
}
