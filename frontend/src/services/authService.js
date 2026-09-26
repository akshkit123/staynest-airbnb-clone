import api from '../api/axios';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login/', { email, password });
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  async updateProfile(userData) {
    const response = await api.put('/auth/profile/', userData);
    return response.data;
  },
};
