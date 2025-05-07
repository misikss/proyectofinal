import api from './api';

const getAll = async () => {
  const response = await api.get('/categorias');
  return response.data;
};

const getCategoria = async (id) => {
  const response = await api.get(`/categorias/${id}`);
  return response.data;
};

const createCategoria = async (categoria) => {
  const response = await api.post('/categorias', categoria);
  return response.data;
};

const updateCategoria = async (id, categoria) => {
  const response = await api.put(`/categorias/${id}`, categoria);
  return response.data;
};

const deleteCategoria = async (id) => {
  const response = await api.delete(`/categorias/${id}`);
  return response.data;
};

export default {
  getAll,
  getCategoria,
  createCategoria,
  updateCategoria,
  deleteCategoria
};