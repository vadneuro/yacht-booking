// Центральный data layer — сейчас mock, легко заменить на Supabase

export type YachtType = 'sailing' | 'motor' | 'catamaran' | 'training';
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
  longDescription?: string;
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
    id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    ownerId: 'owner-1',
    name: 'Мануну',
    type: 'catamaran', typeLabel: 'Парусный катамаран',
    capacity: 10, pricePerHour: 16000,
    description: 'Lagoon 440 — 14-метровый парусный катамаран, на котором Крым раскрывается с воды так, как вы его ещё не видели. Три каюты, просторный салон с панорамными окнами, SUP-борды, мангал и снасти для рыбалки.',
    longDescription: `**Почему Мануну — это не просто прогулка на яхте:**

Вы садитесь на борт — и через 10 минут забываете, что где-то существует берег с пробками, очередями и шезлонгами за 500 рублей. Парусный катамаран — это тишина, ветер и ощущение, что время остановилось. На Мануну вы не турист — вы путешественник.

**На борту есть всё для идеального дня:**

• **Три каюты** с санузлами и кроватями (две двуспальные + односпальная) — можно уйти в многодневное путешествие
• **Просторный салон** с панорамными окнами, обеденным столом и кухней — ваш личный ресторан с видом на море
• **Два SUP-борда** — встаньте на воду посреди бухты, где дно видно на 10 метров
• **Мангал и печь** — весь улов готовят прямо на борту. Рыба, которую вы поймали 20 минут назад
• **Рыболовные снасти** — удочки и всё необходимое уже на борту
• **Подвесные гамаки** — лягте и смотрите на звёзды. Буквально.

**Маршруты из Ялты — от 2 часов до 24:**

• **Ласточкино гнездо** (2 ч) — классика: фото на фоне замка с воды, где его никто не видел
• **Рассвет у Алупки** (3 ч) — выход ранним утром, когда море стеклянное и вы одни на всём побережье
• **К берегам Гурзуфа** (4 ч) — Аю-Даг, дикие бухты, купание в местах, куда нет дороги
• **Ласточкино гнездо + Гурзуф** (6 ч) — полноценный день: два побережья, обед на борту, снорклинг
• **Звёздное небо** (10 ч) — выходим вечером, огни ночной Ялты, рыбалка, гамаки под звёздами
• **Балаклавская бухта** (12 ч) — вдоль всего южного берега и обратно
• **Новый Свет** (24 ч) — сутки на воде, ночёвка в бухте, полная перезагрузка

**Стоимость аренды катамарана Мануну:**

• Выход в час — 16 000 ₽ (минимум 2 часа)

**Важно:** Капитан и экипаж (2 человека) включены. Топливо включено. Оптимальная загрузка — 8 человек. Бесплатная отмена за 24 часа.`,
    photos: [
      '/yachts/manunu/01-exterior.jpg',
      '/yachts/manunu/09-sunbathing.jpg',
      '/yachts/manunu/02-salon.jpg',
      '/yachts/manunu/07-sunset-deck.jpg',
      '/yachts/manunu/08-deck-coast.jpg',
      '/yachts/manunu/11-sailing.jpg',
      '/yachts/manunu/03-cabin.jpg',
      '/yachts/manunu/06-bedroom.jpg',
      '/yachts/manunu/04-cabin2.jpg',
      '/yachts/manunu/10-helm.jpg',
      '/yachts/manunu/05-bathroom.jpg',
    ],
    features: ['3 каюты', '5 спальных мест', 'Паруса', 'SUP-борды', 'Мангал и печь', 'Рыболовные снасти', 'Панорамный салон', 'Санузлы'],
    isActive: true,
  },
  {
    id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
    ownerId: 'owner-2',
    name: 'Паласса',
    type: 'motor', typeLabel: 'Моторная яхта',
    capacity: 12, pricePerHour: 55000,
    description: '21-метровая моторная яхта PALLASA — флагман флота Glissa и одна из самых роскошных яхт южного побережья Крыма. Комфорт пятизвёздочного отеля посреди Чёрного моря.',
    longDescription: `**Почему именно Паласса?**

Большинство яхт в Крыму — это «покататься по морю». Паласса — это другое. Это 21 метр абсолютного комфорта, где каждая деталь создана для того, чтобы вы забыли о берег и растворились в моменте. Вы не арендуете яхту — вы получаете впечатления, о которых будете рассказывать годами.

**Четыре зоны отдыха — каждая создаёт своё настроение:**

• **Флайбридж с баром** — открытая площадка над рубкой с двумя лежаками, обеденной зоной и баром. Вы наверху, ветер в лицо, коктейль в руке, солнце садится за мыс Айя. Это не фото из Pinterest — это ваш вечер.
• **Носовая палуба** — диван, обеденный стол, два лежака для загара. Отсюда видно всё побережье, и побережье видит вас.
• **Кормовой кокпит** — большой тиковый стол с диваном и мобильными креслами. Ужин здесь — это ресторан, от которого невозможно уйти, потому что вокруг море.
• **Кают-компания** — диван, кофейный столик, кресла, телевизор. Прохлада, панорамные окна, бокал вина. Ваш личный лаунж на воде.

**Маршруты из Балаклавы — самые красивые в Крыму:**

Паласса швартуется в Балаклаве — легендарной бухте, откуда открываются маршруты, недоступные с берега. Мыс Айя с дикими бухтами и бирюзовой водой. Бухта Ласпи — снорклинг в кристально чистом море. Вдоль всего южного побережья до Нового Света — обители князя Голицына и знаменитой шампанерии в гротах. Морское путешествие до древней Керчи или жемчужины ЮБК — Ялты.

**Особые события — мы организуем всё:**

День рождения, от которого у гостей отвиснет челюсть. Предложение руки и сердца — она скажет «да» ещё до того, как вы достанете кольцо. Вечеринка с диджеем в открытом море. Романтический ужин на закате — только вы двое, шеф-повар и бесконечный горизонт. Девичник, мальчишник, корпоратив, фотосессия, рыбалка, дайвинг.

**Дополнительные услуги по предзаказу:**

• Подводные буксировщики SEABOB — адреналин под водой
• Вейкборд и сапсёрф — для активных
• Снаряжение для снорклинга — подводный мир у мыса Айя
• Шеф-повар и официант на борту — от завтрака до ужина при свечах

**Стоимость аренды яхты Паласса:**

• Выход в час — 55 000 ₽ (минимум 3 часа)
• Аренда на день (8:00–20:00) — 500 000 ₽
• Аренда на сутки — 600 000 ₽

**Важно:** В стоимость включены капитан и экипаж. Топливо включено. Бесплатная отмена за 48 часов.`,
    photos: [
      '/yachts/palassa/01-exterior.jpg',
      '/yachts/palassa/03-action.jpg',
      '/yachts/palassa/02-aerial.jpg',
      '/yachts/palassa/04-sundeck.jpg',
      '/yachts/palassa/05-cockpit.jpg',
      '/yachts/palassa/06-salon.jpg',
      '/yachts/palassa/07-bedroom.jpg',
      '/yachts/palassa/08-bathroom.jpg',
      '/yachts/palassa/09-galley.jpg',
      '/yachts/palassa/10-helm.jpg',
      '/yachts/palassa/11-deck-table.jpg',
    ],
    features: ['Флайбридж с баром', 'Люкс-каюта', 'Душ и санузел', 'Тиковые палубы', 'Кают-компания с ТВ', 'Кокпит с обеденной зоной', 'Солнечная палуба', 'SEABOB / вейкборд'],
    isActive: true,
  },
  {
    id: 'gggggggg-gggg-gggg-gggg-gggggggggggg',
    ownerId: 'owner-1',
    name: 'Омега',
    type: 'catamaran', typeLabel: 'Парусный катамаран',
    capacity: 10, pricePerHour: 12000,
    description: 'Indigo Aventura (Франция) — 11-метровый парусный катамаран для тех, кто хочет почувствовать море по-настоящему. Невероятная устойчивость на волне, огромное патио в тени, BBQ-кухня и носовые сетки прямо над бирюзовой водой.',
    longDescription: `**Почему Омега — это другой уровень морской прогулки:**

Забудьте про качку. Широкий корпус катамарана обеспечивает устойчивость, о которой обычные яхты могут только мечтать. Никаких таблеток от укачивания — только плавное скольжение по воде. Французская верфь Indigo Aventura создала катамаран, на котором хочется жить.

**На борту — всё для идеального дня на воде:**

• **Огромное патио в тени** — главная зона отдыха с обеденным столом. Здесь вы обедаете, играете в карты, разговариваете — всё это в тени, с бризом и видом на побережье Крыма.
• **Камбуз с BBQ** — полноценная кухня для пикника на воде. Мангал, плита, мойка — можно приготовить всё, от стейков до пойманной рыбы.
• **3 каюты, 2 санузла с душем** — достаточно для многодневного путешествия. Каждая каюта с отдельной кроватью и деревянной отделкой.
• **Носовые сетки** — две сетки между корпусами, натянутые прямо над водой. Ложитесь, смотрите вниз — рыбы плавают в метре от вас. Лучшее место для загара на всём побережье.
• **SUP-борды** — включены в аренду. Встаньте на доску посреди бухты, где до берега не доплыть на пляжном матрасе.

**Маршруты из Ялты — от короткой прогулки до морского путешествия:**

• **Ласточкино гнездо** (2 ч) — классический маршрут, фото замка с воды
• **Рассвет или закат** (2–3 ч) — выход ранним утром или на вечерний свет
• **К берегам Гурзуфа** (4 ч) — Аю-Даг, дикие бухты, снорклинг
• **Ласточкино гнездо + Гурзуф** (6 ч) — полноценный день на воде с обедом-BBQ на борту
• **Индивидуальный маршрут** — оставьте заявку, и мы разработаем маршрут под ваши пожелания

**Стоимость аренды катамарана Омега:**

• Выход в час — 12 000 ₽ (минимум 2 часа)

**Важно:** Капитан включён в стоимость. Топливо включено. Бесплатная отмена за 24 часа.`,
    photos: [
      '/yachts/omega/01-exterior.jpg',
      '/yachts/omega/02-stern.jpg',
      '/yachts/omega/03-salon.jpg',
      '/yachts/omega/04-galley.jpg',
      '/yachts/omega/05-cabin.jpg',
      '/yachts/omega/06-cabin2.jpg',
      '/yachts/omega/07-cabin3.jpg',
      '/yachts/omega/08-nets.jpg',
      '/yachts/omega/09-cockpit.jpg',
      '/yachts/omega/10-patio.jpg',
      '/yachts/omega/11-deck.jpg',
      '/yachts/omega/12-bathroom.jpg',
      '/yachts/omega/13-detail.jpg',
      '/yachts/omega/14-detail2.jpg',
      '/yachts/omega/15-exterior2.jpg',
    ],
    features: ['Патио в тени', '3 каюты', '2 санузла с душем', 'Камбуз с BBQ', 'SUP-борды', 'Носовые сетки', 'Французская верфь', 'Устойчив на волне'],
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
  {
    id: 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh',
    ownerId: 'owner-1',
    name: 'Обучение яхтингу',
    type: 'training', typeLabel: 'Обучение',
    capacity: 6, pricePerHour: 60000,
    description: 'Научитесь управлять яхтой за одно занятие. 4 часа практики на воде под руководством опытного капитана — от теории навигации до постановки парусов и работы с такелажем.',
    longDescription: `**Зачем учиться яхтингу?**

Яхтинг — это не просто хобби. Это навык, который меняет ваше отношение к морю навсегда. После одного занятия вы перестанете быть пассажиром и станете человеком, который понимает море. Вы будете знать, почему яхта идёт именно так, как читать ветер и волну, как чувствовать себя уверенно на воде.

**Программа занятия (4 часа):**

• **Теория навигации** — правила движения по морю, ориентирование по карте, чтение погоды. Вы узнаете, как капитан принимает решения и почему.
• **Работа с парусами** — постановка и уборка парусов, выбор курса относительно ветра, регулировка. Вы сами поставите парус и почувствуете, как яхта ловит ветер.
• **Такелаж и якоря** — морские узлы, блоки, лебёдки, якорная стоянка. Практика руками — всё покажем и дадим попробовать.
• **Безопасность на борту** — спасательное оборудование, маневры в сложных условиях, действия в нештатных ситуациях. Потому что уверенность на воде начинается с безопасности.

**Что вы получите после занятия:**

• Базовые навыки управления парусной яхтой
• Понимание ветра, курсов и маневров
• Умение вязать основные морские узлы
• Уверенность на воде и желание вернуться
• Незабываемый опыт — потому что учиться яхтингу в Крыму, с видом на горы и Ласточкино гнездо, это совсем другое дело

**Для кого это:**

Абсолютные новички — никакой подготовки не нужно. Приходите с друзьями или семьёй (до 6 человек). Мы адаптируем программу под группу: детям — больше игры, взрослым — больше теории и практики.

**Стоимость обучения:**

• Групповое занятие (до 6 человек) — 60 000 ₽ за 4 часа

**Важно:** Опытный капитан-инструктор включён. Яхта, топливо, спасательное оборудование — всё включено. Бесплатная отмена за 24 часа.`,
    photos: [
      '/yachts/manunu/11-sailing.jpg',
      '/yachts/manunu/01-exterior.jpg',
      '/yachts/omega/08-nets.jpg',
      '/yachts/omega/10-patio.jpg',
      '/yachts/manunu/10-helm.jpg',
      '/yachts/omega/03-salon.jpg',
    ],
    features: ['Теория навигации', 'Работа с парусами', 'Такелаж и узлы', 'Безопасность', 'Капитан-инструктор', '4 часа практики'],
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
