
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
  Package, TrendingUp, History, User as UserIcon, LogOut, ChevronRight, ArrowRight, Zap, Target
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getTacticalInsights } from '../services/geminiService';
import SacredFrame from '../components/SacredFrame';
import ProductImage from '../components/ProductImage';

const Dashboard: React.FC = () => {
  const context = useAppContext();
  const location = useLocation();
  const [sourcingIntel, setSourcingIntel] = useState<any>(null);
  const [loadingIntel, setLoadingIntel] = useState(false);

  const isCartView = location.pathname === '/cart';
  const { user, orders, cart } = context.state;

  useEffect(() => {
    if (user && !isCartView) {
      setLoadingIntel(true);

      // Gather context: Cart items + Recent Order items
      const recentHistory = orders.flatMap(o => o.items.map(i => i.name)).slice(0, 3);
      const cartContext = cart.map(c => c.name);
      const combinedContext = [...new Set([...cartContext, ...recentHistory])];

      getTacticalInsights(combinedContext).then(res => {
        setSourcingIntel(res);
        setLoadingIntel(false);
      });
    }
  }, [user, isCartView, orders, cart]);

  if (!user) {
    return <Navigate to="/login" replace state={{ redirectTo: isCartView ? '/cart' : '/dashboard', fromCart: isCartView }} />;
  }

  const totalEarnings = orders.reduce((acc, o) => acc + o.totalEarnings, 0);

  return (
    <div className="max-w-[1400px] mx-auto px-10 py-32 relative z-10 fade-in-ritual">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left Stats Column */}
        <div className="lg:w-1/3 space-y-10">
          <SacredFrame className="bg-[#1A0303]/80 p-10 border-[#C5A059]/30 backdrop-blur-2xl">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-16 h-16 bg-gradient-to-br from-[#8e6c27] to-[#cf9e42] flex items-center justify-center rounded-sm">
                <UserIcon size={24} className="text-[#1A0303]" />
              </div>
              <div>
                <h3 className="h1-sacred text-xl text-[#F5F0E1]">{user?.name}</h3>
                <p className="label-sacred text-[0.45rem] text-[#C5A059] opacity-70 mt-1 uppercase tracking-[0.2em]">{user?.role}</p>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-[#C5A059]/10">
              <div className="flex justify-between items-center">
                <span className="label-sacred text-[0.5rem] text-[#E6D5B8]/50">Affiliate Earnings</span>
                <span className="h1-sacred text-lg text-[#C5A059]">₹{totalEarnings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="label-sacred text-[0.5rem] text-[#E6D5B8]/50">Partner ID</span>
                <span className="label-sacred text-[0.55rem] text-[#E6D5B8] font-bold tracking-widest">{user?.referralCode}</span>
              </div>
            </div>

            <button onClick={context.logout} className="w-full mt-10 py-4 label-sacred text-[0.55rem] border border-red-900/30 text-red-400/50 hover:bg-red-900/10 transition-all flex items-center justify-center gap-3">
              <LogOut size={14} /> Log Out
            </button>

            <button onClick={() => window.location.hash = '/order-history'} className="w-full mt-4 py-4 label-sacred text-[0.55rem] border border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10 transition-all flex items-center justify-center gap-3">
              <History size={14} /> View Order History
            </button>
          </SacredFrame>

          {/* New Tactical Sourcing Intelligence Card */}
          {!isCartView && (
            <SacredFrame className="bg-[#2D0505]/80 p-8 border-[#C5A059]/20 shadow-xl group">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#C5A059]/10">
                <Target size={16} className="text-[#C5A059]" />
                <h4 className="label-sacred text-[0.6rem] text-[#C5A059] font-bold uppercase tracking-[0.2em]">Sourcing Intelligence</h4>
              </div>

              {loadingIntel ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-2 bg-[#C5A059]/10 rounded w-1/2"></div>
                  <div className="h-2 bg-[#C5A059]/10 rounded w-3/4"></div>
                  <div className="h-8 bg-[#C5A059]/5 rounded w-full mt-4"></div>
                </div>
              ) : sourcingIntel ? (
                <div className="flex flex-col gap-6">
                  {/* Row 1: What is moving */}
                  <div>
                    <p className="label-sacred text-[0.4rem] text-[#E6D5B8]/40 uppercase mb-2 tracking-widest">High Velocity Items</p>
                    <ul className="space-y-1">
                      {sourcingIntel.fastMovingItems?.map((item: string, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-[#C5A059] rounded-full"></div>
                          <span className="h1-sacred text-sm text-[#F5F0E1]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Row 2: Logic */}
                  <div>
                    <p className="label-sacred text-[0.4rem] text-[#E6D5B8]/40 uppercase mb-2 tracking-widest">Market Logic</p>
                    <p className="body-sacred text-xs text-[#E6D5B8]/70 leading-relaxed">
                      {sourcingIntel.marketLogic}
                    </p>
                  </div>

                  {/* Row 3: Action */}
                  <div className="bg-[#C5A059]/10 border border-[#C5A059]/20 p-3 flex items-start gap-3">
                    <Zap size={14} className="text-[#C5A059] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="label-sacred text-[0.4rem] text-[#C5A059] uppercase font-bold tracking-wider mb-1">Recommended Action</p>
                      <p className="h1-sacred text-sm text-[#F5F0E1]">{sourcingIntel.recommendedAction}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </SacredFrame>
          )}
        </div>

        {/* Right Main Content */}
        <div className="lg:w-2/3 space-y-12">
          {isCartView ? (
            <div className="space-y-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="h1-sacred text-4xl metallic-gold-text glow-gold-metallic">Sacred Queue.</h2>
                <button onClick={() => window.location.hash = '/catalog'} className="label-sacred text-[0.5rem] text-[#C5A059] flex items-center gap-2">Continue Browse <ChevronRight size={10} /></button>
              </div>
              {cart.length === 0 ? (
                <div className="p-24 text-center border border-dashed border-[#C5A059]/10 bg-[#1A0303]/40 rounded-sm">
                  <Package size={40} className="mx-auto mb-6 opacity-10 text-[#C5A059]" />
                  <p className="body-sacred text-sm text-[#E6D5B8]/30 italic">The distribution queue is currently empty.</p>
                  <button onClick={() => window.location.hash = '/catalog'} className="cta-outline-gold mt-10 px-12 py-4 text-[0.6rem] glow-gold-cta">Browse Inventory</button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* ... (in the cart mapping) */}
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-8 bg-[#1A0303]/60 p-6 border border-[#C5A059]/10 hover:border-[#C5A059]/30 transition-all">
                      <div className="w-20 h-20 p-2 bg-[#1A0303] border border-[#C5A059]/10 flex-shrink-0">
                        <ProductImage product={item} imagePath={item.image_path} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="h1-sacred text-[0.9rem] text-[#F5F0E1]">{item.name}</h4>
                        <p className="label-sacred text-[0.4rem] text-[#C5A059] mt-2 uppercase tracking-widest">{item.commissionRate}% Expected Margin</p>
                      </div>
                      <div className="text-right">
                        <p className="h1-sacred text-base text-[#F5F0E1]">₹{(item.price * item.quantity).toLocaleString()}</p>
                        <button onClick={() => context.removeFromCart(item.id)} className="text-red-400/30 hover:text-red-400 text-[0.45rem] label-sacred uppercase mt-3 transition-colors">Withdraw</button>
                      </div>
                    </div>
                  ))}
                  <div className="p-10 bg-[#C5A059]/5 border border-[#C5A059]/20 flex flex-col md:flex-row justify-between items-center gap-8 backdrop-blur-md mt-10">
                    <div className="text-center md:text-left">
                      <p className="label-sacred text-[0.45rem] text-[#E6D5B8]/40 mb-1 uppercase tracking-widest">Total Sourcing Liquidity</p>
                      <p className="h1-sacred text-3xl text-[#C5A059]">₹{cart.reduce((sum, i) => sum + i.price * i.quantity, 0).toLocaleString()}</p>
                    </div>
                    {/* UPDATED: Redirect to Address Page */}
                    <button onClick={() => window.location.hash = '/address'} className="cta-gold w-full md:w-auto px-16 py-6 text-[0.7rem] font-black uppercase tracking-[0.4em]">
                      Execute Sourcing
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-16">
              <div className="space-y-8">
                <h2 className="h1-sacred text-4xl metallic-gold-text glow-gold-metallic">Order Ledger.</h2>
                {orders.length === 0 ? (
                  <div className="p-24 text-center border border-dashed border-[#C5A059]/10 bg-[#1A0303]/40 rounded-sm">
                    <History size={40} className="mx-auto mb-6 opacity-10 text-[#C5A059]" />
                    <p className="body-sacred text-sm text-[#E6D5B8]/30 italic">No historical distribution recorded for this account.</p>
                    <button onClick={() => window.location.hash = '/catalog'} className="cta-outline-gold mt-10 px-12 py-4 text-[0.6rem] glow-gold-cta mx-auto block">Start Sourcing</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map(order => (
                      <div key={order.id} className="bg-[#1A0303]/80 border border-[#C5A059]/10 p-10 hover:border-[#C5A059]/30 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 blur-3xl rounded-full pointer-events-none -mr-10 -mt-10"></div>
                        <div className="flex flex-col md:flex-row md:justify-between items-start mb-8 gap-4">
                          <div className="flex items-center gap-5">
                            <div className="p-4 bg-[#2D0505] border border-[#C5A059]/20 rounded-sm">
                              <Package size={20} className="text-[#C5A059]" />
                            </div>
                            <div>
                              <p className="label-sacred text-[0.6rem] text-[#C5A059] font-bold tracking-[0.3em] mb-1 uppercase">{order.id}</p>
                              <p className="label-sacred text-[0.45rem] text-[#E6D5B8]/40 uppercase tracking-[0.1em]">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <span className="label-sacred text-[0.45rem] px-4 py-1.5 bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 uppercase tracking-[0.2em]">{order.status}</span>
                        </div>
                        <div className="flex justify-between items-end pt-8 border-t border-[#C5A059]/5">
                          <div className="flex -space-x-3">
                            {order.items.slice(0, 3).map((item, idx) => (
                              <div key={idx} className="w-12 h-12 rounded-full border-2 border-[#1A0303] shadow-lg overflow-hidden bg-[#2D0505] p-1">
                                <ProductImage product={item} imagePath={item.image_path} alt={item.name} className="w-full h-full object-contain" />
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="w-12 h-12 flex items-center justify-center bg-[#2D0505] rounded-full border-2 border-[#1A0303] text-[0.55rem] label-sacred text-[#C5A059] font-bold">+{order.items.length - 3}</div>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="label-sacred text-[0.4rem] text-[#E6D5B8]/30 mb-1 uppercase tracking-widest">Affiliate Revenue</p>
                            <p className="h1-sacred text-2xl text-[#C5A059]">₹{order.totalEarnings.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
