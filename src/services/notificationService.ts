import type { Notification } from '../types/united';

const generateNotificationId = (): string => {
  return `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const sendNotification = (params: {
  userId: string;
  type: Notification['type'];
  title: string;
  message: string;
  link?: string;
  relatedUserId?: string;
  relatedPostId?: string;
  relatedChatroomId?: string;
}): Notification => {
  const notification: Notification = {
    id: generateNotificationId(),
    userId: params.userId,
    type: params.type,
    title: params.title,
    message: params.message,
    link: params.link,
    read: false,
    createdAt: new Date().toISOString(),
    relatedUserId: params.relatedUserId,
    relatedPostId: params.relatedPostId,
    relatedChatroomId: params.relatedChatroomId,
  };

  const notifications = getNotifications();
  notifications.unshift(notification);
  localStorage.setItem('notifications', JSON.stringify(notifications));
  window.dispatchEvent(new CustomEvent('notification', { detail: notification }));

  return notification;
};

export const getNotifications = (): Notification[] => {
  return JSON.parse(localStorage.getItem('notifications') || '[]');
};

export const getUserNotifications = (userId: string): Notification[] => {
  const notifications = getNotifications();
  return notifications
    .filter((notif) => notif.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const markAsRead = (notificationId: string): void => {
  const notifications = getNotifications();
  const notification = notifications.find((n) => n.id === notificationId);
  if (notification) {
    notification.read = true;
    localStorage.setItem('notifications', JSON.stringify(notifications));
    window.dispatchEvent(new Event('notificationUpdate'));
  }
};

export const markAllAsRead = (userId: string): void => {
  const notifications = getNotifications();
  notifications.forEach((n) => { if (n.userId === userId) n.read = true; });
  localStorage.setItem('notifications', JSON.stringify(notifications));
  window.dispatchEvent(new Event('notificationUpdate'));
};

export const getUnreadCount = (userId: string): number => {
  return getUserNotifications(userId).filter((n) => !n.read).length;
};

export const deleteNotification = (notificationId: string): void => {
  const notifications = getNotifications();
  const filtered = notifications.filter((n) => n.id !== notificationId);
  localStorage.setItem('notifications', JSON.stringify(filtered));
  window.dispatchEvent(new Event('notificationUpdate'));
};

export const deleteAllNotifications = (userId: string): void => {
  const notifications = getNotifications();
  const filtered = notifications.filter((n) => n.userId !== userId);
  localStorage.setItem('notifications', JSON.stringify(filtered));
  window.dispatchEvent(new Event('notificationUpdate'));
};
