import { NextRequest, NextResponse } from 'next/server';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '@/lib/notifications';

export async function GET() {
  return NextResponse.json({
    notifications: getNotifications(),
    unreadCount: getUnreadCount(),
  });
}

export async function PATCH(req: NextRequest) {
  const { id, markAll } = await req.json();
  if (markAll) {
    markAllAsRead();
  } else if (id) {
    markAsRead(id);
  }
  return NextResponse.json({ ok: true, unreadCount: getUnreadCount() });
}
