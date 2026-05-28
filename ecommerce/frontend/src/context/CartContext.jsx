import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const { data } = await api.get('/cart');
      setCart(data);
      setCartCount(data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
    } catch {
      setCart(null);
    }
  }, [isAuthenticated]);

  const updateCartCount = (items) => {
    setCartCount(items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
  };

  return (
    <CartContext.Provider value={{ cart, setCart, cartCount, fetchCart, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
