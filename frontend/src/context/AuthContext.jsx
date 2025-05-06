import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

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
      const response = await axios.get(`${API_URL}/auth/perfil`);
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
      
      const response = await axios.post(`${API_URL}/auth/refresh-token`, {
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
      
      const response = await axios.post(`${API_URL}/auth/login`, {
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
      
      return { success: true };
    } catch (error) {
      console.error('Error en login:', error);
      setError(error.response?.data?.mensaje || 'Error al iniciar sesión');
      setLoading(false);
      return { 
        success: false, 
        message: error.response?.data?.mensaje || 'Error al iniciar sesión'
      };
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

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    refreshAuthToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;