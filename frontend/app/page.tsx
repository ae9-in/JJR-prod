
'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';

// ─── COLORS & GLOBAL CONFIG ────────────────────────────────────────────────────────
const C = {
  gold: '#C5A059', goldDark: '#8e6c27', goldLight: '#f7e7c0',
  maroon: '#1A0303', maroonLight: '#2D0505', beige: '#E6D5B8',
  white: '#F5F0E1', success: '#10b981', error: '#ef4444'
};
const getDefaultApiUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5050/api';
    }
  }
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) return envUrl;
  return 'http://localhost:5050/api';
};
const API_URL = getDefaultApiUrl();
const API_STORAGE_KEY = 'jj_working_api_url_v2';
const API_CANDIDATES = Array.from(
  new Set(
    [API_URL, 'http://localhost:5050/api', 'http://127.0.0.1:5050/api']
      .filter(Boolean)
      .map((url) => url.replace(/\/$/, ''))
  )
);

const fetchWithTimeout = async (url: string, init: RequestInit = {}, timeoutMs = 6000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

const apiFetch = async (path: string, init: RequestInit = {}) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const storedBase = typeof window !== 'undefined' ? localStorage.getItem(API_STORAGE_KEY) : null;
  const candidates = storedBase
    ? [storedBase, ...API_CANDIDATES.filter((base) => base !== storedBase)]
    : API_CANDIDATES;

  let lastError: unknown = null;

  for (const base of candidates) {
    try {
      const response = await fetchWithTimeout(`${base}${normalizedPath}`, init);
      if (typeof window !== 'undefined') {
        localStorage.setItem(API_STORAGE_KEY, base);
      }
      return response;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Unable to reach backend API.');
};

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 'p1', cat: 'Daily Pooja', name: '100% Pure Camphor', price: 219, commission: 15, img: '/assets/products/Camphor JJ.png' },
  { id: 'p2', cat: 'Daily Pooja', name: 'Sacred Deepa Oil', price: 209, commission: 12, img: '/assets/products/Pooja Oil JJ.png' },
  { id: 'p3', cat: 'Incense & Resins', name: 'Sandalwood Bliss Agarbatti', price: 59, commission: 20, img: '/assets/products/Agarbhatti Sandalwood JJ.png' },
  { id: 'p4', cat: 'Incense & Resins', name: 'Sandalwood Dhoop', price: 59, commission: 20, img: '/assets/products/Sandalwood JJ.png' },
  { id: 'p5', cat: 'Daily Pooja', name: 'Arsina + Kunkuma', price: 20, commission: 15, img: '/assets/products/ArsinaKunkuma.png' },
  { id: 'p6', cat: 'Daily Pooja', name: 'Premium Cotton Wicks', price: 10, commission: 10, img: '/assets/products/Cotton Wicks JJ.png' }
];

const NAV_SECTIONS = ['margins', 'panchanga', 'about', 'shop', 'subscription'];

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ active, setActive, user, setAuthMode, onLogout, cartCount, onCartClick }: { active: string; setActive: (s: string) => void, user: any, setAuthMode: (m: 'login' | null) => void, onLogout: () => void, cartCount: number, onCartClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setActive(id);
    if (id === 'orders') return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else if (id === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(26,3,3,0.97)' : 'transparent',
      borderBottom: scrolled ? `1px solid rgba(197,160,89,0.15)` : 'none',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      transition: 'all 0.3s ease', padding: '0 40px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => scrollTo('home')}>
        <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/assets/logo.png" alt="Jaya Janardhana Sacred Sourcing and Temple Distribution Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.15em', color: C.gold }}>JAYA JANARDHANA</div>
          <div style={{ fontSize: '9px', letterSpacing: '0.3em', opacity: 0.5, fontFamily: 'var(--font-inter-family), sans-serif', textTransform: 'uppercase', color: C.beige }}>Sacred Goods Storefront</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        {NAV_SECTIONS.map(s => (
          <button key={s} onClick={() => scrollTo(s)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
            fontFamily: 'var(--font-inter-family), sans-serif', fontWeight: 500,
            color: active === s ? C.gold : `${C.beige}80`,
            borderBottom: active === s ? `1px solid ${C.gold}` : '1px solid transparent',
            paddingBottom: '2px', transition: 'all 0.2s'
          }}>{s === 'shop' ? 'Shop' : s === 'panchanga' ? 'Panchanga' : s === 'affiliate' ? 'Affiliates' : s}</button>
        ))}
        {user && (
          <button onClick={() => scrollTo('orders')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
            fontFamily: 'var(--font-inter-family), sans-serif', fontWeight: 500,
            color: active === 'orders' ? C.gold : `${C.beige}80`,
            borderBottom: active === 'orders' ? `1px solid ${C.gold}` : '1px solid transparent',
            paddingBottom: '2px', transition: 'all 0.2s'
          }}>My Orders</button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '16px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '11px', color: C.beige, opacity: 0.8, background: `${C.gold}11`, padding: '6px 12px', borderRadius: '100px', border: `1px solid ${C.gold}33` }}>{user.name}</div>
              <button onClick={onLogout} style={{ background: 'none', border: 'none', color: C.gold, fontSize: '10px', textTransform: 'uppercase', cursor: 'pointer', opacity: 0.7 }}>Logout</button>
            </div>
          ) : (
            <button onClick={() => setAuthMode('login')} style={{ background: 'none', border: 'none', color: C.gold, fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'var(--font-inter-family), sans-serif', cursor: 'pointer', fontWeight: 600 }}>Login</button>
          )}
          
          <button onClick={onCartClick} style={{
            background: 'none', border: `1px solid ${C.gold}50`, color: C.gold,
            padding: '8px 16px', borderRadius: '100px', cursor: 'pointer',
            fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px',
            fontFamily: 'var(--font-inter-family), sans-serif', textTransform: 'uppercase',
            boxShadow: `0 0 10px ${C.gold}20`, transition: 'all 0.2s'
          }}>
            🛒 Cart <span style={{ background: C.gold, color: C.maroon, borderRadius: '50%', width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 900 }}>{cartCount}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── AUTHENTICATION MODAL ─────────────────────────────────────────────────────
