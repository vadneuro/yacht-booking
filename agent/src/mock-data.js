// Тестовые данные — заменить на Supabase после настройки проекта

export const YACHTS = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    name: 'Мария',
    type: 'sailing',
    type_label: 'Парусная',
    capacity: 8,
    price_per_hour: 4000,
    description: 'Комфортабельная парусная яхта. Идеальна для прогулок и посещения бухт.',
    features: ['Паруса', 'Каюта', 'Холодильник', 'Спасательные жилеты'],
    is_active: true,
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    name: 'Посейдон',
    type: 'motor',
    type_label: 'Моторная',
    capacity: 10,
    price_per_hour: 5500,
    description: 'Скоростная моторная яхта бизнес-класса. Просторная палуба.',
    features: ['Мощный мотор', 'Открытая палуба', 'Кухня', 'Аудиосистема'],
    is_active: true,
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    name: 'Бриз',
    type: 'catamaran',
    type_label: 'Катамаран',
    capacity: 12,
    price_per_hour: 6000,
    description: 'Просторный катамаран для большой компании. Устойчив на волне.',
    features: ['Две каюты', 'Большой кокпит', 'Кухня', 'Снаряжение для снорклинга'],
    is_active: true,
  },
  {
    id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    name: 'Афина',
    type: 'premium',
    type_label: 'Премиум',
    capacity: 6,
    price_per_hour: 8000,
    description: 'Яхта премиум-класса для особых событий. Люкс-отделка.',
    features: ['VIP-каюта', 'Полная кухня', 'Бар', 'Дайвинг-снаряжение'],
    is_active: true,
  },
];

// Имитация занятых дат (в продакшене — из Supabase)
export const BLOCKED_SLOTS = [
  { yacht_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', date: '2026-06-01', time_start: '10:00', time_end: '14:00' },
  { yacht_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', date: '2026-06-01', time_start: '12:00', time_end: '18:00' },
];
