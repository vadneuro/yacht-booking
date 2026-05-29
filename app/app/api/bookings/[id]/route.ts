import { NextRequest, NextResponse } from 'next/server';
import { updateBookingStatus, type BookingStatus } from '@/lib/data';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json() as { status: BookingStatus };
    const valid: BookingStatus[] = ['pending', 'confirmed', 'paid', 'cancelled', 'completed'];
    if (!valid.includes(status)) {
      return NextResponse.json({ error: 'invalid status' }, { status: 400 });
    }
    const booking = updateBookingStatus(id, status);
    if (!booking) {
      return NextResponse.json({ error: 'not found' }, { status: 404 });
    }
    return NextResponse.json({ booking });
  } catch {
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
