import { NextResponse } from 'next/server';

const FALLBACK_PRODUCTS = [
  { _id: 'p1', category: 'Daily Pooja', name: '100% Pure Camphor', price: 219, imageUrl: '/assets/products/Camphor JJ.png' },
  { _id: 'p2', category: 'Daily Pooja', name: 'Sacred Deepa Oil', price: 209, imageUrl: '/assets/products/Pooja Oil JJ.png' },
  { _id: 'p3', category: 'Incense & Resins', name: 'Sandalwood Bliss Agarbatti', price: 59, imageUrl: '/assets/products/Agarbhatti Sandalwood JJ.png' },
  { _id: 'p4', category: 'Incense & Resins', name: 'Sandalwood Dhoop', price: 59, imageUrl: '/assets/products/Sandalwood JJ.png' },
  { _id: 'p5', category: 'Daily Pooja', name: 'Arsina + Kunkuma', price: 20, imageUrl: '/assets/products/ArsinaKunkuma.png' },
  { _id: 'p6', category: 'Daily Pooja', name: 'Premium Cotton Wicks', price: 10, imageUrl: '/assets/products/Cotton Wicks JJ.png' }
];

const normalizeApiBase = () => {
  const raw = (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5050/api').trim();
  return raw.replace(/\/$/, '');
};

export async function GET() {
  const apiBase = normalizeApiBase();

  try {
    const res = await fetch(`${apiBase}/products`, { cache: 'no-store' });
    const payload = await res.json();
    if (res.ok && payload?.products) {
      return NextResponse.json(payload);
    }
  } catch {
    // Fall back below.
  }

  return NextResponse.json({ products: FALLBACK_PRODUCTS });
}
