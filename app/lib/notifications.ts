export type NotificationType = 'new_booking' | 'commission_paid' | 'new_inquiry' | 'booking_cancelled';

export interface Notification {
  id: string;
  type: NotificationType;
  bookingId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

let NOTIFICATIONS: Notification[] = [];

export function createNotification(data: Pick<Notification, 'type' | 'bookingId' | 'message'>): Notification {
  const notification: Notification = {
    ...data,
    id: `notif-${Date.now()}`,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  NOTIFICATIONS.unshift(notification);
  return notification;
}

export function getNotifications(unreadOnly = false): Notification[] {
  if (unreadOnly) return NOTIFICATIONS.filter(n => !n.isRead);
  return [...NOTIFICATIONS];
}

export function getUnreadCount(): number {
  return NOTIFICATIONS.filter(n => !n.isRead).length;
}

export function markAsRead(id: string): void {
  const n = NOTIFICATIONS.find(n => n.id === id);
  if (n) n.isRead = true;
}

export function markAllAsRead(): void {
  NOTIFICATIONS.forEach(n => { n.isRead = true; });
}
