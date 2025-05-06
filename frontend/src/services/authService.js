import api from './api';

const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

const resetPassword = async (token, newPassword) => {
  const response = await api.post('/auth/reset-password', { token, newPassword });
  return response.data;
};

const refreshToken = async (refreshToken) => {
  const response = await api.post('/auth/refresh-token', { refreshToken });
  return response.data;
};

const getPerfil = async () => {
  const response = await api.get('/auth/perfil');
  return response.data;
};

const updatePerfil = async (userData) => {
  const response = await api.put('/auth/perfil', userData);
  return response.data;
};

const changePassword = async (currentPassword, newPassword) => {
  const response = await api.post('/auth/change-password', { currentPassword, newPassword });
  return response.data;
};

const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export default {
  login,
  register,
  forgotPassword,
  resetPassword,
  refreshToken,
  getPerfil,
  updatePerfil,
  changePassword,
  logout
};