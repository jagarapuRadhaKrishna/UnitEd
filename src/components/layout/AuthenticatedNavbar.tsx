import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, LogOut, Settings, Camera, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { label: 'Home', path: '/home' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Create Post', path: '/create-post' },
  { label: 'Forums', path: '/forums' },
  { label: 'Applications', path: '/applications' },
  { label: 'Invitations', path: '/invitations' },
  { label: 'Chat Room', path: '/chatrooms' },
  { label: 'About', path: '/about' },
];

const AuthenticatedNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const [invitationCount, setInvitationCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [receivedAppCount, setReceivedAppCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch pending invitation count from Supabase
  useEffect(() => {
    if (!user?.id) { setInvitationCount(0); return; }

    const fetchInvCount = async () => {
      const { count } = await supabase
        .from('invitations')
        .select('*', { count: 'exact', head: true })
        .eq('invitee_id', user.id)
        .eq('status', 'pending');
      setInvitationCount(count || 0);
    };

    fetchInvCount();

    const channel = supabase
      .channel('navbar-invitations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invitations', filter: `invitee_id=eq.${user.id}` }, () => {
        fetchInvCount();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  // Fetch unread notification count from Supabase
  useEffect(() => {
    if (!user?.id) { setNotificationCount(0); return; }
    const fetchCount = async () => {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);
      setNotificationCount(count || 0);
    };
    fetchCount();
    const channel = supabase
      .channel('navbar-notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, () => {
        fetchCount();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id, location.pathname]);

  // Fetch received application count for faculty
  useEffect(() => {
    if (!user?.id || user?.role !== 'faculty') { setReceivedAppCount(0); return; }

    const fetchAppCount = async () => {
      // Get faculty's posts first
      const { data: myPosts } = await supabase.from('posts').select('id').eq('author_id', user.id);
      if (!myPosts || myPosts.length === 0) { setReceivedAppCount(0); return; }

      const postIds = myPosts.map(p => p.id);
      const { count } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .in('post_id', postIds)
        .eq('status', 'applied');
      setReceivedAppCount(count || 0);
    };

    fetchAppCount();

    const channel = supabase
      .channel('navbar-received-apps')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => {
        fetchAppCount();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id, user?.role]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(filePath, file, { upsert: true });

    if (uploadError) { console.error('Upload failed:', uploadError); return; }

    const { data: { publicUrl } } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(filePath);

    await updateProfile({ profilePicture: `${publicUrl}?t=${Date.now()}` });
  };

  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`;

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const showInvBadge = item.label === 'Invitations' && user?.role === 'student' && invitationCount > 0;
        const showAppBadge = item.label === 'Applications' && user?.role === 'faculty' && receivedAppCount > 0;
        const badgeCount = showInvBadge ? invitationCount : showAppBadge ? receivedAppCount : 0;
        return (
          <button
            key={item.path}
            onClick={() => { navigate(item.path); onClick?.(); }}
            className={`relative px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap
                       border-0 cursor-pointer shadow-sm
                       transition-all duration-300 ease-in-out
                       ${isActive 
                         ? 'bg-blue-600 text-white shadow-[0_4px_14px_0px_rgba(37,99,235,0.4)]' 
                         : 'bg-background text-foreground hover:bg-blue-50 dark:hover:bg-blue-950'
                       }
                       active:translate-y-1 active:shadow-none`}
          >
            {item.label}
            {badgeCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                {badgeCount}
              </span>
            )}
          </button>
        );
      })}
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background border-b border-border shadow-sm">
      <div className="h-full max-w-[1400px] mx-auto px-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <button onClick={() => navigate('/home')} className="flex flex-col shrink-0">
          <span className="text-xl font-bold text-foreground">
            Unit<span className="text-primary">Ed</span> 🫱🏻‍🫲🏾
          </span>
          <span className="text-[0.6rem] font-semibold tracking-widest uppercase text-muted-foreground leading-none">
            Innovate • Collaborate • Elevate
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          <NavLinks />
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            <Sun size={20} className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon size={20} className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/notifications')}>
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[11px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center shadow-sm border-2 border-background">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </Button>

          {/* Profile Dropdown */}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profilePicture || ''} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User size={16} className="mr-2" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                <Camera size={16} className="mr-2" /> Change Photo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings size={16} className="mr-2" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                <LogOut size={16} className="mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu size={22} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 pt-12">
              <nav className="flex flex-col gap-1">
                <NavLinks onClick={() => setMobileOpen(false)} />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default AuthenticatedNavbar;
