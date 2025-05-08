import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Paper, 
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import categoriasService from '../../../services/categoriasService';

// Esquema de validación
const CategoriaSchema = Yup.object().shape({
  nombre: Yup.string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no debe exceder los 50 caracteres'),
  descripcion: Yup.string()
    .max(200, 'La descripción no debe exceder los 200 caracteres')
});

const CategoriasForm = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    nombre: '',
    descripcion: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();
  
  useEffect(() => {
    const fetchCategoria = async () => {
      if (id) {
        try {
          setLoading(true);
          const data = await categoriasService.getCategoria(id);
          setInitialValues({
            nombre: data.nombre || '',
            descripcion: data.descripcion || ''
          });
          setIsEditing(true);
        } catch (err) {
          console.error('Error al obtener la categoría:', err);
          setError('No se pudo cargar la información de la categoría');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchCategoria();
  }, [id]);
  
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      if (isEditing) {
        await categoriasService.updateCategoria(id, values);
        setSuccess('Categoría actualizada exitosamente');
      } else {
        await categoriasService.createCategoria(values);
        setSuccess('Categoría creada exitosamente');
        resetForm();
      }
      
      // Redirigir después de un tiempo
      setTimeout(() => {
        navigate('/categorias');
      }, 2000);
      
    } catch (err) {
      console.error('Error al guardar la categoría:', err);
      setError(err.response?.data?.message || 'Error al procesar la solicitud. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/categorias');
  };

  if (loading && isEditing) {
    return (
      <Container component="main" maxWidth="sm">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
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
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
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
            initialValues={initialValues}
            validationSchema={CategoriaSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched, isSubmitting }) => (
              <Form style={{ width: '100%' }}>
                <Field
                  as={TextField}
                  margin="normal"
                  fullWidth
                  id="nombre"
                  label="Nombre de la Categoría"
                  name="nombre"
                  autoFocus
                  error={touched.nombre && Boolean(errors.nombre)}
                  helperText={touched.nombre && errors.nombre}
                />
                
                <Field
                  as={TextField}
                  margin="normal"
                  fullWidth
                  id="descripcion"
                  label="Descripción"
                  name="descripcion"
                  multiline
                  rows={4}
                  error={touched.descripcion && Boolean(errors.descripcion)}
                  helperText={touched.descripcion && errors.descripcion}
                />
                
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={handleCancel}
                    >
                      Cancelar
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={isSubmitting || loading}
                    >
                      {loading ? <CircularProgress size={24} /> : (isEditing ? 'Actualizar' : 'Guardar')}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </Container>
  );
};

export default CategoriasForm;