
import React from 'react';

const FloralPattern: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" fill="none" className={`${className} opacity-[0.05] stroke-[#C5A059] stroke-[0.2]`}>
    {[...Array(8)].map((_, i) => (
      <g key={i} transform={`rotate(${i * 45} 50 50)`}>
        <path d="M50 50 C 60 40, 70 40, 80 50 C 70 60, 60 60, 50 50" />
        <circle cx="70" cy="50" r="1.5" />
      </g>
    ))}
  </svg>
);

export default FloralPattern;
