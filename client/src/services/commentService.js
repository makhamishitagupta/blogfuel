import api from './api.js';

export const getComments = async (blogId) => {
  const { data } = await api.get(`/comment/${blogId}`);
  return data.comments;
};

export const createComment = async (blogId, { text }) => {
  const { data } = await api.post(`/comment/${blogId}`, { text });
  return data;
};

export const updateComment = async (blogId, commentId, { text }) => {
  const { data } = await api.put(`/comment/${blogId}/${commentId}`, { text });
  return data;
};

export const deleteComment = async (blogId, commentId) => {
  const { data } = await api.delete(`/comment/${blogId}/${commentId}`);
  return data;
};

export const getAllCommentsAdmin = async () => {
  const { data } = await api.get('/comment/admin/all');
  return data.comments;
};

export const getMyComments = async () => {
  const { data } = await api.get('/user/my-comments');
  return data.comments;
};

