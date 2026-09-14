import api from '../api/axios';

export const bookingService = {
  async createBooking(bookingData) {
    const response = await api.post('/bookings/', bookingData);
    return response.data;
  },

  async getMyBookings() {
    const response = await api.get('/bookings/');
    return response.data;
  },

  async getBooking(id) {
    const response = await api.get(`/bookings/${id}/`);
    return response.data;
  },

  async updateBooking(id, data) {
    const response = await api.put(`/bookings/${id}/`, data);
    return response.data;
  },

  async cancelBooking(id) {
    const response = await api.put(`/bookings/${id}/`, { status: 'cancelled' });
    return response.data;
  },
};
