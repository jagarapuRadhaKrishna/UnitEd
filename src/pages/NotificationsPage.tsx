import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getUserNotifications, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications } from '@/services/notificationService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Notification } from '@/types/united';
import {
  Bell, CheckCheck, Trash2, Mail, MailOpen, UserPlus, MessageSquare,
  Briefcase, CheckCircle, XCircle, Users,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  application_received: <UserPlus className="w-4 h-4 text-united-blue" />,
  application_accepted: <CheckCircle className="w-4 h-4 text-united-green" />,
  application_rejected: <XCircle className="w-4 h-4 text-united-red" />,
  invitation_received: <Mail className="w-4 h-4 text-united-purple" />,
  chatroom_created: <MessageSquare className="w-4 h-4 text-united-orange" />,
  chatroom_invite: <Users className="w-4 h-4 text-united-blue" />,
  chatroom_expiring: <Bell className="w-4 h-4 text-united-amber" />,
  new_message: <MessageSquare className="w-4 h-4 text-united-green" />,
  post_filled: <Briefcase className="w-4 h-4 text-united-purple" />,
  post_closed: <Briefcase className="w-4 h-4 text-muted-foreground" />,
};

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifications = () => {
    if (user?.id) setNotifications(getUserNotifications(user.id));
  };

  useEffect(() => { loadNotifications(); }, [user?.id]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleClick = (notif: Notification) => {
    if (!notif.read) { markAsRead(notif.id); loadNotifications(); }
    if (notif.link) navigate(notif.link);
  };

  const handleMarkAllRead = () => {
    if (user?.id) { markAllAsRead(user.id); loadNotifications(); }
  };

  const handleDeleteAll = () => {
    if (user?.id) { deleteAllNotifications(user.id); loadNotifications(); }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNotification(id);
    loadNotifications();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground text-sm">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
              <CheckCheck className="w-4 h-4 mr-1" /> Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleDeleteAll} className="text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-1" /> Clear all
            </Button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
            <p className="text-muted-foreground text-sm">You'll see updates about your applications, invitations, and messages here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-1">
          {notifications.map(notif => (
            <Card
              key={notif.id}
              className={`cursor-pointer transition-colors hover:border-primary/30 ${!notif.read ? 'bg-primary/5 border-primary/20' : ''}`}
              onClick={() => handleClick(notif)}
            >
              <CardContent className="p-3 flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  {iconMap[notif.type] || <Bell className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{notif.title}</p>
                    {!notif.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0 h-7 w-7" onClick={(e) => handleDelete(e, notif.id)}>
                  <Trash2 className="w-3 h-3 text-muted-foreground" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
