
import React from 'react';
import { Package, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const { user, signOut } = useAuth();
  const cartCount = state.cart.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleCartClick = () => {
    if (user) {
      navigate('/cart');
      return;
    }

    navigate('/login', {
      state: {
        fromCart: true
      }
    });
  };
  
  return (
    <nav className="border-b border-[#C5A059]/15 py-5 px-10 sticky top-0 z-50 bg-[#1A0303]/90 backdrop-blur-2xl">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="opacity-90 group-hover:opacity-100 transition-opacity duration-300">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              className="w-6 h-6 text-[#C5A059]" 
              stroke="currentColor" 
              strokeWidth="1.2"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M4 21H20" />
              <path d="M6 21V12L12 4L18 12V21" />
              <path d="M12 4V2" />
              <path d="M12 15V18" />
              <path d="M6 12H18" />
            </svg>
          </div>

          <div className="flex flex-col items-start px-2">
            <span className="h1-sacred text-xl metallic-gold-text uppercase leading-none tracking-tight">Jaya Janardhana</span>
            <span className="label-sacred text-[0.4rem] opacity-40 mt-1 tracking-[0.4em] text-[#E6D5B8]">Sacred Goods Storefront</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-10">
          {/* Main navigation links removed for affiliate focus */}
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
             <>
               <button onClick={() => navigate('/dashboard')} className="label-sacred text-[0.5rem] text-[#C5A059] flex items-center gap-2 border border-[#C5A059]/30 px-4 py-2 hover:bg-[#C5A059]/10 transition-all font-bold">
                 <LayoutDashboard size={12} /> Portal
               </button>
               <button onClick={handleLogout} className="label-sacred text-[0.55rem] text-[#E6D5B8]/70 hover:text-red-400 transition-all font-bold tracking-[0.2em]">Logout</button>
             </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="label-sacred text-[0.55rem] text-[#E6D5B8]/70 hover:text-[#C5A059] transition-all font-bold tracking-[0.2em]">Login</button>
              <button onClick={() => navigate('/register')} className="cta-outline-gold px-5 py-2 text-[0.5rem]">Become Affiliate</button>
            </>
          )}
          {/* Cart removed for affiliate focus */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
