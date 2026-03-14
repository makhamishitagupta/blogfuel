import api from './api.js';

export const getAllBlogs = async (tag = '') => {
  const { data } = await api.get('/blog/getAll', {
    params: { tag }
  });
  return data;
};

export const getAllBlogsAdmin = async () => {
  const { data } = await api.get('/blog/admin/getAll');
  return data;
};

export const getBlogById = async (id) => {
  const { data } = await api.get(`/blog/getById/${id}`);
  // { success, blog }
  return data;
};

export const createBlog = async ({ title, content, tags }) => {
  const { data } = await api.post('/blog/create', { title, content, tags });
  return data;
};

export const updateBlog = async (id, { title, content, tags }) => {
  const { data } = await api.put(`/blog/update/${id}`, { title, content, tags });
  return data;
};

export const deleteBlog = async (id) => {
  const { data } = await api.delete(`/blog/delete/${id}`);
  return data;
};

export const searchBlogs = async (query) => {
  const { data } = await api.get('/blog/search', {
    params: { query },
  });
  return data;
};

export const likeBlog = async (id) => {
  const { data } = await api.post(`/blog/${id}/like`);
  return data;
};

export const unlikeBlog = async (id) => {
  const { data } = await api.post(`/blog/${id}/unlike`);
  return data;
};

export const getBlogLikes = async (id) => {
  const { data } = await api.get(`/blog/${id}/likes`);
  return data;
};

export const toggleFavorite = async (id) => {
  const { data } = await api.post(`/blog/${id}/favorite`);
  return data;
};

export const getFavoriteBlogs = async () => {
  const { data } = await api.get('/blog/favorites');
  return data;
};

