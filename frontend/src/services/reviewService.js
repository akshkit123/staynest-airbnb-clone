import api from '../api/axios';

export const reviewService = {
  async getPropertyReviews(propertyId) {
    const response = await api.get(`/properties/${propertyId}/reviews/`);
    return response.data;
  },

  async addReview(propertyId, reviewData) {
    const response = await api.post(`/properties/${propertyId}/reviews/`, reviewData);
    return response.data;
  },
};
