import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/lib/agent';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, message } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: 'empty message' }, { status: 400 });
    }
    const id = sessionId || `web-${Date.now()}`;
    const reply = await chat(id, message.trim());
    return NextResponse.json({ reply, sessionId: id });
  } catch (err) {
    console.error('chat api error:', err);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
