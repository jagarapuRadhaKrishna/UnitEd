import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, LogOut, Settings, Camera, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import { getUserInvitations } from '@/services/invitationService';
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
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [invitationCount, setInvitationCount] = useState(0);
  const [profileImage, setProfileImage] = useState(user?.profilePicture || '');
  const [mobileOpen, setMobileOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleProfileUpdate = () => {
      const stored = localStorage.getItem('currentUser');
      if (stored) setProfileImage(JSON.parse(stored).profilePicture || '');
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  useEffect(() => {
    if (user?.role === 'student' && user?.id) {
      const load = () => {
        const inv = getUserInvitations(user.id);
        setInvitationCount(inv.filter(i => i.status === 'pending' || !i.seenAt).length);
      };
      load();
      window.addEventListener('invitationUpdate', load);
      return () => window.removeEventListener('invitationUpdate', load);
    }
  }, [user]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      setProfileImage(url);
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        const data = JSON.parse(stored);
        data.profilePicture = url;
        localStorage.setItem('currentUser', JSON.stringify(data));
        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const idx = users.findIndex((u: any) => u.id === data.id);
        if (idx !== -1) { users[idx].profilePicture = url; localStorage.setItem('registeredUsers', JSON.stringify(users)); }
        window.dispatchEvent(new Event('profileUpdated'));
      }
    };
    reader.readAsDataURL(file);
  };

  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`;

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const showBadge = item.label === 'Invitations' && user?.role === 'student' && invitationCount > 0;
        return (
          <button
            key={item.path}
            onClick={() => { navigate(item.path); onClick?.(); }}
            className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {item.label}
            {showBadge && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                {invitationCount}
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
        <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
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
            <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Profile Dropdown */}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profileImage} />
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
