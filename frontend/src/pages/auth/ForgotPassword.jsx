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
  Alert
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link as RouterLink } from 'react-router-dom';
import authService from '../../services/authService';

// Esquema de validación
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email inválido')
    .required('El email es requerido')
});

const ForgotPassword = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      // Llamar al servicio de recuperación de contraseña
      await authService.forgotPassword(values.email);
      
      // Mostrar mensaje de éxito
      setSuccess('Se ha enviado un correo con instrucciones para restablecer tu contraseña.');
      resetForm();
      
    } catch (err) {
      console.error('Error al solicitar recuperación de contraseña:', err);
      setError(err.response?.data?.message || 'Error al procesar la solicitud. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
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
          <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
            Recuperar Contraseña
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
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
            initialValues={{ email: '' }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form style={{ width: '100%' }}>
                <Field
                  as={TextField}
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting || loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Enviar Instrucciones'}
                </Button>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Link component={RouterLink} to="/auth/login" variant="body2">
                    Volver al inicio de sesión
                  </Link>
                  <Link component={RouterLink} to="/auth/register" variant="body2">
                    Crear una cuenta
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

export default ForgotPassword;