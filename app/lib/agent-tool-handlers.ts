import {
  getYachts, getYachtById, getBookings, getBlockedSlots,
  createBooking, COMMISSION_RATE,
  type YachtType,
} from './data';
import { createNotification } from './notifications';

export async function handleToolCall(
  toolName: string,
  toolInput: Record<string, unknown>,
): Promise<unknown> {
  switch (toolName) {
    case 'get_yachts': return handleGetYachts(toolInput);
    case 'check_availability': return handleCheckAvailability(toolInput);
    case 'create_booking': return handleCreateBooking(toolInput);
    case 'create_inquiry': return handleCreateInquiry(toolInput);
    default: return { error: `Неизвестный инструмент: ${toolName}` };
  }
}

function handleGetYachts(input: Record<string, unknown>) {
  let yachts = getYachts();

  if (input.min_capacity) {
    yachts = yachts.filter(y => y.capacity >= (input.min_capacity as number));
  }
  if (input.yacht_type) {
    yachts = yachts.filter(y => y.type === (input.yacht_type as YachtType));
  }
  if (input.max_price_per_hour) {
    yachts = yachts.filter(y => y.pricePerHour <= (input.max_price_per_hour as number));
  }

  return {
    count: yachts.length,
    yachts: yachts.map(y => ({
      id: y.id,
      name: y.name,
      type_label: y.typeLabel,
      capacity: y.capacity,
      price_per_hour: y.pricePerHour,
      features: y.features,
      description: y.description,
    })),
  };
}

function handleCheckAvailability(input: Record<string, unknown>) {
  const yachtId = input.yacht_id as string;
  const date = input.date as string;
  const timeStart = input.time_start as string | undefined;
  const timeEnd = input.time_end as string | undefined;

  const yacht = getYachtById(yachtId);
  if (!yacht) return { available: false, reason: 'Яхта не найдена' };

  const blocked = getBlockedSlots(yachtId, date);
  const existingBookings = getBookings({ yachtId, date })
    .filter(b => b.status !== 'cancelled');

  const busySlots = [
    ...blocked.map(s => ({ start: s.timeStart || '00:00', end: s.timeEnd || '23:59', type: 'blocked' })),
    ...existingBookings.map(b => ({ start: b.timeStart, end: b.timeEnd, type: 'booked' })),
  ];

  if (busySlots.length === 0) {
    return { available: true, yacht_name: yacht.name, date, message: 'Яхта свободна весь день' };
  }

  if (timeStart && timeEnd) {
    const hasConflict = busySlots.some(s => timeStart < s.end && timeEnd > s.start);
    if (hasConflict) {
      return {
        available: false,
        yacht_name: yacht.name,
        date,
        busy_slots: busySlots.map(s => `${s.start}–${s.end}`),
        message: 'Яхта занята в указанное время',
      };
    }
    return { available: true, yacht_name: yacht.name, date, message: 'Запрошенное время свободно' };
  }

  return {
    available: true,
    yacht_name: yacht.name,
    date,
    busy_slots: busySlots.map(s => `${s.start}–${s.end}`),
    message: 'Яхта частично занята — проверьте конкретное время',
  };
}

function handleCreateBooking(input: Record<string, unknown>) {
  const yachtId = input.yacht_id as string;
  const yacht = getYachtById(yachtId);
  if (!yacht) return { success: false, error: 'Яхта не найдена' };

  const timeStart = input.time_start as string;
  const timeEnd = input.time_end as string;
  const hours = (parseInt(timeEnd) - parseInt(timeStart)) || 4;
  const amount = hours * yacht.pricePerHour;
  const commission = Math.round(amount * COMMISSION_RATE);

  const booking = createBooking({
    yachtId,
    yachtName: input.yacht_name as string,
    date: input.date as string,
    timeStart,
    timeEnd,
    clientName: input.client_name as string,
    clientPhone: input.client_phone as string,
    amount,
    type: 'standard',
    source: 'web_chat',
    notes: (input.notes as string) || undefined,
  });

  createNotification({
    type: 'new_booking',
    bookingId: booking.id,
    message: `Новое бронирование: ${yacht.name}, ${booking.date} ${timeStart}–${timeEnd}, ${booking.clientName}`,
  });

  return {
    success: true,
    booking_id: booking.id,
    summary: {
      yacht: yacht.name,
      date: booking.date,
      time: `${timeStart}–${timeEnd}`,
      hours,
      total_amount: amount,
      commission,
      commission_percent: '15%',
    },
    message: `Бронирование создано! Стоимость: ${amount.toLocaleString('ru')} ₽. Для подтверждения оплатите бронь ${commission.toLocaleString('ru')} ₽ (15%). Остальное — капитану в день прогулки.`,
    pay_url: `/booking/${booking.id}/pay`,
  };
}

function handleCreateInquiry(input: Record<string, unknown>) {
  const booking = createBooking({
    yachtId: '',
    yachtName: 'Индивидуальный запрос',
    date: (input.preferred_date as string) || '',
    timeStart: '',
    timeEnd: '',
    clientName: input.client_name as string,
    clientPhone: input.client_phone as string,
    amount: 0,
    type: 'inquiry',
    source: 'web_chat',
    notes: input.description as string,
  });

  createNotification({
    type: 'new_inquiry',
    bookingId: booking.id,
    message: `Новая заявка от ${booking.clientName}: ${(input.description as string).slice(0, 100)}`,
  });

  return {
    success: true,
    inquiry_id: booking.id,
    message: 'Заявка принята! Менеджер свяжется с вами в течение часа для обсуждения деталей.',
  };
}
