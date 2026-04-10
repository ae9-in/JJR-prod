
import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { Product, CartItem, Order, GlobalState, DeliveryAddress } from '@/types';
import { VERTICALS, PRODUCTS } from '@/data/constants';
import { useAuth } from '@/context/AuthContext';
import { backendService } from '@/services/backendService';
import { orderService } from '@/services/orderService';

export interface AppContextType {
  state: GlobalState;
  logout: () => Promise<void>;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  setActiveVertical: (id: string | null) => void;
  setDeliveryAddress: (address: DeliveryAddress) => void;
  placeOrder: () => Promise<Order | undefined>;
  completeOrder: (order: Order) => void;
  cancelOrder: (orderId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  
  // Initialize cart from localStorage for persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('jj_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Initialize address from localStorage
  const [deliveryAddress, setDeliveryAddressState] = useState<DeliveryAddress | null>(() => {
    try {
      const saved = localStorage.getItem('jj_address');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeVerticalId, setActiveVerticalId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        setOrders([]);
        return;
      }

      try {
        const fetchedOrders = await orderService.getOrderHistory();
        setOrders(fetchedOrders);
      } catch (supabaseError) {
        const fallbackOrders = await backendService.getOrders(user.id);
        setOrders(fallbackOrders);
        console.warn('Falling back to local orders:', supabaseError);
      }
    };

    loadOrders();
  }, [user]);

  useEffect(() => {
    if (!deliveryAddress) {
      localStorage.removeItem('jj_address');
      return;
    }

    localStorage.setItem('jj_address', JSON.stringify(deliveryAddress));
  }, [deliveryAddress]);

  useEffect(() => {
    localStorage.setItem('jj_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
      setCart(prev => {
        const existing = prev.find(p => p.id === product.id);
        if (existing) {
          return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
        }
        return [...prev, { ...product, quantity: 1 }];
      });
  };

  const decreaseQuantity = (productId: string) => {
      setCart(prev => {
        const existing = prev.find(p => p.id === productId);
        if (existing && existing.quantity > 1) {
             return prev.map(p => p.id === productId ? { ...p, quantity: p.quantity - 1 } : p);
        }
        return prev.filter(p => p.id !== productId);
      });
  };

  const removeFromCart = (productId: string) => {
      setCart(prev => prev.filter(p => p.id !== productId));
  };

  const setDeliveryAddress = (address: DeliveryAddress) => {
    setDeliveryAddressState(address);
  };

  const logout = async () => {
      await signOut();
      setOrders([]);
      setDeliveryAddressState(null);
      window.location.hash = '/';
  };

  const placeOrder = async () => {
      if (!user) return undefined;
      setIsLoading(true);
      try {
        let order: Order | undefined;
        
        // Try Supabase first
        try {
          const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const supabaseOrder = await orderService.createOrder(cart, totalAmount);
          if (supabaseOrder) {
            order = supabaseOrder;
          }
        } catch (supabaseError) {
          console.warn('Supabase order creation failed, falling back to local:', supabaseError);
          // Fallback to local backend service
          order = await backendService.placeOrder(user.id, cart);
        }

        if (order) {
          return order;
        } else {
          throw new Error('Failed to create order');
        }
      } catch (e) {
        console.error(e);
        throw e;
      } finally {
        setIsLoading(false);
      }
  };

  const completeOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    setCart([]);
  };

  const cancelOrder = async (orderId: string) => {
    try {
      await orderService.deleteOrder(orderId);
    } catch (supabaseError) {
      await backendService.deleteOrder(orderId);
      console.warn('Falling back to local order deletion:', supabaseError);
    }
  };

  const contextValue = useMemo(() => ({
    state: {
      user,
      cart,
      verticals: VERTICALS,
      products: PRODUCTS,
      orders,
      activeVerticalId,
      isLoading,
      deliveryAddress
    },
    logout,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    setActiveVertical: setActiveVerticalId,
    setDeliveryAddress,
    placeOrder,
    completeOrder,
    cancelOrder
  }), [user, cart, orders, activeVerticalId, isLoading, deliveryAddress]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
