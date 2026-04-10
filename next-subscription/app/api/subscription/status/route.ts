
import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import { Subscriber } from '../../../../lib/models';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    await dbConnect();
    const subscriber = await Subscriber.findOne({ userId });

    return NextResponse.json({ subscriber });

  } catch (error: any) {
    console.error('Fetch Status Error (MongoDB):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
