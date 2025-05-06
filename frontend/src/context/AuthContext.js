import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar si hay un token en localStorage
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (token) {
      // Configurar el token en los headers de axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Obtener perfil del usuario
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/perfil');
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      
      // Si el token expiró, intentar refresh
      if (error.response && error.response.status === 401) {
        refreshAuthToken();
      } else {
        logout();
        setError('Error al obtener perfil de usuario');
        setLoading(false);
      }
    }
  };

  const refreshAuthToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No hay refresh token');
      }
      
      const response = await axios.post('http://localhost:5000/api/auth/refresh-token', {
        refreshToken
      });
      
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      // Guardar nuevos tokens
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      // Actualizar header de axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Obtener perfil nuevamente
      fetchUserProfile();
    } catch (error) {
      console.error('Error al refrescar token:', error);
      logout();
      setError('Sesión expirada, por favor inicie sesión nuevamente');
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      const { accessToken, refreshToken, usuario } = response.data;
      
      // Guardar tokens
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Configurar axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Actualizar estado
      setUser(usuario);
      setLoading(false);
      
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      setError(error.response?.data?.mensaje || 'Error al iniciar sesión');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    // Eliminar tokens
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    // Eliminar header de axios
    delete axios.defaults.headers.common['Authorization'];
    
    // Actualizar estado
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        refreshAuthToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};