import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verificarToken(token);
    } else {
      setCargando(false);
    }
  }, []);

  const verificarToken = async (token) => {
    try {
      const response = await axios.get('http://localhost:3000/api/auth/verificar', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setUsuario(response.data.usuario);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error al verificar token:', error);
      logout();
    } finally {
      setCargando(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        const { token, usuario } = response.data;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUsuario(usuario);
        return { success: true };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al iniciar sesión'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 