function AuthModal({ mode, setMode, onLogin }: { mode: 'login' | 'register' | null, setMode: (m: 'login' | 'register' | null) => void, onLogin: (u: any) => void }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', contact: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!mode) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const bodyPayload = mode === 'register' ? { ...form, role: 'USER' } : form;
      const res = await apiFetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Authentication failed');
      
      if (mode === 'login' && data.user.role === 'AFFILIATE') {
        throw new Error('Affiliate accounts must log in via the /affiliate portal.');
      }
      
      localStorage.setItem('jj_cust_token', data.token);
      localStorage.setItem('jj_cust_user', JSON.stringify(data.user));
      onLogin(data.user);
      setMode(null);
    } catch (err: any) {
      setError(err.message || `Could not reach backend at ${API_URL}.`);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '16px', borderRadius: '12px', background: C.white, border: `2px solid transparent`, color: C.maroon, outline: 'none', marginBottom: '16px', fontFamily: 'var(--font-inter-family), sans-serif', boxSizing: 'border-box' as 'border-box', fontWeight: 500 };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,1)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      
      {/* High-Performance Video Engine */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', transform: 'translateZ(0)' }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6, transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
        >
          <source src="/assets/Whisk_mmzhbtm5mdnlz2yj1sm1qtytmgzkrtl2itmy0cm.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8))' }} />
      </div>

      <div style={{ background: 'rgba(26,3,3,0.8)', border: `1px solid ${C.gold}33`, borderRadius: '24px', padding: '48px', width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1, backdropFilter: 'blur(10px)', transform: 'translateZ(0)' }}>
        <button onClick={() => setMode(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', color: C.gold, border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2"><path d="M12 2C12 2 19 8 19 13C19 16.866 15.866 20 12 20C8.13401 20 5 16.866 5 13C5 8 12 2 12 2Z" fill={`${C.gold}33`}/></svg>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.white, marginBottom: '24px', textAlign: 'center' }}>{mode === 'login' ? 'Customer Login' : 'Register Account'}</h2>
        {error && <div style={{ color: C.error, fontSize: '12px', background: 'rgba(239,68,68,.1)', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <input style={inputStyle} placeholder="Full Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input style={inputStyle} placeholder="Contact Number" required value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
            </>
          )}
          <input style={inputStyle} type="email" placeholder="Email Address" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input style={inputStyle} type="password" placeholder="Password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <button type="submit" disabled={loading} style={{ background: `linear-gradient(135deg, ${C.goldDark}, ${C.gold})`, color: C.maroon, border: 'none', borderRadius: '100px', padding: '16px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', width: '100%', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Authenticating...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: C.beige, opacity: 0.6 }}>
          {mode === 'login' ? "New Customer? " : "Already have an account? "}
          <span onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ color: C.gold, cursor: 'pointer', fontWeight: 700 }}>
            {mode === 'login' ? 'Register' : 'Log In'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── HERO / HOME ──────────────────────────────────────────────────────────────
function HomeSection() {
  return (
    <section id="home" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Image Background Banner with text overlaid */}
      <div 
        style={{
          width: '100%',
          height: '100vh',
          backgroundImage: 'url(/assets/hero_bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '10%'
        }}
      >
        {/* Subtle Dark Overlay to ensure text legibility */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(26,3,3,0.75) 30%, rgba(26,3,3,0.15) 100%)', pointerEvents: 'none' }} />

        {/* Hero Content Overlay in Inverted Pyramid structure */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '650px', textAlign: 'left', paddingRight: '40px' }} className="reveal-up">
          <h1 style={{ fontSize: 'clamp(48px, 6vw, 84px)', fontWeight: 600, lineHeight: 1.05, marginBottom: '24px', color: '#F5F0E1', fontFamily: 'var(--font-cormorant-family), serif' }}>
            Pure Camphor &<br />
            Heritage Sacred<br />
            <span className="shimmer-text" style={{ fontStyle: 'italic', fontWeight: 300 }}>Puja Goods.</span>
          </h1>
          <p style={{ fontSize: 'clamp(15px, 1.8vw, 18px)', opacity: 0.85, lineHeight: 1.7, fontWeight: 300, marginBottom: '40px', color: '#E6D5B8', fontFamily: 'var(--font-jost-family), sans-serif' }}>
            100% natural chemical-free camphor, wood-pressed Deepa oil, and hand-rolled incense sourced directly from Salem and Thanjavur artisans.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {/* CTA Variant A */}
            <button 
              onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })} 
              style={{ 
                background: '#C5A059', 
                color: '#1A0303', 
                border: 'none', 
                padding: '16px 36px', 
                fontSize: '11px', 
                letterSpacing: '0.15em', 
                textTransform: 'uppercase', 
                fontFamily: 'var(--font-jost-family), sans-serif', 
                fontWeight: 700, 
                cursor: 'pointer', 
                borderRadius: '4px', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                transition: 'transform 0.2s'
              }}
            >
              Explore Blessed Collection →
            </button>
            {/* CTA Variant B */}
            <button 
              onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })} 
              style={{ 
                background: 'transparent', 
                color: '#C5A059', 
                border: '1px solid #C5A059', 
                padding: '16px 36px', 
                fontSize: '11px', 
                letterSpacing: '0.15em', 
                textTransform: 'uppercase', 
                fontFamily: 'var(--font-jost-family), sans-serif', 
                fontWeight: 700, 
                cursor: 'pointer', 
                borderRadius: '4px', 
                transition: 'all 0.2s'
              }}
            >
              Secure Premium Offerings
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TRUST TICKER ────────────────────────────────────────────────────────────
function TrustTicker() {
  return (
    <div className="ticker-wrapper">
      <div className="ticker-track">
        <div className="ticker-content">
          <span className="type-label">CAMPHOR DIRECTLY FROM ARTISANS</span>
          <span className="ticker-diamond">✦</span>
          <span className="type-label">NO SYNTHETIC COMPOUNDS</span>
          <span className="ticker-diamond">✦</span>
          <span className="type-label">HERITAGE-SOURCED INCENSE</span>
          <span className="ticker-diamond">✦</span>
          <span className="type-label">SOUTH INDIA DISTRIBUTION</span>
          <span className="ticker-diamond">✦</span>
          <span className="type-label">FAMILY RITUALS SINCE GENERATIONS</span>
          <span className="ticker-diamond">✦</span>
          <span className="type-label">BRASS METALWARE FROM THANJAVUR</span>
          <span className="ticker-diamond">✦</span>
          <span className="type-label">100% NATURAL DEEPA OIL</span>
          <span className="ticker-diamond">✦</span>
          {/* Duplicate for seamless loop */}
          <span className="type-label">CAMPHOR DIRECTLY FROM ARTISANS</span>
          <span className="ticker-diamond">✦</span>
          <span className="type-label">NO SYNTHETIC COMPOUNDS</span>
          <span className="ticker-diamond">✦</span>
          <span className="type-label">HERITAGE-SOURCED INCENSE</span>
          <span className="ticker-diamond">✦</span>
          <span className="type-label">SOUTH INDIA DISTRIBUTION</span>
          <span className="ticker-diamond">✦</span>
          <span className="type-label">FAMILY RITUALS SINCE GENERATIONS</span>
          <span className="ticker-diamond">✦</span>
          <span className="type-label">BRASS METALWARE FROM THANJAVUR</span>
          <span className="ticker-diamond">✦</span>
          <span className="type-label">100% NATURAL DEEPA OIL</span>
          <span className="ticker-diamond">✦</span>
        </div>
      </div>
    </div>
  );
}

// ─── FEATURES SECTION ─────────────────────────────────────────────────────────
function FeaturesSection() {
  return (
    <section className="features-section">
      <div className="features-grid">
        <div className="feature-col">
          <div className="feature-number">01</div>
          <h3 className="feature-heading">100% Pure Elements</h3>
          <div className="feature-rule"></div>
          <p className="feature-body">No synthetics. We provide natural camphor and pure oils for safe daily respiratory exposure.</p>
        </div>
        <div className="feature-col">
          <div className="feature-number">02</div>
          <h3 className="feature-heading">Heritage Sourced</h3>
          <div className="feature-rule"></div>
          <p className="feature-body">Secure verified metalware, incense, and ritual consumables straight from traditional artisans.</p>
        </div>
        <div className="feature-col">
          <div className="feature-number">03</div>
          <h3 className="feature-heading">Family Trusted</h3>
          <div className="feature-rule"></div>
          <p className="feature-body">Used in thousands of homes daily. We maintain the highest standards of spiritual sanctity.</p>
        </div>
      </div>
    </section>
  );
}


