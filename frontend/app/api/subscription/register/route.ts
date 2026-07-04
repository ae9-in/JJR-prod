export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { SubscriptionRegistration } from '@/lib/models';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, phone, address, planId, planName, planPrice, billingMode } = await req.json();

    if (!name || !email || !phone || !address || !planId || !planName || !planPrice || !billingMode) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const registration = await SubscriptionRegistration.create({
      name,
      email,
      phone,
      address,
      planId,
      planName,
      planPrice: Number(planPrice),
      billingMode,
      status: 'pending'
    });

    console.log(`✅ Subscription Registration saved: ${registration._id} | ${name} | Plan: ${planName}`);

    return NextResponse.json({
      success: true,
      registrationId: registration._id,
      message: 'Our team will get back to you shortly'
    });

  } catch (error: any) {
    console.error('❌ Subscription Registration API Error:', error.message);
    return NextResponse.json({ error: error.message || 'Subscription registration failed' }, { status: 500 });
  }
}
