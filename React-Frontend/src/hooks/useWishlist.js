import { useState, useEffect } from 'react';

export function useWishlist() {
  const [wishlistIds, setWishlistIds] = useState([]);

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        setWishlistIds(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Failed to load wishlist from localStorage:', error);
      setWishlistIds([]);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const addToWishlist = (gameId) => {
    setWishlistIds(prev => {
      if (prev.includes(gameId)) {
        return prev;
      }
      return [...prev, gameId];
    });
  };

  const removeFromWishlist = (gameId) => {
    setWishlistIds(prev => prev.filter(id => id !== gameId));
  };

  const isInWishlist = (gameId) => {
    return wishlistIds.includes(gameId);
  };

  const toggleWishlist = (gameId) => {
    if (isInWishlist(gameId)) {
      removeFromWishlist(gameId);
    } else {
      addToWishlist(gameId);
    }
  };

  return {
    wishlistIds,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist
  };
}