import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { 
  Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, 
  Mic, Check, CheckCheck, File, X, Download, Pin, Image, Users,
  Settings, Bell, BellOff, Archive, Edit2, Trash2, Forward,
  Reply, Copy, Bookmark, Info, Lock, Calendar, CheckCircle,
  BarChart, Folder, Upload, PlayCircle, PauseCircle
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isDelivered: boolean;
  isEdited?: boolean;
  type: 'text' | 'image' | 'file' | 'voice' | 'video';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  mediaUrl?: string;
  replyTo?: {
    messageId: string;
    content: string;
    senderName: string;
  };
  reactions?: { emoji: string; users: string[] }[];
  isPinned?: boolean;
  isForwarded?: boolean;
}

interface Chat {
  id: string;
  name: string;
  type: 'individual' | 'group' | 'channel';
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  isTyping?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  members?: number;
  messages: Message[];
}

const PageWrapper = styled.div`
  height: calc(100vh - 64px);
  background: #F0F2F5;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  overflow: hidden;
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  max-width: 100%;
  height: 100%;
  background: #F0F2F5;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 340px;
  border-right: 1px solid #E4E6EB;
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  overflow: hidden;
  height: 100%;
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #E4E6EB;
  background: #FFFFFF;
`;

const SidebarTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
`;

const TabBar = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
`;

const Tab = styled.button<{ active?: boolean }>`
  padding: 8px 16px;
  background: ${props => props.active ? '#E7E3FF' : 'transparent'};
  color: ${props => props.active ? '#6C47FF' : '#6B7280'};
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #F3F4F6;
    color: #6C47FF;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 8px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px 10px 40px;
  background: #F3F4F6;
  border: 1px solid #E4E6EB;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;

  &::placeholder {
    color: #9CA3AF;
  }

  &:focus {
    outline: none;
    border-color: #6C47FF;
  }
`;

const SearchIconStyled = styled(Search)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  color: #6B7280;
`;

const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 3px;
  }
`;

const ChatItem = styled.div<{ active?: boolean; isPinned?: boolean }>`
  padding: 12px 16px;
  display: flex;
  gap: 12px;
  cursor: pointer;
  background: ${props => props.active ? '#E7E3FF' : props.isPinned ? '#F9FAFB' : 'transparent'};
  border-left: 3px solid ${props => props.active ? '#6C47FF' : 'transparent'};
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#E7E3FF' : '#F9FAFB'};
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const OnlineIndicator = styled.div<{ isOnline?: boolean }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 14px;
  height: 14px;
  background: ${props => props.isOnline ? '#10B981' : '#D1D5DB'};
  border: 2px solid #FFFFFF;
  border-radius: 50%;
`;

const ChatInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChatName = styled.div`
  font-weight: 600;
  color: #111827;
  font-size: 15px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LastMessage = styled.div<{ unread?: boolean }>`
  color: ${props => props.unread ? '#111827' : '#6B7280'};
  font-size: 13px;
  font-weight: ${props => props.unread ? 600 : 400};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChatMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const TimeStamp = styled.div<{ unread?: boolean }>`
  font-size: 12px;
  color: ${props => props.unread ? '#6C47FF' : '#9CA3AF'};
  font-weight: ${props => props.unread ? 600 : 400};
`;

const UnreadBadge = styled.div`
  background: #6C47FF;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #E5DDD5;
  position: relative;
  overflow: hidden;
  height: 100%;
`;

const ChatHeader = styled.div`
  padding: 16px 24px;
  background: #F0F2F5;
  border-bottom: 1px solid #E4E6EB;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatHeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const ChatHeaderName = styled.div`
  font-weight: 600;
  color: #111827;
  font-size: 16px;
  margin-bottom: 2px;
`;

const ChatHeaderStatus = styled.div`
  font-size: 13px;
  color: #6B7280;
`;

const ChatHeaderActions = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: #6B7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: #E4E6EB;
    color: #111827;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #E5DDD5;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 3px;
  }
`;

