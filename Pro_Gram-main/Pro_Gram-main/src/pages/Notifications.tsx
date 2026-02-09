import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  IconButton,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, X, Users, FileText, MessageSquare } from 'lucide-react';

interface Notification {
  id: string;
  type: 'application' | 'acceptance' | 'chatroom' | 'message';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  avatar?: string;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'acceptance',
    title: 'Application Accepted!',
    message: 'Your application for "AI Research Project" has been accepted. The chatroom is now available.',
    timestamp: '2 hours ago',
    read: false,
    actionUrl: '/chatroom/1',
  },
  {
    id: '2',
    type: 'application',
    title: 'New Application',
    message: 'John Doe has applied to your project "Web Development Team".',
    timestamp: '5 hours ago',
    read: false,
    actionUrl: '/dashboard/posts',
  },
  {
    id: '3',
    type: 'message',
    title: 'New Message',
    message: 'Dr. Smith sent you a message in "Machine Learning Study Group".',
    timestamp: '1 day ago',
    read: true,
    actionUrl: '/chatroom/2',
  },
  {
    id: '4',
    type: 'chatroom',
    title: 'Chatroom Activated',
    message: 'The chatroom for "Hackathon Team 2024" is now active!',
    timestamp: '2 days ago',
    read: true,
    actionUrl: '/chatroom/3',
  },
  {
    id: '5',
    type: 'application',
    title: 'Application Update',
    message: 'Your application status for "Research Assistant Position" has been updated.',
    timestamp: '3 days ago',
    read: true,
    actionUrl: '/applied',
  },
];

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [tabValue, setTabValue] = useState(0);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  const handleRemove = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (tabValue === 0) return true; // All
    if (tabValue === 1) return !notif.read; // Unread
    return notif.read; // Read
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'acceptance':
        return <CheckCircle size={24} color="#10B981" />;
      case 'application':
        return <FileText size={24} color="#2563EB" />;
      case 'chatroom':
        return <Users size={24} color="#F97316" />;
      case 'message':
        return <MessageSquare size={24} color="#8B5CF6" />;
      default:
        return <Bell size={24} color="#6B7280" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'acceptance':
        return '#ECFDF5';
      case 'application':
        return '#EFF6FF';
      case 'chatroom':
        return '#FFF7ED';
      case 'message':
        return '#F3F4F6';
      default:
        return '#F9FAFB';
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB', py: 4 }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 3 }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  p: 1.5,
                  backgroundColor: '#2563EB',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bell size={28} color="#FFFFFF" />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827' }}>
                  Notifications
                </Typography>
                {unreadCount > 0 && (
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </Typography>
                )}
              </Box>
            </Stack>

            {unreadCount > 0 && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleMarkAllAsRead}
                sx={{
                  textTransform: 'none',
                  borderColor: '#E5E7EB',
                  color: '#6B7280',
                  '&:hover': {
                    borderColor: '#2563EB',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                  },
                }}
              >
                Mark all as read
              </Button>
            )}
          </Stack>

          {/* Tabs */}
          <Paper sx={{ mb: 3, borderRadius: 2 }}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              sx={{
                borderBottom: '1px solid #E5E7EB',
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                },
              }}
            >
              <Tab label={`All (${notifications.length})`} />
              <Tab label={`Unread (${unreadCount})`} />
              <Tab label={`Read (${notifications.length - unreadCount})`} />
            </Tabs>
          </Paper>

          {/* Notifications List */}
          <Stack spacing={2}>
            <AnimatePresence>
              {filteredNotifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Paper
                    sx={{
                      p: 6,
                      textAlign: 'center',
                      borderRadius: 2,
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <Bell size={48} color="#D1D5DB" style={{ marginBottom: 16 }} />
                    <Typography variant="h6" sx={{ color: '#6B7280', mb: 1 }}>
                      No notifications
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                      You're all caught up!
                    </Typography>
                  </Paper>
                </motion.div>
              ) : (
                filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Paper
                      sx={{
                        p: 2.5,
                        borderRadius: 2,
                        backgroundColor: notification.read ? '#FFFFFF' : getNotificationColor(notification.type),
                        border: notification.read ? '1px solid #E5E7EB' : '2px solid #2563EB',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        },
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        {/* Icon */}
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 1.5,
                            backgroundColor: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {getNotificationIcon(notification.type)}
                        </Box>

                        {/* Content */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ mb: 0.5 }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: notification.read ? 500 : 700,
                                color: '#111827',
                              }}
                            >
                              {notification.title}
                            </Typography>
                            {!notification.read && (
                              <Chip
                                label="New"
                                size="small"
                                sx={{
                                  backgroundColor: '#2563EB',
                                  color: '#FFFFFF',
                                  fontWeight: 600,
                                  fontSize: '0.7rem',
                                  height: 20,
                                }}
                              />
                            )}
                          </Stack>

                          <Typography
                            variant="body2"
                            sx={{ color: '#6B7280', mb: 1, lineHeight: 1.5 }}
                          >
                            {notification.message}
                          </Typography>

                          <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                            {notification.timestamp}
                          </Typography>
                        </Box>

                        {/* Actions */}
                        <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                          {!notification.read && (
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              sx={{
                                color: '#6B7280',
                                '&:hover': {
                                  backgroundColor: '#EFF6FF',
                                  color: '#2563EB',
                                },
                              }}
                            >
                              <CheckCircle size={18} />
                            </IconButton>
                          )}
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(notification.id);
                            }}
                            sx={{
                              color: '#6B7280',
                              '&:hover': {
                                backgroundColor: '#FEE2E2',
                                color: '#EF4444',
                              },
                            }}
                          >
                            <X size={18} />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </Paper>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Notifications;
