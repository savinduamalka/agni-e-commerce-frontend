import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Cart } from '../lib/cartTypes';
import { toast } from 'sonner';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  getCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<boolean>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const getCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCart(null);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setCart(data.cart);
      } else {
        console.error('Failed to fetch cart:', data.message);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number): Promise<boolean> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please sign in to add items to your cart.');
            return false;
        }

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId, quantity })
        });

        const data = await response.json();
        if (response.ok) {
            setCart(data.cart);
            return true;
        } else {
            toast.error(`Failed to add to cart: ${data.message}`);
            return false;
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('An error occurred while adding the item to the cart.');
        return false;
    }
  };

  const updateCartItem = async (productId: string, quantity: number) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cart/item/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ quantity })
        });

        const data = await response.json();
        if (response.ok) {
            setCart(data.cart);
        } else {
            console.error('Failed to update cart item:', data.message);
        }
    } catch (error) {
        console.error('Error updating cart item:', error);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cart/item/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (response.ok) {
            setCart(data.cart);
        } else {
            console.error('Failed to remove item from cart:', data.message);
        }
    } catch (error) {
        console.error('Error removing item from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cart/clear`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (response.ok) {
            setCart(data.cart);
        } else {
            console.error('Failed to clear cart:', data.message);
        }
    } catch (error) {
        console.error('Error clearing cart:', error);
    }
  };

  useEffect(() => {
    getCart();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        getCart();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <CartContext.Provider value={{ cart, loading, getCart, addToCart, updateCartItem, removeFromCart, clearCart }}>
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