const MessageBubble = styled.div<{ isSent?: boolean }>`
  max-width: 65%;
  align-self: ${props => props.isSent ? 'flex-end' : 'flex-start'};
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MessageContent = styled.div<{ isSent?: boolean }>`
  background: ${props => props.isSent ? '#DCF8C6' : 'white'};
  padding: 8px 12px;
  border-radius: ${props => props.isSent ? '8px 8px 2px 8px' : '8px 8px 8px 2px'};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const MessageReply = styled.div`
  background: rgba(0, 0, 0, 0.05);
  padding: 6px 8px;
  border-left: 3px solid #6C47FF;
  border-radius: 4px;
  margin-bottom: 4px;
  font-size: 12px;
`;

const ReplyName = styled.div`
  color: #6C47FF;
  font-weight: 600;
  margin-bottom: 2px;
`;

const ReplyText = styled.div`
  color: #6B7280;
`;

const MessageText = styled.div`
  color: #111827;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
`;

const MessageMeta = styled.div<{ isSent?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #6B7280;
  margin-top: 2px;
  justify-content: ${props => props.isSent ? 'flex-end' : 'flex-start'};
`;

const FileAttachment = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  margin-bottom: 4px;
`;

const FileIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #6C47FF;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const FileInfo = styled.div`
  flex: 1;
`;

const FileName = styled.div`
  font-weight: 600;
  font-size: 13px;
  color: #111827;
`;

const FileSize = styled.div`
  font-size: 11px;
  color: #6B7280;
`;

const VoiceMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PlayButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #6C47FF;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Waveform = styled.div`
  flex: 1;
  height: 20px;
  background: rgba(108, 71, 255, 0.1);
  border-radius: 4px;
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  border-radius: 8px 8px 8px 2px;
  max-width: 80px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const TypingDot = styled.div`
  width: 8px;
  height: 8px;
  background: #9CA3AF;
  border-radius: 50%;
  animation: typing 1.4s infinite;

  &:nth-of-type(2) {
    animation-delay: 0.2s;
  }

  &:nth-of-type(3) {
    animation-delay: 0.4s;
  }

  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-10px);
    }
  }
`;

const InputArea = styled.div`
  padding: 16px 24px;
  background: #F0F2F5;
  border-top: 1px solid #E4E6EB;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
`;

const InputContainer = styled.div`
  flex: 1;
  background: white;
  border-radius: 24px;
  display: flex;
  align-items: flex-end;
  padding: 8px 12px;
  border: 1px solid #E4E6EB;

  &:focus-within {
    border-color: #6C47FF;
  }
`;

const MessageInput = styled.textarea`
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font-size: 14px;
  line-height: 1.5;
  max-height: 100px;
  font-family: inherit;
  padding: 4px 8px;
  background: transparent;
  color: #111827;

  &::placeholder {
    color: #9CA3AF;
  }
`;

const AttachButton = styled.button`
  background: transparent;
  border: none;
  color: #6B7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
  transition: all 0.2s;

  &:hover {
    color: #6C47FF;
  }
`;

const SendButton = styled.button`
  background: #6C47FF;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #5936E8;
    transform: scale(1.05);
  }

  &:disabled {
    background: #D1D5DB;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9CA3AF;
  background: #E5DDD5;
`;

const EmojiPickerWrapper = styled.div`
  position: absolute;
  bottom: 80px;
  right: 100px;
  z-index: 1000;
`;

// New enhanced components for Telegram-like features
const MessageContextMenu = styled.div`
  position: absolute;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px;
  min-width: 200px;
  z-index: 1000;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #111827;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: #F3F4F6;
  }

  &.danger {
    color: #EF4444;
  }
`;

const ReactionPicker = styled.div`
  position: absolute;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px 12px;
  display: flex;
  gap: 6px;
  z-index: 100;
  bottom: 100%;
  margin-bottom: 8px;
`;

const ReactionButton = styled.button`
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: #F3F4F6;
    transform: scale(1.2);
  }
`;

const MessageReactions = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 4px;
  flex-wrap: wrap;
`;

const ReactionBadge = styled.div`
  background: #F3F4F6;
  border: 1px solid #E4E6EB;
  border-radius: 12px;
  padding: 2px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #E7E3FF;
    border-color: #6C47FF;
  }

  &.active {
    background: #E7E3FF;
    border-color: #6C47FF;
  }
