// Центральный data layer — сейчас mock, легко заменить на Supabase

export type YachtType = 'sailing' | 'motor' | 'catamaran';
export type BookingStatus = 'pending' | 'commission_paid' | 'confirmed' | 'cancelled' | 'completed';
export type BookingType = 'standard' | 'inquiry';
export type BookingSource = 'form' | 'web_chat' | 'telegram';

export const COMMISSION_RATE = 0.15;

export interface Owner {
  id: string;
  token: string;
  name: string;
  phone: string;
  telegram?: string;
}

export interface Yacht {
  id: string;
  ownerId: string;
  name: string;
  type: YachtType;
  typeLabel: string;
  capacity: number;
  pricePerHour: number;
  description: string;
  photos: string[];
  features: string[];
  isActive: boolean;
}

export interface Booking {
  id: string;
  yachtId: string;
  yachtName: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  clientName: string;
  clientPhone: string;
  status: BookingStatus;
  amount: number;
  commission: number;
  type: BookingType;
  source: BookingSource;
  notes?: string;
}

export interface BlockedSlot {
  id: string;
  yachtId: string;
  date: string;
  timeStart?: string;
  timeEnd?: string;
  note?: string;
}

// ---- MOCK DATA ----

export const OWNERS: Owner[] = [
  { id: 'owner-1', token: 'ivan-captain-2026', name: 'Иван Морской', phone: '+79001111111', telegram: '@ivan_captain' },
  { id: 'owner-2', token: 'sergey-sea-2026',   name: 'Сергей Черноморец', phone: '+79002222222', telegram: '@sergey_sea' },
];

export const YACHTS: Yacht[] = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    ownerId: 'owner-1',
    name: 'Мария',
    type: 'sailing', typeLabel: 'Парусная',
    capacity: 8, pricePerHour: 4000,
    description: 'Комфортабельная парусная яхта. Идеальна для прогулок и посещения тихих бухт.',
    photos: ['https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=900&q=80'],
    features: ['Паруса', 'Каюта', 'Холодильник', 'Спасательные жилеты'],
    isActive: true,
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    ownerId: 'owner-1',
    name: 'Посейдон',
    type: 'motor', typeLabel: 'Моторная',
    capacity: 10, pricePerHour: 5500,
    description: 'Скоростная моторная яхта бизнес-класса. Просторная открытая палуба.',
    photos: ['https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=900&q=80'],
    features: ['Мощный мотор', 'Открытая палуба', 'Кухня', 'Аудиосистема'],
    isActive: true,
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    ownerId: 'owner-2',
    name: 'Бриз',
    type: 'catamaran', typeLabel: 'Катамаран',
    capacity: 12, pricePerHour: 6000,
    description: 'Просторный катамаран для большой компании. Устойчив на волне.',
    photos: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80'],
    features: ['Две каюты', 'Большой кокпит', 'Кухня', 'Снаряжение для снорклинга'],
    isActive: true,
  },
  {
    id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    ownerId: 'owner-2',
    name: 'Афина',
    type: 'motor', typeLabel: 'Моторная',
    capacity: 6, pricePerHour: 8000,
    description: 'Яхта для особых событий. Люкс-отделка, персональный капитан.',
    photos: ['https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=900&q=80'],
    features: ['VIP-каюта', 'Полная кухня', 'Бар', 'Дайвинг-снаряжение', 'Аудиосистема'],
    isActive: true,
  },
];

