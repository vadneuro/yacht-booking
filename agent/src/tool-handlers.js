import { YACHTS, BLOCKED_SLOTS } from './mock-data.js';

// В продакшене эти функции работают с Supabase:
// import { supabase } from './supabase.js';

export async function handleToolCall(toolName, toolInput) {
  switch (toolName) {
    case 'get_yachts':
      return getYachts(toolInput);
    case 'check_availability':
      return checkAvailability(toolInput);
    case 'create_booking_request':
      return createBookingRequest(toolInput);
    default:
      return { error: `Неизвестный инструмент: ${toolName}` };
  }
}

function getYachts({ min_capacity, yacht_type, max_price_per_hour } = {}) {
  let yachts = YACHTS.filter(y => y.is_active);

  if (min_capacity) {
    yachts = yachts.filter(y => y.capacity >= min_capacity);
  }
  if (yacht_type) {
    yachts = yachts.filter(y => y.type === yacht_type);
  }
  if (max_price_per_hour) {
    yachts = yachts.filter(y => y.price_per_hour <= max_price_per_hour);
  }

  return {
    count: yachts.length,
    yachts: yachts.map(y => ({
      id: y.id,
      name: y.name,
      type_label: y.type_label,
      capacity: y.capacity,
      price_per_hour: y.price_per_hour,
      features: y.features,
      description: y.description,
    })),
  };
}

function checkAvailability({ yacht_id, date, time_start, time_end }) {
  const yacht = YACHTS.find(y => y.id === yacht_id);
  if (!yacht) return { available: false, reason: 'Яхта не найдена' };

  const blocked = BLOCKED_SLOTS.filter(s => s.yacht_id === yacht_id && s.date === date);

  if (blocked.length === 0) {
    return {
      available: true,
      yacht_name: yacht.name,
      date,
      message: 'Яхта свободна на эту дату',
    };
  }

  // Простая проверка пересечения
  if (time_start && time_end) {
    const hasConflict = blocked.some(s => {
      return time_start < s.time_end && time_end > s.time_start;
    });
    if (hasConflict) {
      return {
        available: false,
        yacht_name: yacht.name,
        date,
        blocked_slots: blocked.map(s => `${s.time_start}–${s.time_end}`),
        message: 'Яхта занята в указанное время',
      };
    }
  }

  return {
    available: true,
    yacht_name: yacht.name,
    date,
    busy_slots: blocked.map(s => `${s.time_start}–${s.time_end}`),
    message: 'Запрошенное время свободно',
  };
}

async function createBookingRequest(input) {
  const { yacht_id, yacht_name, date, time_start, time_end, client_name, client_phone, notes } = input;

  // TODO: сохранить в Supabase
  // const { data, error } = await supabase.from('bookings').insert([...]);

  // Генерируем простой ID заявки
  const booking_id = `BK-${Date.now().toString(36).toUpperCase()}`;

  return {
    success: true,
    booking_id,
    summary: {
      yacht: yacht_name,
      date,
      time: `${time_start}–${time_end}`,
      client: client_name,
      phone: client_phone,
      notes: notes || 'нет',
    },
    message: 'Заявка создана. Администратор подтвердит бронирование в течение 15 минут.',
  };
}
