'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const C = {
  gold: '#C5A059',
  goldDark: '#8e6c27',
  goldLight: '#f7e7c0',
  maroon: '#1A0303',
  maroonLight: '#2D0505',
  beige: '#E6D5B8',
  white: '#F5F0E1'
};

const CITY_PROFILES = {
  'Bengaluru': {
    hub: 'Bengaluru Heritage Hub',
    address: 'No 45, Temple Street, Malleshwaram, Bengaluru, Karnataka - 560003',
    phone: '+91 8431119696',
    hours: '6:00 AM – 9:00 PM',
    panchangaTiming: 'Rahu Kalam: 10:42 AM – 12:18 PM',
    mapsLink: 'https://maps.google.com/?q=Malleshwaram+Temple+Street+Bengaluru',
    description: 'Serving the tech capital with daily morning deliveries of fresh, natural camphor blocks and pooja consumables directly to Malleshwaram, Basavanagudi, and Jayanagar regions.'
  },
  'Chennai': {
    hub: 'Mylapore Divine Center',
    address: 'Old No 12, Kapaleeswarar Sannidhi Street, Mylapore, Chennai, Tamil Nadu - 600004',
    phone: '+91 8431119697',
    hours: '5:30 AM – 8:30 PM',
    panchangaTiming: 'Rahu Kalam: 10:30 AM – 12:05 PM',
    mapsLink: 'https://maps.google.com/?q=Mylapore+Kapaleeswarar+Sannidhi+Chennai',
    description: 'Supplying traditional households and temple trust retail counters in Mylapore, Adyar, and T. Nagar with mastergrade hand-rolled Salem agarbatti and premium Deepa oil.'
  },
  'Hyderabad': {
    hub: 'Secunderabad Sourcing Point',
    address: 'Shop 4, Ghasmandi Road, Secunderabad, Hyderabad, Telangana - 500003',
    phone: '+91 8431119698',
    hours: '6:00 AM – 9:00 PM',
    panchangaTiming: 'Rahu Kalam: 10:48 AM – 12:25 PM',
    mapsLink: 'https://maps.google.com/?q=Secunderabad+Ghasmandi+Road+Hyderabad',
    description: 'Providing door-to-door distribution of 100% natural camphor and brassware offerings for religious ceremonies across Hyderabad and Secunderabad districts.'
  },
  'Thiruvananthapuram': {
    hub: 'East Fort Altar Supplies',
    address: 'Building 18, West Nada, East Fort, Thiruvananthapuram, Kerala - 695023',
    phone: '+91 8431119699',
    hours: '5:00 AM – 8:00 PM',
    panchangaTiming: 'Rahu Kalam: 10:55 AM – 12:30 PM',
    mapsLink: 'https://maps.google.com/?q=East+Fort+West+Nada+Thiruvananthapuram',
    description: 'Catering to the coastal capital and heritage temple networks with wood-pressed Deepa oils and premium cotton wicks designed for long-burning morning pujas.'
  },
  'Vijayawada': {
    hub: 'One Town Retail Hub',
    address: 'No 3/2, Brahmin Street, One Town, Vijayawada, Andhra Pradesh - 520001',
    phone: '+91 8431119700',
    hours: '6:00 AM – 8:30 PM',
    panchangaTiming: 'Rahu Kalam: 10:38 AM – 12:15 PM',
    mapsLink: 'https://maps.google.com/?q=One+Town+Brahmin+Street+Vijayawada',
    description: 'Connecting Andhra distribution partners with pure camphor packs and Thanjavur metalware, offering next-day delivery to local retail counters.'
  }
};

