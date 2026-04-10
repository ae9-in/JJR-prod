
import { User, UserRole, Order, OrderStatus, CartItem } from '../types';

const STORAGE_KEYS = {
  USERS: 'jj_users',
  ORDERS: 'jj_orders',
  SESSION: 'jj_session'
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const backendService = {
  // Authentication & Accounts
  async register(name: string, email: string, contact: string): Promise<User> {
    await delay(800);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    if (users.find((u: User) => u.email === email)) {
      throw new Error('Email already registered');
    }

    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      email,
      name,
      contact,
      role: UserRole.AFFILIATE,
      referralCode: 'JAN-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
      joinedAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setSession(newUser);
    return newUser;
  },

  async login(email: string): Promise<User> {
    await delay(600);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find((u: User) => u.email === email);
    if (!user) {
      // For Phase 1 demo, if not found, let's create a default one to make it easy to test
      return this.register("Demo Partner", email, "9876543210");
    }
    this.setSession(user);
    return user;
  },

  setSession(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  },

  getSession(): User | null {
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    return session ? JSON.parse(session) : null;
  },

  // Order Placement & Tracking
  async placeOrder(userId: string, items: CartItem[]): Promise<Order> {
    await delay(1000);
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalEarnings = items.reduce((sum, item) => sum + (item.price * (item.commissionRate / 100) * item.quantity), 0);
    
    const newOrder: Order = {
      id: 'JJ-SRC-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      userId,
      items,
      totalAmount,
      totalEarnings,
      status: 'PLACED',
      createdAt: new Date().toISOString()
    };

    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return newOrder;
  },

  async getOrders(userId: string): Promise<Order[]> {
    await delay(400);
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    return orders.filter((o: Order) => o.userId === userId);
  },

  async deleteOrder(orderId: string): Promise<void> {
    await delay(200);
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const filteredOrders = orders.filter((order: Order) => order.id !== orderId);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(filteredOrders));
  }
};
