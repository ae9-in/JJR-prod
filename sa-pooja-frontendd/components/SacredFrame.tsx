
import React from 'react';

const SacredFrame: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`gold-frame ${className}`}>
    <div className="corner-ornament tl" />
    <div className="corner-ornament tr" />
    <div className="corner-ornament bl" />
    <div className="corner-ornament br" />
    {children}
  </div>
);

export default SacredFrame;
