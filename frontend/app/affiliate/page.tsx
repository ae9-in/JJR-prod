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
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) return envUrl;
  if (typeof window !== 'undefined') return `http://${window.location.hostname}:5050/api`;
  return 'http://localhost:5050/api';
};
const API_URL = getDefaultApiUrl();

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 'p1', cat: 'Daily Pooja', name: '100% Pure Camphor', price: 219, commission: 15, img: '/assets/products/Camphor JJ.png' },
  { id: 'p2', cat: 'Daily Pooja', name: 'Sacred Deepa Oil', price: 209, commission: 12, img: '/assets/products/Pooja Oil JJ.png' },
  { id: 'p3', cat: 'Incense & Resins', name: 'Sandalwood Bliss Agarbatti', price: 59, commission: 20, img: '/assets/products/Agarbhatti Sandalwood JJ.png' },
  { id: 'p4', cat: 'Incense & Resins', name: 'Sandalwood Dhoop', price: 59, commission: 20, img: '/assets/products/Sandalwood JJ.png' },
  { id: 'p5', cat: 'Daily Pooja', name: 'Arsina + Kunkuma', price: 20, commission: 15, img: '/assets/products/ArsinaKunkuma.png' },
  { id: 'p6', cat: 'Daily Pooja', name: 'Premium Cotton Wicks', price: 10, commission: 10, img: '/assets/products/Cotton Wicks JJ.png' }
];

const PLANS = [
  { id: 'basic', name: 'Daily Pooja Kit', price: 499, description: 'Everything for your daily ritual', features: ['Complete pooja essentials kit', '3-in-1 premium agarbatti (100g)', 'Pure camphor for aarti (100g)', 'High-quality deepa oil (800ml)', 'Traditional dhoop sticks (100g)', 'Cotton wicks (40 units)', 'Sacred kumkuma packet'] },
  { id: 'standard', name: 'Divine Partner Pack', price: 799, popular: true, description: 'For families & temple communities', features: ['Multiple kits for home & temple', 'Priority doorstep delivery', 'Handpicked premium heritage grade', 'Weekly community ritual strategy', 'Dedicated sacred accounts manager', 'Exclusive access to custom dhoop', 'Uninterrupted daily rituals'] },
];

const NAV_SECTIONS = ['home', 'about', 'catalog', 'subscribe', 'margins'];

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ active, setActive, user, setAuthMode, onLogout }: { active: string; setActive: (s: string) => void, user: any, setAuthMode: (m: 'login' | null) => void, onLogout: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setActive(id);
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
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
          <div style={{ fontSize: '9px', letterSpacing: '0.3em', opacity: 0.5, fontFamily: 'Inter,sans-serif', textTransform: 'uppercase', color: C.beige }}>Affiliate Portal</div>
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
          }}>{s}</button>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '11px', color: C.beige, opacity: 0.8, background: `${C.gold}11`, padding: '6px 12px', borderRadius: '100px', border: `1px solid ${C.gold}33` }}>👤 {user.name}</div>
              <button onClick={onLogout} style={{ background: 'none', border: 'none', color: C.gold, fontSize: '10px', textTransform: 'uppercase', cursor: 'pointer', opacity: 0.7 }}>Logout</button>
            </div>
          ) : (
            <button onClick={() => setAuthMode('login')} style={{ background: 'none', border: 'none', color: C.gold, fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif', cursor: 'pointer', fontWeight: 600 }}>Login</button>
          )}
          <button onClick={() => scrollTo('subscribe')} style={{
            background: 'none', border: `1px solid ${C.gold}`, padding: '8px 20px',
            color: C.gold, fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
            fontFamily: 'Inter,sans-serif', cursor: 'pointer', transition: 'all 0.2s',
            fontWeight: 600
          }}>Subscribe</button>
        </div>
      </div>
    </nav>
  );
}

