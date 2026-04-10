
import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import { Subscriber, SubscriptionLog } from '../../../../lib/models';

export async function PATCH(req: Request) {
  try {
    const { subscriberId, action } = await req.json();
    await dbConnect();

    const actionToStatus: Record<string, string> = {
      'pause': 'paused',
      'resume': 'active',
      'cancel': 'cancelled'
    };

    const newStatus = actionToStatus[action];
    if (!newStatus) return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    // 1. UPDATE SUBSCRIBER STATUS
    const subscriber = await Subscriber.findByIdAndUpdate(
      subscriberId,
      { status: newStatus },
      { new: true }
    );

    if (!subscriber) return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });

    // 2. LOG ACTION
    await SubscriptionLog.create({
      subscriberId: subscriber._id,
      action: action === 'resume' ? 'resumed' : (action === 'pause' ? 'paused' : 'cancelled'),
      metadata: { timestamp: new Date().toISOString(), action }
    });

    return NextResponse.json({ success: true, status: newStatus });

  } catch (error: any) {
    console.error('Manage Action Error (MongoDB):', error);
    return NextResponse.json({ error: error.message || 'Action failed' }, { status: 500 });
  }
}
