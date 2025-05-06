import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const ProductosService = {
  obtenerTodos: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/productos`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener productos' };
    }
  },

  obtenerPorId: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/productos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener el producto' };
    }
  },

  crear: async (producto) => {
    try {
      const response = await axios.post(`${API_URL}/productos`, producto);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear el producto' };
    }
  },

  actualizar: async (id, producto) => {
    try {
      const response = await axios.put(`${API_URL}/productos/${id}`, producto);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar el producto' };
    }
  },

  eliminar: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/productos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar el producto' };
    }
  },

  obtenerCategorias: async () => {
    try {
      const response = await axios.get(`${API_URL}/categorias`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener categorías' };
    }
  },

  actualizarStock: async (id, cantidad, tipo = 'entrada') => {
    try {
      const response = await axios.patch(`${API_URL}/productos/${id}/stock`, {
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
      const response = await axios.get(`${API_URL}/productos/buscar`, {
        params: { q: termino }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al buscar productos' };
    }
  }
}; 