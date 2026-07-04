export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

const normalizeApiBase = () => {
  const raw = (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api').trim();
  return raw.replace(/\/$/, '');
};

export async function POST(req: Request) {
  try {
    const apiBase = normalizeApiBase();
    const body = await req.json();

    const res = await fetch(`${apiBase}/admin/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to execute backend action');
    }

    return NextResponse.json({
      success: true,
      message: data.message
    });

  } catch (error: any) {
    console.error('❌ Admin Action Next.js Proxy Error:', error.message);
    return NextResponse.json({ error: error.message || 'Action execution failed' }, { status: 500 });
  }
}
