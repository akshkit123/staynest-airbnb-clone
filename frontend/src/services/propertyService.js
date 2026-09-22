import api from '../api/axios';

export const propertyService = {
  async getProperties(params = {}) {
    const response = await api.get('/properties/', { params });
    return response.data;
  },

  async getProperty(id) {
    const response = await api.get(`/properties/${id}/`);
    return response.data;
  },

  async createProperty(propertyData) {
    const response = await api.post('/properties/', propertyData);
    return response.data;
  },

  async updateProperty(id, propertyData) {
    const response = await api.put(`/properties/${id}/`, propertyData);
    return response.data;
  },

  async deleteProperty(id) {
    const response = await api.delete(`/properties/${id}/`);
    return response.data;
  },

  async getAvailability(id, checkIn = '', checkOut = '') {
    const params = {};
    if (checkIn && checkOut) {
      params.check_in = checkIn;
      params.check_out = checkOut;
    }
    const response = await api.get(`/properties/${id}/availability/`, { params });
    return response.data;
  },

  async uploadImages(id, formData) {
    const response = await api.post(`/properties/${id}/images/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getAmenities() {
    const response = await api.get('/properties/amenities/');
    return response.data;
  },
};
