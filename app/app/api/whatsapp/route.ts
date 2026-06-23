// Twilio WhatsApp webhook
// Настройка: в Twilio console -> WhatsApp -> Sandbox -> When a message comes in
// URL: https://your-domain/api/whatsapp  Method: POST

import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/lib/agent';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);

    const from = params.get('From') ?? '';    // whatsapp:+79001234567
    const text = params.get('Body') ?? '';

    if (!text.trim()) {
      return twiml('Напиши что-нибудь, я помогу подобрать яхту.');
    }

    // Используем номер как session ID
    const sessionId = `wa-${from.replace(/\D/g, '')}`;
    const result = await chat(sessionId, text.trim());

    return twiml(result.reply);
  } catch (err) {
    console.error('whatsapp webhook error:', err);
    return twiml('Что-то пошло не так. Позвони нам: +7 900 123-45-67');
  }
}

function twiml(message: string) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message><Body>${escapeXml(message)}</Body></Message>
</Response>`;
  return new NextResponse(xml, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
