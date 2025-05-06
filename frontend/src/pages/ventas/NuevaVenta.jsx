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
import axios from 'axios';

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
        axios.get('http://localhost:4000/api/clientes', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:4000/api/productos', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      console.log('Productos cargados:', productosRes.data);
      
      const productosActivos = productosRes.data.filter(p => p.activo && p.stock_actual > 0);
      console.log('Productos filtrados:', productosActivos);

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
      setError('La cantidad supera el stock disponible');
      return;
    }

    const precio = parseFloat(productoSeleccionado.precio_venta) || 0;
    const subtotal = precio * cantidad;

    const itemExistente = items.find(item => item.productoId === productoSeleccionado.id);
    if (itemExistente) {
      setItems(items.map(item => 
        item.productoId === productoSeleccionado.id
          ? { 
              ...item, 
              cantidad: item.cantidad + cantidad,
              subtotal: (item.cantidad + cantidad) * precio
            }
          : item
      ));
    } else {
      setItems([...items, {
        productoId: productoSeleccionado.id,
        nombre: productoSeleccionado.nombre,
        precio: precio,
        cantidad,
        subtotal: subtotal
      }]);
    }

    setProductoSeleccionado(null);
    setCantidad(1);
    setError('');
  };

  const eliminarItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    return items.reduce((total, item) => total + (parseFloat(item.subtotal) || 0), 0);
  };

  const guardarVenta = async () => {
    if (!clienteSeleccionado) {
      setError('Seleccione un cliente');
      return;
    }

    if (items.length === 0) {
      setError('Agregue al menos un producto');
      return;
    }

    try {
      const total = calcularTotal();
      const subtotal = total; // En este caso el subtotal es igual al total ya que no manejamos impuestos ni descuentos
      
      await axios.post('http://localhost:4000/api/ventas', {
        id_cliente: clienteSeleccionado.id,
        metodo_pago: 'Efectivo', // Valor por defecto
        detalles: items.map(item => ({
          id_producto: item.productoId,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          subtotal: item.subtotal
        })),
        subtotal: subtotal,
        impuestos: 0, // Por ahora no manejamos impuestos
        descuento: 0, // Por ahora no manejamos descuentos
        total: total
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
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
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={productos}
                getOptionLabel={(producto) => `${producto.nombre} - Stock: ${producto.stock_actual}`}
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
                inputProps={{ min: 1 }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                onClick={agregarItem}
                fullWidth
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
                <TableCell align="right">Precio</TableCell>
                <TableCell align="right">Cantidad</TableCell>
                <TableCell align="right">Subtotal</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell align="right">
                    {new Intl.NumberFormat('es-CL', {
                      style: 'currency',
                      currency: 'CLP'
                    }).format(parseFloat(item.precio) || 0)}
                  </TableCell>
                  <TableCell align="right">{item.cantidad}</TableCell>
                  <TableCell align="right">
                    {new Intl.NumberFormat('es-CL', {
                      style: 'currency',
                      currency: 'CLP'
                    }).format(parseFloat(item.subtotal) || 0)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => eliminarItem(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} align="right">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Total:
                  </Typography>
                </TableCell>
                <TableCell align="right" colSpan={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {new Intl.NumberFormat('es-CL', {
                      style: 'currency',
                      currency: 'CLP'
                    }).format(calcularTotal())}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/ventas')}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={guardarVenta}
            disabled={items.length === 0 || !clienteSeleccionado}
          >
            Guardar Venta
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NuevaVenta; 