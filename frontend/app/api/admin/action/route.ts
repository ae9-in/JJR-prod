export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { CartOrder, SubscriptionRegistration } from '@/lib/models';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { action, type, id, status } = await req.json();

    if (!action || !type || !id) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const Model = type === 'order' ? CartOrder : SubscriptionRegistration;

    if (action === 'delete') {
      await Model.findByIdAndDelete(id);
      return NextResponse.json({ success: true, message: `${type} deleted successfully` });
    }

    if (action === 'update_status') {
      if (!status) {
        return NextResponse.json({ error: 'Status is required for update' }, { status: 400 });
      }
      await Model.findByIdAndUpdate(id, { status });
      return NextResponse.json({ success: true, message: `${type} status updated to ${status}` });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    console.error('❌ Admin Action Error:', error.message);
    return NextResponse.json({ error: error.message || 'Action execution failed' }, { status: 500 });
  }
}
