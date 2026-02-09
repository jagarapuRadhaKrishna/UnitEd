import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, LogOut, Settings, Camera } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserInvitations } from '../../services/invitationService';

const AuthenticatedNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationCount] = React.useState(3); // Mock notification count
  const [invitationCount, setInvitationCount] = React.useState(0);
  const [profileImage, setProfileImage] = React.useState<string>(user?.profilePicture || '');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Listen for profile updates
  React.useEffect(() => {
    const handleProfileUpdate = () => {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setProfileImage(userData.profilePicture || '');
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  // Load invitation count for students
  React.useEffect(() => {
    if (user?.role === 'student' && user?.id) {
      const loadInvitationCount = () => {
        const invitations = getUserInvitations(user.id);
        const pendingCount = invitations.filter(
          inv => inv.status === 'pending' || !inv.seenAt
        ).length;
        setInvitationCount(pendingCount);
      };

      loadInvitationCount();
      
      // Listen for invitation updates
      window.addEventListener('invitationUpdate', loadInvitationCount);
      return () => window.removeEventListener('invitationUpdate', loadInvitationCount);
    }
  }, [user]);

  const handleProfilePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setProfileImage(imageUrl);
        
        // Update user profile in localStorage
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          userData.profilePicture = imageUrl;
          localStorage.setItem('currentUser', JSON.stringify(userData));
          
          // Update in registered users list
          const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          const userIndex = registeredUsers.findIndex((u: any) => u.id === userData.id);
          if (userIndex !== -1) {
            registeredUsers[userIndex].profilePicture = imageUrl;
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
          }
          
          // Dispatch event for real-time updates
          window.dispatchEvent(new Event('profileUpdated'));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const handleSettings = () => {
    navigate('/settings');
    handleMenuClose();
  };

  // Navigation items based on website structure
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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: 'white',
            color: '#111827',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Toolbar>
            {/* Logo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                flexGrow: 0,
              }}
              onClick={() => navigate('/home')}
            >
              <Box sx={{ textAlign: 'left' }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: '#111827',
                    fontSize: '1.5rem',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: 1.2,
                  }}
                >
                   Unit<span style={{ color: '#6C47FF'  }}> Ed🫱🏻‍🫲🏾</span>
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.65rem',
                    color: '#6B7280',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    lineHeight: 1,
                    mt: 0.3,
                  }}
                >
                   <span style={{ color: 'black'}}> • INNOVATE • </span>
                   <span style={{ color: '#043fffff' }}> COLLABORATE</span>
                   <span style={{ color: 'black'}}> • ELEVATE</span>
                </Typography>
              </Box>
            </Box>

            {/* Navigation Items */}
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{
                marginLeft: 'auto',
                marginRight: 5,
                display: { xs: 'none', md: 'flex' },
                flexWrap: 'nowrap',
                whiteSpace: 'nowrap',
              }}
            >
              {navItems.map((item) => (
                <Badge
                  key={item.path}
                  badgeContent={item.label === 'Invitations' && user?.role === 'student' ? invitationCount : 0}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      right: -3,
                      top: 5,
                      fontSize: '0.65rem',
                      height: '16px',
                      minWidth: '16px',
                      padding: '0 4px',
                    }
                  }}
                >
                  <Button
                    onClick={() => navigate(item.path)}
                    sx={{
                      color: location.pathname === item.path ? '#6C47FF' : '#111827',
                      fontWeight: location.pathname === item.path ? 600 : 500,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      px: 1.5,
                      py: 1,
                      minWidth: 'auto',
                      borderRadius: 0,
                      backgroundColor: 'transparent',
                      border: 'none',
                      boxShadow: 'none',
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        color: '#6C47FF',
                        backgroundColor: 'transparent',
                        border: 'none',
                        boxShadow: 'none',
                      },
                      '&:focus': {
                        outline: 'none',
                        border: 'none',
                        boxShadow: 'none',
                      },
                      '&:active': {
                        border: 'none',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                </Badge>
              ))}
            </Stack>

            {/* Right Side Actions */}
            <Stack 
              direction="row" 
              spacing={2} 
              alignItems="center"
              sx={{ 
                flexShrink: 0 
              }}
            >
              {/* Notifications */}
              <IconButton
                onClick={() => navigate('/notifications')}
                sx={{
                  color: '#6B7280',
                  '&:hover': {
                    backgroundColor: 'rgba(37, 99, 235, 0.05)',
                    color: '#2563EB',
                  },
                }}
              >
                <Badge badgeContent={notificationCount} color="error">
                  <Bell size={20} />
                </Badge>
              </IconButton>

              {/* Profile Menu */}
              <Box sx={{ position: 'relative' }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleProfilePhotoUpload}
                />
                <Tooltip title="Click to change profile photo">
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{
                      p: 0.5,
                      '&:hover': {
                        backgroundColor: 'rgba(37, 99, 235, 0.05)',
                      },
                    }}
                  >
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          sx={{
                            width: 20,
                            height: 20,
                            backgroundColor: '#6C47FF',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: '#5A3AD6',
                            },
                          }}
                        >
                          <Camera size={12} />
                        </IconButton>
                      }
                    >
                      <Avatar
                        src={profileImage}
                        sx={{
                          width: 36,
                          height: 36,
                          backgroundColor: '#2563EB',
                          fontSize: '0.875rem',
                        }}
                      >
                        {!profileImage && `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`}
                      </Avatar>
                    </Badge>
                  </IconButton>
                </Tooltip>
              </Box>
            </Stack>

            {/* Profile Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #E5E7EB' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="caption" sx={{ color: '#6B7280' }}>
                  {user?.email}
                </Typography>
              </Box>

              <MenuItem
                onClick={() => {
                  navigate('/profile');
                  handleMenuClose();
                }}
              >
                <User size={18} style={{ marginRight: 8 }} />
                Profile
              </MenuItem>

              <MenuItem
                onClick={handleSettings}
              >
                <Settings size={18} style={{ marginRight: 8 }} />
                Settings
              </MenuItem>

              <MenuItem onClick={handleLogout} sx={{ color: '#EF4444' }}>
                <LogOut size={18} style={{ marginRight: 8 }} />
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthenticatedNavbar;
