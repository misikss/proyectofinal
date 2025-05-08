import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  Alert
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    ventasHoy: 0,
    ventasMes: 0,
    productosTotal: 0,
    productosStockBajo: [],
    ventasPorDia: [],
    productosMasVendidos: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Verificar si hay token
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No hay sesión activa. Por favor, inicie sesión.');
          navigate('/login');
          return;
        }

        console.log('Token:', token);
        
        // Obtener datos del dashboard
        const [
          ventasHoyRes,
          ventasMesRes,
          productosRes,
          stockBajoRes,
          ventasPorDiaRes,
          productosMasVendidosRes
        ] = await Promise.all([
          api.get('/dashboard/total'),
          api.get('/dashboard/mensuales'),
          api.get('/dashboard/productos'),
          api.get('/dashboard/productos/stock-bajo'),
          api.get('/dashboard/mensuales'),
          api.get('/dashboard/productos-mas-vendidos?limite=5')
        ]);
        
        console.log('Respuestas:', {
          ventasHoy: ventasHoyRes.data,
          ventasMes: ventasMesRes.data,
          productos: productosRes.data,
          stockBajo: stockBajoRes.data,
          ventasPorDia: ventasPorDiaRes.data,
          productosMasVendidos: productosMasVendidosRes.data
        });
        
        setDashboardData({
          ventasHoy: ventasHoyRes.data.total || 0,
          ventasMes: ventasMesRes.data[ventasMesRes.data.length - 1]?.total || 0,
          productosTotal: productosRes.data.total || 0,
          productosStockBajo: stockBajoRes.data || [],
          ventasPorDia: ventasPorDiaRes.data.map(item => ({
            dia: new Date(item.mes).getDate(),
            ventas: item.total,
            monto: item.total
          })),
          productosMasVendidos: productosMasVendidosRes.data || []
        });
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        console.error('Detalles del error:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          headers: err.response?.headers
        });
        
        if (err.response?.status === 401) {
          setError('La sesión ha expirado. Por favor, inicie sesión nuevamente.');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          navigate('/login');
        } else {
          setError(`Error al cargar los datos del dashboard: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Colores para gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(value);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Cargando datos del dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard - Nova Salud
      </Typography>
      
      {/* Tarjetas de resumen */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShoppingCartIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Ventas Hoy</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {formatCurrency(dashboardData.ventasHoy)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Ventas del Mes</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {formatCurrency(dashboardData.ventasMes)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InventoryIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Productos</Typography>
              </Box>
              <Typography variant="h4" color="info.main">
                {dashboardData.productosTotal}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WarningIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Stock Bajo</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                {dashboardData.productosStockBajo.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Gráficos y listas */}
      <Grid container spacing={3}>
        {/* Gráfico de ventas por día */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ventas por Día (Mes Actual)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={dashboardData.ventasPorDia}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="monto" 
                  name="Monto de Ventas" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Productos con stock bajo */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Productos con Stock Bajo
            </Typography>
            {dashboardData.productosStockBajo.length > 0 ? (
              <List>
                {dashboardData.productosStockBajo.slice(0, 5).map((producto) => (
                  <ListItem key={producto.id} divider>
                    <ListItemText
                      primary={producto.nombre}
                      secondary={`Stock: ${producto.stock_actual} / Mínimo: ${producto.stock_minimo}`}
                    />
                  </ListItem>
                ))}
                {dashboardData.productosStockBajo.length > 5 && (
                  <Button 
                    fullWidth 
                    sx={{ mt: 1 }}
                    onClick={() => navigate('/inventario?filtro=stock-bajo')}
                  >
                    Ver todos ({dashboardData.productosStockBajo.length})
                  </Button>
                )}
              </List>
            ) : (
              <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
                No hay productos con stock bajo
              </Typography>
            )}
          </Paper>
        </Grid>
        
        {/* Productos más vendidos */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Productos Más Vendidos
            </Typography>
            {dashboardData.productosMasVendidos.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.productosMasVendidos}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="cantidad_vendida"
                    nameKey="nombre"
                    label={({ nombre, cantidad_vendida }) => `${nombre}: ${cantidad_vendida}`}
                  >
                    {dashboardData.productosMasVendidos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [value, props.payload.nombre]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
                No hay datos de ventas disponibles
              </Typography>
            )}
          </Paper>
        </Grid>
        
        {/* Lista de productos más vendidos */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Detalle de Productos Más Vendidos
            </Typography>
            {dashboardData.productosMasVendidos.length > 0 ? (
              <List>
                {dashboardData.productosMasVendidos.map((producto, index) => (
                  <ListItem key={producto.id} divider>
                    <ListItemText
                      primary={`${index + 1}. ${producto.nombre}`}
                      secondary={`Cantidad: ${producto.cantidad_vendida} | Total: ${formatCurrency(producto.monto_total)}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
                No hay datos de ventas disponibles
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Botones de acción rápida */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/ventas/nueva')}
        >
          Nueva Venta
        </Button>
        <Button 
          variant="outlined"
          onClick={() => navigate('/ventas')}
        >
          Ver Ventas
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;