import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      setFavoriteIds(new Set());
      return;
    }

    try {
      setLoading(true);
      const data = await wishlistService.getWishlist();
      const items = data.results || data || [];
      setWishlistItems(items);
      const ids = new Set(items.map((item) => item.property.id));
      setFavoriteIds(ids);
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const toggleWishlist = async (property) => {
    if (!isAuthenticated) {
      return false; // Indicating user should log in
    }

    const propId = property.id;
    const isFav = favoriteIds.has(propId);

    // Optimistic UI update
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (isFav) {
        next.delete(propId);
      } else {
        next.add(propId);
      }
      return next;
    });

    try {
      if (isFav) {
        await wishlistService.removeFromWishlist(propId);
        setWishlistItems((prev) => prev.filter((item) => item.property.id !== propId));
      } else {
        const newItem = await wishlistService.addToWishlist(propId);
        setWishlistItems((prev) => [newItem, ...prev]);
      }
      return true;
    } catch (err) {
      console.error('Failed to toggle wishlist', err);
      // Revert optimistic update
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (isFav) {
          next.add(propId);
        } else {
          next.delete(propId);
        }
        return next;
      });
      return false;
    }
  };

  const isFavorited = (propertyId) => favoriteIds.has(Number(propertyId));

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        favoriteIds,
        loading,
        fetchWishlist,
        toggleWishlist,
        isFavorited,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
