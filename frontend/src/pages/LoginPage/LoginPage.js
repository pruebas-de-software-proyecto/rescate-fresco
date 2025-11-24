import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Link, Alert, } from '@mui/material';
import styles from './LoginPage.module.css'; // Importamos el nuevo CSS
import fondoLogin from '../../assets/images/bolsa con lechuga.png';
import Logo from '../../components/Logo';
import { useAuth } from '../../context/AuthContext';
//import axios from 'axios';
import api from '../../api/lotes';
export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null); // Limpia errores anteriores
        const dataParaBackend = {
            email: formData.email,
            password: formData.password,
        };
        console.log('Enviando al backend:', dataParaBackend);
        try {
            // ¡TODA LA LÓGICA DE LOGIN VA AQUÍ!
            const response = await api.post('/auth/login', // La URL base ya está en 'api'
            dataParaBackend);
            const { token, user } = response.data;
            login(token, user); // Guardamos en el contexto
            navigate('/'); // Enviamos a la página principal
        }
        catch (err) {
            console.error('Error de login:', err);
            // Mostramos un error genérico al usuario
            setError('Email o contraseña incorrectos. Por favor, intenta de nuevo.');
        }
    };
    return (_jsxs("div", { className: styles.container, children: [_jsx("div", { className: styles.backgroundSection, style: {
                    backgroundImage: `url(${fondoLogin})`
                } }), _jsx("div", { className: styles.formSection, children: _jsxs("div", { className: styles.formContainer, children: [_jsx(Typography, { variant: "h4", fontWeight: 600, className: styles.title, children: "Iniciar sesi\u00F3n" }), _jsxs("div", { className: styles.registerLink, children: [" ", _jsxs(Typography, { component: "span", color: "text.secondary", children: ["\u00BFA\u00FAn no tienes una cuenta?", ' '] }), _jsx(Link, { href: "/register", underline: "hover", color: "#43A047", children: "Reg\u00EDstrate" })] }), _jsxs("form", { onSubmit: handleSubmit, children: [error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error })), _jsxs("div", { className: styles.inputGroup, children: [_jsx(Typography, { component: "label", htmlFor: "email", className: styles.inputLabel, children: "Email" }), _jsx(TextField, { fullWidth: true, id: "email", name: "email", type: "email", placeholder: "juanperez@example.com", value: formData.email, onChange: handleInputChange, required: true })] }), _jsxs("div", { className: styles.inputGroup, children: [_jsx(Typography, { component: "label", htmlFor: "password", className: styles.inputLabel, children: "Password" }), _jsx(TextField, { fullWidth: true, id: "password", name: "password", type: "password", placeholder: "Value" // Placeholder genérico como en tu figma
                                            , value: formData.password, onChange: handleInputChange, required: true })] }), _jsx(Button, { type: "submit", variant: "contained", className: styles.submitButton, sx: { textTransform: 'none' }, children: "Iniciar Sesi\u00F3n" })] }), _jsx("div", { className: styles.logoContainer, children: _jsx(Logo, { className: styles.logo }) })] }) })] }));
}
