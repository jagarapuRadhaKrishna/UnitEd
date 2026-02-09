import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Stack,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, Phone, Video, MoreVertical } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
}

const ChatroomPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'user1',
      senderName: 'Dr. Smith',
      text: 'Welcome to the team! Looking forward to working with you all.',
      timestamp: new Date(2024, 10, 5, 10, 30),
      isOwn: false,
    },
    {
      id: '2',
      senderId: 'current',
      senderName: 'You',
      text: 'Thank you! Excited to collaborate on this project.',
      timestamp: new Date(2024, 10, 5, 10, 35),
      isOwn: true,
    },
    {
      id: '3',
      senderId: 'user2',
      senderName: 'Alice Johnson',
      text: 'Has anyone reviewed the project requirements document?',
      timestamp: new Date(2024, 10, 5, 11, 15),
      isOwn: false,
    },
    {
      id: '4',
      senderId: 'current',
      senderName: 'You',
      text: 'Yes, I went through it. We should schedule a meeting to discuss the timeline.',
      timestamp: new Date(2024, 10, 5, 11, 20),
      isOwn: true,
    },
  ]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: 'current',
        senderName: 'You',
        text: message,
        timestamp: new Date(),
        isOwn: true,
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F0F2F5' }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: '1px solid #E5E7EB',
          backgroundColor: '#FFFFFF',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton
            onClick={() => navigate('/chatrooms')}
            sx={{
              color: '#6B7280',
              '&:hover': { backgroundColor: '#F3F4F6' },
            }}
          >
            <ArrowLeft size={24} />
          </IconButton>

          <Avatar
            sx={{
              width: 45,
              height: 45,
              backgroundColor: '#6C47FF',
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            AI
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
              AI Research Project Team
            </Typography>
            <Typography variant="caption" sx={{ color: '#10B981' }}>
              4 members • Online
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <IconButton
              sx={{
                color: '#6B7280',
                '&:hover': { backgroundColor: '#F3F4F6' },
              }}
            >
              <Phone size={20} />
            </IconButton>
            <IconButton
              sx={{
                color: '#6B7280',
                '&:hover': { backgroundColor: '#F3F4F6' },
              }}
            >
              <Video size={20} />
            </IconButton>
            <IconButton
              sx={{
                color: '#6B7280',
                '&:hover': { backgroundColor: '#F3F4F6' },
              }}
            >
              <MoreVertical size={20} />
            </IconButton>
          </Stack>
        </Stack>
      </Paper>

      {/* Messages Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          px: 3,
          py: 2,
          backgroundColor: '#E5DDD5',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h100v100H0z\' fill=\'%23f0f2f5\' fill-opacity=\'.05\'/%3E%3C/svg%3E")',
        }}
      >
        <Container maxWidth="md" sx={{ py: 2 }}>
          {/* Date Chip */}
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <Chip
              label="Today"
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#6B7280',
                fontSize: '0.75rem',
              }}
            />
          </Box>

          {/* Messages */}
          <Stack spacing={1}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: msg.isOwn ? 'flex-end' : 'flex-start',
                    mb: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '65%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.isOwn ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {!msg.isOwn && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#6B7280',
                          mb: 0.5,
                          px: 1,
                          fontWeight: 500,
                        }}
                      >
                        {msg.senderName}
                      </Typography>
                    )}
                    <Paper
                      elevation={1}
                      sx={{
                        px: 2,
                        py: 1.5,
                        backgroundColor: msg.isOwn ? '#DCF8C6' : '#FFFFFF',
                        borderRadius: msg.isOwn
                          ? '12px 12px 0 12px'
                          : '12px 12px 12px 0',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#111827',
                          wordWrap: 'break-word',
                          mb: 0.5,
                        }}
                      >
                        {msg.text}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#6B7280',
                          fontSize: '0.7rem',
                          display: 'block',
                          textAlign: 'right',
                        }}
                      >
                        {formatTime(msg.timestamp)}
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </Stack>
        </Container>
      </Box>

      {/* Input Area */}
      <Paper
        elevation={3}
        sx={{
          px: 2,
          py: 1.5,
          borderTop: '1px solid #E5E7EB',
          backgroundColor: '#F9FAFB',
        }}
      >
        <Container maxWidth="md">
          <Stack direction="row" spacing={1} alignItems="flex-end">
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#FFFFFF',
                  borderRadius: 3,
                  '& fieldset': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover fieldset': {
                    borderColor: '#6C47FF',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6C47FF',
                  },
                },
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!message.trim()}
              sx={{
                backgroundColor: '#6C47FF',
                color: '#FFFFFF',
                width: 48,
                height: 48,
                '&:hover': {
                  backgroundColor: '#5A3AD6',
                },
                '&:disabled': {
                  backgroundColor: '#E5E7EB',
                  color: '#9CA3AF',
                },
              }}
            >
              <Send size={20} />
            </IconButton>
          </Stack>
        </Container>
      </Paper>
    </Box>
  );
};

export default ChatroomPage;
