import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const NuevaVenta = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [clientesRes, productosRes] = await Promise.all([
        api.get('/clientes'),
        api.get('/productos')
      ]);

      const productosActivos = productosRes.data.filter(p => p.activo && p.stock_actual > 0);
      setClientes(clientesRes.data);
      setProductos(productosActivos);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos necesarios');
    }
  };

  const agregarItem = () => {
    if (!productoSeleccionado || cantidad < 1) {
      setError('Seleccione un producto y una cantidad válida');
      return;
    }

    if (cantidad > productoSeleccionado.stock_actual) {
      setError('La cantidad excede el stock disponible');
      return;
    }

    const precio = parseFloat(productoSeleccionado.precio_venta);
    const itemExistente = items.find(item => item.productoId === productoSeleccionado.id);
    
    if (itemExistente) {
      const nuevaCantidad = itemExistente.cantidad + cantidad;
      if (nuevaCantidad > productoSeleccionado.stock_actual) {
        setError('La cantidad total excede el stock disponible');
        return;
      }
      
      setItems(items.map(item =>
        item.productoId === productoSeleccionado.id
          ? {
              ...item,
              cantidad: nuevaCantidad,
              precio: precio,
              subtotal: nuevaCantidad * precio
            }
          : item
      ));
    } else {
      setItems([...items, {
        productoId: productoSeleccionado.id,
        nombre: productoSeleccionado.nombre,
        cantidad: cantidad,
        precio: precio,
        subtotal: cantidad * precio
      }]);
    }

    setProductoSeleccionado(null);
    setCantidad(1);
    setError('');
  };

  const eliminarItem = (productoId) => {
    setItems(items.filter(item => item.productoId !== productoId));
  };

  const calcularTotal = () => {
    return items.reduce((total, item) => total + item.subtotal, 0);
  };

  const handleSubmit = async () => {
    if (!clienteSeleccionado) {
      setError('Debe seleccionar un cliente');
      return;
    }

    if (items.length === 0) {
      setError('Debe agregar al menos un producto');
      return;
    }

    try {
      const total = calcularTotal();
      const subtotal = total;
      
      await api.post('/ventas', {
        id_cliente: clienteSeleccionado.id,
        metodo_pago: 'Efectivo',
        detalles: items.map(item => ({
          id_producto: item.productoId,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          subtotal: item.subtotal
        })),
        subtotal: subtotal,
        impuestos: 0,
        descuento: 0,
        total: total
      });

      navigate('/ventas');
    } catch (error) {
      console.error('Error al guardar la venta:', error);
      setError('Error al guardar la venta');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Nueva Venta
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Autocomplete
                options={clientes}
                getOptionLabel={(cliente) => `${cliente.nombre} ${cliente.apellido || ''}`}
                value={clienteSeleccionado}
                onChange={(_, newValue) => setClienteSeleccionado(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Cliente" required />
                )}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={productos}
                getOptionLabel={(producto) => producto.nombre}
                value={productoSeleccionado}
                onChange={(_, newValue) => setProductoSeleccionado(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Producto" />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                type="number"
                label="Cantidad"
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
                fullWidth
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={agregarItem}
                fullWidth
                sx={{ height: '100%' }}
              >
                Agregar
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell align="right">Cantidad</TableCell>
                <TableCell align="right">Precio</TableCell>
                <TableCell align="right">Subtotal</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.productoId}>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell align="right">{item.cantidad}</TableCell>
                  <TableCell align="right">${parseFloat(item.precio).toFixed(2)}</TableCell>
                  <TableCell align="right">${parseFloat(item.subtotal).toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="error"
                      onClick={() => eliminarItem(item.productoId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} align="right">
                  <strong>Total:</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>S/ {calcularTotal().toFixed(2)}</strong>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={items.length === 0 || !clienteSeleccionado}
          >
            Registrar Venta
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NuevaVenta; 