
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function POST(req: Request) {
  try {
    const { planId, planName, planPrice, userId, name, email, phone, address } = await req.json();

    const totalAmount = Number(planPrice); // Already in paise from frontend
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create Razorpay order — no DB dependency
    const razorOrder = await razorpay.orders.create({
      amount: totalAmount,
      currency: 'INR',
      receipt: invoiceNumber,
      notes: { planId, userId, planName }
    });

    console.log(`✅ Razorpay order created: ${razorOrder.id} | ₹${totalAmount / 100} | Plan: ${planName}`);

    return NextResponse.json({
      orderId: razorOrder.id,
      amount: razorOrder.amount,
      currency: razorOrder.currency,
      subscriberId: `mock_${userId}_${Date.now()}`,
      invoiceNumber: invoiceNumber,
      keyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (error: any) {
    console.error('❌ Create Order Error:', error.message);
    return NextResponse.json({ error: error.message || 'Payment initiation failed' }, { status: 500 });
  }
}
