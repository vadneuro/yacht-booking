import { NextRequest, NextResponse } from 'next/server';
import { updateBookingStatus, getBookingById, type BookingStatus } from '@/lib/data';
import { createNotification } from '@/lib/notifications';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const booking = getBookingById(id);
  if (!booking) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ booking });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json() as { status: BookingStatus };
    const valid: BookingStatus[] = ['pending', 'commission_paid', 'confirmed', 'cancelled', 'completed'];
    if (!valid.includes(status)) {
      return NextResponse.json({ error: 'invalid status' }, { status: 400 });
    }
    const booking = updateBookingStatus(id, status);
    if (!booking) {
      return NextResponse.json({ error: 'not found' }, { status: 404 });
    }
    if (status === 'commission_paid') {
      createNotification({
        type: 'commission_paid',
        bookingId: id,
        message: `Бронь оплачена: ${booking.yachtName}, ${booking.date} ${booking.timeStart}–${booking.timeEnd}, ${booking.clientName}`,
      });
    }
    return NextResponse.json({ booking });
  } catch {
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
