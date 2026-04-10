
import React from 'react';

const DetailedMandala: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg 
    viewBox="0 0 400 400" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`${className} thin-mandala-outline`}
    strokeWidth="0.12"
  >
    <circle cx="200" cy="200" r="195" stroke="var(--sandalwood)" strokeDasharray="1 1" />
    <circle cx="200" cy="200" r="170" stroke="var(--antique-gold)" strokeDasharray="0.5 2" />
    {[...Array(36)].map((_, i) => (
      <g key={`spikes-${i}`} transform={`rotate(${i * 10} 200 200)`}>
        <path d="M200 10 L 208 30 L 192 30 Z" stroke="var(--antique-gold)" />
      </g>
    ))}
    {[...Array(72)].map((_, i) => (
      <path key={`arches-${i}`} d="M200 45 Q 205 55, 210 45" stroke="var(--sandalwood)" transform={`rotate(${i * 5} 200 200)`} />
    ))}
    <circle cx="200" cy="200" r="45" stroke="var(--antique-gold)" strokeDasharray="2 1" />
    <circle cx="200" cy="200" r="15" stroke="var(--sandalwood)" />
  </svg>
);

export default DetailedMandala;
