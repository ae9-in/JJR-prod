
import React from 'react';

const TempleOutline: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg viewBox="0 0 200 300" fill="none" className={`${className} opacity-[0.03] stroke-[#E6D5B8] stroke-[0.5]`}>
    <path d="M100 20 L130 80 H70 L100 20 Z" />
    <path d="M60 80 H140 V280 H60 V80 Z" />
    <path d="M80 120 V160 H120 V120 H80 Z" />
    <path d="M85 130 H115 V150 H85 V130 Z" strokeWidth="0.2" />
    <path d="M50 280 H150 V290 H50 V280 Z" />
    <path d="M100 0 V20 M90 5 H110" strokeWidth="1" />
  </svg>
);

export default TempleOutline;
