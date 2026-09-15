import api from '../api/axios';

export const wishlistService = {
  async getWishlist() {
    const response = await api.get('/wishlist/');
    return response.data;
  },

  async addToWishlist(propertyId) {
    const response = await api.post('/wishlist/', { property_id: propertyId });
    return response.data;
  },

  async removeFromWishlist(propertyId) {
    const response = await api.delete(`/wishlist/${propertyId}/`);
    return response.data;
  },
};