`;

const PinnedMessageBar = styled.div`
  background: #FEF3C7;
  border-left: 3px solid #F59E0B;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: #92400E;
`;

const ChatInfoPanel = styled.div<{ isOpen: boolean }>`
  width: 320px;
  background: white;
  border-left: 1px solid #E4E6EB;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  overflow-y: auto;
`;

const InfoSection = styled.div`
  padding: 20px;
  border-bottom: 1px solid #E4E6EB;
`;

const InfoTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #6B7280;
  margin-bottom: 12px;
  text-transform: uppercase;
`;

const MemberItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #F9FAFB;
    margin: 0 -20px;
    padding: 10px 20px;
  }
`;

const MemberInfo = styled.div`
  flex: 1;
`;

const MemberName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #111827;
`;

const MemberStatus = styled.div`
  font-size: 12px;
  color: #6B7280;
`;

const SharedMediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
`;

const MediaThumbnail = styled.div`
  aspect-ratio: 1;
  background: #F3F4F6;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.2);
  }
`;

const ScheduledMessageIndicator = styled.div`
  font-size: 11px;
  color: #6B7280;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
`;

const EditedBadge = styled.span`
  font-size: 10px;
  color: #9CA3AF;
  margin-left: 4px;
`;

const ForwardedLabel = styled.div`
  font-size: 12px;
  color: #6B7280;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TypingUsers = styled.div`
  font-size: 13px;
  color: #6C47FF;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MuteIcon = styled.div`
  color: #9CA3AF;
  display: flex;
  align-items: center;
