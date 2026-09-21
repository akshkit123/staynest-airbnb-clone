import api from '../api/axios';

export const hostService = {
  async getHostProperties() {
    const response = await api.get('/host/properties/');
    return response.data;
  },

  async getHostBookings() {
    const response = await api.get('/host/bookings/');
    return response.data;
  },

  async getHostEarnings() {
    const response = await api.get('/host/earnings/');
    return response.data;
  },
};
