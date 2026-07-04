export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { CartOrder } from '@/lib/models';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, phone, address, items, totalAmount } = await req.json();

    if (!name || !email || !phone || !address || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'All fields and cart items are required' }, { status: 400 });
    }

    const order = await CartOrder.create({
      name,
      email,
      phone,
      address,
      items,
      totalAmount: Number(totalAmount),
      status: 'pending'
    });

    console.log(`✅ Cart Order saved to DB: ${order._id} | ${name} | total: ₹${totalAmount}`);

    return NextResponse.json({
      success: true,
      orderId: order._id,
      message: 'Our team will get back to you shortly'
    });

  } catch (error: any) {
    console.error('❌ Checkout API Error:', error.message);
    return NextResponse.json({ error: error.message || 'Checkout submission failed' }, { status: 500 });
  }
}