`;



const Chatrooms: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const commonEmojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '✨', '💯', '🙌', '👏', '💪', '🚀'];

  const [chats] = useState<Chat[]>([
    {
      id: '1',
      name: 'AI Research Team',
      type: 'group',
      avatar: 'https://i.pravatar.cc/150?img=1',
      lastMessage: "Let's schedule a meeting for tomorrow",
      lastMessageTime: '10:30 AM',
      unreadCount: 3,
      isOnline: true,
      isPinned: true,
      messages: [
        {
          id: 'm1',
          senderId: 'other',
          senderName: 'Dr. Smith',
          content: 'Hey team! How is everyone doing with the project?',
          timestamp: '9:00 AM',
          isRead: true,
          isDelivered: true,
          type: 'text'
        },
        {
          id: 'm2',
          senderId: 'me',
          senderName: 'You',
          content: "I'm making good progress on the neural network implementation!",
          timestamp: '9:15 AM',
          isRead: true,
          isDelivered: true,
          type: 'text'
        },
        {
          id: 'm3',
          senderId: 'other',
          senderName: 'Sarah',
          content: 'project_report.pdf',
          timestamp: '10:00 AM',
          isRead: true,
          isDelivered: true,
          type: 'file',
          fileName: 'project_report.pdf',
          fileSize: '2.4 MB'
        },
        {
          id: 'm4',
          senderId: 'other',
          senderName: 'Dr. Smith',
          content: "Let's schedule a meeting for tomorrow",
          timestamp: '10:30 AM',
          isRead: false,
          isDelivered: true,
          type: 'text'
        }
      ]
    },
    {
      id: '2',
      name: 'Web Dev Squad',
      type: 'group',
      avatar: 'https://i.pravatar.cc/150?img=2',
      lastMessage: "I've pushed the latest changes to GitHub",
      lastMessageTime: '2:15 PM',
      unreadCount: 1,
      isOnline: true,
      isTyping: true,
      messages: []
    },
    {
      id: '3',
      name: 'Hackathon 2024',
      type: 'channel',
      avatar: 'https://i.pravatar.cc/150?img=3',
      lastMessage: 'Great presentation today!',
      lastMessageTime: 'Yesterday',
      unreadCount: 0,
      isOnline: false,
      messages: []
    },
    {
      id: '4',
      name: 'Research Study Group',
      type: 'group',
      avatar: 'https://i.pravatar.cc/150?img=4',
      lastMessage: 'Here are the papers for review',
      lastMessageTime: '2 days ago',
      unreadCount: 0,
      isOnline: true,
      messages: []
    },
    {
      id: '5',
      name: 'Mobile App Team',
      type: 'group',
      avatar: 'https://i.pravatar.cc/150?img=5',
      lastMessage: 'The new UI looks amazing!',
      lastMessageTime: '3 days ago',
      unreadCount: 0,
      isOnline: false,
      messages: []
    }
  ]);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: 'me',
      senderName: 'You',
      content: message,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      isRead: false,
      isDelivered: true,
      type: 'text'
    };

    selectedChat.messages.push(newMessage);
    setMessage('');
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage(message + emoji);
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <PageWrapper>
      <ChatContainer>
        {/* Sidebar - Chat List */}
        <Sidebar>
          <SidebarHeader>
            <SidebarTitle>All Messages</SidebarTitle>
            <TabBar>
              <Tab active>Open Chat</Tab>
              <Tab>Ongoing</Tab>
              <Tab>Closed</Tab>
            </TabBar>
            <SearchContainer>
              <SearchIconStyled />
              <SearchInput 
                placeholder="Search by contact or IP"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchContainer>
          </SidebarHeader>

          <ChatList>
            {filteredChats.map((chat) => (
              <ChatItem 
                key={chat.id}
                active={selectedChat?.id === chat.id}
                isPinned={chat.isPinned}
                onClick={() => setSelectedChat(chat)}
              >
                <AvatarWrapper>
                  <Avatar src={chat.avatar} alt={chat.name} />
                  <OnlineIndicator isOnline={chat.isOnline} />
                </AvatarWrapper>
                
                <ChatInfo>
                  <ChatName>
                    {chat.isPinned && <Pin size={14} color="#6B7280" />}
                    {chat.name}
                  </ChatName>
                  <LastMessage unread={chat.unreadCount > 0}>
                    {chat.isTyping ? 'Typing...' : chat.lastMessage}
                  </LastMessage>
                </ChatInfo>

                <ChatMeta>
                  <TimeStamp unread={chat.unreadCount > 0}>
                    {chat.lastMessageTime}
                  </TimeStamp>
                  {chat.unreadCount > 0 && (
                    <UnreadBadge>{chat.unreadCount}</UnreadBadge>
                  )}
                </ChatMeta>
              </ChatItem>
            ))}
          </ChatList>
        </Sidebar>

        {/* Main Chat Area */}
        {selectedChat ? (
          <ChatArea>
            <ChatHeader>
              <ChatHeaderInfo>
                <AvatarWrapper>
                  <Avatar src={selectedChat.avatar} alt={selectedChat.name} />
                  <OnlineIndicator isOnline={selectedChat.isOnline} />
                </AvatarWrapper>
                <div>
                  <ChatHeaderName>{selectedChat.name}</ChatHeaderName>
                  <ChatHeaderStatus>
                    {selectedChat.isTyping ? 'typing...' : selectedChat.isOnline ? 'Online' : 'Offline'}
                  </ChatHeaderStatus>
                </div>
              </ChatHeaderInfo>

              <ChatHeaderActions>
                <IconButton title="Voice Call">
                  <Phone size={20} />
                </IconButton>
                <IconButton title="Video Call">
                  <Video size={20} />
                </IconButton>
                <IconButton title="Search">
                  <Search size={20} />
                </IconButton>
                <IconButton title="More">
                  <MoreVertical size={20} />
                </IconButton>
              </ChatHeaderActions>
            </ChatHeader>

            <MessagesContainer>
              {selectedChat.messages.map((msg) => (
                <MessageBubble key={msg.id} isSent={msg.senderId === 'me'}>
                  {msg.senderId !== 'me' && (
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', marginLeft: '4px' }}>
                      {msg.senderName}
                    </div>
                  )}
                  
                  <MessageContent isSent={msg.senderId === 'me'}>
                    {msg.replyTo && (
                      <MessageReply>
                        <ReplyName>{msg.replyTo.senderName}</ReplyName>
                        <ReplyText>{msg.replyTo.content}</ReplyText>
                      </MessageReply>
                    )}

                    {msg.type === 'text' && (
                      <MessageText>{msg.content}</MessageText>
                    )}

                    {msg.type === 'file' && (
                      <FileAttachment>
                        <FileIcon>
                          <File size={20} />
                        </FileIcon>
                        <FileInfo>
                          <FileName>{msg.fileName}</FileName>
                          <FileSize>{msg.fileSize}</FileSize>
                        </FileInfo>
                        <IconButton>
                          <Download size={18} />
                        </IconButton>
                      </FileAttachment>
                    )}

                    {msg.type === 'voice' && (
                      <VoiceMessage>
                        <PlayButton>▶</PlayButton>
                        <Waveform />
                        <span style={{ fontSize: '12px', color: '#6B7280' }}>0:45</span>
                      </VoiceMessage>
                    )}

                    <MessageMeta isSent={msg.senderId === 'me'}>
                      <span>{msg.timestamp}</span>
                      {msg.senderId === 'me' && (
                        <>
                          {msg.isRead ? (
                            <CheckCheck size={16} color="#4FB1E8" />
                          ) : msg.isDelivered ? (
                            <CheckCheck size={16} color="#9CA3AF" />
                          ) : (
                            <Check size={16} color="#9CA3AF" />
                          )}
                        </>
                      )}
                    </MessageMeta>
                  </MessageContent>
                </MessageBubble>
              ))}

              {selectedChat.isTyping && (
                <MessageBubble isSent={false}>
                  <TypingIndicator>
                    <TypingDot />
                    <TypingDot />
                    <TypingDot />
                  </TypingIndicator>
                </MessageBubble>
              )}

              <div ref={messagesEndRef} />
            </MessagesContainer>

            <InputArea>
              {showEmojiPicker && (
                <EmojiPickerWrapper>
                  <div style={{
                    background: 'white',
                    padding: '16px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    border: '1px solid #E4E6EB',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gap: '8px',
                    maxWidth: '300px'
                  }}>
                    {commonEmojis.map((emoji, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleEmojiClick(emoji)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          fontSize: '24px',
                          cursor: 'pointer',
                          padding: '8px',
                          borderRadius: '6px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowEmojiPicker(false)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: '#E4E6EB',
                      color: '#111827',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <X size={16} />
                  </button>
                </EmojiPickerWrapper>
              )}

              <InputWrapper>
                <InputContainer>
                  <AttachButton title="Attach file">
                    <Paperclip size={20} />
                  </AttachButton>
                  <MessageInput
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows={1}
                  />
                  <AttachButton 
                    title="Emoji"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile size={20} />
                  </AttachButton>
                </InputContainer>

                {message.trim() ? (
                  <SendButton onClick={handleSendMessage}>
                    <Send size={18} />
                  </SendButton>
                ) : (
                  <SendButton as="button" title="Voice message">
                    <Mic size={18} />
                  </SendButton>
                )}
              </InputWrapper>
            </InputArea>
          </ChatArea>
        ) : (
          <EmptyState>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>💬</div>
              <h3 style={{ color: '#111827', marginBottom: '8px' }}>Select a conversation</h3>
              <p style={{ color: '#6B7280' }}>Choose a chat from the left to start messaging</p>
            </div>
          </EmptyState>
        )}
      </ChatContainer>
    </PageWrapper>
  );
};

export default Chatrooms;
