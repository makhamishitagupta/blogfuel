import api from './api.js';

export const getAnnouncements = async () => {
  const { data } = await api.get('/announcement/viewAll');
  return data.announcements;
};

export const createAnnouncement = async ({ title, content, important }) => {
  const { data } = await api.post('/announcement/create', { title, content, important });
  return data;
};

export const updateAnnouncement = async (id, payload) => {
  const { data } = await api.put(`/announcement/update/${id}`, payload);
  return data;
};

export const deleteAnnouncement = async (id) => {
  const { data } = await api.delete(`/announcement/delete/${id}`);
  return data;
};

