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

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState<'pillars' | 'calendar' | 'brief'>('pillars');

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
            <div style={{ fontSize: '9px', letterSpacing: '0.3em', opacity: 0.5, textTransform: 'uppercase', color: C.beige }}>Sacred Sourcing Hub</div>
          </div>
        </Link>
        <Link href="/" style={{ textDecoration: 'none', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, fontWeight: 600 }}>
          ← Back to Shop
        </Link>
      </nav>

      {/* Hero Header */}
      <header style={{ padding: '160px 40px 60px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.gold, boxShadow: `0 0 8px ${C.gold}`, display: 'inline-block' }} />
          <span style={{ fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.gold }}>Heritage Resources & Guides</span>
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 600, fontFamily: 'var(--font-cormorant-family), serif', color: C.white, lineHeight: 1.1, marginBottom: '24px' }}>
          The Sacred <em style={{ fontStyle: 'italic', fontWeight: 300, color: C.goldLight }}>Knowledge Hub</em>
        </h1>
        <p style={{ fontSize: '16px', color: C.beige, opacity: 0.8, lineHeight: 1.8, fontWeight: 300 }}>
          Explore our expert guides detailing natural camphor purity, South Indian morning rituals, and opportunities for local community distribution.
        </p>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '60px', padding: '0 20px' }}>
        {[
          { id: 'pillars', label: '3 Content Pillars' },
          { id: 'calendar', label: '90-Day Calendar' },
          { id: 'brief', label: 'Detailed Puja Brief' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            style={{
              background: activeTab === t.id ? `linear-gradient(135deg, ${C.goldDark}, ${C.gold})` : 'rgba(26,3,3,0.8)',
              border: `1px solid ${activeTab === t.id ? C.gold : 'rgba(197,160,89,0.15)'}`,
              color: activeTab === t.id ? C.maroon : C.beige,
              padding: '12px 24px',
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 700,
              cursor: 'pointer',
              borderRadius: '4px',
              transition: 'all 0.3s'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        
        {/* PILLARS TAB */}
        {activeTab === 'pillars' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            
            {/* Pillar 1 */}
            <article style={{ background: C.maroonLight, border: `1px solid ${C.gold}22`, borderRadius: '16px', padding: '40px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '24px', right: '32px', color: C.gold, opacity: 0.2, fontSize: '48px', fontFamily: 'serif', fontWeight: 'bold' }}>01</div>
              <h2 style={{ fontSize: '24px', color: C.gold, fontFamily: 'var(--font-cormorant-family), serif', fontWeight: 600, marginBottom: '20px' }}>
                Camphor Purity Standards
              </h2>
              <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.15em', color: C.white, opacity: 0.6, marginBottom: '16px' }}>
                Health & Purity Testing Guide
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: C.beige, opacity: 0.8, marginBottom: '20px', fontWeight: 300 }}>
                Most commercial camphor is synthesized from petroleum or turpentine, releasing harmful parabens, phthalates, and carbon monoxide during daily indoor worship. This chemical exposure poses serious respiratory risks, particularly for children and the elderly.
              </p>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: C.beige, opacity: 0.8, fontWeight: 300 }}>
                Our 100% Natural Camphor is distilled directly from the wood of the Cinnamomum Camphora tree. To verify the purity of your camphor at home: light a block on a heat-resistant plate. Natural camphor burns completely away, leaving <strong>zero black ash residue</strong> and releasing a smooth, sweet herbal scent that clears sinuses.
              </p>
            </article>

            {/* Pillar 2 */}
            <article style={{ background: C.maroonLight, border: `1px solid ${C.gold}22`, borderRadius: '16px', padding: '40px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '24px', right: '32px', color: C.gold, opacity: 0.2, fontSize: '48px', fontFamily: 'serif', fontWeight: 'bold' }}>02</div>
              <h2 style={{ fontSize: '24px', color: C.gold, fontFamily: 'var(--font-cormorant-family), serif', fontWeight: 600, marginBottom: '20px' }}>
                Daily Morning Puja Guide
              </h2>
              <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.15em', color: C.white, opacity: 0.6, marginBottom: '16px' }}>
                Vedic Altars & Ritual Procedures
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: C.beige, opacity: 0.8, marginBottom: '20px', fontWeight: 300 }}>
                Aligning your day with the cosmic order begins with a structured morning worship ritual (Puja). Cleanliness and the purity of consumable offerings are paramount.
              </p>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: C.beige, opacity: 0.8, fontWeight: 300 }}>
                First, bathe and sweep the altar clean. Fill your deepa lamp with wood-pressed oil and cotton wicks. Light the lamp to symbolize the removal of ignorance. Next, light charcoal-free sandalwood agarbatti to cleanse the air. Conclude by lighting pure camphor and carrying out the Aarti (circular waving of the lamp) while chanting Vedic shlokas to channel divine energy throughout your household.
              </p>
            </article>

            {/* Pillar 3 */}
            <article style={{ background: C.maroonLight, border: `1px solid ${C.gold}22`, borderRadius: '16px', padding: '40px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '24px', right: '32px', color: C.gold, opacity: 0.2, fontSize: '48px', fontFamily: 'serif', fontWeight: 'bold' }}>03</div>
              <h2 style={{ fontSize: '24px', color: C.gold, fontFamily: 'var(--font-cormorant-family), serif', fontWeight: 600, marginBottom: '20px' }}>
                Affiliate Sourcing & Income
              </h2>
              <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.15em', color: C.white, opacity: 0.6, marginBottom: '16px' }}>
                Distributor Commissions & Network
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: C.beige, opacity: 0.8, marginBottom: '20px', fontWeight: 300 }}>
                Jaya Janardhana is built on community empowerment. We offer home business opportunities for devotees, neighborhood leaders, and temple retail store operators across South India.
              </p>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: C.beige, opacity: 0.8, fontWeight: 300 }}>
                By establishing a direct supply chain from Salem and Thanjavur artisans, we eliminate expensive wholesalers. This permits us to pass an outstanding <strong>25% to 30% commission</strong> directly to our local distributors. We provide marketing packs, digital training, and direct regional support to ensure a stable secondary income source.
              </p>
            </article>

          </div>
        )}

        {/* CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <div style={{ background: C.maroonLight, border: `1px solid ${C.gold}22`, borderRadius: '16px', padding: '48px' }}>
            <h2 style={{ fontSize: '28px', color: C.gold, fontFamily: 'var(--font-cormorant-family), serif', fontWeight: 600, marginBottom: '12px' }}>
              90-Day Content Publishing Calendar
            </h2>
            <p style={{ fontSize: '14px', color: C.beige, opacity: 0.7, marginBottom: '32px', fontWeight: 300 }}>
              A strategic roadmap designed to build keyword topical authority and drive GSC search traffic.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                { title: 'Weeks 1-4: The Foundation of Purity (Topical Authority)', desc: 'Publish 8 key articles outlining: The health dangers of synthetic camphor, chemical composition comparisons, and how to verify 100% natural products. Targets keywords like "buy pure camphor online", "safest agarbatti brand".' },
                { title: 'Weeks 5-8: Daily Vedic Ritual Mechanics (Transactional Search)', desc: 'Provide localized guides for specific rituals: Deepa lamp oil differences, Thanjavur metalware care, and Salem incense history. Emphasizes keywords: "best oil for temple lamps", "brass puja items maintenance".' },
                { title: 'Weeks 9-12: Community Distributor Network (Commercial Sourcing)', desc: 'Focus on case studies of South India distribution partners, side business guides, and temple retail store setup tips. Targets search queries: "how to start puja item business", "distributor income South India".' }
              ].map((week, idx) => (
                <div key={idx} style={{ paddingBottom: '20px', borderBottom: idx < 2 ? `1px solid ${C.gold}22` : 'none' }}>
                  <h3 style={{ fontSize: '18px', color: C.white, fontWeight: 600, marginBottom: '8px' }}>{week.title}</h3>
                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: C.beige, opacity: 0.8, fontWeight: 300 }}>{week.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BRIEF TAB */}
        {activeTab === 'brief' && (
          <div style={{ background: C.maroonLight, border: `1px solid ${C.gold}22`, borderRadius: '16px', padding: '48px' }}>
            <h2 style={{ fontSize: '28px', color: C.gold, fontFamily: 'var(--font-cormorant-family), serif', fontWeight: 600, marginBottom: '12px' }}>
              SEO Content Brief: The Ultimate Morning Puja Ritual
            </h2>
            <p style={{ fontSize: '14px', color: C.beige, opacity: 0.7, marginBottom: '32px', fontWeight: 300 }}>
              Use this structure to write high-ranking articles targeting search engines.
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', color: C.beige, fontSize: '14px', textAlign: 'left' }}>
              <tbody>
                <tr style={{ borderBottom: `1px solid ${C.gold}22` }}>
                  <td style={{ padding: '16px 8px', fontWeight: 700, color: C.gold, width: '200px' }}>Target Keyword</td>
                  <td style={{ padding: '16px 8px', fontWeight: 300 }}>"how to perform morning puja at home" (Search volume: 8.5K/mo IN)</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${C.gold}22` }}>
                  <td style={{ padding: '16px 8px', fontWeight: 700, color: C.gold }}>Secondary Keywords</td>
                  <td style={{ padding: '16px 8px', fontWeight: 300 }}>"puja lamp lighting oil", "pure camphor burning guide", "daily morning mantras"</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${C.gold}22` }}>
                  <td style={{ padding: '16px 8px', fontWeight: 700, color: C.gold }}>Target Length</td>
                  <td style={{ padding: '16px 8px', fontWeight: 300 }}>1,500 – 1,800 words</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${C.gold}22` }}>
                  <td style={{ padding: '16px 8px', fontWeight: 700, color: C.gold }}>Search Intent</td>
                  <td style={{ padding: '16px 8px', fontWeight: 300 }}>Informational & Transactional (seeking proper Vedic instructions and matching consumables)</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${C.gold}22` }}>
                  <td style={{ padding: '16px 8px', fontWeight: 700, color: C.gold }}>Article Outline</td>
                  <td style={{ padding: '16px 8px', fontWeight: 300, lineHeight: 1.6 }}>
                    1. **Introduction**: Why a pure morning puja elevates the household energy fields.<br />
                    2. **Preparation (Vedic rules)**: Cleansing, dress code, matching directional alignment (facing East).<br />
                    3. **The Essential Consumables Checklist**: Pure camphor, non-toxic Deepa oil, charcoal-free agarbatti.<br />
                    4. **Step-by-Step Procedure**: Detailed lamp prep, prayer chanting, and correct Aarti techniques.<br />
                    5. **Conclusion & CTA**: Shop pure essentials directly from Salem cooperatives.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{ marginTop: '120px', textAlign: 'center', opacity: 0.4, fontSize: '12px' }}>
        © {new Date().getFullYear()} Jaya Janardhana. Content Strategy Hub.
      </footer>
    </div>
  );
}
