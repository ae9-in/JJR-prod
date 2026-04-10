
export enum UserRole {
  USER = 'USER',
  AFFILIATE = 'AFFILIATE',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  referralCode?: string;
  contact?: string;
  joinedAt: string;
}

export interface DeliveryAddress {
  fullName: string;
  mobile: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Vertical {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface Product {
  id: string;
  verticalId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  image_path?: string; // Supabase storage path
  slug?: string; // for local image fallback
  commissionRate: number; // percentage
  variants?: Array<{ name: string; image: string; image_path?: string; slug?: string }>;
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'PLACED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  totalEarnings: number;
  status: OrderStatus;
  createdAt: string;
}

export interface EarningsSummary {
  totalSourced: number;
  totalEarnings: number;
  pendingEarnings: number;
  orderCount: number;
}

export interface GlobalState {
  user: User | null;
  cart: CartItem[];
  verticals: Vertical[];
  products: Product[];
  orders: Order[];
  activeVerticalId: string | null;
  isLoading: boolean;
  deliveryAddress: DeliveryAddress | null;
}