// ─── REGIONAL SUPPLY & PARTNER SUPPORT ──────────────────────────────────────────
function SupplyInfoSection() {
  return (
    <section className="supply-section" id="supply">
      <div className="supply-inner">

        {/* Left: Atmospheric image with text overlay */}
        <div className="supply-image-col reveal-left">
          <div className="supply-image-frame">
            <img
              src="/assets/supply_artisan.jpg"
              alt="South Indian heritage artisan crafting sacred items in Tamil Nadu Salem cooperative"
              loading="lazy"
              fetchPriority="low"
            />
            {/* Floating coverage stat */}
            <div className="supply-stat-float">
              <span className="stat-number" style={{ fontSize: '48px' }}>5</span>
              <span className="type-label" style={{ fontSize: '10px', color: 'var(--color-text-tertiary)' }}>STATES COVERED</span>
            </div>
          </div>

          {/* State list overlaid at bottom of image */}
          <div className="supply-states">
            <div className="supply-state">Karnataka</div>
            <div className="supply-state">Tamil Nadu</div>
            <div className="supply-state">Kerala</div>
            <div className="supply-state">Andhra Pradesh</div>
            <div className="supply-state">Telangana</div>
          </div>
        </div>

        {/* Right: Information blocks */}
        <div className="supply-content-col reveal-right">
          <div className="section-label">
            <span className="label-ornament">✦</span>
            <span className="type-label">REGIONAL DISTRIBUTION</span>
          </div>

          <h2 className="supply-heading">
            Supplying Across<br />
            <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--color-gold-light)' }}>South India</em>
          </h2>

          <div className="supply-blocks">

            <div className="supply-block">
              <span className="supply-block-number type-label">01</span>
              <div className="supply-block-content">
                <h3>Regional Coverage</h3>
                <p>Supplying across Karnataka, Tamil Nadu, Kerala, Andhra Pradesh, and Telangana. Door-to-door delivery to retailers, households, and temples.</p>
              </div>
            </div>

            <div className="supply-block">
              <span className="supply-block-number type-label">02</span>
              <div className="supply-block-content">
                <h3>Guidance & Training</h3>
                <p>We provide sales strategies, product guidance, and technology-backed training to help you generate consistent income from our collection.</p>
                <a href="tel:8431119696" className="supply-phone">8431119696</a>
              </div>
            </div>

            <div className="supply-block">
              <span className="supply-block-number type-label">03</span>
              <div className="supply-block-content">
                <h3>Personalized Guidance</h3>
                <p>Our team connects with you, understands your market, and arranges a field visit where applicable to explain the full opportunity.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

const CITY_PANCHANGA: Record<string, {
  date: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  rahu: string;
}> = {
  'Bengaluru': {
    date: 'Friday, 5 June 2026',
    tithi: 'Panchami (Krishna)',
    nakshatra: 'Shravana',
    yoga: 'Brahma',
    karana: 'Kaulava',
    rahu: '10:42 AM – 12:18 PM'
  },
  'Chennai': {
    date: 'Friday, 5 June 2026',
    tithi: 'Panchami (Krishna)',
    nakshatra: 'Uttarashadha',
    yoga: 'Indra',
    karana: 'Taitila',
    rahu: '10:30 AM – 12:05 PM'
  },
  'Hyderabad': {
    date: 'Friday, 5 June 2026',
    tithi: 'Panchami (Krishna)',
    nakshatra: 'Shravana',
    yoga: 'Vaidhriti',
    karana: 'Garaja',
    rahu: '10:48 AM – 12:25 PM'
  },
  'Thiruvananthapuram': {
    date: 'Friday, 5 June 2026',
    tithi: 'Panchami (Krishna)',
    nakshatra: 'Shravana',
    yoga: 'Brahma',
    karana: 'Kaulava',
    rahu: '10:55 AM – 12:30 PM'
  },
  'Vijayawada': {
    date: 'Friday, 5 June 2026',
    tithi: 'Panchami (Krishna)',
    nakshatra: 'Uttarashadha',
    yoga: 'Indra',
    karana: 'Taitila',
    rahu: '10:38 AM – 12:15 PM'
  }
};

// ─── PANCHANGA SECTION ────────────────────────────────────────────────────────
function PanchangaSection() {
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [loading, setLoading] = useState(false);
  const [panchangaData, setPanchangaData] = useState<any>(null);
  const cities = ['Bengaluru', 'Chennai', 'Hyderabad', 'Thiruvananthapuram', 'Vijayawada'];

  // Format today's date dynamically (real-time update)
  const getTodayFormatted = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return new Date().toLocaleDateString('en-IN', options);
  };

  useEffect(() => {
    let active = true;
    const fetchPanchanga = async () => {
      setLoading(true);
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const res = await fetch('/api/panchanga', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: dateStr,
            location: selectedCity,
            timezone: 'Asia/Kolkata'
          })
        });
        const result = await res.json();
        if (active && result.success) {
          setPanchangaData(result);
        }
      } catch (err) {
        console.error('Error fetching real-time panchanga:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchPanchanga();
    return () => {
      active = false;
    };
  }, [selectedCity]);

  // Fallback to static mapping if API fails or is loading
  const getDisplayData = () => {
    if (panchangaData) {
      const raw = panchangaData.raw || {};
      const timings = panchangaData.timings || {};
      const tithiStr = raw.tithi?.name ? `${raw.tithi.name}${raw.tithi.paksha ? ` (${raw.tithi.paksha})` : ''}` : 'Loading...';
      const nakshatraStr = raw.nakshatra?.name || 'Loading...';
      const yogaStr = raw.yoga?.name || 'Loading...';
      const karanaStr = raw.karana?.name || 'Loading...';
      const rahuStr = timings.rahuKalam ? `${timings.rahuKalam.start} – ${timings.rahuKalam.end}` : 'Loading...';
      
      return {
        date: getTodayFormatted(),
        tithi: tithiStr,
        nakshatra: nakshatraStr,
        yoga: yogaStr,
        karana: karanaStr,
        rahu: rahuStr,
        tithiName: raw.tithi?.name ? `${raw.tithi.paksha || ''} ${raw.tithi.name}` : 'Krishna Panchami'
      };
    }

    const fallback = CITY_PANCHANGA[selectedCity];
    return {
      date: getTodayFormatted(),
      tithi: fallback.tithi,
      nakshatra: fallback.nakshatra,
      yoga: fallback.yoga,
      karana: fallback.karana,
      rahu: fallback.rahu,
      tithiName: `Krishna ${fallback.tithi.split(' ')[0]}`
    };
  };

  const current = getDisplayData();

  return (
    <section className="panchanga-section" id="panchanga">
      <div className="panchanga-header reveal-up">
        <div className="section-label">
          <span className="label-ornament">✦</span>
          <span className="type-label">DAILY VEDIC CALENDAR</span>
        </div>
        <h2>
          Daily <em className="shimmer-text" style={{ fontStyle: 'italic', fontWeight: 300 }}>Panchanga</em>
        </h2>
        <p className="panchanga-sub">
          Tithi · Nakshatra · Yoga · Karana · Rahu Kalam — provided each morning for your city.
        </p>
      </div>

      <div className="panchanga-card reveal-up">

        {/* Left: Data */}
        <div className="panchanga-data" style={{ position: 'relative' }}>
          {loading && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(26,3,3,0.75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5,
              fontSize: '11px',
              color: C.gold,
              fontFamily: 'var(--font-inter-family), sans-serif',
              letterSpacing: '0.15em'
            }}>
              SYNCING VEDIC TIMINGS...
            </div>
          )}
          <div className="panchanga-card-top">
            <div>
              <span className="type-label" style={{ color: 'var(--color-gold-mid)', fontSize: '10px' }}>TODAY</span>
              <div className="panchanga-date">{current.date}</div>
            </div>
            <div className="panchanga-tithi-name">{current.tithiName}</div>
          </div>

          <div className="panchanga-divider"></div>

          <div className="panchanga-grid">
            <div className="panchanga-item">
              <span className="panchanga-item-label type-label">TITHI</span>
              <span className="panchanga-item-value">{current.tithi}</span>
            </div>
            <div className="panchanga-item">
              <span className="panchanga-item-label type-label">NAKSHATRA</span>
              <span className="panchanga-item-value">{current.nakshatra}</span>
            </div>
            <div className="panchanga-item">
              <span className="panchanga-item-label type-label">YOGA</span>
              <span className="panchanga-item-value">{current.yoga}</span>
            </div>
            <div className="panchanga-item">
              <span className="panchanga-item-label type-label">KARANA</span>
              <span className="panchanga-item-value">{current.karana}</span>
            </div>
          </div>

          <div className="panchanga-rahu">
            <span className="type-label" style={{ color: 'var(--color-gold-mid)', fontSize: '10px' }}>RAHU KALAM</span>
            <span className="panchanga-rahu-time">{current.rahu}</span>
          </div>

          <div className="panchanga-divider"></div>

          <div className="panchanga-city-selector">
            <span className="type-label" style={{ color: 'var(--color-text-tertiary)', fontSize: '10px' }}>SELECT CITY</span>
            <div className="city-tabs">
              {cities.map(city => (
                <button
                  key={city}
                  className={`city-tab ${selectedCity === city ? 'active' : ''}`}
                  onClick={() => setSelectedCity(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Atmospheric image */}
        <div className="panchanga-image">
          <img
            src="/assets/panchanga_lamp.jpg"
            alt="Vedic puja altar lighting deepa oil lamp for morning ritual alignment"
            loading="lazy"
            fetchPriority="low"
          />
          <div className="panchanga-image-quote">
            <span className="type-quote" style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              "Begin each day in alignment with the sacred calendar."
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── ABOUT / SACRED QUALITY ───────────────────────────────────────────────────
function AboutSection() {
  return (
    <section id="about" className="sacred-quality-section">
      <div className="sacred-quality-inner">
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.gold, fontFamily: 'var(--font-inter-family), sans-serif', display: 'block', marginBottom: '16px' }}>Our Sacred Heritage</span>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 900, color: C.white, marginBottom: '24px', lineHeight: 1.1 }}>Sacred Quality &<br />Artisanal Integrity.</h2>
          <div style={{ width: '60px', height: '1px', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, margin: '0 auto 32px' }} />
          <p style={{ fontSize: '18px', opacity: 0.85, maxWidth: '800px', margin: '0 auto 32px', lineHeight: 1.8, fontFamily: 'var(--font-inter-family), sans-serif', fontWeight: 300, color: C.beige }}>
            Founded by Janardhana Shastri, a third-generation Vedic priest and heritage scholar from Salem, Jaya Janardhana was born out of a mission to restore purity to household rituals. Frustrated by the prevalence of toxic, petroleum-based synthetic camphor and chemical-laden incense in the market, Shastri partnered directly with traditional artisan cooperatives.
          </p>
          <p style={{ fontSize: '16px', opacity: 0.7, maxWidth: '800px', margin: '0 auto', lineHeight: 1.8, fontFamily: 'var(--font-inter-family), sans-serif', fontWeight: 300, color: C.white }}>
            Today, we source 100% natural camphor, wood-pressed Deepa oil, and hand-rolled charcoal-free incense directly from Salem and Thanjavur craftsmen. By bypassing commercial middle-agents, we guarantee authentic, chemical-free consumables while ensuring that local South Indian artisans receive fair, sustaining wages for their spiritual craft.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '80px' }}>
          {[
            { title: 'Salem Camphor Cooperative', desc: 'Crafted from 100% natural camphor tree extract. Contains zero paraffin or synthetic additives, burning completely clean without black smoke.' },
            { title: 'Thanjavur Brass & Oil Artisans', desc: 'Handcrafted pure oil lamps and wood-pressed oil formulations created in alignment with Ayurvedic principles for a clean respiratory burn.' },
            { title: 'Salem Hand-Rolled Incense', desc: 'Mastergrade agarbatti rolled by hand using natural herbs, resins, and pure sandalwood powders rather than synthetic fragrances.' },
          ].map((item, i) => (
            <div key={i} className="sacred-card">
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: C.white, fontFamily: 'var(--font-cormorant-family), serif' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', opacity: 0.75, lineHeight: 1.7, fontFamily: 'var(--font-inter-family), sans-serif', fontWeight: 300, color: C.beige }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CATALOG ──────────────────────────────────────────────────────────────────
function CatalogSection({ user, setAuthMode, onAddToCart }: { user: any, setAuthMode: (m: 'login') => void, onAddToCart: (product: any) => void }) {
  const [filter, setFilter] = useState('All');
  const [products, setProducts] = useState(PRODUCTS);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [isCrawler, setIsCrawler] = useState(false);
  
  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(d => {
      if (d.products && d.products.length > 0) {
        setProducts(d.products.map((p: any) => ({
          id: p._id, cat: p.category || 'Incense & Resins', name: p.name, price: p.price, img: p.imageUrl || '/assets/products/Camphor JJ.png'
        })));
      }
    }).catch(err => console.warn('Using fallback static catalog products.', err.message));

    // Crawl Bot Detection
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase();
      const bots = ['googlebot', 'bingbot', 'yandexbot', 'duckduckbot', 'baiduspider', 'google-coop', 'google-site-verification'];
      if (bots.some(bot => ua.includes(bot))) {
        setIsCrawler(true);
      }
    }
  }, []);

  const cats = ['All', 'Incense & Resins', 'Daily Pooja'];
  const filtered = filter === 'All' ? products : products.filter(p => p.cat === filter);

  const handleAdd = (product: typeof PRODUCTS[0]) => {
    onAddToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1000);
  };

  const showOverlay = !user && !isCrawler;

  return (
    <section id="shop" style={{ padding: '80px 40px', maxWidth: '1300px', margin: '0 auto', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: '60px' }}>
        <div>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, color: C.gold, marginBottom: '8px' }}>The Collection.</h2>
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.4, fontFamily: 'var(--font-inter-family), sans-serif' }}>Open Product Catalog</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', background: 'rgba(26,3,3,0.8)', padding: '8px', border: `1px solid rgba(197,160,89,0.15)`, borderRadius: '8px' }}>
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{ background: filter === c ? `linear-gradient(135deg, ${C.goldDark}, ${C.gold})` : 'none', border: 'none', color: filter === c ? C.maroon : `${C.beige}60`, padding: '8px 16px', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-inter-family), sans-serif', fontWeight: filter === c ? 700 : 400, cursor: 'pointer', borderRadius: '4px', transition: 'all 0.2s' }}>{c}</button>
          ))}
        </div>
      </div>
      
      <div style={{ position: 'relative' }}>
        {/* Products Grid - Always Rendered in DOM for SEO Indexing */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '24px',
          filter: showOverlay ? 'blur(8px)' : 'none',
          pointerEvents: showOverlay ? 'none' : 'auto',
          opacity: showOverlay ? 0.35 : 1,
          transition: 'all 0.4s ease'
        }}>
          {filtered.map(p => (
            <div key={p.id} style={{ background: 'rgba(26,3,3,0.9)', border: `1px solid rgba(197,160,89,0.15)`, borderRadius: '12px', overflow: 'hidden', transition: 'all 0.3s' }}>
              <div style={{ height: '220px', width: '100%', overflow: 'hidden', position: 'relative', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={p.img} alt={`Buy ${p.name} online - Heritage Sourced Sacred Pooja Goods`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} loading="lazy" fetchPriority="low" />
              </div>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, fontFamily: 'var(--font-inter)', marginBottom: '8px', opacity: 0.7 }}>{p.cat}</div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '12px', color: C.white }}>{p.name}</h3>
                <div style={{ fontSize: '22px', fontWeight: 700, color: C.gold, marginBottom: '16px' }}>₹{p.price.toLocaleString('en-IN')}</div>
                <button onClick={() => handleAdd(p as any)} style={{ background: addedId === p.id ? C.success : `linear-gradient(135deg, ${C.goldDark}, ${C.gold})`, color: addedId === p.id ? C.white : C.maroon, border: 'none', padding: '12px', width: '100%', borderRadius: '8px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {addedId === p.id ? '✓ Added' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Overlay for Unregistered Users - Blurs grid and blocks click interactions */}
        {showOverlay && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(26,3,3,0.3)',
            zIndex: 10,
            borderRadius: '16px',
            padding: '20px'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '60px 40px',
              background: 'rgba(45,5,5,0.92)',
              border: `1.5px solid ${C.gold}`,
              borderRadius: '24px',
              maxWidth: '500px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.8), 0 0 40px rgba(197,160,89,0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ fontSize: '26px', fontWeight: 900, color: C.white, marginBottom: '16px', fontFamily: 'var(--font-cormorant-family), serif' }}>Exclusive Sacred Catalog</h3>
              <p style={{ fontSize: '15px', opacity: 0.8, color: C.beige, maxWidth: '400px', margin: '0 auto 32px', fontFamily: 'var(--font-jost-family), sans-serif', lineHeight: 1.65 }}>
                Please sign in or create a customer account to view pricing and purchase our heritage, artisan-crafted items.
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button onClick={() => setAuthMode('login')} style={{ background: `linear-gradient(135deg, ${C.goldDark}, ${C.gold})`, color: C.maroon, border: 'none', padding: '16px 36px', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'var(--font-jost-family), sans-serif', fontWeight: 700, cursor: 'pointer', borderRadius: '4px', boxShadow: '0 4px 15px rgba(0,0,0,0.4)' }}>
                  Sign In
                </button>
                <button onClick={() => setAuthMode('login')} style={{ background: 'transparent', border: `1px solid ${C.gold}`, color: C.gold, padding: '16px 36px', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'var(--font-jost-family), sans-serif', fontWeight: 700, cursor: 'pointer', borderRadius: '4px' }}>
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── SUBSCRIPTION ──────────────────────────────────────────────────────────────
function SubscriptionSection({ user, onSubscribe }: { user: any, onSubscribe: (plan: any, billingMode: 'monthly' | 'annual') => void }) {
  const [billingMode, setBillingMode] = useState<'monthly' | 'annual'>('monthly');
  const plans = [
    { id: 'sub_pooja', name: 'Daily Pooja Kit', price: 499, annualPrice: 5988, features: ['Complete pooja essentials kit', '3-in-1 premium agarbatti (100g)', 'Pure camphor (100g)', 'Sacred deepa oil (800ml)', 'Traditional dhoop sticks (100g)', 'Ready cotton wicks (40 units)', 'Sacred kumkuma packet'] },
    { id: 'sub_partner', name: 'Divine Partner Pack', price: 799, annualPrice: 9588, features: ['Multiple kits for home & temple', 'Priority doorstep delivery', 'Handpicked premium heritage grade', 'Weekly ritual community support', 'Dedicated account manager', 'Exclusive dhoop access', 'Guaranteed uninterrupted rituals'], featured: true }
  ];
  return (
    <section id="subscription" style={{ padding: '120px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 900, color: C.white, marginBottom: '24px' }}>Divine Subscriptions.</h2>
        <div style={{ display: 'inline-flex', background: 'rgba(26,3,3,0.8)', border: `1px solid ${C.gold}33`, borderRadius: '100px', padding: '4px', marginBottom: '32px' }}>
          <button onClick={() => setBillingMode('monthly')} style={{ background: billingMode === 'monthly' ? C.gold : 'none', color: billingMode === 'monthly' ? C.maroon : C.beige, border: 'none', padding: '10px 24px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Monthly</button>
          <button onClick={() => setBillingMode('annual')} style={{ background: billingMode === 'annual' ? C.gold : 'none', color: billingMode === 'annual' ? C.maroon : C.beige, border: 'none', padding: '10px 24px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Annual (-20%)</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
        {plans.map(p => (
          <div key={p.id} className="subscription-card" style={{ background: p.featured ? 'rgba(45,5,5,1)' : 'rgba(26,3,3,0.9)', border: p.featured ? `1.5px solid ${C.gold}` : `1px solid ${C.gold}33`, borderRadius: '24px', padding: '48px' }}>
            {p.featured && <div style={{ position: 'absolute', top: 0, right: '32px', background: C.gold, color: C.maroon, fontSize: '10px', fontWeight: 900, padding: '8px 16px', borderRadius: '0 0 8px 8px', textTransform: 'uppercase', zIndex: 10 }}>Recommended</div>}
            <div style={{ fontSize: '12px', color: C.gold, fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase' }}>{p.name}</div>
            <div className="subscription-price">
              <span style={{ fontSize: '24px', verticalAlign: 'super', marginRight: '4px' }}>₹</span>
              {billingMode === 'monthly' ? p.price : p.annualPrice}
            </div>

            {p.featured && (
              <div className="subscription-card-image">
                <img src="/assets/sub_kit.jpg" alt="Divine partner pack contents" loading="lazy" fetchPriority="low" />
              </div>
            )}

            <div style={{ width: '100%', height: '1px', background: `${C.gold}22`, margin: '24px 0 32px' }} />
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {p.features.map(f => <li key={f} style={{ fontSize: '14px', opacity: 0.7, display: 'flex', gap: '12px' }}><span style={{ color: C.gold }}>✦</span> {f}</li>)}
            </ul>
            <button onClick={() => onSubscribe(p, billingMode)} style={{ width: '100%', background: p.featured ? `linear-gradient(135deg, ${C.goldDark}, ${C.gold})` : 'none', border: p.featured ? 'none' : `1px solid ${C.gold}55`, color: p.featured ? C.maroon : C.gold, padding: '16px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}>
              {user ? 'Subscribe Now' : 'Sign in to Subscribe'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── MARGINS ──────────────────────────────────────────────────────────────────
function MarginsSection() {
  const [packets, setPackets] = useState(50);
  const avgPrice = 500; // average product price in ₹
  const minRate = 0.25;
  const maxRate = 0.30;
  const minEarning = Math.round(packets * avgPrice * minRate);
  const maxEarning = Math.round(packets * avgPrice * maxRate);
  const barPct = Math.min((packets / 500) * 100, 100);

  return (
    <section id="margins" style={{ padding: '120px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>
        <div>
           <div style={{ display: 'inline-block', fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.gold, marginBottom: '16px' }}>Simple Margins</div>
           <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, color: C.white, marginBottom: '32px', lineHeight: 1.1 }}>Partner Earnings <br />Made Transparent.</h2>
           <p style={{ fontSize: '18px', opacity: 0.7, lineHeight: 1.8, marginBottom: '40px', fontWeight: 300 }}>
             Affiliates and distributors earn verified set margins. No uncertainty, no hidden rates.
           </p>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {['25–30% Commission Per Product', 'Earnings Visible Before Ordering', 'Reliable Communal Sourcing', 'No Upfront Entry Fees'].map(point => (
                <div key={point} style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '15px', color: C.beige }}>
                   <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.gold, boxShadow: `0 0 10px ${C.gold}` }} />
                   {point}
                </div>
              ))}
           </div>
        </div>
        <div className="margins-stat-card">
           <div className="margins-stat-card-content">
              <div style={{ fontSize: '12px', opacity: 0.5, marginBottom: '12px', letterSpacing: '0.2em', color: 'var(--color-text-secondary)' }}>AVERAGE COMMISSION</div>
              <div className="margins-percent">25–30%</div>
              <div style={{ display: 'inline-flex', padding: '8px 24px', background: `${C.gold}11`, border: `1px solid ${C.gold}33`, borderRadius: '100px', color: C.gold, fontSize: '11px', fontWeight: 700, marginTop: '24px' }}>Flat Performance Rate</div>
           </div>
        </div>
      </div>

      {/* ── Earning Potential Calculator ── */}
      <div style={{
        marginTop: '80px',
        background: 'linear-gradient(135deg, rgba(45,5,5,0.95), rgba(26,3,3,0.98))',
        border: `1px solid ${C.gold}33`,
        borderRadius: '24px',
        padding: '56px 48px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* decorative corner accent */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '220px', height: '220px', background: `radial-gradient(circle at top right, ${C.gold}0d, transparent 70%)`, pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.gold, boxShadow: `0 0 8px ${C.gold}`, display: 'inline-block' }} />
          <span style={{ fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.gold }}>Interactive Calculator</span>
        </div>
        <h3 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, color: C.white, marginBottom: '8px', lineHeight: 1.2 }}>
          Earning Potential
        </h3>
        <p style={{ fontSize: '14px', opacity: 0.5, marginBottom: '48px', fontFamily: 'var(--font-inter-family), sans-serif' }}>
          Drag the slider to see how your earnings grow with every packet sold.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '48px', alignItems: 'end' }}>
          <div>
            {/* Slider label */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', color: C.beige, opacity: 0.7, fontFamily: 'var(--font-inter-family), sans-serif' }}>Packets Sold Per Month</span>
              <span style={{ fontSize: '28px', fontWeight: 900, color: C.gold, fontFamily: 'var(--font-cormorant-family), serif' }}>{packets.toLocaleString('en-IN')}</span>
            </div>

            {/* Custom slider track */}
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <div style={{ height: '4px', background: `${C.gold}20`, borderRadius: '2px', position: 'relative', overflow: 'visible' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${barPct}%`, background: `linear-gradient(90deg, ${C.goldDark}, ${C.gold})`, borderRadius: '2px', transition: 'width 0.15s' }} />
              </div>
              <input
                type="range"
                min={10}
                max={500}
                step={5}
                value={packets}
                onChange={e => setPackets(Number(e.target.value))}
                style={{
                  position: 'absolute', top: '-8px', left: 0, width: '100%',
                  appearance: 'none', background: 'transparent', cursor: 'pointer',
                  outline: 'none', margin: 0, padding: 0, height: '20px'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', opacity: 0.35, fontFamily: 'var(--font-inter-family), sans-serif', letterSpacing: '0.1em' }}>
              <span>10 packets</span><span>500 packets</span>
            </div>

            {/* Progress ticks */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', gap: '8px' }}>
              {[50, 100, 200, 300, 500].map(mark => (
                <button
                  key={mark}
                  onClick={() => setPackets(mark)}
                  style={{
                    flex: 1, padding: '6px 0', background: packets === mark ? `${C.gold}22` : 'transparent',
                    border: `1px solid ${packets === mark ? C.gold : C.gold + '30'}`,
                    borderRadius: '6px', color: packets === mark ? C.gold : `${C.beige}60`,
                    fontSize: '11px', fontWeight: packets === mark ? 700 : 400,
                    cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-inter-family), sans-serif'
                  }}
                >{mark}</button>
              ))}
            </div>
          </div>

          {/* Earnings display */}
          <div style={{ textAlign: 'right', minWidth: '240px' }}>
            <div>
              <div style={{ fontSize: '11px', opacity: 0.45, letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'var(--font-inter-family), sans-serif', marginBottom: '8px' }}>Monthly Earnings</div>
              <div style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 900, fontFamily: 'var(--font-cormorant-family), serif', lineHeight: 1, background: `linear-gradient(135deg, ${C.goldDark}, ${C.gold}, ${C.goldLight})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ₹{minEarning.toLocaleString('en-IN')}
                <span style={{ fontSize: '0.55em', opacity: 0.7 }}> – </span>
                ₹{maxEarning.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Annual projection */}
            <div style={{ marginTop: '24px', padding: '14px 20px', background: `${C.gold}0d`, border: `1px solid ${C.gold}22`, borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', opacity: 0.45, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-inter-family), sans-serif', marginBottom: '6px' }}>Annual Projections</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: C.gold, fontFamily: 'var(--font-cormorant-family), serif', lineHeight: 1 }}>
                ₹{(minEarning * 12).toLocaleString('en-IN')}
                <span style={{ fontSize: '0.70em', opacity: 0.8 }}> – </span>
                ₹{(maxEarning * 12).toLocaleString('en-IN')}
              </div>
            </div>

            <div style={{ fontSize: '11px', opacity: 0.4, fontFamily: 'var(--font-inter-family), sans-serif', marginTop: '16px' }}>at 25–30% on ₹{avgPrice}/packet avg.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── AFFILIATE REGISTRATION ──────────────────────────────────────────────────
function AffiliateSection() {
  const [form, setForm] = useState({ name: '', email: '', contact: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess(false);
    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'AFFILIATE' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setSuccess(true);
      setForm({ name: '', email: '', contact: '', password: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '16px', borderRadius: '12px', background: C.white, border: `1px solid ${C.gold}33`, color: C.maroon, outline: 'none', marginBottom: '16px', fontSize: '15px' };

  return (
    <section id="affiliate" style={{ padding: '120px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '80px', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.gold, marginBottom: '16px' }}>Sacred Distribution</div>
          <h2 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 900, color: C.white, marginBottom: '32px', lineHeight: 1.1 }}>Join Our Sacred<br />Network.</h2>
          <p style={{ fontSize: '18px', opacity: 0.7, lineHeight: 1.8, marginBottom: '40px', fontWeight: 300 }}>
            Become a part of Jaya Janardhana's heritage distribution community. Help deliver pure ritual goods to homes while earning transparent margins.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[
              { t: 'Verified Partner Status', d: 'Get certified as a Jaya Janardhana community sourcing agent.' },
              { t: 'Transparent Commissions', d: 'Earn 25–30% on every sacred item delivered through your network.' },
              { t: 'Heritage Support', d: 'Get marketing resources and ritual training for your local area.' }
            ].map(point => (
              <div key={point.t} style={{ display: 'flex', gap: '20px' }}>
                <div style={{ color: C.gold, fontSize: '24px' }}>✦</div>
                <div>
                  <div style={{ color: C.white, fontWeight: 700, marginBottom: '4px' }}>{point.t}</div>
                  <div style={{ fontSize: '14px', opacity: 0.6 }}>{point.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(26,3,3,0.95)', border: `1.5px solid ${C.gold}33`, borderRadius: '32px', padding: '60px', boxShadow: `0 30px 60px rgba(0,0,0,0.5)` }}>
          <h3 style={{ fontSize: '24px', fontWeight: 700, color: C.white, marginBottom: '32px', textAlign: 'center' }}>Become an Affiliate.</h3>
          {error && <div style={{ color: C.error, fontSize: '12px', background: 'rgba(239,68,68,.1)', padding: '12px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center' }}>{error}</div>}
          {success && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ color: C.success, fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Welcome to the Network!</div>
              <p style={{ opacity: 0.7, fontSize: '14px' }}>Your affiliate account has been registered successfully. You can now login to access your dashboard.</p>
              <button onClick={() => window.scrollTo(0, 0)} style={{ background: C.gold, color: C.maroon, border: 'none', padding: '12px 32px', borderRadius: '100px', marginTop: '24px', fontWeight: 700, cursor: 'pointer' }}>Login Now</button>
            </div>
          )}
          {!success && (
            <form onSubmit={handleRegister}>
              <input style={inputStyle} placeholder="Full Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input style={inputStyle} type="email" placeholder="Email Address" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <input style={inputStyle} placeholder="Contact Number" required value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
              <input style={inputStyle} type="password" placeholder="Create Password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              <button type="submit" disabled={loading} style={{ width: '100%', background: `linear-gradient(135deg, ${C.goldDark}, ${C.gold})`, color: C.maroon, padding: '18px', borderRadius: '100px', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '12px', letterSpacing: '0.15em' }}>
                {loading ? 'Processing...' : 'Join the Community →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────
function OrdersSection() {
  return (
    <section id="orders" style={{ padding: '140px 40px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center', minHeight: '80vh' }}>
      <h2 style={{ fontSize: '36px', fontWeight: 900, color: C.gold, marginBottom: '24px' }}>Your Protected Orders</h2>
      <div style={{ background: 'rgba(26,3,3,0.9)', border: `1px solid rgba(197,160,89,0.15)`, borderRadius: '16px', padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.gold}33`, paddingBottom: '16px', marginBottom: '24px', opacity: 0.5, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <span>Order ID</span><span>Date</span><span>Amount</span><span>Status</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: `1px solid ${C.gold}11` }}>
          <span style={{ color: C.white, fontFamily: 'monospace' }}>#JJ-89A23E</span>
          <span style={{ color: C.beige, opacity: 0.7 }}>Today</span>
          <span style={{ color: C.gold, fontWeight: 700 }}>₹219</span>
          <span style={{ background: C.success, color: '#fff', padding: '4px 12px', borderRadius: '100px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>Processing</span>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ padding: '60px 40px', borderTop: `1px solid rgba(197,160,89,0.1)`, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img src="/assets/logo.png" alt="Jaya Janardhana Temple Logo" style={{ width: '48px', height: '48px', objectFit: 'contain', marginBottom: '16px' }} />
      <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.2em', color: C.gold, marginBottom: '8px' }}>JAYA JANARDHANA</div>
      <div style={{ fontSize: '11px', opacity: 0.4, fontFamily: 'var(--font-inter-family), sans-serif', letterSpacing: '0.2em' }}>SACRED GOODS STOREFRONT (JAYA JANARDANA)</div>
      <div style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${C.gold}30, transparent)`, margin: '24px auto', maxWidth: '300px' }} />
      <div style={{ fontSize: '12px', opacity: 0.3, fontFamily: 'var(--font-inter-family), sans-serif' }}>© {new Date().getFullYear()} Jaya Janardhana / Jaya Janardana. Heritage Community Marketplace.</div>
    </footer>
  );
}

// ─── REACH OUT ──────────────────────────────────────────────────────────────
function ReachOutSection({ onJoin }: { onJoin: () => void }) {
  return (
    <section style={{ padding: '100px 40px', textAlign: 'center', background: `linear-gradient(to bottom, transparent, ${C.maroon})` }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 700, color: C.white, marginBottom: '24px' }}>Want to Join Our Sacred Mission?</h2>
        <p style={{ fontSize: '18px', opacity: 0.7, marginBottom: '40px', lineHeight: 1.6 }}>
          Whether you are a ritual expert, a regional distributor, or a passionate devotee, we welcome you to our community sourcing network.
        </p>
        <button
          onClick={onJoin}
          style={{ background: 'transparent', border: `2px solid ${C.gold}`, color: C.gold, padding: '18px 48px', borderRadius: '100px', fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer', transition: 'all 0.3s' }}
        >
          Reach Out Us →
        </button>
      </div>
    </section>
  );
}

// ─── VISIBLE FAQ SECTION ──────────────────────────────────────────────────────
function FaqSection() {
  const faqs = [
    { q: "How is the brand name spelled, Jaya Janardhana or Jaya Janardana?", a: "Our brand name can be transliterated as Jaya Janardhana (with 'h') or Jaya Janardana (without 'h'). Both spellings refer to our sacred Salem-based sourcing storefront and regional South India temple distribution network. We ensure complete search indexation for both variations so that devotees can easily find our pure offerings." },
    { q: "Why is pure camphor important for daily worship?", a: "Pure camphor burns cleanly without releasing toxic synthetic chemical residues, preventing respiratory issues and maintaining a pure temple atmosphere." },
    { q: "How can I verify the purity of camphor?", a: "100% pure camphor burns completely without leaving behind any black residue or ash, and emits a clean, sweet aroma." },
    { q: "Does the Deepa Oil contain mineral oil?", a: "No, our Sacred Deepa Oil is formulated with 100% natural, plant-based oils and has zero mineral oil or synthetic additives." },
    { q: "Is the agarbatti safe for daily indoor use?", a: "Yes, our Sandalwood Bliss Agarbatti is crafted using natural wood powders and oils, avoiding artificial charcoal binders to ensure respiratory safety." },
    { q: "What regions do you supply across South India?", a: "We distribute products to retailers, temples, and homes in Karnataka, Tamil Nadu, Kerala, Andhra Pradesh, and Telangana." }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" style={{ padding: '100px 40px', backgroundColor: '#1A0303', borderTop: '1px solid var(--color-border)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.gold, display: 'block', marginBottom: '16px' }}>FAQ</span>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 600, color: C.white, fontFamily: 'var(--font-cormorant-family), serif', lineHeight: 1.1, margin: 0 }}>
            Frequently Asked <em className="shimmer-text" style={{ fontStyle: 'italic', fontWeight: 300 }}>Questions</em>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              style={{ 
                background: 'rgba(45,5,5,0.4)', 
                border: `1px solid ${openIdx === idx ? C.gold : 'var(--color-border)'}`, 
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                style={{
                  width: '100%',
                  padding: '24px 28px',
                  background: 'none',
                  border: 'none',
                  color: C.white,
                  fontFamily: 'var(--font-cormorant-family), serif',
                  fontSize: '18px',
                  fontWeight: 500,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  outline: 'none'
                }}
              >
                <span>{faq.q}</span>
                <span style={{ color: C.gold, fontSize: '20px', transition: 'transform 0.3s', transform: openIdx === idx ? 'rotate(45deg)' : 'none' }}>+</span>
              </button>
              
              <div style={{
                maxHeight: openIdx === idx ? '200px' : '0',
                opacity: openIdx === idx ? 1 : 0,
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
                padding: openIdx === idx ? '0 28px 24px' : '0 28px 0'
              }}>
                <p style={{ 
                  margin: 0, 
                  fontSize: '14px', 
                  lineHeight: 1.7, 
                  color: C.beige, 
                  opacity: 0.8, 
                  fontFamily: 'var(--font-jost-family), sans-serif',
                  fontWeight: 300 
                }}>
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
// ─── CART DRAWER MODAL ────────────────────────────────────────────────────────
function CartDrawer({ isOpen, onClose, cart, updateQty, removeProduct, user }: { isOpen: boolean, onClose: () => void, cart: any[], updateQty: (id: string, q: number) => void, removeProduct: (id: string) => void, user: any }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '', phone: user.contact || '', address: '' });
    }
  }, [user]);

  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          items: cart,
          totalAmount: total
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Our team will get back to you shortly');
        onClose();
        // Clear cart event
        window.dispatchEvent(new Event('jj_clear_cart'));
      } else {
        alert(`Checkout failed: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Checkout error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '8px', background: C.white, border: 'none', color: C.maroon, outline: 'none', marginBottom: '12px', fontSize: '14px', fontFamily: 'var(--font-inter-family), sans-serif', boxSizing: 'border-box' as 'border-box' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />
      <div style={{ position: 'relative', width: '100%', maxWidth: '460px', background: 'rgba(26,3,3,0.98)', borderLeft: `1px solid ${C.gold}33`, height: '100%', display: 'flex', flexDirection: 'column', padding: '36px', boxSizing: 'border-box', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', color: C.gold, border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        
        <h3 style={{ fontSize: '24px', color: C.white, marginBottom: '24px', fontWeight: 700, fontFamily: 'var(--font-cormorant-family), serif' }}>Sacred Offerings Cart</h3>
        
        {cart.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: C.beige, opacity: 0.5 }}>
            <span style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</span>
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '300px', overflowY: 'auto', paddingRight: '8px' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: `1px solid ${C.gold}11` }}>
                  <img src={item.img} alt={item.name} style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: C.white }}>{item.name}</div>
                    <div style={{ fontSize: '13px', color: C.gold, marginTop: '2px' }}>₹{item.price}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{ background: 'none', border: `1px solid ${C.gold}33`, color: C.gold, width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer' }}>-</button>
                    <span style={{ fontSize: '14px', color: C.white }}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{ background: 'none', border: `1px solid ${C.gold}33`, color: C.gold, width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer' }}>+</button>
                  </div>
                  <button onClick={() => removeProduct(item.id)} style={{ background: 'none', border: 'none', color: C.error, cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                </div>
              ))}
            </div>

            <div style={{ height: '1px', background: `${C.gold}22`, margin: '12px 0' }} />

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700, color: C.gold }}>
              <span>Total Sourced:</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>

            {/* Checkout details form */}
            <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
              <h4 style={{ fontSize: '14px', color: C.beige, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Delivery & Contact Information</h4>
              <input type="text" placeholder="Full Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
              <input type="email" placeholder="Email Address" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
              <input type="tel" placeholder="WhatsApp / Contact Number" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
              <textarea placeholder="Complete Delivery Address" required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
              
              <button type="submit" disabled={loading} style={{ width: '100%', background: `linear-gradient(135deg, ${C.goldDark}, ${C.gold})`, color: C.maroon, border: 'none', borderRadius: '100px', padding: '16px', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.1em', marginTop: '12px' }}>
                {loading ? 'Submitting Sourcing Request...' : 'Place Sourcing Order'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SUBSCRIPTION REGISTRATION MODAL ──────────────────────────────────────────
function SubscriptionModal({ isOpen, onClose, plan, billingMode, user }: { isOpen: boolean, onClose: () => void, plan: any, billingMode: 'monthly' | 'annual', user: any }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '', phone: user.contact || '', address: '' });
    }
  }, [user]);

  if (!isOpen || !plan) return null;

  const price = billingMode === 'annual' ? plan.annualPrice : plan.price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/subscription/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          planId: plan.id,
          planName: plan.name,
          planPrice: price,
          billingMode
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Our team will get back to you shortly');
        onClose();
      } else {
        alert(`Subscription failed: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Subscription error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '8px', background: C.white, border: 'none', color: C.maroon, outline: 'none', marginBottom: '12px', fontSize: '14px', fontFamily: 'var(--font-inter-family), sans-serif', boxSizing: 'border-box' as 'border-box' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />
      <div style={{ position: 'relative', width: '100%', maxWidth: '480px', background: 'rgba(26,3,3,0.98)', border: `1px solid ${C.gold}33`, borderRadius: '24px', padding: '40px', boxSizing: 'border-box', zIndex: 1 }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', color: C.gold, border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2"><path d="M12 2C12 2 19 8 19 13C19 16.866 15.866 20 12 20C8.13401 20 5 16.866 5 13C5 8 12 2 12 2Z" fill={`${C.gold}33`}/></svg>
        </div>

        <h3 style={{ fontSize: '22px', color: C.white, marginBottom: '8px', fontWeight: 700, textAlign: 'center', fontFamily: 'var(--font-cormorant-family), serif' }}>Sacred Subscription Registration</h3>
        <p style={{ fontSize: '14px', color: C.gold, textAlign: 'center', marginBottom: '24px' }}>
          Plan: <strong>{plan.name}</strong> ({billingMode === 'annual' ? 'Annual' : 'Monthly'} — ₹{price}/{billingMode === 'annual' ? 'yr' : 'mo'})
        </p>

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
          <input type="email" placeholder="Email Address" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
          <input type="tel" placeholder="WhatsApp / Contact Number" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
          <textarea placeholder="Complete Delivery Address" required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
          
          <button type="submit" disabled={loading} style={{ width: '100%', background: `linear-gradient(135deg, ${C.goldDark}, ${C.gold})`, color: C.maroon, border: 'none', borderRadius: '100px', padding: '16px', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.15em', marginTop: '12px' }}>
            {loading ? 'Activating Subscription...' : 'Submit Registration Request'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState('shop');
  const [user, setUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [showAffiliate, setShowAffiliate] = useState(false);

  // Cart & Subscription states
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeSubPlan, setActiveSubPlan] = useState<any>(null);
  const [subBillingMode, setSubBillingMode] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    const savedUser = localStorage.getItem('jj_cust_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('jj_cart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) {}
    }

    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }); },
      { rootMargin: '-40% 0px -40% 0px' }
    );
    NAV_SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });

    // Handle clear cart event
    const handleClearCartEvent = () => {
      setCart([]);
      localStorage.removeItem('jj_cart');
    };
    window.addEventListener('jj_clear_cart', handleClearCartEvent);

    return () => {
      observer.disconnect();
      window.removeEventListener('jj_clear_cart', handleClearCartEvent);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jj_cust_token');
    localStorage.removeItem('jj_cust_user');
    setUser(null);
  };

  // Add item to cart
  const handleAddToCart = (product: any) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      let updated;
      if (existing) {
        updated = prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updated = [...prevCart, { ...product, quantity: 1 }];
      }
      localStorage.setItem('jj_cart', JSON.stringify(updated));
      return updated;
    });
  };

  // Update item quantity
  const handleUpdateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart(prevCart => {
      const updated = prevCart.map(item => item.id === id ? { ...item, quantity: qty } : item);
      localStorage.setItem('jj_cart', JSON.stringify(updated));
      return updated;
    });
  };

  // Remove item from cart
  const handleRemoveFromCart = (id: string) => {
    setCart(prevCart => {
      const updated = prevCart.filter(item => item.id !== id);
      localStorage.setItem('jj_cart', JSON.stringify(updated));
      return updated;
    });
  };

  // Open subscription registration modal
  const handleSubscribe = (plan: any, billingMode: 'monthly' | 'annual') => {
    setActiveSubPlan(plan);
    setSubBillingMode(billingMode);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <AuthModal mode={authMode} setMode={setAuthMode} onLogin={setUser} />
      <Navbar active={active} setActive={setActive} user={user} setAuthMode={setAuthMode} onLogout={handleLogout} cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} updateQty={handleUpdateQty} removeProduct={handleRemoveFromCart} user={user} />
      <SubscriptionModal isOpen={activeSubPlan !== null} onClose={() => setActiveSubPlan(null)} plan={activeSubPlan} billingMode={subBillingMode} user={user} />
      
      <main>
        {active === 'orders' ? (
          <OrdersSection />
        ) : (
          <>
            <HomeSection />
            <TrustTicker />
            <FeaturesSection />
            <MarginsSection />
            <SupplyInfoSection />
            <PanchangaSection />
            <AboutSection />
            <CatalogSection user={user} setAuthMode={setAuthMode} onAddToCart={handleAddToCart} />
            <SubscriptionSection user={user} onSubscribe={handleSubscribe} />
            <FaqSection />
            <ReachOutSection onJoin={() => {
              setShowAffiliate(true);
              setTimeout(() => document.getElementById('affiliate')?.scrollIntoView({ behavior: 'smooth' }), 100);
            }} />
            {showAffiliate && <AffiliateSection />}
          </>
        )}
      </main>

      {/* Footer Panoramic Strip */}
      <div className="footer-image-strip">
        <img src="/assets/footer_banner.jpg" alt="Heritage ritual space" loading="lazy" fetchPriority="low" />
        <div className="footer-image-strip-overlay">
          <span className="type-quote" style={{ fontSize: '20px', color: 'var(--color-text-secondary)' }}>
            "Sanctity in every product. Delivered with reverence."
          </span>
          <span className="type-label" style={{ marginTop: '10px', display: 'block', color: 'var(--color-gold-mid)', fontSize: '9px' }}>— JAYA JANARDHANA</span>
        </div>
      </div>

      <Footer />
    </>
  );
}

