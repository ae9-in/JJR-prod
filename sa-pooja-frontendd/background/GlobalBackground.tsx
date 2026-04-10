
import React from 'react';
import DetailedMandala from './DetailedMandala';

const GlobalBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#1A0303]">
      {/* Textile Texture Overlay: Subtle cross-hatch/weave pattern */}
      <div className="absolute inset-0 opacity-[0.15]" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 3h1v1H1V3zm2-2h1v1H3V1z' fill='%23E6D5B8' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        mixBlendMode: 'overlay'
      }}></div>

      {/* Central Mandala: Static, centered, extremely low opacity for subconscious impact */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] md:w-[80vw] md:h-[80vw] flex items-center justify-center opacity-[0.025]">
        <DetailedMandala className="w-full h-full" />
      </div>

      {/* Architectural Border Frame: Inspired by Temple layouts */}
      <div className="absolute inset-3 md:inset-6 border border-[#C5A059]/10 rounded-sm">
         {/* Top Left Corner */}
         <svg className="absolute top-0 left-0 w-12 h-12 text-[#C5A059]/40" viewBox="0 0 50 50" fill="none">
            <path d="M0 0 L 30 0" stroke="currentColor" strokeWidth="1" />
            <path d="M0 0 L 0 30" stroke="currentColor" strokeWidth="1" />
            <path d="M5 5 L 20 5" stroke="currentColor" strokeWidth="0.5" />
            <path d="M5 5 L 5 20" stroke="currentColor" strokeWidth="0.5" />
         </svg>
         
         {/* Top Right Corner */}
         <svg className="absolute top-0 right-0 w-12 h-12 text-[#C5A059]/40" viewBox="0 0 50 50" fill="none">
            <path d="M50 0 L 20 0" stroke="currentColor" strokeWidth="1" />
            <path d="M50 0 L 50 30" stroke="currentColor" strokeWidth="1" />
            <path d="M45 5 L 30 5" stroke="currentColor" strokeWidth="0.5" />
            <path d="M45 5 L 45 20" stroke="currentColor" strokeWidth="0.5" />
         </svg>

         {/* Bottom Left Corner */}
         <svg className="absolute bottom-0 left-0 w-12 h-12 text-[#C5A059]/40" viewBox="0 0 50 50" fill="none">
            <path d="M0 50 L 30 50" stroke="currentColor" strokeWidth="1" />
            <path d="M0 50 L 0 20" stroke="currentColor" strokeWidth="1" />
            <path d="M5 45 L 20 45" stroke="currentColor" strokeWidth="0.5" />
            <path d="M5 45 L 5 30" stroke="currentColor" strokeWidth="0.5" />
         </svg>

         {/* Bottom Right Corner */}
         <svg className="absolute bottom-0 right-0 w-12 h-12 text-[#C5A059]/40" viewBox="0 0 50 50" fill="none">
            <path d="M50 50 L 20 50" stroke="currentColor" strokeWidth="1" />
            <path d="M50 50 L 50 20" stroke="currentColor" strokeWidth="1" />
            <path d="M45 45 L 30 45" stroke="currentColor" strokeWidth="0.5" />
            <path d="M45 45 L 45 30" stroke="currentColor" strokeWidth="0.5" />
         </svg>

         {/* Mid-Border Pillars (Vertical) */}
         <div className="absolute top-1/2 left-0 -translate-y-1/2 h-32 w-[1px] bg-gradient-to-b from-transparent via-[#C5A059]/20 to-transparent"></div>
         <div className="absolute top-1/2 right-0 -translate-y-1/2 h-32 w-[1px] bg-gradient-to-b from-transparent via-[#C5A059]/20 to-transparent"></div>
      </div>
      
      {/* Vignette for focus on center content */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#1A0303_90%)] opacity-80"></div>
    </div>
  );
};

export default GlobalBackground;
