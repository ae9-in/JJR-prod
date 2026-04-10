
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import GlobalBackground from '@/background/GlobalBackground';
import Navbar from '@/components/Navbar';
import AppRoutes from '@/router/AppRoutes';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-[#C5A059] focus:text-[#1A0303] focus:px-4 focus:py-2"
          >
            Skip to main content
          </a>
          <GlobalBackground />
          <div className="relative z-10 min-h-screen flex flex-col selection:bg-[#C5A059] selection:text-[#1A0303]">
            <Navbar />
            <main id="main-content" className="flex-grow">
              <AppRoutes />
            </main>
            <footer className="bg-[#1A0303] py-32 px-10 relative overflow-hidden border-t border-[#C5A059]/15 z-10">
              <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-20 relative z-10 text-left">
                <div className="space-y-12">
                  <div className="flex flex-col items-start">
                    <h4 className="h1-sacred text-4xl metallic-gold-text uppercase tracking-tighter">Jaya Janardhana</h4>
                    <div className="sandalwood-divider w-20 mt-4 opacity-30"></div>
                  </div>
                  <p className="body-sacred text-base opacity-40 max-w-sm font-light text-[#E6D5B8] leading-relaxed">
                    A dedicated portal for heritage sourcing and spiritual community distribution. We protect your margins while preserving tradition.
                  </p>
                </div>
                <div className="flex flex-col md:flex-row justify-end gap-20">
                  <div className="space-y-6">
                    <h5 className="label-sacred text-[0.65rem] text-[#C5A059] tracking-widest">Community</h5>
                    <ul className="space-y-4 label-sacred text-[0.55rem] font-bold text-[#E6D5B8]/40">
                      <li onClick={() => window.location.hash='/register'} className="hover:text-[#C5A059] cursor-pointer transition-colors">Become an Affiliate</li>
                      <li onClick={() => window.location.hash='/catalog'} className="hover:text-[#C5A059] cursor-pointer transition-colors">Full Catalog</li>
                      <li onClick={() => window.location.hash='/dashboard'} className="hover:text-[#C5A059] cursor-pointer transition-colors">Portal Login</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="max-w-[1400px] mx-auto mt-32 pt-10 border-t border-[#C5A059]/10 flex flex-col md:flex-row justify-between items-center opacity-20">
                <p className="label-sacred text-[0.45rem] tracking-[1em] uppercase text-[#E6D5B8] mb-6 md:mb-0">&copy; MMXXIV Jaya Janardhana Sacred Goods.</p>
                <p className="label-sacred text-[0.45rem] tracking-[0.5em] font-bold uppercase text-[#E6D5B8]">Sacred Logistics Ecosystem</p>
              </div>
            </footer>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