// ─── HERO / HOME ──────────────────────────────────────────────────────────────
function HomeSection() {
  return (
    <section id="home" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 40px 80px', position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: '800px', height: '800px', background: `radial-gradient(ellipse, ${C.goldDark}15 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 24px', border: `1px solid ${C.gold}33`, borderRadius: '100px', background: `${C.gold}11`, marginBottom: '32px' }}>
        <span style={{ fontSize: '12px', color: C.gold }}>🛡️</span>
        <span style={{ fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.gold, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Heritage Community Marketplace</span>
      </div>

      <h1 style={{ fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 900, lineHeight: 1.05, marginBottom: '24px', color: C.white }}>
        The Source for<br />
        <span style={{ fontStyle: 'italic', background: `linear-gradient(135deg, ${C.goldDark}, ${C.goldLight})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' as any }}>Sacred Distribution.</span>
      </h1>

      <div style={{ width: '120px', height: '1px', background: `linear-gradient(90deg, transparent, ${C.gold}60, transparent)`, margin: '0 auto 32px' }} />

      <p style={{ fontSize: '18px', opacity: 0.7, maxWidth: '600px', lineHeight: 1.8, fontWeight: 300, marginBottom: '48px' }}>
        We bridge the gap between traditional craftsmanship and independent distributors. High-integrity sourcing, guaranteed margins, communal trust.
      </p>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '80px' }}>
        <button onClick={() => document.getElementById('subscribe')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: `linear-gradient(135deg, ${C.goldDark}, ${C.gold})`, color: C.maroon, border: 'none', padding: '18px 40px', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif', fontWeight: 700, cursor: 'pointer', borderRadius: '4px' }}>
          Subscribe Now →
        </button>
        <button onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: 'none', color: C.gold, border: `1px solid ${C.gold}66`, padding: '18px 40px', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif', fontWeight: 600, cursor: 'pointer', borderRadius: '4px' }}>
          View Catalog
        </button>
      </div>

      <div style={{ display: 'flex', gap: '48px', opacity: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['🔥 Direct Sourcing', '🔔 Member Margins', '💨 Shared Logistics'].map(t => (
          <span key={t} style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif' }}>{t}</span>
        ))}
      </div>

      {/* Feature cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '1100px', width: '100%', marginTop: '100px' }}>
        {[
          { icon: '📈', title: 'Transparent Earnings', desc: 'Know exactly what you earn on every sacred item. Our member pricing is fixed to protect your distribution profits.', link: 'margins' },
          { icon: '📦', title: 'Heritage Catalog', desc: 'Access verified metalware, incense, and ritual consumables sourced from master craft centers across Bharat.', link: 'catalog' },
          { icon: '🤝', title: 'Community Trust', desc: 'Join a network of poojaris and local resellers. We succeed when our collective community thrives.', link: 'about' },
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
        <h2 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 900, color: C.white, marginBottom: '24px', lineHeight: 1.1 }}>A Community-First<br />Sourcing Platform.</h2>
        <div style={{ width: '60px', height: '1px', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, margin: '0 auto 32px' }} />
        <p style={{ fontSize: '18px', opacity: 0.7, maxWidth: '680px', margin: '0 auto', lineHeight: 1.8, fontFamily: 'Inter,sans-serif', fontWeight: 300 }}>
          Jaya Janardhana is a dedicated network for sourcing high-quality spiritual products. We bridge the gap between traditional craftsmanship and independent distributors, ensuring transparency, reliable margins, and simplified logistics for everyone.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '80px' }}>
        {[
          { icon: '🙏', title: 'Poojaris & Priests', desc: 'Source ritual materials for your daily poojas and devotee requirements directly.' },
          { icon: '🏪', title: 'Small Shop Owners', desc: 'Stock authentic, high-quality inventory without navigating complex wholesale markets.' },
          { icon: '💼', title: 'Independent Resellers', desc: 'Build a home-based business distributing sacred goods to your local network.' },
        ].map((item, i) => (
          <div key={i} style={{ background: 'rgba(26,3,3,0.8)', border: `1px solid rgba(197,160,89,0.2)`, borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>{item.icon}</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: C.white }}>{item.title}</h3>
            <p style={{ fontSize: '14px', opacity: 0.6, lineHeight: 1.7, fontFamily: 'Inter,sans-serif', fontWeight: 300 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div style={{ background: 'rgba(26,3,3,0.4)', border: `1px solid rgba(197,160,89,0.1)`, borderRadius: '16px', padding: '60px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '48px', color: C.white }}>How The Partner Model Works</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '32px' }}>
          {[
            { step: '01', title: 'Join', desc: 'Register as a verified affiliate partner. No upfront fees.' },
            { step: '02', title: 'Source', desc: 'Access our catalog of verified sacred products at member prices.' },
            { step: '03', title: 'Distribute', desc: 'Place orders for your community or retail needs.' },
            { step: '04', title: 'Earn', desc: 'Track your margins and earnings transparently on your dashboard.' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '48px', fontWeight: 900, color: `${C.gold}15`, lineHeight: 1, marginBottom: '8px' }}>{s.step}</div>
              <h4 style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, fontFamily: 'Inter,sans-serif', fontWeight: 600, marginBottom: '8px' }}>{s.title}</h4>
              <p style={{ fontSize: '13px', opacity: 0.6, lineHeight: 1.7, fontFamily: 'Inter,sans-serif', fontWeight: 300 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CATALOG ──────────────────────────────────────────────────────────────────
function CatalogSection() {
  const [filter, setFilter] = useState('All');
  const [products, setProducts] = useState(PRODUCTS);
  
  useEffect(() => {
    fetch(`${API_URL}/products`).then(r => r.json()).then(d => {
      if (d.products && d.products.length > 0) {
        setProducts(d.products.map((p: any) => ({
          id: p._id, cat: p.category || 'Incense & Resins', name: p.name, price: p.price, commission: p.commissionRate, img: p.imageUrl || '/assets/products/Camphor JJ.png'
        })));
      }
    }).catch(err => console.warn('Using fallback static catalog products.', err.message));
  }, []);

  const cats = ['All', 'Incense & Resins', 'Daily Pooja'];
  const filtered = filter === 'All' ? products : products.filter(p => p.cat === filter);

  return (
    <section id="catalog" style={{ padding: '120px 40px', maxWidth: '1300px', margin: '0 auto' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background: 'rgba(26,3,3,0.9)', border: `1px solid rgba(197,160,89,0.15)`, borderRadius: '12px', overflow: 'hidden', transition: 'all 0.3s' }}>
            <div style={{ height: '220px', width: '100%', overflow: 'hidden', position: 'relative', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={p.img} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              <div style={{ position: 'absolute', top: '12px', right: '12px', background: `${C.gold}`, color: C.maroon, padding: '4px 10px', fontSize: '10px', fontWeight: 700, fontFamily: 'Inter,sans-serif', borderRadius: '100px' }}>{p.commission}% margin</div>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, fontFamily: 'Inter,sans-serif', marginBottom: '8px', opacity: 0.7 }}>{p.cat}</div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '12px', color: C.white }}>{p.name}</h3>
              <div style={{ fontSize: '22px', fontWeight: 700, color: C.gold }}>₹{p.price.toLocaleString('en-IN')}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── MARGINS ──────────────────────────────────────────────────────────────────
function MarginsSection() {
  return (
    <section id="margins" style={{ padding: '120px 40px', background: 'rgba(26,3,3,0.5)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 900, color: C.white, marginBottom: '16px' }}>How You Earn as a<br />Jaya Janardhana Affiliate</h2>
          <div style={{ width: '60px', height: '1px', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, margin: '0 auto 24px' }} />
          <p style={{ fontSize: '18px', opacity: 0.7, maxWidth: '600px', margin: '0 auto', fontFamily: 'Inter,sans-serif', fontWeight: 300, lineHeight: 1.8 }}>Earn up to 35% commission on verified pooja and spiritual products through transparent member pricing.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '60px', alignItems: 'center', marginBottom: '60px', flexWrap: 'wrap' as any }}>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {['Affiliates earn 30–35% commission per product', 'Margins are fixed and visible before ordering', 'No hidden fees or changing rates', 'Earnings depend on product category and quantity'].map((p, i) => (
              <li key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <span style={{ color: C.gold, fontSize: '16px' }}>✦</span>
                <span style={{ fontSize: '16px', opacity: 0.8, fontFamily: 'Inter,sans-serif', fontWeight: 300, lineHeight: 1.6 }}>{p}</span>
              </li>
            ))}
          </ul>
          <div style={{ background: 'rgba(45,5,5,0.5)', border: `1px solid rgba(197,160,89,0.3)`, borderRadius: '16px', padding: '48px', textAlign: 'center', minWidth: '220px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.5, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: '16px' }}>Flat Performance Rate</span>
            <div style={{ fontSize: '80px', fontWeight: 900, color: C.gold, lineHeight: 1 }}>35%</div>
            <span style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: C.gold, fontFamily: 'Inter,sans-serif', display: 'block', marginTop: '12px' }}>Average Commission</span>
          </div>
        </div>

        {/* Example */}
        <div style={{ background: 'rgba(45,5,5,0.6)', border: `1px solid rgba(197,160,89,0.2)`, borderRadius: '16px', padding: '40px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '32px', color: C.white }}>📊 Real Earning Example</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '24px', textAlign: 'center' }}>
            {[{ label: 'Product', value: 'Brass Deepam' }, { label: 'Member Price', value: '₹650' }, { label: 'Selling Price', value: '₹1,000' }].map((item, i) => (
              <div key={i}>
                <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.4, fontFamily: 'Inter,sans-serif', marginBottom: '8px' }}>{item.label}</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: C.white }}>{item.value}</div>
              </div>
            ))}
            <div style={{ background: `rgba(197,160,89,0.1)`, borderLeft: `1px solid rgba(197,160,89,0.3)`, padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, fontFamily: 'Inter,sans-serif', marginBottom: '8px' }}>Affiliate Earnings</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: C.gold }}>₹350 <span style={{ fontSize: '14px', opacity: 0.6, fontWeight: 400 }}>(35%)</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SUBSCRIPTION / PAYMENT ───────────────────────────────────────────────────
function SubscribeSection({ user, setAuthMode }: { user: any, setAuthMode: (m: 'login') => void }) {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [step, setStep] = useState<'plans' | 'details' | 'processing' | 'success'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);
  // Define a resilient fallback for local testing without DB connection
  const mockUser = { id: '6565_demo', name: 'Jaya Janardhana Devotee', email: 'devotee@example.com', contact: '9876543210' };
  const activeUser = user || mockUser;

  const [form, setForm] = useState({ name: activeUser.name, phone: activeUser.contact, address: '' });
  const [error, setError] = useState('');

  const price = (plan: typeof PLANS[0]) => billing === 'annual' ? plan.price * 12 : plan.price;
  const paise = (plan: typeof PLANS[0]) => price(plan) * 100;

  const pay = async () => {
    if (!selectedPlan) return;
    setStep('processing');
    setError('');
    try {
      const res = await fetch('/api/subscription/create-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selectedPlan.id, planName: `${selectedPlan.name} (${billing})`, planPrice: paise(selectedPlan), userId: activeUser.id, name: form.name, email: activeUser.email, phone: form.phone, address: form.address })
      });
      const order = await res.json();
      if (order.error) throw new Error(order.error);

      const options = {
        key: order.keyId, amount: order.amount, currency: order.currency,
        name: 'Jaya Janardhana', description: `Membership: ${selectedPlan.name}`,
        order_id: order.orderId,
        handler: async (response: any) => {
          setStep('processing');
          const verifyRes = await fetch('/api/subscription/verify-payment', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature, subscriberId: order.subscriberId })
          });
          const verify = await verifyRes.json();
          if (verify.success) setStep('success');
          else throw new Error(verify.error || 'Verification failed');
        },
        prefill: { name: form.name, email: activeUser.email, contact: form.phone },
        theme: { color: C.gold }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      setStep('details');
    } catch (err: any) {
      setError(err.message);
      setStep('details');
    }
  };

  return (
    <section id="subscribe" style={{ padding: '120px 40px', textAlign: 'center', position: 'relative' }}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <span style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: C.gold, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: '16px' }}>✦ Jaya Janardhana Membership ✦</span>
      <h2 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900, marginBottom: '16px', color: C.white, lineHeight: 1.05 }}>
        We grow when<br />
        <span style={{ fontStyle: 'italic', background: `linear-gradient(135deg, ${C.goldDark}, ${C.goldLight})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' as any }}>you grow.</span>
      </h2>
      <p style={{ fontSize: '16px', opacity: 0.5, fontStyle: 'italic', maxWidth: '560px', margin: '0 auto 16px', fontFamily: 'Inter,sans-serif', fontWeight: 300 }}>Join a trusted ecosystem where sourcing is reliable, earnings are clear, and the sanctity of every product is guaranteed.</p>

      {/* Billing toggle */}
      {step === 'plans' && (
        <div style={{ display: 'inline-flex', background: `${C.gold}08`, border: `1px solid ${C.gold}22`, borderRadius: '100px', padding: '4px', marginBottom: '48px' }}>
          {(['monthly', 'annual'] as const).map(m => (
            <button key={m} onClick={() => setBilling(m)} style={{ padding: '10px 28px', borderRadius: '100px', border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: 'Inter,sans-serif', fontWeight: 600, background: billing === m ? C.gold : 'transparent', color: billing === m ? C.maroon : `${C.beige}60`, transition: 'all 0.3s', textTransform: 'capitalize' }}>{m}</button>
          ))}
        </div>
      )}

      {/* Plans */}
      {step === 'plans' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px' }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{ background: 'rgba(26,3,3,0.85)', border: `1px solid ${plan.popular ? C.gold : 'rgba(197,160,89,0.2)'}`, borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '420px', position: 'relative', transform: plan.popular ? 'scale(1.03)' : 'scale(1)', transition: 'all 0.3s', textAlign: 'left' }}>
              {plan.popular && <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', background: C.gold, color: C.maroon, padding: '4px 20px', borderRadius: '0 0 12px 12px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Most Trusted</div>}
              <h3 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '12px', color: C.white }}>{plan.name}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '40px', fontWeight: 700, color: C.gold }}>₹{price(plan).toLocaleString('en-IN')}</span>
                <span style={{ opacity: 0.4, fontSize: '14px' }}>{billing === 'annual' ? '/year' : '/month'}</span>
              </div>
              {billing === 'annual' && <div style={{ fontSize: '12px', color: C.gold, opacity: 0.7, marginBottom: '8px', fontFamily: 'Inter,sans-serif' }}>₹{plan.price}/month × 12</div>}
              <p style={{ opacity: 0.5, fontSize: '13px', fontStyle: 'italic', borderBottom: `1px solid ${C.gold}22`, paddingBottom: '16px', marginBottom: '24px', fontFamily: 'Inter,sans-serif' }}>{plan.description}</p>
              <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', gap: '12px', fontSize: '14px', fontFamily: 'Inter,sans-serif' }}>
                    <span style={{ color: C.gold }}>✦</span><span style={{ opacity: 0.8 }}>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => { setSelectedPlan(plan); setStep('details'); }} style={{ background: `linear-gradient(135deg, ${C.goldDark}, ${C.gold}, ${C.goldLight})`, color: C.maroon, border: 'none', borderRadius: '100px', padding: '18px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', width: '100%' }}>Subscribe Now</button>
            </div>
          ))}
        </div>
      )}

      {/* Details step */}
      {step === 'details' && selectedPlan && (
        <div style={{ background: 'rgba(26,3,3,0.85)', border: `1px solid rgba(197,160,89,0.25)`, borderRadius: '24px', padding: '40px', maxWidth: '480px', margin: '0 auto', textAlign: 'left' }}>
          <button onClick={() => setStep('plans')} style={{ background: 'none', border: 'none', color: C.gold, cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}>← Back to Plans</button>
          <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '28px', color: C.white }}>Onboarding Details</h3>
          {(['name', 'phone', 'address'] as const).map(field => (
            field === 'address'
              ? <textarea key={field} placeholder={field === 'address' ? 'Delivery Address' : field} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} style={{ width: '100%', padding: '16px', borderRadius: '12px', background: `${C.gold}08`, border: `1px solid ${C.gold}22`, color: C.beige, outline: 'none', marginBottom: '16px', fontFamily: 'Inter,sans-serif', minHeight: '100px', resize: 'vertical', boxSizing: 'border-box' }} />
              : <input key={field} placeholder={field === 'phone' ? 'WhatsApp Number' : 'Full Name'} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} style={{ width: '100%', padding: '16px', borderRadius: '12px', background: `${C.gold}08`, border: `1px solid ${C.gold}22`, color: C.beige, outline: 'none', marginBottom: '16px', fontFamily: 'Inter,sans-serif', boxSizing: 'border-box' }} />
          ))}
          {error && <div style={{ color: C.error, fontSize: '13px', background: 'rgba(239,68,68,.1)', padding: '10px 16px', borderRadius: '8px', marginBottom: '16px' }}>⚠️ {error}</div>}
          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '24px', border: `1px dashed ${C.gold}33`, marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontFamily: 'Inter,sans-serif' }}>
              <span>{selectedPlan.name} ({billing})</span>
              <span style={{ color: C.gold }}>₹{price(selectedPlan).toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '20px', borderTop: `1px solid ${C.gold}22`, paddingTop: '12px' }}>
              <span>Final Offering</span>
              <span style={{ color: C.white }}>₹{price(selectedPlan).toLocaleString('en-IN')}</span>
            </div>
          </div>
          <button onClick={pay} style={{ background: `linear-gradient(135deg, ${C.goldDark}, ${C.gold}, ${C.goldLight})`, color: C.maroon, border: 'none', borderRadius: '100px', padding: '18px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', width: '100%' }}>Begin Journey via Razorpay</button>
        </div>
      )}

      {step === 'processing' && (
        <div style={{ background: 'rgba(26,3,3,0.85)', border: `1px solid rgba(197,160,89,0.25)`, borderRadius: '24px', padding: '60px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🕯️</div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.white }}>Validating Your Sanctity...</h3>
          <p style={{ opacity: 0.5, fontFamily: 'Inter,sans-serif', fontWeight: 300 }}>Synchronizing with Jaya Janardhana ecosystem</p>
        </div>
      )}

      {step === 'success' && (
        <div style={{ background: 'rgba(26,3,3,0.85)', border: `1px solid rgba(197,160,89,0.25)`, borderRadius: '24px', padding: '60px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🪔</div>
          <h3 style={{ fontSize: '24px', fontWeight: 700, color: C.gold, marginBottom: '16px' }}>Ritual Activated!</h3>
          <p style={{ opacity: 0.7, fontFamily: 'Inter,sans-serif', fontWeight: 300, marginBottom: '32px' }}>Welcome to the family. Your first kit is being prepared for a sacred delivery.</p>
          <button onClick={() => setStep('plans')} style={{ background: `linear-gradient(135deg, ${C.goldDark}, ${C.gold})`, color: C.maroon, border: 'none', borderRadius: '100px', padding: '16px 32px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Subscribe Another Plan</button>
        </div>
      )}
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
      const bodyPayload = mode === 'register' ? { ...form, role: 'AFFILIATE' } : form;
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Authentication failed');
      
      if (mode === 'login' && data.user.role === 'USER') {
        throw new Error('Customers must log in via the main storefront.');
      }
      
      localStorage.setItem('jj_aff_token', data.token);
      localStorage.setItem('jj_aff_user', JSON.stringify(data.user));
      onLogin(data.user);
      setMode(null);
    } catch (err: any) {
      setError(err.message || `Could not reach backend at ${API_URL}.`);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '16px', borderRadius: '12px', background: C.white, border: `2px solid transparent`, color: C.maroon, outline: 'none', marginBottom: '16px', fontFamily: 'Inter,sans-serif', boxSizing: 'border-box' as 'border-box', fontWeight: 500 };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(26,3,3,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
      <div style={{ background: 'rgba(26,3,3,1)', border: `1px solid ${C.gold}33`, borderRadius: '24px', padding: '48px', width: '100%', maxWidth: '400px', position: 'relative' }}>
        <button onClick={() => setMode(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', color: C.gold, border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        <div style={{ fontSize: '32px', marginBottom: '16px', textAlign: 'center' }}>🕯️</div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.white, marginBottom: '24px', textAlign: 'center' }}>{mode === 'login' ? 'Affiliate Login' : 'Register Account'}</h2>
        
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
          {mode === 'login' ? "Don't have an account? " : "Already an affiliate? "}
          <span onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ color: C.gold, cursor: 'pointer', fontWeight: 700 }}>
            {mode === 'login' ? 'Register' : 'Log In'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── AFFILIATE DASHBOARD COMPONENT ──────────────────────────────────────────────
function AffiliateDashboard({ user, setAuthMode }: { user: any, setAuthMode: (m: 'login' | null) => void }) {
  const [activeTab, setActiveTab] = useState<'stats' | 'upload' | 'subscribe'>('stats');

  return (
    <div style={{ padding: '120px 40px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <h2 style={{ fontSize: '32px', color: C.gold, margin: 0 }}>Welcome to your Reseller Dashboard, {user.name}</h2>
        
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(26,3,3,0.8)', padding: '8px', borderRadius: '8px', border: `1px solid ${C.gold}33` }}>
          {(['stats', 'upload', 'subscribe'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? `linear-gradient(135deg, ${C.goldDark}, ${C.gold})` : 'transparent',
                color: activeTab === tab ? C.maroon : C.beige,
                border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer',
                fontWeight: activeTab === tab ? 700 : 400, textTransform: 'capitalize', fontSize: '12px'
              }}
            >
              {tab === 'stats' ? 'Catalog & Earnings' : tab === 'upload' ? 'Upload Products' : 'Membership Plans'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'stats' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
             <div style={{ background: 'rgba(26,3,3,0.7)', border: `1px solid ${C.gold}33`, padding: '24px', borderRadius: '12px' }}>
                <p style={{ opacity: 0.6, fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Total Payouts</p>
                <h3 style={{ fontSize: '36px', color: C.white, margin: 0 }}>₹0</h3>
                <p style={{ fontSize: '12px', color: C.success, marginTop: '8px' }}>+0% from last month</p>
             </div>
             <div style={{ background: 'rgba(26,3,3,0.7)', border: `1px solid ${C.gold}33`, padding: '24px', borderRadius: '12px' }}>
                <p style={{ opacity: 0.6, fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Active Referrals</p>
                <h3 style={{ fontSize: '36px', color: C.white, margin: 0 }}>0</h3>
                <p style={{ fontSize: '12px', color: C.beige, marginTop: '8px', opacity: 0.5 }}>Pending initial conversions</p>
             </div>
          </div>
          <h3 style={{ fontSize: '24px', color: C.gold, marginBottom: '24px', marginTop: '60px' }}>Your Available Catalog</h3>
          <CatalogSection />
        </>
      )}

      {activeTab === 'upload' && (
        <div style={{ background: 'rgba(26,3,3,0.9)', padding: '60px', borderRadius: '16px', border: `1px solid ${C.gold}33`, textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '24px' }}>📦</div>
          <h3 style={{ fontSize: '28px', color: C.white, marginBottom: '16px' }}>Product Upload Station</h3>
          <p style={{ opacity: 0.7, maxWidth: '500px', margin: '0 auto 32px' }}>
            Uploading your own inventory onto the platform requires an active **Distribution Membership**.
          </p>
          <button onClick={() => setActiveTab('subscribe')} style={{ background: `linear-gradient(135deg, ${C.goldDark}, ${C.gold})`, color: C.maroon, border: 'none', padding: '16px 32px', cursor: 'pointer', borderRadius: '100px', fontWeight: 700, textTransform: 'uppercase' }}>
            Upgrade Membership To Unlock
          </button>
        </div>
      )}

      {activeTab === 'subscribe' && (
        <div>
           <SubscribeSection user={user} setAuthMode={setAuthMode} />
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState('home');
  const [user, setUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);

  useEffect(() => {
    // Check local storage for existing session
    const savedUser = localStorage.getItem('jj_aff_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }); },
      { rootMargin: '-40% 0px -40% 0px' }
    );
    NAV_SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jj_aff_token');
    localStorage.removeItem('jj_aff_user');
    setUser(null);
  };

  return (
    <>
      <AuthModal mode={authMode} setMode={setAuthMode} onLogin={setUser} />
      <Navbar active={active} setActive={setActive} user={user} setAuthMode={setAuthMode} onLogout={handleLogout} />
      <main>
        {!user ? (
          <>
            <HomeSection />
            <AboutSection />
            <CatalogSection />
            <SubscribeSection user={user} setAuthMode={setAuthMode} />
            <MarginsSection />
          </>
        ) : (
          <AffiliateDashboard user={user} setAuthMode={setAuthMode} />
        )}
      </main>
      <Footer />
    </>
  );
}
