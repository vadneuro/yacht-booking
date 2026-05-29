-- АрендаЯхтЯлта — схема базы данных
-- Supabase / PostgreSQL

-- =============================
-- YACHT OWNERS
-- =============================
create table yacht_owners (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text,
  telegram    text,
  email       text,
  inn         text,
  bank_details jsonb,
  created_at  timestamptz default now()
);

-- =============================
-- YACHTS
-- =============================
create type yacht_type as enum ('sailing', 'motor', 'catamaran', 'premium');

create table yachts (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid references yacht_owners(id) on delete set null,
  name            text not null,
  type            yacht_type not null,
  capacity        integer not null,
  price_per_hour  integer not null,  -- в рублях
  description     text,
  photos          text[],            -- массив URL
  features        text[],            -- ["Каюта", "Кухня", "Снаряжение"]
  is_active       boolean default true,
  created_at      timestamptz default now()
);

-- =============================
-- CLIENTS
-- =============================
create table clients (
  id           uuid primary key default gen_random_uuid(),
  name         text,
  phone        text,
  telegram_id  bigint unique,
  whatsapp     text,
  source       text,                 -- 'telegram' | 'whatsapp' | 'site' | 'avito'
  created_at   timestamptz default now()
);

-- =============================
-- AVAILABILITY (captain blocks)
-- =============================
create table availability (
  id          uuid primary key default gen_random_uuid(),
  yacht_id    uuid references yachts(id) on delete cascade,
  date        date not null,
  time_start  time,
  time_end    time,
  is_blocked  boolean default true,  -- true = занято, false = свободно
  note        text,
  created_at  timestamptz default now()
);

create index idx_availability_yacht_date on availability(yacht_id, date);

-- =============================
-- BOOKINGS
-- =============================
create type booking_status as enum (
  'pending',    -- ожидает подтверждения
  'confirmed',  -- подтверждено
  'paid',       -- оплачено
  'cancelled',  -- отменено
  'completed'   -- завершено
);

create table bookings (
  id              uuid primary key default gen_random_uuid(),
  yacht_id        uuid references yachts(id),
  client_id       uuid references clients(id),
  date            date not null,
  time_start      time not null,
  time_end        time not null,
  hours           numeric(4,1),
  amount          integer,           -- итоговая сумма в рублях
  commission      integer,           -- комиссия платформы
  status          booking_status default 'pending',
  notes           text,
  source          text,              -- 'telegram' | 'whatsapp' | 'site'
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index idx_bookings_yacht_date on bookings(yacht_id, date);
create index idx_bookings_status on bookings(status);

-- =============================
-- SUBSCRIPTIONS (owner monthly fee)
-- =============================
create type subscription_status as enum ('active', 'expired', 'cancelled');

create table subscriptions (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid references yacht_owners(id) on delete cascade,
  amount      integer not null,      -- рублей в месяц
  paid_until  date not null,
  status      subscription_status default 'active',
  created_at  timestamptz default now()
);

-- =============================
-- SEED DATA — тестовые яхты
-- =============================
insert into yacht_owners (id, name, phone, telegram) values
  ('11111111-1111-1111-1111-111111111111', 'Иван Морской', '+79001111111', '@ivan_captain'),
  ('22222222-2222-2222-2222-222222222222', 'Сергей Черноморец', '+79002222222', '@sergey_sea');

insert into yachts (id, owner_id, name, type, capacity, price_per_hour, description, photos, features) values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Мария', 'sailing', 8, 4000,
    'Комфортабельная парусная яхта. Идеальна для прогулок по Чёрному морю и посещения живописных бухт.',
    ARRAY['https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800'],
    ARRAY['Паруса', 'Каюта', 'Холодильник', 'Спасательные жилеты']
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-1111-1111-1111-111111111111',
    'Посейдон', 'motor', 10, 5500,
    'Скоростная моторная яхта бизнес-класса. Просторная палуба, мощный двигатель.',
    ARRAY['https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800'],
    ARRAY['Мощный мотор', 'Открытая палуба', 'Кухня', 'Аудиосистема']
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '22222222-2222-2222-2222-222222222222',
    'Бриз', 'catamaran', 12, 6000,
    'Просторный катамаран для большой компании. Устойчив на волне, идеален для отдыха с семьёй.',
    ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'],
    ARRAY['Две каюты', 'Большой кокпит', 'Кухня', 'Снаряжение для снорклинга']
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '22222222-2222-2222-2222-222222222222',
    'Афина', 'premium', 6, 8000,
    'Яхта премиум-класса для особых событий. Люкс-отделка, персональный капитан.',
    ARRAY['https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800'],
    ARRAY['VIP-каюта', 'Полная кухня', 'Бар', 'Снаряжение для дайвинга', 'Аудиосистема']
  );

-- RLS (Row Level Security) — включаем для продакшена
-- alter table yachts enable row level security;
-- alter table bookings enable row level security;
-- alter table clients enable row level security;
