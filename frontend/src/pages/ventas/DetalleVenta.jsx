import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import axios from 'axios';

const DetalleVenta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDetalleVenta();
  }, [id]);

  const cargarDetalleVenta = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/ventas/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setVenta(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar detalle de venta:', error);
      setError('Error al cargar los detalles de la venta');
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(monto);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Alert severity="error">{error}</Alert>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/ventas')}
            sx={{ mt: 2 }}
          >
            Volver a Ventas
          </Button>
        </Box>
      </Container>
    );
  }

  if (!venta) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Alert severity="warning">Venta no encontrada</Alert>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/ventas')}
            sx={{ mt: 2 }}
          >
            Volver a Ventas
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Detalle de Venta #{venta.id}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/ventas')}
          >
            Volver
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Información General
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography><strong>Fecha:</strong> {formatearFecha(venta.fecha)}</Typography>
                <Typography><strong>Estado:</strong> {venta.estado}</Typography>
                <Typography><strong>Método de Pago:</strong> {venta.metodo_pago}</Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Información del Cliente
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography>
                  <strong>Nombre:</strong> {venta.cliente ? `${venta.cliente.nombre} ${venta.cliente.apellido}` : 'N/A'}
                </Typography>
                <Typography>
                  <strong>Documento:</strong> {venta.cliente ? `${venta.cliente.tipo_documento}: ${venta.cliente.documento}` : 'N/A'}
                </Typography>
                <Typography>
                  <strong>Teléfono:</strong> {venta.cliente?.telefono || 'N/A'}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ mt: 2 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell align="right">Precio Unitario</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {venta.detalles.map((detalle) => (
                      <TableRow key={detalle.id}>
                        <TableCell>{detalle.producto.nombre}</TableCell>
                        <TableCell align="right">
                          {formatearMoneda(detalle.precio_unitario)}
                        </TableCell>
                        <TableCell align="right">{detalle.cantidad}</TableCell>
                        <TableCell align="right">
                          {formatearMoneda(detalle.subtotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} />
                      <TableCell align="right">
                        <Typography variant="subtitle1" fontWeight="bold">
                          Subtotal:
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {formatearMoneda(venta.subtotal)}
                      </TableCell>
                    </TableRow>
                    {venta.impuestos > 0 && (
                      <TableRow>
                        <TableCell colSpan={2} />
                        <TableCell align="right">
                          <Typography variant="subtitle1" fontWeight="bold">
                            Impuestos:
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          {formatearMoneda(venta.impuestos)}
                        </TableCell>
                      </TableRow>
                    )}
                    {venta.descuento > 0 && (
                      <TableRow>
                        <TableCell colSpan={2} />
                        <TableCell align="right">
                          <Typography variant="subtitle1" fontWeight="bold">
                            Descuento:
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          {formatearMoneda(venta.descuento)}
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell colSpan={2} />
                      <TableCell align="right">
                        <Typography variant="h6" fontWeight="bold">
                          Total:
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" fontWeight="bold">
                          {formatearMoneda(venta.total)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DetalleVenta; 