
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-10 relative z-10">
      <div className="bg-[#1A0303]/95 border border-[#C5A059]/30 p-12 max-w-xl w-full text-center shadow-2xl backdrop-blur-3xl">
        <h2 className="h1-sacred text-5xl metallic-gold-text mb-6">404</h2>
        <div className="sandalwood-divider w-20 mx-auto mb-8"></div>
        <p className="body-sacred text-xl text-[#E6D5B8]/80 mb-12">
          The path you seek is currently beyond our portal's reach.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/')} 
            className="label-sacred text-[0.7rem] bg-[var(--antique-gold)] text-[#1A0303] px-8 py-4 font-black hover:brightness-110 transition-all border border-[#C5A059]/50"
          >
            Return Home
          </button>
          <button 
            onClick={() => navigate('/catalog')} 
            className="label-sacred text-[0.7rem] border border-[#C5A059] text-[#C5A059] px-8 py-4 font-bold hover:bg-[#C5A059]/10 transition-all"
          >
            Browse Catalog
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
