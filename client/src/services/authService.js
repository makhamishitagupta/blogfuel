import api from './api.js';

export const register = async ({ name, email, password }) => {
  const { data } = await api.post('/user/register', { name, email, password });
  return data;
};

export const login = async ({ email, password }) => {
  const { data } = await api.post('/user/login', { email, password });
  // data: { status, message, token, user: { id, name, email, role } }
  return data;
};

export const googleLogin = async (token) => {
  const { data } = await api.post('/user/google-login', { token });
  // data: { status, message, token, user: { id, name, email, role, picture } }
  return data;
};

export const logout = async () => {
  const { data } = await api.post('/user/logout');
  return data;
};

export const getMe = async () => {
  const { data } = await api.get('/user/me');
  // data: { status: "ok", user: { id, name, email, role } }
  return data;
};

export const updateProfile = async ({ name }) => {
  const { data } = await api.post('/user/update-profile', { name });
  return data;
};

export const deleteProfile = async () => {
  const { data } = await api.delete('/user/delete-profile');
  return data;
};

export const createAdmin = async ({ name, email, password }) => {
  const { data } = await api.post('/user/admin/create', { name, email, password });
  return data;
};

export const addToHistory = async (blogId) => {
  const { data } = await api.post('/user/history', { blogId });
  return data;
};

export const getHistory = async () => {
  const { data } = await api.get('/user/history');
  return data;
};

export const getUserActivity = async () => {
  const { data } = await api.get('/user/activity');
  return data;
};

export const getAdminStats = async () => {
  const { data } = await api.get('/user/admin/stats');
  return data;
};

export const getAdminUsers = async () => {
  const { data } = await api.get('/user/admin/users');
  return data;
};

