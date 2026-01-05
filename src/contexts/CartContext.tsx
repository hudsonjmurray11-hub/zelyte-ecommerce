import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '../services/cartService';
import { OrderItem } from '../config/supabase';
import { trackAddToCart } from '../utils/analytics';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  flavor?: string;
  bundleType?: string;
  image?: string;
  variantId?: string;
  productId?: string;
  handle?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Local storage key for guest cart persistence
const LOCAL_CART_STORAGE_KEY = 'zelyte-local-cart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart when user changes or component mounts
  useEffect(() => {
    loadCart();
  }, [user]);

  // Sync cart items to storage/database whenever they change
  useEffect(() => {
    if (cartItems.length > 0) {
      syncCart();
    }
  }, [cartItems, user]);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      
      if (user) {
        // Load cart from Supabase for logged-in users
        const { data } = await cartService.getCart(user.id);
        
        if (data && data.items) {
          setCartItems(data.items as CartItem[]);
        } else {
          // Check if there's a local cart to migrate
          const localCart = localStorage.getItem(LOCAL_CART_STORAGE_KEY);
          if (localCart) {
            const parsedCart = JSON.parse(localCart);
            setCartItems(parsedCart);
            // Migrate to database
            await cartService.upsertCart(user.id, parsedCart);
            // Clear local storage after migration
            localStorage.removeItem(LOCAL_CART_STORAGE_KEY);
          } else {
            setCartItems([]);
          }
        }
      } else {
        // Load from localStorage for guests
        const savedCart = localStorage.getItem(LOCAL_CART_STORAGE_KEY);
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
        } else {
          setCartItems([]);
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const syncCart = async () => {
    if (user) {
      // Sync to Supabase for logged-in users
      await cartService.upsertCart(user.id, cartItems as OrderItem[]);
    } else {
      // Sync to localStorage for guests
      if (cartItems.length > 0) {
        localStorage.setItem(LOCAL_CART_STORAGE_KEY, JSON.stringify(cartItems));
      } else {
        localStorage.removeItem(LOCAL_CART_STORAGE_KEY);
      }
    }
  };

  const refreshCart = async () => {
    await loadCart();
  };

  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
    try {
      setIsLoading(true);
      
      setCartItems(prevItems => {
        // Check if item already exists in cart (by id and flavor)
        const existingItemIndex = prevItems.findIndex(
          cartItem => cartItem.id === item.id && cartItem.flavor === item.flavor
        );

        if (existingItemIndex > -1) {
          // Item exists, increment quantity
          const newItems = [...prevItems];
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + 1
          };
          // Track analytics
          trackAddToCart(item.id, item.name, item.price, newItems[existingItemIndex].quantity);
          return newItems;
        } else {
          // New item, add to cart
          // Track analytics
          trackAddToCart(item.id, item.name, item.price, 1);
          return [...prevItems, { ...item, quantity: 1 }];
        }
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Unable to add item to cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      setIsLoading(true);
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      setIsLoading(true);
      
      if (quantity <= 0) {
        await removeFromCart(id);
        return;
      }
      
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      setCartItems([]);
      
      if (user) {
        await cartService.clearCart(user.id);
      } else {
        localStorage.removeItem(LOCAL_CART_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      isLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
