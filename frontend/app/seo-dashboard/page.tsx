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
  white: '#F5F0E1',
  success: '#10b981'
};

const KPIS = [
  { name: 'Total Organic Clicks', baseline: '120/mo', target90: '1,500/mo', status: 'On Track' },
  { name: 'Total Search Impressions', baseline: '4,800/mo', target90: '45,000/mo', status: 'On Track' },
  { name: 'Average Click-Through Rate (CTR)', baseline: '2.5%', target90: '3.3%', status: 'Improving' },
  { name: 'Average Search Position', baseline: '38.4', target90: '18.2', status: 'Improving' },
  { name: 'Google Site Verification Status', baseline: 'Unverified', target90: '100% Verified', status: 'Completed (Meta Tag Added)' },
  { name: 'XML Sitemap Indexation Rate', baseline: '0%', target90: '100% Indexed', status: 'Sitemap Created' },
  { name: 'Schema Markup Validation Errors', baseline: 'N/A', target90: '0 Errors (8 Blocks Loaded)', status: 'Completed' },
  { name: 'Local Business Maps Packs Clicks', baseline: '0/mo', target90: '250/mo', status: 'Setup Completed' },
  { name: 'Top-3 Position Rankings (Salem Camphor)', baseline: '0 Keywords', target90: '8 Keywords', status: 'Optimizing' },
  { name: 'Top-10 Position Rankings (Puja Sourcing)', baseline: '2 Keywords', target90: '15 Keywords', status: 'Optimizing' },
  { name: 'High-Authority South India Backlinks', baseline: '0 Domains', target90: '10 Domains', status: 'Linkbait Designed' },
  { name: 'Blog Pillar Content Page Indexation', baseline: '0 Pages', target90: '5 Pages (Indexed)', status: 'Completed' },
  { name: 'Google Business Profile Completeness', baseline: '45%', target90: '100%', status: 'NAP Aligned' },
  { name: 'Mobile Core Web Vitals (LCP)', baseline: '3.4s', target90: '< 2.5s', status: 'Optimized via Preloads' },
  { name: 'Desktop Core Web Vitals (FID)', baseline: '45ms', target90: '< 100ms', status: 'Healthy' }
];

const SPRINTS = [
  { week: 'Weeks 1-2: Indexing & Crawl Alignment', tasks: 'Inject site-verification meta tags into head. Solve the catalog login wall. Deploy static robots.txt and sitemap.xml. Verify indexing requests in GSC.' },
  { week: 'Weeks 3-4: Schema Deploy & Rich Snippets', tasks: 'Embed organization, local business, website, speakable, breadcrumbs, aggregate rating products, HowTo, and FAQ JSON-LD schemas. Validate using Schema Markup Validator.' },
  { week: 'Weeks 5-6: On-Page Inverted Pyramid & Alts', tasks: 'Refactor home content headers to match high-volume keywords. Optimize image properties with descriptive alt text. Introduce A/B variant call-to-actions.' },
  { week: 'Weeks 7-8: Content Pillar Launch', tasks: 'Publish the 3 core pillars (Camphor Purity, Morning Puja Guide, Distributor Income) on the blog directory. Submit blog URL structures directly to GSC for indexing.' },
  { week: 'Weeks 9-10: Local SEO & Citations Syncing', tasks: 'Generate Dedicated City Hub profiles. Sync NAP (Name, Address, Phone) details consistently across South India local directories (Justdial, Sulekha, IndiaMART).' },
  { week: 'Weeks 11-12: Link Sourcing & Trust signals', tasks: 'Acquire high-quality South Indian regional backlinks using the Salem cooperative trust campaign. Launch the Puja guide linkbait asset. Review KPI targets.' }
];