let BOOKINGS: Booking[] = [
  {
    id: 'booking-1',
    yachtId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', yachtName: 'Мария',
    date: '2026-06-05', timeStart: '10:00', timeEnd: '14:00',
    clientName: 'Александр Смирнов', clientPhone: '+79001112233',
    status: 'confirmed', amount: 16000, commission: 2400,
    type: 'standard', source: 'form',
  },
  {
    id: 'booking-2',
    yachtId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', yachtName: 'Посейдон',
    date: '2026-06-05', timeStart: '12:00', timeEnd: '18:00',
    clientName: 'Марина Козлова', clientPhone: '+79004445566',
    status: 'commission_paid', amount: 33000, commission: 4950,
    type: 'standard', source: 'web_chat',
  },
  {
    id: 'booking-3',
    yachtId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', yachtName: 'Мария',
    date: '2026-06-07', timeStart: '09:00', timeEnd: '13:00',
    clientName: 'Дмитрий Петров', clientPhone: '+79007778899',
    status: 'pending', amount: 16000, commission: 2400,
    type: 'inquiry', source: 'telegram',
  },
];

let BLOCKED_SLOTS: BlockedSlot[] = [];

// ---- DATA FUNCTIONS ----

export function getOwnerByToken(token: string): Owner | undefined {
  return OWNERS.find(o => o.token === token);
}

export function getYachts(): Yacht[] {
  return YACHTS.filter(y => y.isActive);
}

export function getYachtsByOwner(ownerId: string): Yacht[] {
  return YACHTS.filter(y => y.ownerId === ownerId && y.isActive);
}

export function getYachtById(id: string): Yacht | undefined {
  return YACHTS.find(y => y.id === id);
}

export function getBookings(filters?: { yachtId?: string; date?: string; status?: BookingStatus }): Booking[] {
  let result = [...BOOKINGS];
  if (filters?.yachtId) result = result.filter(b => b.yachtId === filters.yachtId);
  if (filters?.date) result = result.filter(b => b.date === filters.date);
  if (filters?.status) result = result.filter(b => b.status === filters.status);
  return result;
}

export function getBookingsForOwner(ownerId: string): Booking[] {
  const yachtIds = new Set(getYachtsByOwner(ownerId).map(y => y.id));
  return BOOKINGS.filter(b => yachtIds.has(b.yachtId) && b.status !== 'cancelled');
}

export function getBookingsForMonth(yachtId: string, year: number, month: number): Booking[] {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return BOOKINGS.filter(b => b.yachtId === yachtId && b.date.startsWith(prefix));
}

export function getBookingById(id: string): Booking | undefined {
  return BOOKINGS.find(b => b.id === id);
}

export function createBooking(data: Omit<Booking, 'id' | 'status' | 'commission'> & { status?: BookingStatus }): Booking {
  const commission = Math.round(data.amount * COMMISSION_RATE);
  const booking: Booking = {
    ...data,
    id: `booking-${Date.now()}`,
    status: data.status || 'pending',
    commission,
  };
  BOOKINGS.push(booking);
  return booking;
}

export function updateBookingStatus(id: string, status: BookingStatus): Booking | null {
  const booking = BOOKINGS.find(b => b.id === id);
  if (booking) { booking.status = status; return booking; }
  return null;
}

export function getBlockedSlots(yachtId: string, date?: string): BlockedSlot[] {
  return BLOCKED_SLOTS.filter(s =>
    s.yachtId === yachtId && (date ? s.date === date : true)
  );
}

export function addBlockedSlot(data: Omit<BlockedSlot, 'id'>): BlockedSlot {
  const slot: BlockedSlot = { ...data, id: `block-${Date.now()}` };
  BLOCKED_SLOTS.push(slot);
  return slot;
}

export function removeBlockedSlot(id: string): void {
  BLOCKED_SLOTS = BLOCKED_SLOTS.filter(s => s.id !== id);
}

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Ожидает',
  commission_paid: 'Бронь оплачена',
  confirmed: 'Подтверждено',
  cancelled: 'Отменено',
  completed: 'Завершено',
};

export const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  commission_paid: 'bg-emerald-100 text-emerald-800',
  confirmed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-100 text-gray-500',
  completed: 'bg-gray-100 text-gray-700',
};

export const SOURCE_LABELS: Record<BookingSource, string> = {
  form: 'Форма',
  web_chat: 'Чат',
  telegram: 'Telegram',
};
