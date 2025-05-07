import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Paper, 
  Link, 
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import authService from '../../../services/authService';

// Esquema de validación
const RegisterSchema = Yup.object().shape({
  nombre: Yup.string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: Yup.string()
    .required('El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: Yup.string()
    .email('Email inválido')
    .required('El email es requerido'),
  password: Yup.string()
    .required('La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
    .required('Confirmar contraseña es requerido')
});

const Register = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      // Preparar datos para el registro
      const userData = {
        nombre: values.nombre,
        apellido: values.apellido,
        email: values.email,
        password: values.password
      };
      
      // Llamar al servicio de registro
      const data = await authService.register(userData);
      
      // Mostrar mensaje de éxito
      setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
      resetForm();
      
      // Opcionalmente, iniciar sesión automáticamente
      // login(data.token, data.user);
      // navigate('/dashboard');
      
      // O redirigir al login después de un tiempo
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
      
    } catch (err) {
      console.error('Error al registrarse:', err);
      setError(err.response?.data?.message || 'Error al registrarse. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
            Nova Salud
          </Typography>
          <Typography component="h2" variant="h6" sx={{ mb: 3 }}>
            Crear Cuenta
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              {success}
            </Alert>
          )}
          
          <Formik
            initialValues={{ 
              nombre: '', 
              apellido: '', 
              email: '', 
              password: '', 
              confirmPassword: '' 
            }}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form style={{ width: '100%' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      margin="normal"
                      fullWidth
                      id="nombre"
                      label="Nombre"
                      name="nombre"
                      autoComplete="given-name"
                      autoFocus
                      error={touched.nombre && Boolean(errors.nombre)}
                      helperText={touched.nombre && errors.nombre}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      margin="normal"
                      fullWidth
                      id="apellido"
                      label="Apellido"
                      name="apellido"
                      autoComplete="family-name"
                      error={touched.apellido && Boolean(errors.apellido)}
                      helperText={touched.apellido && errors.apellido}
                    />
                  </Grid>
                </Grid>
                
                <Field
                  as={TextField}
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                
                <Field
                  as={TextField}
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
                
                <Field
                  as={TextField}
                  margin="normal"
                  fullWidth
                  name="confirmPassword"
                  label="Confirmar Contraseña"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting || loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Registrarse'}
                </Button>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Link component={RouterLink} to="/auth/login" variant="body2">
                    ¿Ya tienes una cuenta? Inicia sesión
                  </Link>
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;