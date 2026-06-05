import api from './api';

export const authService = {
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    return data.data; // { user }
  },

  logout: async () => {
    const { data } = await api.post('/auth/logout');
    return data;
  },

  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data.data; // { user }
  },
};
