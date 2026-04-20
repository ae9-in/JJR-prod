
'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';

// ─── COLORS & GLOBAL CONFIG ────────────────────────────────────────────────────────
const C = {
  gold: '#C5A059', goldDark: '#8e6c27', goldLight: '#f7e7c0',
  maroon: '#1A0303', maroonLight: '#2D0505', beige: '#E6D5B8',
  white: '#F5F0E1', success: '#10b981', error: '#ef4444'
};
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 'p1', cat: 'Daily Pooja', name: '100% Pure Camphor', price: 219, commission: 15, img: '/assets/products/Camphor JJ.png' },
  { id: 'p2', cat: 'Daily Pooja', name: 'Sacred Deepa Oil', price: 209, commission: 12, img: '/assets/products/Pooja Oil JJ.png' },
  { id: 'p3', cat: 'Incense & Resins', name: 'Sandalwood Bliss Agarbatti', price: 59, commission: 20, img: '/assets/products/Agarbhatti Sandalwood JJ.png' },
  { id: 'p4', cat: 'Incense & Resins', name: 'Sandalwood Dhoop', price: 59, commission: 20, img: '/assets/products/Sandalwood JJ.png' },
  { id: 'p5', cat: 'Daily Pooja', name: 'Arsina + Kunkuma', price: 20, commission: 15, img: '/assets/products/ArsinaKunkuma.png' },
  { id: 'p6', cat: 'Daily Pooja', name: 'Premium Cotton Wicks', price: 10, commission: 10, img: '/assets/products/Cotton Wicks JJ.png' }
];

