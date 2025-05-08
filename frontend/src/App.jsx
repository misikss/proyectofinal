import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

// Páginas
import Login from './pages/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Productos from './pages/productos/Productos';
import ProductosForm from './pages/productos/ProductosForm';
import Ventas from './pages/ventas/Ventas';
import NuevaVenta from './pages/ventas/NuevaVenta';
import DetalleVenta from './pages/ventas/DetalleVenta';
import Clientes from './pages/clientes/Clientes';
import Proveedores from './pages/proveedores/Proveedores';
import Usuarios from './pages/usuarios/Usuarios';

// Layouts
import MainLayout from './layouts/MainLayout';

const ProtectedRoute = ({ children, requiereAdmin = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiereAdmin && user.rol !== 'administrador') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="productos" element={<Productos />} />
        <Route path="productos/nuevo" element={<ProductosForm />} />
        <Route path="productos/editar/:id" element={<ProductosForm />} />
        <Route path="ventas" element={<Ventas />} />
        <Route path="ventas/nueva" element={<NuevaVenta />} />
        <Route path="ventas/:id" element={<DetalleVenta />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="proveedores" element={<Proveedores />} />
        <Route path="usuarios" element={
          <ProtectedRoute requiereAdmin={true}>
            <Usuarios />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
