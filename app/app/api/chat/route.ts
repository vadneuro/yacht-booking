import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/lib/agent';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, message } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: 'empty message' }, { status: 400 });
    }
    const id = sessionId || `web-${Date.now()}`;
    const result = await chat(id, message.trim());
    return NextResponse.json({
      reply: result.reply,
      sessionId: id,
      bookingId: result.bookingId,
      action: result.action,
    });
  } catch (err) {
    console.error('chat api error:', err);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
