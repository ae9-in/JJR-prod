import type { Metadata } from "next";
import GlobalClient from "./GlobalClient";
import { Playfair_Display, Inter, Cormorant_Garamond, Jost } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-jost",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jayajanardhana.com"),
  alternates: {
    canonical: "/",
  },
  title: "Jaya Janardhana | Jaya Janardana - Sacred Goods Storefront",
  description: "Jaya Janardhana (also known as Jaya Janardana) is a heritage community marketplace for sacred distribution. Source pure camphor, deepa oil, and natural agarbatti online.",
  icons: { icon: '/favicon.svg' },
  verification: {
    google: "ZLvrsxBgeoxoLY4yZFeIRQEwbyW2kyAqdCZXeT8mqik",
  },
  openGraph: {
    title: "Jaya Janardhana | Jaya Janardana - Sacred Goods Storefront",
    description: "Jaya Janardhana (also known as Jaya Janardana) is a heritage community marketplace for sacred distribution. Source pure camphor, deepa oil, and natural agarbatti online.",
    url: "https://www.jayajanardhana.com",
    siteName: "Jaya Janardhana",
    images: [
      {
        url: "/assets/logo.png",
        width: 800,
        height: 600,
        alt: "Jaya Janardhana logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jaya Janardhana | Jaya Janardana - Sacred Goods Storefront",
    description: "Jaya Janardhana (also known as Jaya Janardana) is a heritage community marketplace for sacred distribution. Source pure camphor, deepa oil, and natural agarbatti online.",
    images: ["/assets/logo.png"],
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${cormorant.variable} ${jost.variable}`} style={{ backgroundColor: '#1A0303' }}>
      <head>
        <link rel="preload" href="/assets/logo.png" as="image" />
        <link rel="preload" href="/assets/hero_bg.jpg" as="image" />
        
        {/* Schema Suite - 8 Complete JSON-LD Blocks */}
        <script
          type="application/ld+json"
          id="schema-organization"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Jaya Janardhana",
              "alternateName": ["Jaya Janardana", "Jaya Janardhana Storefront"],
              "url": "https://www.jayajanardhana.com",
              "logo": "https://www.jayajanardhana.com/assets/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-8431119696",
                "contactType": "customer service"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          id="schema-local-business"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Jaya Janardhana Sourcing Hub",
              "image": "https://www.jayajanardhana.com/assets/supply_artisan.jpg",
              "@id": "https://www.jayajanardhana.com/#localbusiness",
              "url": "https://www.jayajanardhana.com",
              "telephone": "+91-8431119696",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Heritage Distribution St",
                "addressLocality": "Bengaluru",
                "addressRegion": "Karnataka",
                "postalCode": "560001",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 12.9716,
                "longitude": 77.5946
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
                ],
                "opens": "06:00",
                "closes": "21:00"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          id="schema-website"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Jaya Janardhana",
              "url": "https://www.jayajanardhana.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.jayajanardhana.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          id="schema-speakable"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Daily Panchanga Calendar",
              "speakable": {
                "@type": "SpeakableSpecification",
                "cssSelector": [".panchanga-date", ".panchanga-item", ".panchanga-rahu-time"]
              },
              "url": "https://www.jayajanardhana.com/#panchanga"
            })
          }}
        />
        <script
          type="application/ld+json"
          id="schema-breadcrumb"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://www.jayajanardhana.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Blog",
                  "item": "https://www.jayajanardhana.com/blog"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Cities",
                  "item": "https://www.jayajanardhana.com/cities"
                }
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          id="schema-product"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "100% Pure Camphor",
              "image": "https://www.jayajanardhana.com/assets/products/Camphor%20JJ.png",
              "description": "100% Pure Camphor for Daily Worship, containing no synthetic compounds. Pure camphor for clean and safe respiratory daily exposure.",
              "sku": "JJ-CAMPHOR-100",
              "mpn": "JJ-CAMPHOR-100",
              "brand": {
                "@type": "Brand",
                "name": "Jaya Janardhana"
              },
              "offers": {
                "@type": "Offer",
                "url": "https://www.jayajanardhana.com/#shop",
                "priceCurrency": "INR",
                "price": "219",
                "priceValidUntil": "2027-12-31",
                "itemCondition": "https://schema.org/NewCondition",
                "availability": "https://schema.org/InStock"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "184"
              },
              "review": [
                {
                  "@type": "Review",
                  "author": {
                    "@type": "Person",
                    "name": "Srinivas Prasad"
                  },
                  "datePublished": "2026-05-15",
                  "reviewBody": "Excellent purity. Does not produce black smoke, burns completely leaving zero residue.",
                  "reviewRating": {
                    "@type": "Rating",
                    "bestRating": "5",
                    "ratingValue": "5",
                    "worstRating": "1"
                  }
                }
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          id="schema-faq"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Why is pure camphor important for daily worship?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Pure camphor burns cleanly without releasing toxic synthetic chemical residues, preventing respiratory issues and maintaining a pure temple atmosphere."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How can I verify the purity of camphor?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "100% pure camphor burns completely without leaving behind any black residue or ash, and emits a clean, sweet aroma."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Where does Jaya Janardhana source its camphor?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We source our camphor and other sacred ritual goods directly from traditional heritage artisans across South India."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does the Deepa Oil contain mineral oil?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No, our Sacred Deepa Oil is formulated with 100% natural, plant-based oils and has zero mineral oil or synthetic additives."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is the agarbatti safe for daily indoor use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, our Sandalwood Bliss Agarbatti is crafted using natural wood powders and oils, avoiding artificial charcoal binders to ensure respiratory safety."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What regions do you supply across South India?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We distribute products to retailers, temples, and homes in Karnataka, Tamil Nadu, Kerala, Andhra Pradesh, and Telangana."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How can I become an affiliate distributor?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can sign up through our online affiliate portal. Once verified, you can manage order fulfillment and earn margins in your local area."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What are the earning margins for Jaya Janardhana partners?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our divine partners and affiliates earn an average of 25% to 30% commission per product sold."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do I need to pay any upfront fees to join?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No, joining the Jaya Janardhana community sourcing and distribution network is completely free of charge."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do you provide training for distributors?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we provide personalized guidance, marketing materials, sales strategies, and digital tools to help you succeed."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does the subscription plan work?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can subscribe to a monthly or annual delivery of our Daily Pooja Kit, ensuring you never run out of pure elements for your daily prayers."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I cancel my subscription at any time?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, you can easily cancel, pause, or adjust your subscription frequency at any time through your customer profile."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How is the brand name spelled, Jaya Janardhana or Jaya Janardana?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our brand name can be transliterated as Jaya Janardhana (with 'h') or Jaya Janardana (without 'h'). Both refer to our sacred Salem-based sourcing storefront and regional South India temple distribution network."
                  }
                }
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          id="schema-howto"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              "name": "How to Perform Daily Morning Puja at Home",
              "description": "A guide to performing your daily morning worship with pure, sacred ritual ingredients.",
              "totalTime": "PT15M",
              "step": [
                {
                  "@type": "HowToStep",
                  "name": "Cleanse the Altar",
                  "text": "Clean the sacred altar space and wipe down the brass lamps and deity idols with a clean cloth.",
                  "url": "https://www.jayajanardhana.com/#about"
                },
                {
                  "@type": "HowToStep",
                  "name": "Prepare the Deepa Lamp",
                  "text": "Place cotton wicks in the lamp and pour our 100% natural Deepa Oil, then light the lamp.",
                  "url": "https://www.jayajanardhana.com/#shop"
                },
                {
                  "@type": "HowToStep",
                  "name": "Offer Incense",
                  "text": "Light the Sandalwood Bliss Agarbatti or Sandalwood Dhoop stick to purify the household air.",
                  "url": "https://www.jayajanardhana.com/#shop"
                },
                {
                  "@type": "HowToStep",
                  "name": "Aarti with Pure Camphor",
                  "text": "Place pure camphor on the camphor burner, light it, and perform the circular Aarti movement while chanting prayers.",
                  "url": "https://www.jayajanardhana.com/#shop"
                }
              ]
            })
          }}
        />
        
        <style dangerouslySetInnerHTML={{ __html: `
          html {
            background-color: #1A0303 !important;
          }
          :root {
            --color-gold-bright: #f7e7c0;
            --color-gold-mid: #C5A059;
            --color-gold-deep: #8e6c27;
            --color-gold-light: #f7e7c0;
            --color-gold-whisper: #fbf5e6;
            
            --color-obsidian: #1A0303;
            --color-sanctum: #1A0303;
            --color-vessel: #2D0505;
            --color-border: rgba(197, 160, 89, 0.15);
            --color-border-mid: rgba(197, 160, 89, 0.4);
            
            --color-text-primary: #F5F0E1;
            --color-text-secondary: #E6D5B8;
            --color-text-tertiary: rgba(230, 213, 184, 0.6);
            
            --gutter: 40px;
            --container-wide: 1200px;

            --font-playfair-family: var(--font-playfair), 'Playfair Display', serif;
            --font-inter-family: var(--font-inter), 'Inter', sans-serif;
            --font-cormorant-family: var(--font-cormorant), 'Cormorant Garamond', serif;
            --font-jost-family: var(--font-jost), 'Jost', sans-serif;
          }

          /* Nuclear removal of all injected floating widgets */
          [class*="tidio"],
          [class*="tawk"],
          [class*="intercom"],
          [class*="crisp"],
          [class*="chat-widget"],
          [class*="floating-widget"],
          [id*="tidio"],
          [id*="tawk"],
          [id*="intercom"],
          div[style*="position: fixed"][style*="right: 0"],
          div[style*="position:fixed"][style*="right:0"],
          iframe[src*="tidio"],
          iframe[src*="tawk"],
          iframe[src*="crisp"] {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
            opacity: 0 !important;
            width: 0 !important;
            height: 0 !important;
          }

          /* Custom Cursor */
          *, *::before, *::after {
            cursor: none;
          }
          
          #cursor-dot {
            position: fixed;
            top: 0; left: 0;
            width: 6px; height: 6px;
            background: var(--color-gold-bright);
            border-radius: 50%;
            pointer-events: none;
            z-index: 99999;
            transform: translate(-50%, -50%);
            transition: transform 0.1s ease, background 0.2s ease;
          }

          #cursor-ring {
            position: fixed;
            top: 0; left: 0;
            width: 32px; height: 32px;
            border: 1px solid rgba(212, 168, 67, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 99998;
            transform: translate(-50%, -50%);
            transition: transform 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                        width 0.3s ease, height 0.3s ease, opacity 0.3s ease;
          }

          /* Disable custom cursor on touch devices */
          @media (hover: none) {
            #cursor-dot, #cursor-ring {
              display: none !important;
            }
            *, *::before, *::after {
              cursor: auto !important;
            }
          }

          /* Page Scroll Progress Indicator */
          #scroll-progress {
            position: fixed;
            top: 0; left: 0;
            height: 2px;
            width: 0%;
            background: linear-gradient(90deg, var(--color-gold-deep), var(--color-gold-bright));
            box-shadow: 0 0 10px rgba(212, 168, 67, 0.6);
            z-index: 100000;
            transition: width 0.1s linear;
          }

          /* Reveal Animations */
          .reveal-up {
            opacity: 0;
            transform: translateY(32px);
            transition: opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                        transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .reveal-up.visible { opacity: 1; transform: translateY(0); }

          .reveal-left {
            opacity: 0;
            transform: translateX(-32px);
            transition: opacity 0.4s ease, transform 0.4s ease;
          }
          .reveal-left.visible { opacity: 1; transform: translateX(0); }

          .reveal-right {
            opacity: 0;
            transform: translateX(32px);
            transition: opacity 0.4s ease, transform 0.4s ease;
          }
          .reveal-right.visible { opacity: 1; transform: translateX(0); }

          /* Stagger delays */
          .stagger > *:nth-child(1) { transition-delay: 0s; }
          .stagger > *:nth-child(2) { transition-delay: 0.12s; }
          .stagger > *:nth-child(3) { transition-delay: 0.24s; }
          .stagger > *:nth-child(4) { transition-delay: 0.36s; }
          .stagger > *:nth-child(5) { transition-delay: 0.48s; }

          /* Ambient Glow */
          body::before {
            content: '';
            position: fixed;
            inset: 0;
            background: radial-gradient(
              ellipse 70% 50% at 50% 100%,
              rgba(139, 105, 20, 0.07) 0%,
              transparent 65%
            );
            pointer-events: none;
            z-index: 0;
            animation: ambientGlow 12s ease-in-out infinite alternate;
          }

          @keyframes ambientGlow {
            0%   { opacity: 0.6; transform: scale(1)    translateX(0);   }
            33%  { opacity: 1;   transform: scale(1.05) translateX(2%);  }
            66%  { opacity: 0.8; transform: scale(0.98) translateX(-2%); }
            100% { opacity: 0.7; transform: scale(1.02) translateX(1%);  }
          }

          /* Shimmering margins effect */
          @keyframes goldShimmer {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .shimmer-text {
            background: linear-gradient(90deg, #8e6c27, #f7e7c0, #C5A059, #f7e7c0, #8e6c27);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: goldShimmer 6s linear infinite;
          }

          /* Part 2 — Hero Split Layout */
          .hero-split {
            display: grid;
            grid-template-columns: 45% 55%;
            min-height: 100vh;
            overflow: hidden;
            background: var(--color-obsidian);
          }

          .hero-content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 120px var(--gutter) 80px;
            background: var(--color-obsidian);
            position: relative;
            z-index: 2;
          }

          .hero-label {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
          }

          .label-ornament {
            color: var(--color-gold-mid);
            font-size: 12px;
          }

          .type-label {
            font-family: var(--font-jost-family);
            font-size: 10px;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: var(--color-gold-mid);
          }

          .hero-heading {
            font-family: var(--font-cormorant-family);
            font-size: clamp(48px, 5.5vw, 76px);
            font-weight: 600;
            color: var(--color-text-primary);
            line-height: 1.05;
            margin: 20px 0;
          }

          .hero-italic {
            font-style: italic;
            font-weight: 300;
          }

          .hero-divider {
            display: flex;
            align-items: center;
            gap: 12px;
            margin: 16px 0 24px;
          }

          .divider-line {
            height: 1px;
            width: 40px;
            background: var(--color-border);
          }

          .divider-diamond {
            color: var(--color-gold-mid);
            font-size: 8px;
          }

          .hero-body {
            font-family: var(--font-jost-family);
            font-size: 15px;
            font-weight: 300;
            color: var(--color-text-secondary);
            line-height: 1.7;
            margin: 0 0 32px;
          }

          .hero-actions {
            margin-bottom: 32px;
          }

          .btn-primary-outline {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            padding: 14px 28px;
            border: 1px solid var(--color-gold-mid);
            color: var(--color-text-primary);
            text-decoration: none;
            font-family: var(--font-jost-family);
            font-size: 11px;
            font-weight: 400;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            position: relative;
            overflow: hidden;
            transition: color 0.4s ease;
            width: fit-content;
            background: transparent;
          }

          .btn-primary-outline::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, var(--color-gold-deep), var(--color-gold-mid));
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            z-index: -1;
          }

          .btn-primary-outline:hover::before {
            transform: scaleX(1);
          }

          .btn-primary-outline:hover {
            color: #fff !important;
            border-color: var(--color-gold-mid);
          }

          .btn-arrow {
            transition: transform 0.3s ease;
          }

          .btn-primary-outline:hover .btn-arrow {
            transform: translateX(5px);
          }

          .hero-trust {
            margin-top: 24px;
            color: var(--color-text-tertiary);
            font-size: 9px;
            letter-spacing: 0.14em;
          }

          .hero-stats {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-top: 32px;
          }

          .stat-pill {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .stat-number {
            font-family: var(--font-cormorant-family);
            font-size: 22px;
            font-weight: 600;
            color: var(--color-gold-bright);
            line-height: 1;
          }

          .stat-label {
            font-family: var(--font-jost-family);
            font-size: 10px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--color-text-tertiary);
          }

          .stat-divider {
            color: var(--color-border-mid);
            font-size: 18px;
          }

          .hero-image-panel {
            position: relative;
            overflow: hidden;
          }

          .hero-image-frame {
            width: 100%;
            height: 100%;
            position: relative;
          }

          .hero-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            filter: sepia(0.15) brightness(0.75) contrast(1.05);
            transform: scale(1.05);
            transition: transform 8s ease;
          }

          .hero-split:hover .hero-img {
            transform: scale(1);
          }

          .img-corner {
            position: absolute;
            width: 28px;
            height: 28px;
            border-color: var(--color-gold-mid);
            border-style: solid;
            opacity: 0.7;
          }

          .img-corner--tl {
            top: 20px;
            left: 20px;
            border-width: 1px 0 0 1px;
          }

          .img-corner--br {
            bottom: 20px;
            right: 20px;
            border-width: 0 1px 1px 0;
          }

          .hero-image-panel::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 120px;
            height: 100%;
            background: linear-gradient(to right, var(--color-obsidian), transparent);
            z-index: 1;
          }

          .hero-float-tag {
            position: absolute;
            background: rgba(26, 15, 10, 0.85);
            border: 1px solid var(--color-border);
            backdrop-filter: blur(8px);
            padding: 10px 16px;
            display: flex;
            flex-direction: column;
            gap: 3px;
            z-index: 2;
          }

          .hero-float-tag--1 {
            bottom: 30%;
            left: 12%;
            animation: floatTag 4s ease-in-out infinite;
          }

          .hero-float-tag--2 {
            top: 25%;
            right: 8%;
            animation: floatTag 4s ease-in-out infinite 1.5s;
          }

          @keyframes floatTag {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(-8px); }
          }

          /* Part 3 — Trust Ticker */
          .ticker-wrapper {
            border-top: 1px solid var(--color-border);
            border-bottom: 1px solid var(--color-border);
            padding: 14px 0;
            overflow: hidden;
            background: var(--color-obsidian);
            mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          }

          .ticker-track {
            display: flex;
          }

          .ticker-content {
            display: flex;
            align-items: center;
            gap: 28px;
            white-space: nowrap;
            animation: ticker 35s linear infinite;
          }

          .ticker-content .type-label {
            color: var(--color-text-tertiary);
            font-size: 10px;
            letter-spacing: 0.16em;
          }

          .ticker-diamond {
            color: var(--color-gold-deep);
            font-size: 8px;
            opacity: 0.8;
          }

          @keyframes ticker {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }

          .ticker-wrapper:hover .ticker-content {
            animation-play-state: paused;
          }

          /* Part 4 — Features Section */
          .features-section {
            position: relative;
            overflow: hidden;
            padding: 120px var(--gutter);
            background: var(--color-obsidian);
          }

          .features-section::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: url('/assets/features_bg.jpg');
            background-size: cover;
            background-position: center;
            filter: brightness(0.15) sepia(0.4);
            z-index: 0;
          }

          .features-section::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, var(--color-sanctum) 0%, rgba(26,15,10,0.6) 50%, var(--color-sanctum) 100%);
            z-index: 1;
          }

          .features-grid {
            position: relative;
            z-index: 2;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 0;
            border: 1px solid var(--color-border);
          }

          .feature-col {
            padding: 48px 40px;
            border-right: 1px solid var(--color-border);
            position: relative;
            transition: background 0.4s ease;
            cursor: default;
          }

          .feature-col:last-child {
            border-right: none;
          }

          .feature-col::before {
            content: '';
            position: absolute;
            top: 0; left: 0;
            width: 2px;
            height: 0%;
            background: linear-gradient(to bottom, var(--color-gold-deep), transparent);
            transition: height 0.5s ease;
          }

          .feature-col:hover::before {
            height: 100%;
          }

          .feature-col:hover {
            background: rgba(139, 105, 20, 0.04);
          }

          .feature-number {
            font-family: var(--font-cormorant-family);
            font-size: 80px;
            font-weight: 300;
            color: var(--color-gold-deep);
            opacity: 0.4;
            line-height: 1;
            margin-bottom: 24px;
            transition: opacity 0.3s ease;
          }

          .feature-col:hover .feature-number {
            opacity: 0.7;
          }

          .feature-heading {
            font-family: var(--font-cormorant-family);
            font-size: 22px;
            font-weight: 500;
            color: var(--color-text-primary);
            margin-bottom: 12px;
          }

          .feature-rule {
            width: 36px;
            height: 1px;
            background: var(--color-gold-mid);
            margin-bottom: 16px;
            transition: width 0.4s ease;
          }

          .feature-col:hover .feature-rule {
            width: 60px;
          }

          .feature-body {
            font-family: var(--font-jost-family);
            font-size: 14px;
            font-weight: 300;
            color: var(--color-text-secondary);
            line-height: 1.7;
            max-width: 280px;
          }

          /* Part 5 — Product Photography Strip */
          .photo-strip-section {
            padding: 100px 0;
            overflow: hidden;
            background: var(--color-obsidian);
          }

          .photo-strip-header {
            text-align: center;
            padding: 0 var(--gutter);
            margin-bottom: 60px;
          }

          .photo-strip-header h2 {
            font-family: var(--font-cormorant-family);
            font-size: clamp(36px, 4vw, 60px);
            font-weight: 600;
            color: var(--color-text-primary);
            line-height: 1.1;
            margin: 0;
          }

          .photo-strip-scroll {
            overflow-x: auto;
            scrollbar-width: none;
            cursor: grab;
            -webkit-overflow-scrolling: touch;
          }

          .photo-strip-scroll:active {
            cursor: grabbing;
          }

          .photo-strip-scroll::-webkit-scrollbar {
            display: none;
          }

          .photo-strip-track {
            display: flex;
            gap: 16px;
            padding: 0 var(--gutter) 20px;
            width: max-content;
          }

          .strip-item {
            position: relative;
            width: 280px;
            height: 360px;
            flex-shrink: 0;
            overflow: hidden;
            border: 1px solid var(--color-border);
          }

          .strip-item--tall {
            height: 440px;
          }

          .strip-item--wide {
            width: 380px;
          }

          .strip-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: sepia(0.1) brightness(0.8);
            transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.6s ease;
          }

          .strip-item:hover img {
            transform: scale(1.06);
            filter: sepia(0.05) brightness(0.9);
          }

          .strip-item-label {
            position: absolute;
            bottom: 0; left: 0; right: 0;
            padding: 20px 18px;
            background: linear-gradient(to top, rgba(13,8,5,0.9) 0%, transparent 100%);
            display: flex;
            flex-direction: column;
            gap: 4px;
            transform: translateY(10px);
            opacity: 0;
            transition: transform 0.4s ease, opacity 0.4s ease;
          }

          .strip-item:hover .strip-item-label {
            transform: translateY(0);
            opacity: 1;
          }

          .strip-item-label .type-label {
            font-size: 10px;
            color: var(--color-gold-bright);
          }

          .strip-item-sub {
            font-family: var(--font-jost-family);
            font-size: 12px;
            font-weight: 300;
            color: var(--color-text-secondary);
            letter-spacing: 0.04em;
          }

          /* Part 6 — Supply Section */
          .supply-section {
            padding: 120px var(--gutter);
            background: var(--color-obsidian);
          }

          .supply-inner {
            max-width: var(--container-wide);
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 80px;
            align-items: center;
          }

          .supply-image-col {
            position: relative;
          }

          .supply-image-frame {
            position: relative;
            height: 580px;
            overflow: hidden;
            border: 1px solid var(--color-border);
          }

          .supply-image-frame img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: sepia(0.2) brightness(0.65);
            transition: transform 0.8s ease;
          }

          .supply-image-frame:hover img {
            transform: scale(1.03);
          }

          .supply-stat-float {
            position: absolute;
            top: 24px;
            right: 24px;
            background: rgba(13,8,5,0.8);
            backdrop-filter: blur(8px);
            border: 1px solid var(--color-border);
            padding: 16px 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            z-index: 2;
          }

          .supply-states {
            position: absolute;
            bottom: 0; left: 0; right: 0;
            background: linear-gradient(to top, rgba(13,8,5,0.95) 0%, transparent 100%);
            padding: 40px 24px 24px;
            display: flex;
            flex-direction: column;
            gap: 2px;
            z-index: 2;
          }

          .supply-state {
            font-family: var(--font-cormorant-family);
            font-size: 20px;
            font-weight: 300;
            font-style: italic;
            color: var(--color-text-primary);
            opacity: 0.7;
            padding: 4px 0;
            border-left: 0px solid var(--color-gold-mid);
            padding-left: 0;
            transition: opacity 0.3s ease, border-left-width 0.3s ease, padding-left 0.3s ease;
          }

          .supply-state:hover {
            opacity: 1;
            border-left-width: 2px;
            padding-left: 10px;
          }

          .supply-heading {
            font-family: var(--font-cormorant-family);
            font-size: clamp(36px, 3.5vw, 54px);
            font-weight: 600;
            color: var(--color-text-primary);
            line-height: 1.1;
            margin: 20px 0 40px;
          }

          .supply-blocks {
            display: flex;
            flex-direction: column;
            gap: 0;
          }

          .supply-block {
            display: grid;
            grid-template-columns: 40px 1fr;
            gap: 20px;
            padding: 28px 0;
            border-bottom: 1px solid var(--color-border);
            transition: background 0.3s ease;
          }

          .supply-block:first-child {
            border-top: 1px solid var(--color-border);
          }

          .supply-block:hover {
            background: rgba(139,105,20,0.03);
          }

          .supply-block-number {
            font-size: 10px;
            color: var(--color-gold-mid);
            padding-top: 4px;
          }

          .supply-block-content h3 {
            font-family: var(--font-cormorant-family);
            font-size: 20px;
            font-weight: 500;
            color: var(--color-text-primary);
            margin: 0 0 8px;
          }

          .supply-block-content p {
            font-family: var(--font-jost-family);
            font-size: 14px;
            font-weight: 300;
            color: var(--color-text-secondary);
            line-height: 1.65;
            margin: 0;
          }

          .supply-phone {
            display: inline-block;
            margin-top: 12px;
            font-family: var(--font-cormorant-family);
            font-size: 18px;
            font-weight: 500;
            color: var(--color-gold-bright);
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: border-color 0.3s ease;
          }

          .supply-phone:hover {
            border-bottom-color: var(--color-gold-mid);
          }

          /* Part 7 — Panchanga Section */
          .panchanga-section {
            padding: 120px var(--gutter);
            background: var(--color-obsidian);
            text-align: center;
          }

          .panchanga-header h2 {
            font-family: var(--font-cormorant-family);
            font-size: clamp(48px, 5vw, 72px);
            font-weight: 600;
            color: var(--color-text-primary);
            line-height: 1.05;
            margin: 20px 0 16px;
          }

          .panchanga-sub {
            font-family: var(--font-jost-family);
            font-size: 15px;
            font-weight: 300;
            color: var(--color-text-secondary);
            max-width: 500px;
            margin: 0 auto 60px;
            line-height: 1.65;
          }

          .panchanga-card {
            max-width: 900px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 320px;
            border: 1px solid var(--color-border);
            background: var(--color-vessel);
            text-align: left;
            position: relative;
          }

          .panchanga-card::before {
            content: '';
            position: absolute;
            top: -1px; left: -1px;
            width: 24px; height: 24px;
            border-top: 2px solid var(--color-gold-mid);
            border-left: 2px solid var(--color-gold-mid);
          }

          .panchanga-card::after {
            content: '';
            position: absolute;
            bottom: -1px; right: -1px;
            width: 24px; height: 24px;
            border-bottom: 2px solid var(--color-gold-mid);
            border-right: 2px solid var(--color-gold-mid);
          }

          .panchanga-data {
            padding: 40px 44px;
          }

          .panchanga-card-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 28px;
          }

          .panchanga-date {
            font-family: var(--font-cormorant-family);
            font-size: 20px;
            font-weight: 500;
            color: var(--color-text-primary);
            margin-top: 6px;
          }

          .panchanga-tithi-name {
            font-family: var(--font-cormorant-family);
            font-size: 16px;
            font-style: italic;
            font-weight: 300;
            color: var(--color-gold-light);
          }

          .panchanga-divider {
            height: 1px;
            background: var(--color-border);
            margin: 24px 0;
          }

          .panchanga-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }

          .panchanga-item {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .panchanga-item-label {
            font-size: 9px;
            letter-spacing: 0.14em;
            color: var(--color-gold-mid);
          }

          .panchanga-item-value {
            font-family: var(--font-cormorant-family);
            font-size: 20px;
            font-weight: 500;
            color: var(--color-text-primary);
          }

          .panchanga-rahu {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-top: 20px;
          }

          .panchanga-rahu-time {
            font-family: var(--font-cormorant-family);
            font-size: 24px;
            font-weight: 500;
            color: var(--color-text-primary);
          }

          .city-tabs {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
          }

          .city-tab {
            font-family: var(--font-jost-family);
            font-size: 11px;
            font-weight: 400;
            letter-spacing: 0.08em;
            padding: 6px 14px;
            background: none;
            border: 1px solid var(--color-border);
            color: var(--color-text-secondary);
            cursor: pointer;
            transition: border-color 0.3s, color 0.3s, background 0.3s;
          }

          .city-tab:hover, .city-tab.active {
            border-color: var(--color-gold-mid);
            color: var(--color-gold-bright);
            background: rgba(212,168,67,0.05);
          }

          .panchanga-image {
            position: relative;
            overflow: hidden;
            border-left: 1px solid var(--color-border);
          }

          .panchanga-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: sepia(0.3) brightness(0.5);
          }

          .panchanga-image-quote {
            position: absolute;
            bottom: 0; left: 0; right: 0;
            padding: 24px 20px;
            background: linear-gradient(to top, rgba(13,8,5,0.95), transparent);
          }

          /* Part 8 — Subscription Cards */
          .subscription-card {
            position: relative;
            overflow: hidden;
            transition: transform 0.4s ease, box-shadow 0.4s ease;
          }

          .subscription-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px var(--color-border-mid);
          }

          .subscription-card::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: url('/assets/sub_texture.jpg');
            background-size: cover;
            opacity: 0.06;
            pointer-events: none;
            z-index: 0;
          }

          .subscription-card > * {
            position: relative;
            z-index: 1;
          }

          .subscription-price {
            font-family: var(--font-cormorant-family);
            font-size: 72px;
            font-weight: 300;
            color: var(--color-text-primary);
            line-height: 1;
            transition: color 0.3s ease;
          }

          .subscription-card:hover .subscription-price {
            color: var(--color-gold-light);
          }

          .subscription-card-image {
            width: 80px;
            height: 80px;
            position: absolute;
            top: 20px;
            right: 20px;
            border-radius: 4px;
            overflow: hidden;
            opacity: 0.6;
            transition: opacity 0.3s;
          }

          .subscription-card:hover .subscription-card-image {
            opacity: 0.9;
          }

          .subscription-card-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: sepia(0.2);
          }

          /* Part 9 — Sacred Quality / Home Section */
          .sacred-quality-section {
            position: relative;
            padding: 120px var(--gutter);
            overflow: hidden;
            background: var(--color-obsidian);
          }

          .sacred-quality-section::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: url('/assets/quality_bg.jpg');
            background-size: cover;
            background-position: center 30%;
            filter: brightness(0.12) sepia(0.5);
            z-index: 0;
          }

          .sacred-quality-section::after {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, var(--color-obsidian) 90%);
            z-index: 1;
          }

          .sacred-quality-inner {
            position: relative;
            z-index: 2;
          }

          .sacred-card {
            background: rgba(26, 15, 10, 0.6);
            backdrop-filter: blur(8px);
            padding: 40px 32px;
            position: relative;
            border: none;
            transition: background 0.4s ease;
          }

          .sacred-card:hover {
            background: rgba(36, 18, 8, 0.85);
          }

          .sacred-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 20px;
            height: 20px;
            border-top: 1px solid var(--color-gold-mid);
            border-left: 1px solid var(--color-gold-mid);
            opacity: 0.6;
            transition: width 0.3s ease, height 0.3s ease, opacity 0.3s ease;
          }

          .sacred-card::after {
            content: '';
            position: absolute;
            bottom: 0;
            right: 0;
            width: 20px;
            height: 20px;
            border-bottom: 1px solid var(--color-gold-mid);
            border-right: 1px solid var(--color-gold-mid);
            opacity: 0.6;
            transition: width 0.3s ease, height 0.3s ease, opacity 0.3s ease;
          }

          .sacred-card:hover::before,
          .sacred-card:hover::after {
            width: 40px;
            height: 40px;
            opacity: 1;
          }

          /* Part 10 — Margins Section */
          .margins-stat-card {
            position: relative;
            overflow: hidden;
            min-height: 320px;
            border: 1px solid var(--color-border);
            border-radius: 32px;
            background: var(--color-obsidian);
          }

          .margins-stat-card::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: url('/assets/margins_bg.jpg');
            background-size: cover;
            background-position: center;
            filter: brightness(0.2) sepia(0.4);
            z-index: 0;
          }

          .margins-stat-card-content {
            position: relative;
            z-index: 1;
            padding: 48px;
          }

          .margins-percent {
            font-family: 'Cormorant Garamond', serif;
            font-size: 120px;
            font-weight: 300;
            font-style: italic;
            color: var(--color-gold-light);
            line-height: 1;
            animation: goldShimmer 6s ease-in-out infinite;
            background: linear-gradient(90deg,
              var(--color-gold-deep) 0%,
              var(--color-gold-bright) 40%,
              var(--color-gold-whisper) 50%,
              var(--color-gold-bright) 60%,
              var(--color-gold-deep) 100%
            );
            background-size: 300% 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          /* Part 11 — Footer Panoramic Strip */
          .footer-image-strip {
            position: relative;
            height: 220px;
            overflow: hidden;
            border-top: 1px solid var(--color-border);
            border-bottom: 1px solid var(--color-border);
          }

          .footer-image-strip img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center 40%;
            filter: brightness(0.3) sepia(0.4);
          }

          .footer-image-strip-overlay {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 0 var(--gutter);
            text-align: center;
            background: linear-gradient(to right, rgba(13,8,5,0.6), transparent, rgba(13,8,5,0.6));
          }

          /* Responsive Rules */
          @media (max-width: 1024px) {
            .hero-split            { grid-template-columns: 1fr !important; min-height: auto !important; }
            .hero-image-panel      { height: 60vw !important; }
            .hero-content          { padding: 80px 20px 60px !important; }
            .supply-inner          { grid-template-columns: 1fr !important; gap: 48px !important; }
            .supply-image-col      { order: 2 !important; }
            .supply-image-frame    { height: 400px !important; }
            .features-grid         { grid-template-columns: 1fr !important; }
            .feature-col           { border-right: none !important; border-bottom: 1px solid var(--color-border) !important; }
          }

          @media (max-width: 768px) {
            .hero-stats            { flex-wrap: wrap !important; gap: 12px !important; }
            .photo-strip-track     { padding: 0 16px 16px !important; }
            .strip-item            { width: 240px !important; height: 300px !important; }
            .panchanga-grid        { grid-template-columns: 1fr !important; gap: 16px !important; }
            .margins-percent       { font-size: 80px !important; }
            .footer-image-strip    { height: 160px !important; }
            .hero-float-tag        { display: none !important; }
          }

          /* ── Earning Calculator Slider ── */
          input[type='range'] {
            -webkit-appearance: none;
            appearance: none;
            background: transparent;
            cursor: pointer;
          }
          input[type='range']::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, #8e6c27, #C5A059);
            border: 2px solid #f7e7c0;
            box-shadow: 0 0 10px rgba(197,160,89,0.5), 0 2px 6px rgba(0,0,0,0.4);
            cursor: pointer;
            transition: transform 0.15s, box-shadow 0.15s;
            margin-top: -8px;
          }
          input[type='range']::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 0 18px rgba(197,160,89,0.8), 0 2px 8px rgba(0,0,0,0.5);
          }
          input[type='range']::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, #8e6c27, #C5A059);
            border: 2px solid #f7e7c0;
            box-shadow: 0 0 10px rgba(197,160,89,0.5);
            cursor: pointer;
          }
          input[type='range']::-webkit-slider-runnable-track {
            background: transparent;
            height: 4px;
          }

          /* Preloader Screen */
          #jjr-preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: radial-gradient(circle at center, #2D0505 0%, #1A0303 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100000;
            opacity: 1;
            transition: opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }

          #jjr-preloader.fade-out {
            opacity: 0;
            pointer-events: none;
          }

          .preloader-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;
          }

          .preloader-logo {
            width: 120px;
            height: 160px;
            object-fit: contain;
            filter: drop-shadow(0 0 20px rgba(197, 160, 89, 0.3));
            animation: preloader-pulse 2s infinite ease-in-out;
            mix-blend-mode: screen;
          }

          .preloader-line-container {
            width: 160px;
            height: 2px;
            background: rgba(197, 160, 89, 0.15);
            border-radius: 1px;
            overflow: hidden;
            position: relative;
          }

          .preloader-line {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 60px;
            background: linear-gradient(90deg, transparent, #C5A059, transparent);
            animation: preloader-loading 1.5s infinite linear;
          }

          @keyframes preloader-pulse {
            0%, 100% {
              transform: scale(0.95);
              filter: drop-shadow(0 0 10px rgba(197, 160, 89, 0.2));
            }
            50% {
              transform: scale(1.05);
              filter: drop-shadow(0 0 30px rgba(197, 160, 89, 0.5));
            }
          }

          @keyframes preloader-loading {
            0% {
              left: -60px;
            }
            100% {
              left: 160px;
            }
          }
        ` }} />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#1A0303', color: '#E6D5B8', fontFamily: "var(--font-playfair), serif" }}>
        <div id="jjr-preloader">
          <div className="preloader-content">
            <img src="/assets/logo.png" alt="Jaya Janardhana" className="preloader-logo" />
            <div className="preloader-line-container">
              <div className="preloader-line"></div>
            </div>
          </div>
        </div>
        <div id="cursor-dot"></div>
        <div id="cursor-ring"></div>
        <div id="scroll-progress"></div>
        <GlobalClient />
        {children}
      </body>
    </html>
  );
}
