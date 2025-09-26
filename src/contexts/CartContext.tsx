import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ShopifyService } from '../services/shopifyService';
import { LocalCartItem, ShopifyCart } from '../types/shopify';

export interface CartItem extends LocalCartItem {}

interface CartContextType {
  cartItems: CartItem[];
  cart: ShopifyCart | null;
  isLoading: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getCheckoutUrl: () => Promise<string>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart on component mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const shopifyCart = await ShopifyService.getOrCreateCart();
      if (shopifyCart) {
        setCart(shopifyCart);
        const localItems = ShopifyService.convertCartToLocalItems(shopifyCart);
        setCartItems(localItems);
      } else {
        // Fallback to empty cart if Shopify is unavailable
        setCartItems([]);
        setCart(null);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      // Fallback to empty cart
      setCartItems([]);
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCart = async () => {
    await loadCart();
  };

  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
    try {
      setIsLoading(true);
      
      // If we don't have a cart yet, create one
      let currentCart = cart;
      if (!currentCart) {
        currentCart = await ShopifyService.getOrCreateCart();
        if (!currentCart) {
          throw new Error('Unable to create cart. Please try again.');
        }
        setCart(currentCart);
      }

      // Find the variant ID - this is a simplified approach
      // In a real app, you'd want to match by product handle and variant options
      const variantId = item.variantId || `gid://shopify/ProductVariant/${item.id}`;
      
      // Add to Shopify cart
      const updatedCart = await ShopifyService.addToCart(currentCart.id, variantId, 1);
      setCart(updatedCart);
      
      // Convert to local items
      const localItems = ShopifyService.convertCartToLocalItems(updatedCart);
      setCartItems(localItems);
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Show user-friendly error message
      alert('Unable to add item to cart. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      setIsLoading(true);
      
      if (!cart) return;
      
      const updatedCart = await ShopifyService.removeFromCart(cart.id, id);
      setCart(updatedCart);
      
      const localItems = ShopifyService.convertCartToLocalItems(updatedCart);
      setCartItems(localItems);
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
      
      if (!cart) return;
      
      if (quantity <= 0) {
        await removeFromCart(id);
        return;
      }
      
      const updatedCart = await ShopifyService.updateCartLines(cart.id, id, quantity);
      setCart(updatedCart);
      
      const localItems = ShopifyService.convertCartToLocalItems(updatedCart);
      setCartItems(localItems);
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalPrice = () => {
    if (cart) {
      return parseFloat(cart.cost.totalAmount.amount);
    }
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    if (cart) {
      return cart.totalQuantity;
    }
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCheckoutUrl = async () => {
    return await ShopifyService.getCheckoutUrl();
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cart,
      isLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalPrice,
      getTotalItems,
      getCheckoutUrl,
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