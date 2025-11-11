import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
} from '@mui/material';
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

  const [error, setError] = useState<string | null>(null);
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Limpia errores anteriores

    const dataParaBackend = {
      email: formData.email,
      password: formData.password,
    };

    console.log('Enviando al backend:', dataParaBackend);

    try {
      // ¡TODA LA LÓGICA DE LOGIN VA AQUÍ!
      const response = await api.post(
        '/auth/login', // La URL base ya está en 'api'
        dataParaBackend
      );
      
      const { token, user } = response.data;
      
      login(token, user); // Guardamos en el contexto
      
      navigate('/'); // Enviamos a la página principal

    } catch (err: any) {
      console.error('Error de login:', err);
      // Mostramos un error genérico al usuario
      setError('Email o contraseña incorrectos. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className={styles.container}>
      
      {/* --- IMAGEN A LA IZQUIERDA --- */}
      {/* Este va primero en el JSX para que quede a la izquierda */}
      <div 
        className={styles.backgroundSection}
        style={{
          backgroundImage: `url(${fondoLogin})`
        }}
      />

      {/* --- FORMULARIO A LA DERECHA --- */}
      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          
          <Typography variant="h4" fontWeight={600} className={styles.title}>
            Iniciar sesión
          </Typography>
          
          <div className={styles.registerLink}> {/* Link a Registro */}
            <Typography component="span" color="text.secondary">
              ¿Aún no tienes una cuenta?{' '}
            </Typography>
            <Link href="/register" underline="hover" color="#43A047">
              Regístrate
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {/* Usamos el mismo patrón de 'label' + 'TextField' del registro */}
            <div className={styles.inputGroup}>
              <Typography component="label" htmlFor="email" className={styles.inputLabel}>
                Email
              </Typography>
              <TextField
                fullWidth
                id="email"
                name="email"
                type="email"
                placeholder="juanperez@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <Typography component="label" htmlFor="password" className={styles.inputLabel}>
                Password
              </Typography>
              <TextField
                fullWidth
                id="password"
                name="password"
                type="password"
                placeholder="Value" // Placeholder genérico como en tu figma
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {/* <div className={styles.forgotPasswordLink}>
              <Link href="/forgot-password" underline="hover" color="#43A047">
                Forgot password?
              </Link>
            </div> */}

            <Button
              type="submit"
              variant="contained"
              className={styles.submitButton}
              sx={{ textTransform: 'none' }} // Para que diga "Sign In" y no "SIGN IN"
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className={styles.logoContainer}>
            <Logo className={styles.logo} />
          </div>
        </div>
      </div>
    </div>
  );
}