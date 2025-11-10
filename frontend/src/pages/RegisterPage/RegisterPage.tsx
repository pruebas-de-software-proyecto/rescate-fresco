import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,     // <-- AÑADE ESTE
  InputLabel,      // <-- AÑADE ESTE
  OutlinedInput,   // <-- AÑADE ESTE
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import styles from './RegisterPage.module.css';
import logoRescateFrecoVerde from '../../assets/images/logo.svg';
import fondoConsumidor from '../../assets/images/fondo_consumidor.png';
import fondoTienda from '../../assets/images/fondo_tienda.png';
import Logo from '../../components/Logo';

export default function RegisterPage() {
  const [role, setRole] = useState<'consumidor' | 'tienda'>('consumidor');// Queda seteado por defecto el rol de consumidor
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombreConsumidor: '',
    nombreTienda: '',
  });

  const handleRoleChange = (event: React.MouseEvent<HTMLElement>, newRole: 'consumidor' | 'tienda',) => {
      if (newRole !== null) {
        setRole(newRole);
      }
    };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    let dataParaBackend;
    
    if (role === 'consumidor') {
      dataParaBackend = {
        role: 'CONSUMIDOR',
        email: formData.email,
        password: formData.password,
        nombre: formData.nombreConsumidor,
      };
    } else {
      dataParaBackend = {
        role: 'TIENDA',
        email: formData.email,
        password: formData.password,
        nombreTienda: formData.nombreTienda,
      };
    }

    console.log('Enviando al backend:', dataParaBackend);
  };
  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <Typography variant="h4" fontWeight={600} className={styles.title}>
            Regístrate
          </Typography>
          
          <div className={styles.loginLink}>
            <Typography component="span" color="text.secondary">
              ¿Ya tienes una cuenta?{' '}
            </Typography>
            <Link href="/login" underline="hover" color= "#43A047">
              Inicia sesión
            </Link>
          </div>

          <ToggleButtonGroup
            value={role}
            exclusive
            onChange={handleRoleChange}
            fullWidth
            className={styles.toggleButtons}

          >
            <ToggleButton 
              value="consumidor"
              className={role === 'consumidor' ? styles.toggleButtonSelected : styles.toggleButton}
              sx={{ textTransform: 'none' }}
            >
              <ShoppingBagOutlinedIcon  />
              Quiero Comprar
            </ToggleButton>
            <ToggleButton 
              value="tienda"
              className={role === 'tienda' ? styles.toggleButtonSelected : styles.toggleButton}
              sx={{ textTransform: 'none' }}
            >
              <StorefrontOutlinedIcon/>
              Quiero Vender
            </ToggleButton>
          </ToggleButtonGroup>

          <form onSubmit={handleSubmit}>
            
            {role === 'consumidor' ? (
              <div className={styles.inputGroup}>
                <Typography component="label" htmlFor="nombreConsumidor" className={styles.inputLabel}>
                  Nombre
                </Typography>
                <TextField
                  fullWidth
                  id="nombreConsumidor"
                  name="nombreConsumidor"
                  placeholder="Juan" // <-- Usamos placeholder
                  value={formData.nombreConsumidor}
                  onChange={handleInputChange}
                  required
                />
              </div>
            ) : (
              <div className={styles.inputGroup}>
                <Typography component="label" htmlFor="nombreTienda" className={styles.inputLabel}>
                  Nombre de la tienda
                </Typography>
                <TextField
                  fullWidth
                  id="nombreTienda"
                  name="nombreTienda"
                  placeholder="Pastelería Rosa" // <-- Usamos placeholder
                  value={formData.nombreTienda}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <div className={styles.inputGroup}>
              <Typography component="label" htmlFor="email" className={styles.inputLabel}>
                Email
              </Typography>
              <TextField
                fullWidth
                id="email"
                name="email"
                type="email"
                placeholder="juanperez@example.com" // <-- Usamos placeholder
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <Typography component="label" htmlFor="password" className={styles.inputLabel}>
                Contraseña
              </Typography>
              <TextField
                fullWidth
                id="password"
                name="password"
                type="password"
                placeholder="Value" // <-- Placeholder (o déjalo vacío)
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button
              type="submit"
              variant="contained"
              className={styles.submitButton}
              sx={{ textTransform: 'none' }}
            >
              Registrarse
            </Button>
          </form>

          <div className={styles.logoContainer}>
            <Logo className={styles.logo} />
          </div>
        </div>
      </div>

      <div 
        className={styles.backgroundSection}
        style={{
          backgroundImage: `url(${role === 'consumidor' ? fondoConsumidor : fondoTienda})`
        }}
      />
    </div>
  );
}