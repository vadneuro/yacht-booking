'use client';

import { useState, useEffect } from 'react';
import {
  getYachts, getBookings, OWNERS,
  updateBookingStatus,
  type Booking, type BookingStatus,
  STATUS_LABELS, STATUS_COLORS, SOURCE_LABELS,
  COMMISSION_RATE,
} from '@/lib/data';
import { type Notification } from '@/lib/notifications';

const ADMIN_PIN = '2026';  // TODO: заменить на env + нормальную авторизацию

export default function AdminPage() {
  const [pin, setPin] = useState('');
  const [auth, setAuth] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>(() => getBookings());
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'owners'>('overview');
  const [filterStatus, setFilterStatus] = useState<BookingStatus | 'all'>('all');

  const yachts = getYachts();

  // Auth
  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--navy)' }}>
        <div className="bg-white rounded-2xl p-8 w-80 text-center space-y-5 shadow-2xl">
          <div>
            <p className="font-bold text-lg" style={{ color: 'var(--navy)' }}>
              Аренда<span style={{ color: 'var(--gold)' }}>Яхт</span>Ялта
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Панель администратора</p>
          </div>
          <input
            type="password"
            placeholder="PIN-код"
            value={pin}
            onChange={e => { setPin(e.target.value); setPinError(false); }}
            onKeyDown={e => e.key === 'Enter' && tryAuth()}
            className={`w-full px-4 py-3 rounded-xl border text-center text-xl tracking-widest font-bold focus:outline-none focus:ring-2 ${
              pinError ? 'border-red-400 ring-red-200' : 'border-black/15 focus:ring-blue-300'
            }`}
            style={{ color: 'var(--navy)' }}
            maxLength={6}
          />
          {pinError && <p className="text-xs text-red-500">Неверный PIN</p>}
          <button
            onClick={tryAuth}
            className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'var(--navy)' }}
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  function tryAuth() {
    if (pin === ADMIN_PIN) { setAuth(true); }
    else { setPinError(true); setPin(''); }
  }

  // ---- Notifications ----
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    if (!auth) return;
    const poll = () => fetch('/api/notifications').then(r => r.json()).then(d => {
      setNotifications(d.notifications || []);
      setUnreadCount(d.unreadCount || 0);
    }).catch(() => {});
    poll();
    const interval = setInterval(poll, 30000);
    return () => clearInterval(interval);
  }, [auth]);

  const markAllRead = () => {
    fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAll: true }),
    }).then(() => { setUnreadCount(0); setNotifications(ns => ns.map(n => ({ ...n, isRead: true }))); });
  };

  // ---- Stats ----
  const paidStatuses = ['commission_paid', 'confirmed', 'completed'] as const;
  const totalRevenue = bookings
    .filter(b => paidStatuses.includes(b.status as typeof paidStatuses[number]))
    .reduce((s, b) => s + b.amount, 0);

  const totalCommission = bookings
    .filter(b => paidStatuses.includes(b.status as typeof paidStatuses[number]))
    .reduce((s, b) => s + b.commission, 0);

  const actionCount = bookings.filter(b => b.status === 'pending' || b.status === 'commission_paid').length;

  const handleStatus = (id: string, status: BookingStatus) => {
    updateBookingStatus(id, status);
    setBookings(getBookings());
  };

  const filteredBookings = filterStatus === 'all'
    ? bookings
    : bookings.filter(b => b.status === filterStatus);

  const sortedBookings = [...filteredBookings].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-black/8 bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm" style={{ color: 'var(--navy)' }}>
              Аренда<span style={{ color: 'var(--gold)' }}>Яхт</span>Ялта
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-black/8 font-semibold" style={{ color: 'var(--muted)' }}>
              Админ
            </span>
          </div>
          <div className="flex items-center gap-3">
            {actionCount > 0 && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800">
                {actionCount} требуют внимания
              </span>
            )}
            {/* Notification bell */}
            <div className="relative">
              <button onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 rounded-lg hover:bg-black/5 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 flex items-center justify-center text-[9px] font-bold text-white bg-red-500 rounded-full min-w-[18px] px-1">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifs && (
                <div className="absolute right-0 top-11 w-80 bg-white rounded-xl border border-black/10 shadow-2xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-black/6">
                    <span className="text-sm font-bold" style={{ color: 'var(--navy)' }}>Уведомления</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs font-semibold text-blue-500 hover:underline">
                        Прочитать все
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="px-4 py-6 text-sm text-center" style={{ color: 'var(--muted)' }}>Нет уведомлений</p>
                    ) : notifications.slice(0, 10).map(n => (
                      <div key={n.id} className={`px-4 py-3 border-b border-black/4 text-sm ${n.isRead ? '' : 'bg-blue-50/50'}`}>
                        <p className="text-xs" style={{ color: 'var(--navy)' }}>{n.message}</p>
                        <p className="text-[10px] mt-1 text-gray-400">{new Date(n.createdAt).toLocaleString('ru')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => setAuth(false)}
              className="text-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--muted)' }}>
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-black/5 rounded-xl w-fit mb-6">
          {([
            ['overview', 'Обзор'],
            ['bookings', 'Все брони'],
            ['owners', 'Партнёры'],
          ] as const).map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab ? 'bg-white shadow-sm' : 'hover:bg-white/50'
              }`}
              style={{ color: activeTab === tab ? 'var(--navy)' : 'var(--muted)' }}>
              {label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Яхт в системе', value: yachts.length, sub: `${OWNERS.length} владельца` },
                { label: 'Всего броней', value: bookings.length, sub: `${actionCount} требуют внимания` },
                { label: 'Оборот', value: `${totalRevenue.toLocaleString('ru')} ₽`, sub: 'оплачено' },
                { label: 'Комиссия 15%', value: `${totalCommission.toLocaleString('ru')} ₽`, sub: 'ваш доход' },
              ].map(kpi => (
                <div key={kpi.label} className="bg-white rounded-xl border border-black/8 p-4">
                  <p className="text-xl font-bold" style={{ color: 'var(--navy)' }}>{kpi.value}</p>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--muted)' }}>{kpi.label}</p>
                  <p className="text-xs mt-1 text-gray-400">{kpi.sub}</p>
                </div>
              ))}
            </div>

            {/* Action-required bookings */}
            {actionCount > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--navy)' }}>
                  Требуют внимания
                </h3>
                <div className="space-y-2">
                  {bookings.filter(b => b.status === 'pending' || b.status === 'commission_paid').map(b => (
                    <AdminBookingRow key={b.id} booking={b} yachts={yachts} onStatus={handleStatus} />
                  ))}
                </div>
              </div>
            )}

            {/* Fleet status */}
            <div>
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--navy)' }}>Флот</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {yachts.map(y => {
                  const yBookings = bookings.filter(b => b.yachtId === y.id && b.status !== 'cancelled');
                  const revenue = yBookings.filter(b => ['commission_paid','confirmed','completed'].includes(b.status))
                    .reduce((s, b) => s + b.amount, 0);
                  return (
                    <div key={y.id} className="bg-white rounded-xl border border-black/8 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={y.photos[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--navy)' }}>{y.name}</p>
                          <p className="text-xs" style={{ color: 'var(--muted)' }}>{y.typeLabel}</p>
                        </div>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>{yBookings.length} броней</p>
                      <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--blue)' }}>
                        {revenue.toLocaleString('ru')} ₽
                      </p>
                      <a href={`/captain/${
                        OWNERS.find(o => o.id === y.ownerId)?.token ?? ''
                      }`}
                        className="inline-block mt-2 text-xs underline" style={{ color: 'var(--muted)' }}>
                        Кабинет капитана →
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ALL BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {/* Status filter */}
            <div className="flex gap-2 flex-wrap">
              {(['all', 'pending', 'commission_paid', 'confirmed', 'cancelled', 'completed'] as const).map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filterStatus === s ? 'text-white' : 'bg-white border border-black/10 hover:border-black/20'
                  }`}
                  style={filterStatus === s ? { background: 'var(--navy)' } : { color: 'var(--navy)' }}>
                  {s === 'all' ? 'Все' : STATUS_LABELS[s]}
                  <span className="ml-1 opacity-60">
                    {s === 'all' ? bookings.length : bookings.filter(b => b.status === s).length}
                  </span>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {sortedBookings.map(b => (
                <AdminBookingRow key={b.id} booking={b} yachts={yachts} onStatus={handleStatus} expanded />
              ))}
              {sortedBookings.length === 0 && (
                <p className="text-sm py-8 text-center" style={{ color: 'var(--muted)' }}>Нет броней</p>
              )}
            </div>
          </div>
        )}

        {/* OWNERS */}
        {activeTab === 'owners' && (
          <div className="space-y-4">
            {OWNERS.map(owner => {
              const ownerYachts = yachts.filter(y => y.ownerId === owner.id);
              const ownerRevenue = bookings
                .filter(b => ownerYachts.some(y => y.id === b.yachtId) && ['commission_paid','confirmed','completed'].includes(b.status))
                .reduce((s, b) => s + b.amount, 0);
              const commission = Math.round(ownerRevenue * COMMISSION_RATE);

              return (
                <div key={owner.id} className="bg-white rounded-xl border border-black/8 p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--navy)' }}>{owner.name}</p>
                      <p className="text-sm" style={{ color: 'var(--muted)' }}>{owner.phone}</p>
                      {owner.telegram && (
                        <p className="text-sm" style={{ color: 'var(--muted)' }}>{owner.telegram}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>ОБОРОТ</p>
                      <p className="text-lg font-bold" style={{ color: 'var(--navy)' }}>
                        {ownerRevenue.toLocaleString('ru')} ₽
                      </p>
                      <p className="text-xs" style={{ color: 'var(--blue)' }}>
                        комиссия: {commission.toLocaleString('ru')} ₽
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-3 flex-wrap">
                    {ownerYachts.map(y => (
                      <span key={y.id} className="text-xs px-2.5 py-1 rounded-full bg-black/5 font-medium">
                        {y.name}
                      </span>
                    ))}
                    <a href={`/captain/${owner.token}`} target="_blank" rel="noopener"
                      className="text-xs font-semibold underline" style={{ color: 'var(--blue)' }}>
                      Кабинет капитана →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function AdminBookingRow({
  booking, yachts, onStatus, expanded = false,
}: {
  booking: Booking;
  yachts: ReturnType<typeof getYachts>;
  onStatus: (id: string, s: BookingStatus) => void;
  expanded?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  const handle = async (status: BookingStatus) => {
    setLoading(true);
    await fetch(`/api/bookings/${booking.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    onStatus(booking.id, status);
    setLoading(false);
  };

  const dateFormatted = booking.date ? booking.date.split('-').reverse().join('.') : '—';
  const isInquiry = booking.type === 'inquiry';

  return (
    <div className={`bg-white rounded-xl border p-4 ${isInquiry ? 'border-amber-200' : 'border-black/8'}`}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm" style={{ color: 'var(--navy)' }}>
              {booking.yachtName}{booking.date ? ` · ${dateFormatted} ${booking.timeStart}–${booking.timeEnd}` : ''}
            </p>
            {isInquiry && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                ЗАЯВКА
              </span>
            )}
          </div>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            {booking.clientName} · {booking.clientPhone}
            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-black/5">{SOURCE_LABELS[booking.source]}</span>
          </p>
          {booking.notes && <p className="text-xs text-gray-400">{booking.notes}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[booking.status]}`}>
            {STATUS_LABELS[booking.status]}
          </span>
          {booking.amount > 0 && (
            <div className="text-right">
              <span className="text-sm font-bold block" style={{ color: 'var(--navy)' }}>
                {booking.amount.toLocaleString('ru')} ₽
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">
                бронь: {booking.commission.toLocaleString('ru')} ₽
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      {booking.status === 'pending' && isInquiry && (
        <div className="flex gap-2 mt-3">
          <button onClick={() => handle('confirmed')} disabled={loading}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition-colors">
            Взять в работу
          </button>
          <button onClick={() => handle('cancelled')} disabled={loading}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-black/6 hover:bg-black/10 disabled:opacity-50 transition-colors"
            style={{ color: 'var(--muted)' }}>
            Отклонить
          </button>
        </div>
      )}
      {booking.status === 'pending' && !isInquiry && (
        <div className="flex gap-2 mt-3">
          <span className="px-3 py-1.5 text-xs font-medium rounded-lg bg-yellow-50 text-yellow-700">
            Ожидает оплаты брони клиентом
          </span>
          <button onClick={() => handle('cancelled')} disabled={loading}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-black/6 hover:bg-black/10 disabled:opacity-50 transition-colors"
            style={{ color: 'var(--muted)' }}>
            Отменить
          </button>
        </div>
      )}
      {booking.status === 'commission_paid' && (
        <div className="flex gap-2 mt-3">
          <button onClick={() => handle('confirmed')} disabled={loading}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition-colors">
            Подтвердить
          </button>
          <button onClick={() => handle('cancelled')} disabled={loading}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-black/6 hover:bg-black/10 disabled:opacity-50 transition-colors"
            style={{ color: 'var(--muted)' }}>
            Отменить (возврат)
          </button>
        </div>
      )}
      {booking.status === 'confirmed' && (
        <div className="flex gap-2 mt-3">
          <button onClick={() => handle('completed')} disabled={loading}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 transition-colors">
            Завершить
          </button>
        </div>
      )}
    </div>
  );
}
