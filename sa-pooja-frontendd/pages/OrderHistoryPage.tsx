import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { History, ArrowLeft, Package, Calendar, DollarSign, Loader } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { orderService } from '../services/orderService';
import { Order } from '../types';
import SacredFrame from '../components/SacredFrame';
import ProductImage from '../components/ProductImage';

const OrderHistoryPage: React.FC = () => {
  const context = useAppContext();
  const { user } = context.state;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch order history on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch from Supabase first
        try {
          const supabaseOrders = await orderService.getOrderHistory();
          setOrders(supabaseOrders);
        } catch (supabaseError) {
          // Fallback to local state if Supabase fails
          console.warn('Failed to fetch from Supabase, using local state:', supabaseError);
          setOrders(context.state.orders);
        }
      } catch (err) {
        console.error('Error fetching order history:', err);
        setError('Failed to load order history');
        // Fallback to context orders
        setOrders(context.state.orders);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, context.state.orders]);

  if (!user) return <Navigate to="/login" />;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLACED':
        return 'text-yellow-400/70';
      case 'PROCESSING':
        return 'text-blue-400/70';
      case 'COMPLETED':
        return 'text-green-400/70';
      case 'FAILED':
        return 'text-red-400/70';
      default:
        return 'text-[#C5A059]/70';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'PLACED':
        return 'bg-yellow-400/10';
      case 'PROCESSING':
        return 'bg-blue-400/10';
      case 'COMPLETED':
        return 'bg-green-400/10';
      case 'FAILED':
        return 'bg-red-400/10';
      default:
        return 'bg-[#C5A059]/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A0303] to-[#0F0101] relative z-10 py-32 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#C5A059]/20 rounded-lg flex items-center justify-center border border-[#C5A059]/30">
              <History size={24} className="text-[#C5A059]" />
            </div>
            <div>
              <h1 className="h1-sacred text-3xl text-[#F5F0E1]">Order History</h1>
              <p className="label-sacred text-[0.55rem] text-[#C5A059] uppercase tracking-[0.2em] mt-1">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
              </p>
            </div>
          </div>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 label-sacred text-[0.55rem] border border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10 transition-all rounded-sm uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {/* Error State */}
        {error && (
          <SacredFrame className="bg-red-900/20 border-red-500/30 p-6 mb-8">
            <p className="body-sacred text-red-300">{error}</p>
          </SacredFrame>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader size={36} className="text-[#C5A059] animate-spin" />
              <p className="body-sacred text-[#E6D5B8]/60">Loading order history...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <SacredFrame className="bg-[#1A0303]/80 p-16 text-center border-[#C5A059]/30">
            <Package size={48} className="mx-auto mb-6 text-[#C5A059]/40" />
            <h2 className="h1-sacred text-2xl text-[#F5F0E1] mb-3">No orders yet</h2>
            <p className="body-sacred text-[#E6D5B8]/60 mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Start exploring our catalog to place your first order.
            </p>
            <a
              href="/#/catalog"
              className="inline-block px-8 py-3 label-sacred text-[0.55rem] bg-[#C5A059]/20 border border-[#C5A059]/50 text-[#C5A059] hover:bg-[#C5A059]/30 transition-all uppercase tracking-widest rounded-sm"
            >
              Browse Catalog
            </a>
          </SacredFrame>
        )}

        {/* Orders List */}
        {!loading && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <SacredFrame
                key={order.id}
                className="bg-[#1A0303]/80 border-[#C5A059]/30 p-8 hover:border-[#C5A059]/50 transition-all backdrop-blur-2xl"
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-[#C5A059]/10">
                  <div className="space-y-3">
                    <p className="label-sacred text-[0.5rem] text-[#C5A059] uppercase tracking-[0.2em]">
                      Order Reference
                    </p>
                    <p className="h1-sacred text-xl text-[#F5F0E1] font-bold">{order.id}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-8">
                    {/* Date */}
                    <div className="space-y-2">
                      <p className="label-sacred text-[0.5rem] text-[#C5A059] uppercase tracking-[0.2em]">
                        Date
                      </p>
                      <div className="flex items-center gap-2 text-[#E6D5B8]">
                        <Calendar size={16} className="text-[#C5A059]/50" />
                        <span className="body-sacred text-sm">{formatDate(order.createdAt)}</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <p className="label-sacred text-[0.5rem] text-[#C5A059] uppercase tracking-[0.2em]">
                        Status
                      </p>
                      <div
                        className={`px-4 py-2 rounded-sm label-sacred text-[0.55rem] font-bold uppercase tracking-widest ${getStatusBgColor(
                          order.status
                        )} ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                      <p className="label-sacred text-[0.5rem] text-[#C5A059] uppercase tracking-[0.2em]">
                        Total Amount
                      </p>
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-[#C5A059]" />
                        <span className="h1-sacred text-lg text-[#C5A059] font-bold">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-8">
                  <p className="label-sacred text-[0.5rem] text-[#C5A059] uppercase tracking-[0.2em] mb-6">
                    Order Items ({order.items.length})
                  </p>
                  <div className="space-y-4">
                    {/* ... (inside the component) */}
                    {order.items.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-3 px-4 bg-[#0F0101]/40 border border-[#C5A059]/10 rounded-sm hover:border-[#C5A059]/30 transition-all gap-4"
                      >
                        <div key={idx} className="w-12 h-12 rounded-full border-2 border-[#1A0303] shadow-lg overflow-hidden bg-[#2D0505] p-1">
                          <ProductImage product={item} imagePath={item.image_path} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1">
                          <p className="h1-sacred text-sm text-[#F5F0E1] font-medium">{item.name}</p>
                          <p className="body-sacred text-[0.75rem] text-[#E6D5B8]/60 mt-1">
                            Qty: {item.quantity} × {formatCurrency(item.price)} = {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="label-sacred text-[0.5rem] text-[#C5A059] uppercase tracking-[0.1em] mb-1">
                            Commission
                          </p>
                          <p className="h1-sacred text-sm text-[#C5A059] font-bold">
                            {item.commissionRate}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Earnings */}
                <div className="mt-8 pt-6 border-t border-[#C5A059]/10 flex items-center justify-between">
                  <p className="label-sacred text-[0.55rem] text-[#C5A059] uppercase tracking-[0.2em]">
                    Your Earnings
                  </p>
                  <p className="h1-sacred text-lg text-[#2D6A4F] font-bold">
                    +{formatCurrency(order.totalEarnings)}
                  </p>
                </div>
              </SacredFrame>
            ))}
          </div>
        )}

        {/* Summary Card */}
        {!loading && orders.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <SacredFrame className="bg-[#1A0303]/80 border-[#C5A059]/30 p-8 text-center">
              <p className="label-sacred text-[0.5rem] text-[#C5A059] uppercase tracking-[0.2em] mb-3">
                Total Orders
              </p>
              <p className="h1-sacred text-3xl text-[#F5F0E1] font-bold">{orders.length}</p>
            </SacredFrame>

            <SacredFrame className="bg-[#1A0303]/80 border-[#C5A059]/30 p-8 text-center">
              <p className="label-sacred text-[0.5rem] text-[#C5A059] uppercase tracking-[0.2em] mb-3">
                Total Spent
              </p>
              <p className="h1-sacred text-2xl text-[#F5F0E1] font-bold">
                {formatCurrency(orders.reduce((sum, o) => sum + o.totalAmount, 0))}
              </p>
            </SacredFrame>

            <SacredFrame className="bg-[#2D6A4F]/20 border-[#2D6A4F]/50 p-8 text-center">
              <p className="label-sacred text-[0.5rem] text-[#2D6A4F] uppercase tracking-[0.2em] mb-3">
                Total Earnings
              </p>
              <p className="h1-sacred text-2xl text-[#4ADE80] font-bold">
                +{formatCurrency(orders.reduce((sum, o) => sum + o.totalEarnings, 0))}
              </p>
            </SacredFrame>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
