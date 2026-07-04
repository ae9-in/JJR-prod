export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

const normalizeApiBase = () => {
  const raw = (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api').trim();
  return raw.replace(/\/$/, '');
};

export async function GET() {
  try {
    const apiBase = normalizeApiBase();
    const res = await fetch(`${apiBase}/admin/data`, { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch data from backend');
    }

    return NextResponse.json({
      success: true,
      orders: data.orders || [],
      subscriptions: data.subscriptions || []
    });

  } catch (error: any) {
    console.error('❌ Admin Data Next.js Proxy Error:', error.message);
    return NextResponse.json({ error: error.message || 'Failed to fetch admin data' }, { status: 500 });
  }
}
