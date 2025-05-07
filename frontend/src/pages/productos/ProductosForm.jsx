import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { es } from 'date-fns/locale';
import api from '../../services/api';
import { ProductosService } from '../../services/productos.service';

const ProductosForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const isEditing = Boolean(id);

  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    codigo: Yup.string()
      .required('El código es obligatorio')
      .max(20, 'El código no debe exceder los 20 caracteres'),
    nombre: Yup.string()
      .required('El nombre es obligatorio')
      .max(100, 'El nombre no debe exceder los 100 caracteres'),
    descripcion: Yup.string()
      .max(500, 'La descripción no debe exceder los 500 caracteres'),
    id_categoria: Yup.number()
      .required('La categoría es obligatoria'),
    precio_compra: Yup.number()
      .required('El precio de compra es obligatorio')
      .positive('El precio debe ser positivo'),
    precio_venta: Yup.number()
      .required('El precio de venta es obligatorio')
      .positive('El precio debe ser positivo')
      .test(
        'is-greater',
        'El precio de venta debe ser mayor al precio de compra',
        function(value) {
          const { precio_compra } = this.parent;
          return value > precio_compra;
        }
      ),
    stock_actual: Yup.number()
      .required('El stock actual es obligatorio')
      .integer('El stock debe ser un número entero')
      .min(0, 'El stock no puede ser negativo'),
    stock_minimo: Yup.number()
      .required('El stock mínimo es obligatorio')
      .integer('El stock debe ser un número entero')
      .min(0, 'El stock no puede ser negativo'),
    id_proveedor: Yup.number()
      .required('El proveedor es obligatorio'),
    fecha_vencimiento: Yup.date()
      .nullable()
      .min(new Date(), 'La fecha de vencimiento debe ser futura')
  });

  // Configuración de Formik
  const formik = useFormik({
    initialValues: {
      codigo: '',
      nombre: '',
      descripcion: '',
      id_categoria: '',
      precio_compra: '',
      precio_venta: '',
      stock_actual: '',
      stock_minimo: '',
      id_proveedor: '',
      fecha_vencimiento: null,
      activo: true
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        
        if (isEditing) {
          await ProductosService.actualizar(id, values);
          setSnackbar({
            open: true,
            message: 'Producto actualizado correctamente',
            severity: 'success'
          });
        } else {
          await ProductosService.crear(values);
          setSnackbar({
            open: true,
            message: 'Producto creado correctamente',
            severity: 'success'
          });
          formik.resetForm();
        }
      } catch (error) {
        console.error('Error al guardar producto:', error);
        setSnackbar({
          open: true,
          message: `Error al ${isEditing ? 'actualizar' : 'crear'} el producto: ${error.response?.data?.mensaje || 'Error desconocido'}`,
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setInitialLoading(true);
        
        // Cargar categorías y proveedores
        const [categoriasRes, proveedoresRes] = await Promise.all([
          api.get('/categorias'),
          api.get('/proveedores')
        ]);
        
        setCategorias(categoriasRes.data);
        setProveedores(proveedoresRes.data);
        
        // Si estamos editando, cargar datos del producto
        if (isEditing) {
          const producto = await ProductosService.obtenerPorId(id);
          
          formik.setValues({
            codigo: producto.codigo,
            nombre: producto.nombre,
            descripcion: producto.descripcion || '',
            id_categoria: producto.id_categoria,
            precio_compra: producto.precio_compra,
            precio_venta: producto.precio_venta,
            stock_actual: producto.stock_actual,
            stock_minimo: producto.stock_minimo,
            id_proveedor: producto.id_proveedor,
            fecha_vencimiento: producto.fecha_vencimiento ? new Date(producto.fecha_vencimiento) : null,
            activo: producto.activo
          });
        }
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        setSnackbar({
          open: true,
          message: 'Error al cargar datos. Por favor, intente nuevamente.',
          severity: 'error'
        });
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
    if (snackbar.severity === 'success') {
      navigate('/productos');
    }
  };

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }} tabIndex={-1}>
      <Typography variant="h4" gutterBottom>
        {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Información básica */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Información Básica
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="codigo"
                name="codigo"
                label="Código"
                value={formik.values.codigo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.codigo && Boolean(formik.errors.codigo)}
                helperText={formik.touched.codigo && formik.errors.codigo}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="nombre"
                name="nombre"
                label="Nombre"
                value={formik.values.nombre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                helperText={formik.touched.nombre && formik.errors.nombre}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="descripcion"
                name="descripcion"
                label="Descripción"
                multiline
                rows={3}
                value={formik.values.descripcion}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
                helperText={formik.touched.descripcion && formik.errors.descripcion}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth
                error={formik.touched.id_categoria && Boolean(formik.errors.id_categoria)}
              >
                <InputLabel id="categoria-label">Categoría</InputLabel>
                <Select
                  labelId="categoria-label"
                  id="id_categoria"
                  name="id_categoria"
                  value={formik.values.id_categoria}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Categoría"
                >
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.id_categoria && formik.errors.id_categoria && (
                  <FormHelperText>{formik.errors.id_categoria}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth
                error={formik.touched.id_proveedor && Boolean(formik.errors.id_proveedor)}
              >
                <InputLabel id="proveedor-label">Proveedor</InputLabel>
                <Select
                  labelId="proveedor-label"
                  id="id_proveedor"
                  name="id_proveedor"
                  value={formik.values.id_proveedor}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Proveedor"
                >
                  {proveedores.map((proveedor) => (
                    <MenuItem key={proveedor.id} value={proveedor.id}>
                      {proveedor.nombre}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.id_proveedor && formik.errors.id_proveedor && (
                  <FormHelperText>{formik.errors.id_proveedor}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            {/* Precios y Stock */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Precios y Stock
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="precio_compra"
                name="precio_compra"
                label="Precio de Compra"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">S/</InputAdornment>,
                }}
                value={formik.values.precio_compra}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.precio_compra && Boolean(formik.errors.precio_compra)}
                helperText={formik.touched.precio_compra && formik.errors.precio_compra}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="precio_venta"
                name="precio_venta"
                label="Precio de Venta"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">S/</InputAdornment>,
                }}
                value={formik.values.precio_venta}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.precio_venta && Boolean(formik.errors.precio_venta)}
                helperText={formik.touched.precio_venta && formik.errors.precio_venta}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="stock_actual"
                name="stock_actual"
                label="Stock Actual"
                type="number"
                value={formik.values.stock_actual}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.stock_actual && Boolean(formik.errors.stock_actual)}
                helperText={formik.touched.stock_actual && formik.errors.stock_actual}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="stock_minimo"
                name="stock_minimo"
                label="Stock Mínimo"
                type="number"
                value={formik.values.stock_minimo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.stock_minimo && Boolean(formik.errors.stock_minimo)}
                helperText={formik.touched.stock_minimo && formik.errors.stock_minimo}
              />
            </Grid>
            
            {/* Información adicional */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Información Adicional
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DatePicker
                  label="Fecha de Vencimiento"
                  value={formik.values.fecha_vencimiento}
                  onChange={(value) => formik.setFieldValue('fecha_vencimiento', value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={formik.touched.fecha_vencimiento && Boolean(formik.errors.fecha_vencimiento)}
                      helperText={formik.touched.fecha_vencimiento && formik.errors.fecha_vencimiento}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.activo}
                    onChange={(e) => formik.setFieldValue('activo', e.target.checked)}
                    name="activo"
                    color="primary"
                  />
                }
                label="Producto Activo"
              />
            </Grid>
            
            {/* Botones de acción */}
            <Grid item xs={12} sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/productos')}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {isEditing ? 'Actualizar' : 'Guardar'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductosForm;