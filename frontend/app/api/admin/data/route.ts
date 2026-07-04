export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { CartOrder, SubscriptionRegistration } from '@/lib/models';

export async function GET() {
  try {
    await dbConnect();

    // Fetch all cart orders and subscription registrations sorted by newest first
    const orders = await CartOrder.find({}).sort({ createdAt: -1 });
    const subscriptions = await SubscriptionRegistration.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      orders,
      subscriptions
    });

  } catch (error: any) {
    console.error('❌ Admin Data Fetch Error:', error.message);
    return NextResponse.json({ error: error.message || 'Failed to fetch admin data' }, { status: 500 });
  }
}
