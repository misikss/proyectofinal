import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import api from '../services/api';

const DashboardCard = ({ title, value, icon, color, isLoading }) => (
  <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Box
        sx={{
          backgroundColor: `${color}15`,
          borderRadius: '50%',
          p: 1,
          mr: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {React.cloneElement(icon, { sx: { color: color } })}
      </Box>
      <Typography variant="h6" component="div">
        {title}
      </Typography>
    </Box>
    {isLoading ? (
      <CircularProgress size={24} />
    ) : (
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
    )}
  </Paper>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    ventasTotales: 0,
    totalClientes: 0,
    totalProductos: 0,
    totalPedidos: 0,
    ventasMensuales: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [ventasRes, clientesRes, productosRes, ventasMensualesRes] = await Promise.all([
          api.get('/dashboard/total'),
          api.get('/dashboard/clientes'),
          api.get('/dashboard/productos'),
          api.get('/dashboard/mensuales')
        ]);

        setDashboardData({
          ventasTotales: ventasRes.data.total || 0,
          totalClientes: clientesRes.data.total || 0,
          totalProductos: productosRes.data.total || 0,
          totalPedidos: ventasRes.data.cantidad || 0,
          ventasMensuales: ventasMensualesRes.data || []
        });
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        setError('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(value);
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {/* Tarjetas de resumen */}
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Ventas Totales"
            value={formatCurrency(dashboardData.ventasTotales)}
            icon={<TrendingUpIcon />}
            color="#2196f3"
            isLoading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Clientes"
            value={dashboardData.totalClientes}
            icon={<PeopleIcon />}
            color="#4caf50"
            isLoading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Productos"
            value={dashboardData.totalProductos}
            icon={<InventoryIcon />}
            color="#ff9800"
            isLoading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Pedidos"
            value={dashboardData.totalPedidos}
            icon={<ShoppingCartIcon />}
            color="#f50057"
            isLoading={loading}
          />
        </Grid>

        {/* Gráfico de ventas */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Ventas Mensuales"
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Box sx={{ width: '100%', height: 300 }}>
                {loading ? (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                  </Box>
                ) : (
                  <ResponsiveContainer>
                    <LineChart
                      data={dashboardData.ventasMensuales}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Line
                        type="monotone"
                        dataKey="total"
                        name="Ventas"
                        stroke="#2196f3"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 