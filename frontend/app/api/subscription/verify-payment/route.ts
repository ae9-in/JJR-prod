
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, subscriberId } = await req.json();

    // Verify Razorpay signature — no DB needed
    const secret = (process.env.RAZORPAY_KEY_SECRET as string) || '';
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const expectedSignature = hmac.digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('❌ Signature mismatch — payment verification failed');
      return NextResponse.json({ error: 'Signature verification failed' }, { status: 400 });
    }

    console.log(`✅ Payment verified! payment_id=${razorpay_payment_id} | order_id=${razorpay_order_id}`);

    return NextResponse.json({ success: true, paymentId: razorpay_payment_id });

  } catch (error: any) {
    console.error('❌ Verify Payment Error:', error.message);
    return NextResponse.json({ error: error.message || 'Payment verification failed' }, { status: 500 });
  }
}
