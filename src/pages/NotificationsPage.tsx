import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bell, CheckCheck, Trash2, Mail, UserPlus, MessageSquare,
  Briefcase, CheckCircle, XCircle, Users, Loader2,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  application_received: <UserPlus className="w-4 h-4 text-primary" />,
  application_accepted: <CheckCircle className="w-4 h-4 text-accent-foreground" />,
  application_rejected: <XCircle className="w-4 h-4 text-destructive" />,
  invitation_received: <Mail className="w-4 h-4 text-primary" />,
  chatroom_created: <MessageSquare className="w-4 h-4 text-accent-foreground" />,
  chatroom_invite: <Users className="w-4 h-4 text-primary" />,
  chatroom_expiring: <Bell className="w-4 h-4 text-secondary-foreground" />,
  new_message: <MessageSquare className="w-4 h-4 text-accent-foreground" />,
  post_filled: <Briefcase className="w-4 h-4 text-primary" />,
  post_closed: <Briefcase className="w-4 h-4 text-muted-foreground" />,
};

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link: string | null;
  created_at: string;
}

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchNotifications();
  }, [user?.id]);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setNotifications(data || []);
    setLoading(false);
  };

  // Real-time
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel('notifications-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, () => fetchNotifications())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleClick = async (notif: Notification) => {
    if (!notif.read) {
      await supabase.from('notifications').update({ read: true }).eq('id', notif.id);
      fetchNotifications();
    }
    if (notif.link) navigate(notif.link);
  };

  const handleMarkAllRead = async () => {
    if (!user?.id) return;
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false);
    fetchNotifications();
  };

  const handleDeleteAll = async () => {
    if (!user?.id) return;
    await supabase.from('notifications').delete().eq('user_id', user.id);
    fetchNotifications();
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await supabase.from('notifications').delete().eq('id', id);
    fetchNotifications();
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

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
                  <p className="text-[10px] text-muted-foreground mt-1">{new Date(notif.created_at).toLocaleString()}</p>
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
