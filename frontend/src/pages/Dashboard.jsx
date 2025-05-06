import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
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

// Datos de ejemplo para el gráfico
const data = [
  { name: 'Ene', ventas: 4000 },
  { name: 'Feb', ventas: 3000 },
  { name: 'Mar', ventas: 2000 },
  { name: 'Abr', ventas: 2780 },
  { name: 'May', ventas: 1890 },
  { name: 'Jun', ventas: 2390 },
];

const DashboardCard = ({ title, value, icon, color }) => (
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
    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
      {value}
    </Typography>
  </Paper>
);

const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {/* Tarjetas de resumen */}
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Ventas Totales"
            value="S/ 15,350"
            icon={<TrendingUpIcon />}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Clientes"
            value="124"
            icon={<PeopleIcon />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Productos"
            value="1,890"
            icon={<InventoryIcon />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Pedidos"
            value="85"
            icon={<ShoppingCartIcon />}
            color="#f50057"
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
                <ResponsiveContainer>
                  <LineChart
                    data={data}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="ventas"
                      stroke="#2196f3"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 