import api from '../api/axios';

export const adminService = {
  async getUsers(params = {}) {
    const response = await api.get('/auth/admin/users/', { params });
    return response.data;
  },

  async deleteUser(id) {
    const response = await api.delete(`/auth/admin/users/${id}/`);
    return response.data;
  },

  async updateUserRole(id, role) {
    const response = await api.patch(`/auth/admin/users/${id}/`, { role });
    return response.data;
  },

  async getProperties(params = {}) {
    const response = await api.get('/admin/properties/', { params });
    return response.data;
  },

  async deleteProperty(id) {
    const response = await api.delete(`/properties/${id}/`);
    return response.data;
  },

  async getBookings() {
    const response = await api.get('/admin/bookings/');
    return response.data;
  },

  async getStats() {
    const response = await api.get('/admin/stats/');
    return response.data;
  },
};