export default function SeoDashboardPage() {
  const [activeCard, setActiveCard] = useState<'kpis' | 'sprints' | 'command'>('kpis');

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
            <div style={{ fontSize: '9px', letterSpacing: '0.3em', opacity: 0.5, textTransform: 'uppercase', color: C.beige }}>SEO Dashboard</div>
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
          <span style={{ fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.gold }}>Search Console Integration Console</span>
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 600, fontFamily: 'var(--font-cormorant-family), serif', color: C.white, lineHeight: 1.1, marginBottom: '24px' }}>
          SEO Command & <em style={{ fontStyle: 'italic', fontWeight: 300, color: C.goldLight }}>Roadmap Dashboard</em>
        </h1>
        <p style={{ fontSize: '16px', color: C.beige, opacity: 0.8, lineHeight: 1.8, fontWeight: 300 }}>
          Review GSC integration KPIs, 12-week sprint schedules, and our active daily task command card.
        </p>
      </header>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '60px', padding: '0 20px' }}>
        {[
          { id: 'kpis', label: '15 SEO KPIs' },
          { id: 'sprints', label: '12-Week Roadmap Sprints' },
          { id: 'command', label: 'Daily Command Card' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveCard(t.id as any)}
            style={{
              background: activeCard === t.id ? `linear-gradient(135deg, ${C.goldDark}, ${C.gold})` : 'rgba(26,3,3,0.8)',
              border: `1px solid ${activeCard === t.id ? C.gold : 'rgba(197,160,89,0.15)'}`,
              color: activeCard === t.id ? C.maroon : C.beige,
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

      {/* Content */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 40px' }}>
        
        {/* KPIS TABLE */}
        {activeCard === 'kpis' && (
          <div style={{ background: C.maroonLight, border: `1px solid ${C.gold}22`, borderRadius: '16px', padding: '40px', overflowX: 'auto' }}>
            <h2 style={{ fontSize: '24px', color: C.gold, fontFamily: 'var(--font-cormorant-family), serif', fontWeight: 600, marginBottom: '24px' }}>
              Search KPI Baselines & 90-Day Targets
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: C.beige, fontSize: '14px', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${C.gold}44`, color: C.gold, fontWeight: 700 }}>
                  <th style={{ padding: '12px 8px' }}>SEO Performance Metric</th>
                  <th style={{ padding: '12px 8px' }}>Baseline</th>
                  <th style={{ padding: '12px 8px' }}>90-Day Target</th>
                  <th style={{ padding: '12px 8px' }}>Active Integration Status</th>
                </tr>
              </thead>
              <tbody>
                {KPIS.map((kpi, idx) => (
                  <tr key={idx} style={{ borderBottom: `1px solid ${C.gold}11` }}>
                    <td style={{ padding: '16px 8px', fontWeight: 600, color: C.white }}>{kpi.name}</td>
                    <td style={{ padding: '16px 8px' }}>{kpi.baseline}</td>
                    <td style={{ padding: '16px 8px', color: C.goldLight }}>{kpi.target90}</td>
                    <td style={{ padding: '16px 8px' }}>
                      <span style={{ color: kpi.status.includes('Completed') ? C.success : C.gold }}>
                        ✦ {kpi.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SPRINTS ROADMAP */}
        {activeCard === 'sprints' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {SPRINTS.map((sp, idx) => (
              <div key={idx} style={{
                background: C.maroonLight,
                border: `1px solid ${C.gold}22`,
                borderRadius: '16px',
                padding: '36px'
              }}>
                <div style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: '8px', fontWeight: 700 }}>
                  SPRINT PHASE {idx + 1}
                </div>
                <h3 style={{ fontSize: '20px', color: C.white, fontFamily: 'var(--font-cormorant-family), serif', fontWeight: 600, marginBottom: '16px', marginTop: 0 }}>
                  {sp.week}
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: C.beige, opacity: 0.85, fontWeight: 300, margin: 0 }}>
                  {sp.tasks}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* COMMAND CARD */}
        {activeCard === 'command' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            
            {/* Daily Tasks */}
            <div style={{ background: C.maroonLight, border: `1px solid ${C.gold}22`, borderRadius: '16px', padding: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.gold }} />
                <h3 style={{ fontSize: '18px', color: C.white, margin: 0, fontWeight: 600 }}>Daily Checklist</h3>
              </div>
              <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '13px', lineHeight: 1.8, color: C.beige, fontWeight: 300 }}>
                <li>Monitor GSC indexation notifications</li>
                <li>Verify regional Panchanga API sync statuses</li>
                <li>Verify client page loading times</li>
                <li>Check new customer registrations logs</li>
              </ul>
            </div>

            {/* Weekly Tasks */}
            <div style={{ background: C.maroonLight, border: `1px solid ${C.gold}22`, borderRadius: '16px', padding: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.gold }} />
                <h3 style={{ fontSize: '18px', color: C.white, margin: 0, fontWeight: 600 }}>Weekly Checklist</h3>
              </div>
              <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '13px', lineHeight: 1.8, color: C.beige, fontWeight: 300 }}>
                <li>Analyze organic search clicks metrics</li>
                <li>Monitor GSC crawl health dashboards</li>
                <li>Submit newly updated sitemap structures</li>
                <li>Review affiliate registrations and local maps pack clicks</li>
              </ul>
            </div>

            {/* Monthly Tasks */}
            <div style={{ background: C.maroonLight, border: `1px solid ${C.gold}22`, borderRadius: '16px', padding: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.gold }} />
                <h3 style={{ fontSize: '18px', color: C.white, margin: 0, fontWeight: 600 }}>Monthly Checklist</h3>
              </div>
              <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '13px', lineHeight: 1.8, color: C.beige, fontWeight: 300 }}>
                <li>Complete audit of schema validations in head</li>
                <li>Examine mobile-first Core Web Vitals speed tests</li>
                <li>Execute content updates matching publishing schedules</li>
                <li>Audit South India competitor backlink acquisitions</li>
              </ul>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{ marginTop: '120px', textAlign: 'center', opacity: 0.4, fontSize: '12px' }}>
        © {new Date().getFullYear()} Jaya Janardhana. GSC Command Center.
      </footer>
    </div>
  );
}
