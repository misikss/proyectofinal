import axios from 'axios';
import api from './api';

const API_URL = import.meta.env.VITE_API_URL || 'https://novasalud.onrender.com/api';

export const ProductosService = {
  obtenerTodos: async (params = {}) => {
    try {
      const response = await api.get('/productos', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener productos' };
    }
  },

  obtenerPorId: async (id) => {
    try {
      const response = await api.get(`/productos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener el producto' };
    }
  },

  crear: async (producto) => {
    try {
      const response = await api.post('/productos', producto);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear el producto' };
    }
  },

  actualizar: async (id, producto) => {
    try {
      const response = await api.put(`/productos/${id}`, producto);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar el producto' };
    }
  },

  eliminar: async (id) => {
    try {
      const response = await api.delete(`/productos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar el producto' };
    }
  },

  obtenerCategorias: async () => {
    try {
      const response = await api.get('/categorias');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener categorías' };
    }
  },

  actualizarStock: async (id, cantidad, tipo = 'entrada') => {
    try {
      const response = await api.patch(`/productos/${id}/stock`, {
        cantidad,
        tipo
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar el stock' };
    }
  },

  buscar: async (termino) => {
    try {
      const response = await api.get('/productos/buscar', {
        params: { q: termino }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al buscar productos' };
    }
  }
};