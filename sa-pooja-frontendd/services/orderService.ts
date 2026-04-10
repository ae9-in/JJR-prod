import { supabase } from '../lib/supabase';
import { CartItem, Order, OrderStatus } from '../types';

/**
 * Order Service - Handles Supabase integration for orders and order_items
 * Respects Row Level Security (RLS) policies for user-specific data
 */

interface OrderItemInsert {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  commission_rate: number;
}

/**
 * Create an order with order items
 * 1. Insert order into orders table
 * 2. Insert related items into order_items table
 * 3. Return the created order
 */
export const createOrder = async (
  cartItems: CartItem[],
  totalAmount: number
): Promise<Order | null> => {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    // Get current authenticated user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    // Allow guest checkout - only log warning if user is not authenticated
    if (authError || !authData.user) {
      console.warn('User not authenticated - allowing guest checkout', authError?.message);
      // Use a guest ID or null - adjust based on your RLS policies
      // For now, continue with guest user
    }

    const userId = authData.user?.id || 'guest-' + Date.now();

    // Calculate total earnings (commission)
    const totalEarnings = cartItems.reduce(
      (sum, item) => sum + (item.price * (item.commissionRate / 100) * item.quantity),
      0
    );

    // Start transaction-like operation
    // 1. Insert order
    const orderPayload: any = {
      user_id: userId,
      total_amount: totalAmount,
      status: 'PLACED',
      created_at: new Date().toISOString(),
    };
    
    // NOTE: total_earnings is not stored at order level
    // Commission is calculated and tracked at order_items level via commission_rate

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert(orderPayload)
      .select()
      .single();

    if (orderError || !orderData) {
      throw new Error(`Failed to create order: ${orderError?.message}`);
    }

    // 2. Insert order items
    const orderItems: OrderItemInsert[] = cartItems.map((item) => ({
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
      commission_rate: item.commissionRate,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(
        orderItems.map((item) => ({
          order_id: orderData.id,
          ...item,
        }))
      );

    if (itemsError) {
      // If items insertion fails, the order is orphaned - this shouldn't happen with proper DB constraints
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    // 3. Return formatted order object
    const order: Order = {
      id: orderData.id,
      userId: userId,
      items: cartItems,
      totalAmount: totalAmount,
      totalEarnings: totalEarnings,
      status: 'PLACED' as OrderStatus,
      createdAt: orderData.created_at,
    };

    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Fetch order history for the current authenticated user
 * Includes nested order_items for each order
 * RLS policies ensure users can only see their own orders
 */
export const getOrderHistory = async (): Promise<Order[]> => {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    // Get current authenticated user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authData.user) {
      throw new Error('User not authenticated');
    }

    const userId = authData.user.id;

    // Fetch orders with related order_items (RLS enforces user_id matching)
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select(
        `
        id,
        user_id,
        total_amount,
        total_earnings,
        status,
        created_at,
        order_items (
          id,
          product_id,
          product_name,
          quantity,
          price,
          commission_rate,
          products (
            image_path
          )
        )
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (ordersError) {
      throw new Error(`Failed to fetch orders: ${ordersError.message}`);
    }

    // Transform Supabase response to Order type
    const orders: Order[] = (ordersData || []).map((dbOrder: any) => {
      // Reconstruct CartItem from order_items
      const items: CartItem[] = (dbOrder.order_items || []).map(
        (item: any): CartItem => ({
          id: item.product_id,
          name: item.product_name,
          quantity: item.quantity,
          price: item.price,
          commissionRate: item.commission_rate,
          // Required CartItem fields with defaults (full product data not stored in order_items)
          verticalId: '',
          description: '',
          image: item.products?.image_path || '',
          image_path: item.products?.image_path,
        })
      );

      return {
        id: dbOrder.id,
        userId: dbOrder.user_id,
        items: items,
        totalAmount: dbOrder.total_amount,
        totalEarnings: dbOrder.total_earnings,
        status: dbOrder.status as OrderStatus,
        createdAt: dbOrder.created_at,
      };
    });

    return orders;
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error;
  }
};

/**
 * Get current authenticated user (helper method)
 */
export const getCurrentUser = async () => {
  if (!supabase) {
    return null;
  }

  const { data: authData, error } = await supabase.auth.getUser();
  if (error || !authData.user) {
    return null;
  }
  return authData.user;
};

export const deleteOrder = async (orderId: string): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const { error: itemsError } = await supabase
    .from('order_items')
    .delete()
    .eq('order_id', orderId);

  if (itemsError) {
    throw new Error(`Failed to delete order items: ${itemsError.message}`);
  }

  const { error: orderError } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId);

  if (orderError) {
    throw new Error(`Failed to delete order: ${orderError.message}`);
  }
};

export const orderService = {
  createOrder,
  getOrderHistory,
  getCurrentUser,
  deleteOrder,
};

export default orderService;