export default function CitiesPage() {
  const [selectedCity, setSelectedCity] = useState<keyof typeof CITY_PROFILES>('Bengaluru');
  const activeProfile = CITY_PROFILES[selectedCity];

  return (
    <div style={{ backgroundColor: '#1A0303', minHeight: '100vh', color: C.white, fontFamily: "var(--font-jost-family), sans-serif", paddingBottom: '80px' }}>
      
      {/* Mini Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'rgba(26,3,3,0.96)',
        borderBottom: `1px solid rgba(197,160,89,0.15)`,
        backdropFilter: 'blur(20px)',
        padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32 }}>
            <img src="/assets/logo.png" alt="Jaya Janardhana Temple Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.15em', color: C.gold }}>JAYA JANARDHANA</div>
            <div style={{ fontSize: '9px', letterSpacing: '0.3em', opacity: 0.5, textTransform: 'uppercase', color: C.beige }}>Local Store Hubs</div>
          </div>
        </Link>
        <Link href="/" style={{ textDecoration: 'none', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, fontWeight: 600 }}>
          ← Back to Shop
        </Link>
      </nav>

      {/* Hero */}
      <header style={{ padding: '160px 40px 60px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.gold, boxShadow: `0 0 8px ${C.gold}`, display: 'inline-block' }} />
          <span style={{ fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.gold }}>South India Storefront Network</span>
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 600, fontFamily: 'var(--font-cormorant-family), serif', color: C.white, lineHeight: 1.1, marginBottom: '24px' }}>
          Regional <em style={{ fontStyle: 'italic', fontWeight: 300, color: C.goldLight }}>Distribution Hubs</em>
        </h1>
        <p style={{ fontSize: '16px', color: C.beige, opacity: 0.8, lineHeight: 1.8, fontWeight: 300 }}>
          Check regional offices, local contacts, maps directions, and daily Vedic timelines for your city below.
        </p>
      </header>

      {/* City Switcher */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '60px', padding: '0 20px' }}>
        {(Object.keys(CITY_PROFILES) as Array<keyof typeof CITY_PROFILES>).map(city => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            style={{
              background: selectedCity === city ? `linear-gradient(135deg, ${C.goldDark}, ${C.gold})` : 'rgba(26,3,3,0.8)',
              border: `1px solid ${selectedCity === city ? C.gold : 'rgba(197,160,89,0.15)'}`,
              color: selectedCity === city ? C.maroon : C.beige,
              padding: '12px 28px',
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 700,
              cursor: 'pointer',
              borderRadius: '4px',
              transition: 'all 0.3s'
            }}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Active Profile Info */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '0 40px' }}>
        <div style={{
          background: C.maroonLight,
          border: `1px solid ${C.gold}33`,
          borderRadius: '24px',
          padding: '48px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
          position: 'relative'
        }}>
          {/* Inject dynamic LocalBusiness schema block specifically for local crawl indexing */}
          <script
            type="application/ld+json"
            id={`schema-local-business-${selectedCity}`}
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": `Jaya Janardhana - ${activeProfile.hub}`,
                "image": "https://www.jayajanardhana.com/assets/supply_artisan.jpg",
                "telephone": activeProfile.phone,
                "url": `https://www.jayajanardhana.com/cities?city=${selectedCity}`,
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": activeProfile.address,
                  "addressLocality": selectedCity,
                  "addressCountry": "IN"
                },
                "openingHours": "Mo-Su 06:00-21:00"
              })
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '32px', borderBottom: `1px solid ${C.gold}22`, paddingBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold }}>LOCAL HEADQUARTERS</span>
              <h2 style={{ fontSize: '32px', color: C.white, fontFamily: 'var(--font-cormorant-family), serif', fontWeight: 600, marginTop: '6px', marginBottom: 0 }}>
                {activeProfile.hub}
              </h2>
            </div>
            <div style={{ background: `${C.gold}11`, border: `1px solid ${C.gold}33`, padding: '10px 20px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, color: C.gold }}>
              OPEN Daily: {activeProfile.hours}
            </div>
          </div>

          <p style={{ fontSize: '16px', lineHeight: 1.8, color: C.beige, opacity: 0.9, fontWeight: 300, marginBottom: '40px' }}>
            {activeProfile.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px', marginBottom: '40px' }}>
            <div>
              <h3 style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: '8px' }}>Store Address (NAP)</h3>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: C.white, opacity: 0.85, fontWeight: 300, margin: 0 }}>
                {activeProfile.address}
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: '8px' }}>Local Sourcing Line</h3>
              <a href={`tel:${activeProfile.phone.replace(/\s+/g, '')}`} style={{ fontSize: '20px', color: C.white, textDecoration: 'none', fontWeight: 600, display: 'block' }}>
                {activeProfile.phone}
              </a>
            </div>
            <div>
              <h3 style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: '8px' }}>Daily Altar Alignment</h3>
              <p style={{ fontSize: '14px', color: C.white, opacity: 0.85, fontWeight: 300, margin: 0 }}>
                {activeProfile.panchangaTiming}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <a
              href={activeProfile.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: `linear-gradient(135deg, ${C.goldDark}, ${C.gold})`,
                color: C.maroon,
                padding: '14px 28px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
            >
              Get Directions on Maps ↗
            </a>
            <Link
              href="/#shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'transparent',
                border: `1px solid ${C.gold}`,
                color: C.gold,
                padding: '14px 28px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
            >
              Shop Local Products
            </Link>
          </div>

        </div>
      </main>

      {/* Local Citation Directories NAP Info */}
      <section style={{ maxWidth: '900px', margin: '80px auto 0', padding: '0 40px' }}>
        <h3 style={{ fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, marginBottom: '20px', textAlign: 'center' }}>
          VERIFIED SOUTH INDIA LOCAL CITATIONS
        </h3>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '32px', opacity: 0.5, fontSize: '12px', letterSpacing: '0.1em' }}>
          <span>Justdial Verified</span>
          <span>✦</span>
          <span>IndiaMART Partner</span>
          <span>✦</span>
          <span>Sulekha Trusted</span>
          <span>✦</span>
          <span>GMB Map Pack Sync</span>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: '120px', textAlign: 'center', opacity: 0.4, fontSize: '12px' }}>
        © {new Date().getFullYear()} Jaya Janardhana. Local Business Directories.
      </footer>
    </div>
  );
}