const NAV_SECTIONS = ['shop', 'about', 'subscription', 'margins'];

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ active, setActive, user, setAuthMode, onLogout }: { active: string; setActive: (s: string) => void, user: any, setAuthMode: (m: 'login' | null) => void, onLogout: () => void }) {
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
        <div style={{ width: 32, height: 32, border: `1px solid ${C.gold}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 16 }}>🕯️</span>
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.15em', color: C.gold }}>JAYA JANARDHANA</div>
          <div style={{ fontSize: '9px', letterSpacing: '0.3em', opacity: 0.5, fontFamily: 'Inter,sans-serif', textTransform: 'uppercase', color: C.beige }}>Sacred Goods Storefront</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        {NAV_SECTIONS.map(s => (
          <button key={s} onClick={() => scrollTo(s)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
            fontFamily: 'Inter,sans-serif', fontWeight: 500,
            color: active === s ? C.gold : `${C.beige}80`,
            borderBottom: active === s ? `1px solid ${C.gold}` : '1px solid transparent',
            paddingBottom: '2px', transition: 'all 0.2s'
          }}>{s === 'shop' ? 'Shop' : s === 'affiliate' ? 'Affiliates' : s}</button>
        ))}
        {user && (
          <button onClick={() => scrollTo('orders')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
            fontFamily: 'Inter,sans-serif', fontWeight: 500,
            color: active === 'orders' ? C.gold : `${C.beige}80`,
            borderBottom: active === 'orders' ? `1px solid ${C.gold}` : '1px solid transparent',
            paddingBottom: '2px', transition: 'all 0.2s'
          }}>My Orders</button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '16px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '11px', color: C.beige, opacity: 0.8, background: `${C.gold}11`, padding: '6px 12px', borderRadius: '100px', border: `1px solid ${C.gold}33` }}>👤 {user.name}</div>
              <button onClick={onLogout} style={{ background: 'none', border: 'none', color: C.gold, fontSize: '10px', textTransform: 'uppercase', cursor: 'pointer', opacity: 0.7 }}>Logout</button>
            </div>
          ) : (
            <button onClick={() => setAuthMode('login')} style={{ background: 'none', border: 'none', color: C.gold, fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif', cursor: 'pointer', fontWeight: 600 }}>Login</button>
          )}
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
      const res = await fetch(`${API_URL}${endpoint}`, {
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
      setError(err.message || 'Could not reach backend. Is it running on port 5000?');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '16px', borderRadius: '12px', background: C.white, border: `2px solid transparent`, color: C.maroon, outline: 'none', marginBottom: '16px', fontFamily: 'Inter,sans-serif', boxSizing: 'border-box' as 'border-box', fontWeight: 500 };

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
        <div style={{ fontSize: '32px', marginBottom: '16px', textAlign: 'center' }}>🕯️</div>
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
    <section id="home" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 40px 80px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: '800px', height: '800px', background: `radial-gradient(ellipse, ${C.goldDark}15 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 24px', border: `1px solid ${C.gold}33`, borderRadius: '100px', background: `${C.gold}11`, marginBottom: '32px' }}>
        <span style={{ fontSize: '12px', color: C.gold }}>✨</span>
        <span style={{ fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.gold, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Authentic Devotional Needs</span>
      </div>
      <h1 style={{ fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 900, lineHeight: 1.05, marginBottom: '24px', color: C.white }}>
        Pure Products for<br />
        <span style={{ fontStyle: 'italic', background: `linear-gradient(135deg, ${C.goldDark}, ${C.goldLight})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' as any }}>Daily Worship.</span>
      </h1>
      <div style={{ width: '120px', height: '1px', background: `linear-gradient(90deg, transparent, ${C.gold}60, transparent)`, margin: '0 auto 32px' }} />
      <p style={{ fontSize: '18px', opacity: 0.7, maxWidth: '600px', lineHeight: 1.8, fontWeight: 300, marginBottom: '48px' }}>
        Discover expertly crafted camphor, mastergrade incense, and authentic daily ritual products crafted straight from heritage centers.
      </p>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '80px' }}>
        <button onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: `linear-gradient(135deg, ${C.goldDark}, ${C.gold})`, color: C.maroon, border: 'none', padding: '18px 40px', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif', fontWeight: 700, cursor: 'pointer', borderRadius: '4px' }}>
          Explore The Collection →
        </button>
      </div>
      <div style={{ display: 'flex', gap: '48px', opacity: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['🔥 Premium Quality', '⚡ Fast Delivery', '🤝 Trusted By Families'].map(t => (
          <span key={t} style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif' }}>{t}</span>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '1100px', width: '100%', marginTop: '100px' }}>
        {[
          { icon: '🌿', title: '100% Pure Elements', desc: 'No synthetics. We provide natural camphor and pure oils for safe daily respiratory exposure.', link: 'shop' },
          { icon: '📦', title: 'Heritage Sourced', desc: 'Secure verified metalware, incense, and ritual consumables straight from traditional artisans.', link: 'shop' },
          { icon: '🙏', title: 'Family Trusted', desc: 'Used in thousands of homes daily. We maintain the highest standards of spiritual sanctity.', link: 'about' },
        ].map((card, i) => (
          <div key={i} onClick={() => document.getElementById(card.link)?.scrollIntoView({ behavior: 'smooth' })} style={{ background: 'rgba(26,3,3,0.9)', border: `1px solid rgba(197,160,89,0.15)`, borderRadius: '16px', padding: '40px', cursor: 'pointer', transition: 'all 0.3s', textAlign: 'left' }}>
            <div style={{ fontSize: '32px', marginBottom: '20px' }}>{card.icon}</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: C.white }}>{card.title}</h3>
            <p style={{ fontSize: '14px', opacity: 0.6, lineHeight: 1.7, fontFamily: 'Inter,sans-serif', fontWeight: 300 }}>{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section id="about" style={{ padding: '120px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <span style={{ fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.gold, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: '16px' }}>Who We Are</span>
        <h2 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 900, color: C.white, marginBottom: '24px', lineHeight: 1.1 }}>Sacred Quality<br />For Your Home.</h2>
        <div style={{ width: '60px', height: '1px', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, margin: '0 auto 32px' }} />
        <p style={{ fontSize: '18px', opacity: 0.7, maxWidth: '680px', margin: '0 auto', lineHeight: 1.8, fontFamily: 'Inter,sans-serif', fontWeight: 300 }}>
          Jaya Janardhana is dedicated to delivering directly to you. We bypass complex supply chains to ensure you receive the safest, purest ritual components straight to your doorstep.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '80px' }}>
        {[
          { icon: '🙏', title: 'Daily Worship', desc: 'Safely burn camphor and agarbatti without inhaling toxic synthetics.' },
          { icon: '🏡', title: 'Peaceful Homes', desc: 'Elevate your household atmosphere with authentic heritage fragrances.' },
          { icon: '✨', title: 'Complete Rituals', desc: 'Everything you need, carefully packaged and delivered fast.' },
        ].map((item, i) => (
          <div key={i} style={{ background: 'rgba(26,3,3,0.8)', border: `1px solid rgba(197,160,89,0.2)`, borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>{item.icon}</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: C.white }}>{item.title}</h3>
            <p style={{ fontSize: '14px', opacity: 0.6, lineHeight: 1.7, fontFamily: 'Inter,sans-serif', fontWeight: 300 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CATALOG ──────────────────────────────────────────────────────────────────
function CatalogSection({ user, setAuthMode }: { user: any, setAuthMode: (m: 'login') => void }) {
  const [filter, setFilter] = useState('All');
  const [products, setProducts] = useState(PRODUCTS);
  const [processingProduct, setProcessingProduct] = useState<string | null>(null);
  
  useEffect(() => {
    fetch(`${API_URL}/products`).then(r => r.json()).then(d => {
      if (d.products && d.products.length > 0) {
        setProducts(d.products.map((p: any) => ({
          id: p._id, cat: p.category || 'Incense & Resins', name: p.name, price: p.price, img: p.imageUrl || '/assets/products/Camphor JJ.png'
        })));
      }
    }).catch(err => console.warn('Using fallback static catalog products.', err.message));
  }, []);

  const cats = ['All', 'Incense & Resins', 'Daily Pooja'];
  const filtered = filter === 'All' ? products : products.filter(p => p.cat === filter);

  const buyProduct = async (product: typeof PRODUCTS[0]) => {
    setProcessingProduct(product.id);
    try {
      const res = await fetch('/api/subscription/create-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: product.id, planName: product.name, planPrice: product.price * 100, userId: user?.id || 'guest', name: user?.name, email: user?.email, phone: user?.contact, address: 'Customer Address' })
      });
      const order = await res.json();
      if (order.error) throw new Error(order.error);

      const options = {
        key: order.keyId, amount: order.amount, currency: order.currency,
        name: 'Jaya Janardhana', description: `Purchase: ${product.name}`,
        order_id: order.orderId,
        handler: async (response: any) => alert('✨ Sacred offering ordered successfully!'),
        prefill: { name: user?.name, email: user?.email, contact: user?.contact },
        theme: { color: C.gold }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(`Checkout failed: ${err.message}`);
    } finally {
      setProcessingProduct(null);
    }
  };

  return (
    <section id="shop" style={{ padding: '80px 40px', maxWidth: '1300px', margin: '0 auto' }}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: '60px' }}>
        <div>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, color: C.gold, marginBottom: '8px' }}>The Collection.</h2>
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.4, fontFamily: 'Inter,sans-serif' }}>Open Product Catalog</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', background: 'rgba(26,3,3,0.8)', padding: '8px', border: `1px solid rgba(197,160,89,0.15)`, borderRadius: '8px' }}>
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{ background: filter === c ? `linear-gradient(135deg, ${C.goldDark}, ${C.gold})` : 'none', border: 'none', color: filter === c ? C.maroon : `${C.beige}60`, padding: '8px 16px', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif', fontWeight: filter === c ? 700 : 400, cursor: 'pointer', borderRadius: '4px', transition: 'all 0.2s' }}>{c}</button>
          ))}
        </div>
      </div>
      {!user ? (
        <div style={{ textAlign: 'center', padding: '100px 20px', background: 'rgba(26,3,3,0.9)', border: `1px solid rgba(197,160,89,0.15)`, borderRadius: '16px' }}>
          <div style={{ fontSize: '48px', marginBottom: '24px' }}>🔒</div>
          <h3 style={{ fontSize: '24px', fontWeight: 700, color: C.white, marginBottom: '16px' }}>Exclusive Catalog</h3>
          <p style={{ fontSize: '16px', opacity: 0.6, maxWidth: '400px', margin: '0 auto 32px', fontFamily: 'Inter,sans-serif', lineHeight: 1.6 }}>Please sign in or create a customer account to view all of our sacred items.</p>
          <button onClick={() => setAuthMode('login')} style={{ background: `linear-gradient(135deg, ${C.goldDark}, ${C.gold})`, color: C.maroon, border: 'none', padding: '16px 40px', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif', fontWeight: 700, cursor: 'pointer', borderRadius: '100px' }}>
            Login to View Products
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
          {filtered.map(p => (
            <div key={p.id} style={{ background: 'rgba(26,3,3,0.9)', border: `1px solid rgba(197,160,89,0.15)`, borderRadius: '12px', overflow: 'hidden', transition: 'all 0.3s' }}>
              <div style={{ height: '220px', width: '100%', overflow: 'hidden', position: 'relative', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={p.img} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, fontFamily: 'Inter,sans-serif', marginBottom: '8px', opacity: 0.7 }}>{p.cat}</div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '12px', color: C.white }}>{p.name}</h3>
                <div style={{ fontSize: '22px', fontWeight: 700, color: C.gold, marginBottom: '16px' }}>₹{p.price.toLocaleString('en-IN')}</div>
                <button onClick={() => buyProduct(p as any)} disabled={processingProduct === p.id} style={{ background: `linear-gradient(135deg, ${C.goldDark}, ${C.gold})`, color: C.maroon, border: 'none', padding: '12px', width: '100%', borderRadius: '8px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', cursor: processingProduct === p.id ? 'not-allowed' : 'pointer', opacity: processingProduct === p.id ? 0.7 : 1 }}>
                  {processingProduct === p.id ? 'Processing...' : 'Secure Order'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── SUBSCRIPTION ──────────────────────────────────────────────────────────────
function SubscriptionSection({ user }: { user: any }) {
  const [billingMode, setBillingMode] = useState<'monthly' | 'annual'>('monthly');
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const plans = [
    { id: 'sub_pooja', name: 'Daily Pooja Kit', price: 499, annualPrice: 5988, features: ['Complete pooja essentials kit', '3-in-1 premium agarbatti (100g)', 'Pure camphor (100g)', 'Sacred deepa oil (800ml)', 'Traditional dhoop sticks (100g)', 'Ready cotton wicks (40 units)', 'Sacred kumkuma packet'] },
    { id: 'sub_partner', name: 'Divine Partner Pack', price: 799, annualPrice: 9588, features: ['Multiple kits for home & temple', 'Priority doorstep delivery', 'Handpicked premium heritage grade', 'Weekly ritual community support', 'Dedicated account manager', 'Exclusive dhoop access', 'Guaranteed uninterrupted rituals'], featured: true }
  ];
  const subscribe = async (plan: typeof plans[0]) => {
    setProcessingPlan(plan.id);
    const amount = billingMode === 'monthly' ? plan.price : plan.annualPrice;
    try {
      const res = await fetch('/api/subscription/create-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id, planName: plan.name, planPrice: amount * 100, userId: user?.id || 'guest', name: user?.name, email: user?.email, phone: user?.contact, address: 'Subscriber' })
      });
      const order = await res.json();
      if (order.error) throw new Error(order.error);
      const options = {
        key: order.keyId, amount: order.amount, currency: order.currency,
        name: 'Jaya Janardhana', description: `Subscription: ${plan.name}`,
        order_id: order.orderId,
        handler: (response: any) => alert('✨ Subscription confirmed!'),
        prefill: { name: user?.name, email: user?.email, contact: user?.contact },
        theme: { color: C.gold }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(`Subscription failed: ${err.message}`);
    } finally {
      setProcessingPlan(null);
    }
  };
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
          <div key={p.id} style={{ background: p.featured ? 'rgba(45,5,5,1)' : 'rgba(26,3,3,0.9)', border: p.featured ? `1.5px solid ${C.gold}` : `1px solid ${C.gold}33`, borderRadius: '24px', padding: '48px', position: 'relative', overflow: 'hidden' }}>
            {p.featured && <div style={{ position: 'absolute', top: 0, right: '32px', background: C.gold, color: C.maroon, fontSize: '10px', fontWeight: 900, padding: '8px 16px', borderRadius: '0 0 8px 8px', textTransform: 'uppercase' }}>Recommended</div>}
            <div style={{ fontSize: '12px', color: C.gold, fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase' }}>{p.name}</div>
            <div style={{ fontSize: '48px', fontWeight: 900, color: C.white, marginBottom: '24px' }}>
              <span style={{ fontSize: '24px', verticalAlign: 'super', marginRight: '4px' }}>₹</span>
              {billingMode === 'monthly' ? p.price : p.annualPrice}
            </div>
            <div style={{ width: '100%', height: '1px', background: `${C.gold}22`, margin: '0 0 32px' }} />
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {p.features.map(f => <li key={f} style={{ fontSize: '14px', opacity: 0.7, display: 'flex', gap: '12px' }}><span style={{ color: C.gold }}>✦</span> {f}</li>)}
            </ul>
            <button onClick={() => subscribe(p)} disabled={processingPlan === p.id} style={{ width: '100%', background: p.featured ? `linear-gradient(135deg, ${C.goldDark}, ${C.gold})` : 'none', border: p.featured ? 'none' : `1px solid ${C.gold}55`, color: p.featured ? C.maroon : C.gold, padding: '16px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}>
              {processingPlan === p.id ? 'Processing...' : (user ? 'Subscribe Now' : 'Sign in to Subscribe')}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── MARGINS ──────────────────────────────────────────────────────────────────
function MarginsSection() {
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
              {['30–35% Commission Per Product', 'Earnings Visible Before Ordering', 'Reliable Communal Sourcing', 'No Upfront Entry Fees'].map(point => (
                <div key={point} style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '15px', color: C.beige }}>
                   <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.gold, boxShadow: `0 0 10px ${C.gold}` }} />
                   {point}
                </div>
              ))}
           </div>
        </div>
        <div style={{ position: 'relative', textAlign: 'center' }}>
           <div style={{ padding: '80px 40px', background: 'rgba(26,3,3,0.95)', border: `1px solid ${C.gold}33`, borderRadius: '32px' }}>
              <div style={{ fontSize: '12px', opacity: 0.5, marginBottom: '12px', letterSpacing: '0.2em' }}>AVERAGE COMMISSION</div>
              <div style={{ fontSize: '120px', fontWeight: 900, fontStyle: 'italic', background: `linear-gradient(135deg, ${C.goldDark}, ${C.goldLight})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>35%</div>
              <div style={{ display: 'inline-flex', padding: '8px 24px', background: `${C.gold}11`, border: `1px solid ${C.gold}33`, borderRadius: '100px', color: C.gold, fontSize: '11px', fontWeight: 700, marginTop: '24px' }}>Flat Performance Rate</div>
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
      const res = await fetch(`${API_URL}/auth/register`, {
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
              { t: 'Transparent Commissions', d: 'Earn up to 35% on every sacred item delivered through your network.' },
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
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>✨</div>
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
    <footer style={{ padding: '60px 40px', borderTop: `1px solid rgba(197,160,89,0.1)`, textAlign: 'center' }}>
      <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.2em', color: C.gold, marginBottom: '8px' }}>JAYA JANARDHANA</div>
      <div style={{ fontSize: '11px', opacity: 0.4, fontFamily: 'Inter,sans-serif', letterSpacing: '0.2em' }}>SACRED GOODS STOREFRONT</div>
      <div style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${C.gold}30, transparent)`, margin: '24px auto', maxWidth: '300px' }} />
      <div style={{ fontSize: '12px', opacity: 0.3, fontFamily: 'Inter,sans-serif' }}>© {new Date().getFullYear()} Jaya Janardhana. Heritage Community Marketplace.</div>
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

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState('shop');
  const [user, setUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [showAffiliate, setShowAffiliate] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('jj_cust_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }); },
      { rootMargin: '-40% 0px -40% 0px' }
    );
    NAV_SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jj_cust_token');
    localStorage.removeItem('jj_cust_user');
    setUser(null);
  };

  return (
    <>
      <AuthModal mode={authMode} setMode={setAuthMode} onLogin={setUser} />
      <Navbar active={active} setActive={setActive} user={user} setAuthMode={setAuthMode} onLogout={handleLogout} />
      <main>
        {active === 'orders' ? (
          <OrdersSection />
        ) : (
          <>
            <HomeSection />
            <AboutSection />
            <CatalogSection user={user} setAuthMode={setAuthMode} />
            <SubscriptionSection user={user} />
            <MarginsSection />
            <ReachOutSection onJoin={() => {
              setShowAffiliate(true);
              setTimeout(() => document.getElementById('affiliate')?.scrollIntoView({ behavior: 'smooth' }), 100);
            }} />
            {showAffiliate && <AffiliateSection />}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
