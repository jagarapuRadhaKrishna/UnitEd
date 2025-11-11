import { Chatroom, ChatMember, Message, Post, User } from '../types';
import { sendNotification } from './notificationService';

/**
 * Chatroom Service
 * Handles project-scoped chat creation, lifecycle, and deletion
 */

// Generate unique chatroom ID
const generateChatroomId = (): string => {
  return `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Generate unique message ID
const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Create a chatroom for a post
 * @param postId - Post ID
 * @param ownerId - Post owner ID
 * @param memberIds - Array of accepted applicant IDs
 * @returns Created chatroom
 */
export const createChatroom = (params: {
  postId: string;
  ownerId: string;
  memberIds: string[];
}): Chatroom => {
  const { postId, ownerId, memberIds } = params;

  // Get post details
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const post = posts.find((p: Post) => p.id === postId);

  if (!post) {
    throw new Error('Post not found');
  }

  // Check if chatroom already exists
  const existingChatrooms = getChatrooms();
  const existing = existingChatrooms.find((chat) => chat.postId === postId);

  if (existing) {
    return existing; // Return existing chatroom
  }

  // Get user details
  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const owner = users.find((u: User) => u.id === ownerId);

  if (!owner) {
    throw new Error('Owner not found');
  }

  // Build members list
  const members: ChatMember[] = [
    {
      userId: ownerId,
      name: `${owner.firstName} ${owner.lastName}`,
      avatar: owner.profilePicture,
      role: 'owner',
      joinedAt: new Date().toISOString(),
    },
  ];

  // Add accepted members
  memberIds.forEach((memberId) => {
    const member = users.find((u: User) => u.id === memberId);
    if (member) {
      members.push({
        userId: memberId,
        name: `${member.firstName} ${member.lastName}`,
        avatar: member.profilePicture,
        role: 'member',
        joinedAt: new Date().toISOString(),
      });
    }
  });

  // Calculate expiry date (deadline + grace days, default 7)
  const graceDays = post.chatGraceDays || 7;
  const expiresAt = post.deadline
    ? new Date(new Date(post.deadline).getTime() + graceDays * 24 * 60 * 60 * 1000).toISOString()
    : undefined;

  // Create chatroom
  const chatroom: Chatroom = {
    id: generateChatroomId(),
    postId,
    post: {
      id: post.id,
      title: post.title,
      purpose: post.purpose,
      deadline: post.deadline,
    },
    postTitle: post.title, // Legacy
    members,
    messages: [],
    status: 'active',
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    expiresAt,
  };

  // Add welcome system message
  chatroom.messages.push({
    id: generateMessageId(),
    chatroomId: chatroom.id,
    senderId: 'system',
    senderName: 'System',
    content: `Welcome to the project chat for "${post.title}"! This chat will be active until ${
      expiresAt ? new Date(expiresAt).toLocaleDateString() : 'project completion'
    }.`,
    type: 'system',
    timestamp: new Date().toISOString(),
    read: false,
    readBy: [],
  });

  // Save chatroom
  const chatrooms = getChatrooms();
  chatrooms.push(chatroom);
  localStorage.setItem('chatrooms', JSON.stringify(chatrooms));

  // Update post with chatroom ID
  post.chatroomId = chatroom.id;
  post.chatroomEnabled = true;
  localStorage.setItem('posts', JSON.stringify(posts));

  // Send notifications to all members
  members.forEach((member) => {
    sendNotification({
      userId: member.userId,
      type: 'chatroom_created',
      title: 'Chat Room Created',
      message: `Chat room for "${post.title}" is now active`,
      link: `/chatroom/${chatroom.id}`,
      relatedPostId: postId,
      relatedChatroomId: chatroom.id,
    });
  });

  return chatroom;
};

/**
 * Get all chatrooms
 */
export const getChatrooms = (): Chatroom[] => {
  return JSON.parse(localStorage.getItem('chatrooms') || '[]');
};

/**
 * Get chatroom by ID
 */
export const getChatroomById = (chatroomId: string): Chatroom | undefined => {
  const chatrooms = getChatrooms();
  return chatrooms.find((chat) => chat.id === chatroomId);
};

/**
 * Get chatroom by post ID
 */
export const getChatroomByPostId = (postId: string): Chatroom | undefined => {
  const chatrooms = getChatrooms();
  return chatrooms.find((chat) => chat.postId === postId);
};

/**
 * Get chatrooms for a user (where they are a member)
 */
export const getUserChatrooms = (userId: string): Chatroom[] => {
  const chatrooms = getChatrooms();
  return chatrooms
    .filter((chat) => chat.members.some((member) => member.userId === userId) && chat.status !== 'deleted')
    .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
};

/**
 * Add a member to existing chatroom
 */
export const addChatroomMember = (chatroomId: string, userId: string): void => {
  const chatrooms = getChatrooms();
  const chatroom = chatrooms.find((chat) => chat.id === chatroomId);

  if (!chatroom) {
    throw new Error('Chatroom not found');
  }

  // Check if already a member
  if (chatroom.members.some((m) => m.userId === userId)) {
    return; // Already a member
  }

  // Get user details
  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const user = users.find((u: User) => u.id === userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Add member
  const newMember: ChatMember = {
    userId,
    name: `${user.firstName} ${user.lastName}`,
    avatar: user.profilePicture,
    role: 'member',
    joinedAt: new Date().toISOString(),
  };

  chatroom.members.push(newMember);
  chatroom.lastActivity = new Date().toISOString();

  // Add system message
  chatroom.messages.push({
    id: generateMessageId(),
    chatroomId: chatroom.id,
    senderId: 'system',
    senderName: 'System',
    content: `${newMember.name} joined the chat`,
    type: 'system',
    timestamp: new Date().toISOString(),
    read: false,
    readBy: [],
  });

  localStorage.setItem('chatrooms', JSON.stringify(chatrooms));

  // Notify new member
  sendNotification({
    userId,
    type: 'chatroom_invite',
    title: 'Added to Chat',
    message: `You've been added to the chat for "${chatroom.post.title}"`,
    link: `/chatroom/${chatroom.id}`,
    relatedChatroomId: chatroom.id,
    relatedPostId: chatroom.postId,
  });
};

/**
 * Send a message in a chatroom
 */
export const sendMessage = (params: {
  chatroomId: string;
  senderId: string;
  content: string;
  type?: 'text' | 'file';
  fileUrl?: string;
  fileName?: string;
}): Message => {
  const { chatroomId, senderId, content, type = 'text', fileUrl, fileName } = params;

  const chatrooms = getChatrooms();
  const chatroom = chatrooms.find((chat) => chat.id === chatroomId);

  if (!chatroom) {
    throw new Error('Chatroom not found');
  }

  if (chatroom.status === 'deleted') {
    throw new Error('Cannot send messages to deleted chatroom');
  }

  // Verify sender is a member
  const member = chatroom.members.find((m) => m.userId === senderId);
  if (!member) {
    throw new Error('Unauthorized: Not a member of this chatroom');
  }

  // Create message
  const message: Message = {
    id: generateMessageId(),
    chatroomId,
    senderId,
    senderName: member.name,
    senderAvatar: member.avatar,
    content,
    type,
    fileUrl,
    fileName,
    timestamp: new Date().toISOString(),
    read: false,
    readBy: [senderId], // Sender has read their own message
  };

  chatroom.messages.push(message);
  chatroom.lastActivity = new Date().toISOString();
  localStorage.setItem('chatrooms', JSON.stringify(chatrooms));

  // Notify other members
  chatroom.members.forEach((m) => {
    if (m.userId !== senderId) {
      sendNotification({
        userId: m.userId,
        type: 'new_message',
        title: `${member.name} sent a message`,
        message: content.substring(0, 100),
        link: `/chatroom/${chatroomId}`,
        relatedUserId: senderId,
        relatedChatroomId: chatroomId,
      });
    }
  });

  return message;
};

/**
 * Mark chatroom as read-only (before deletion)
 */
export const markChatroomReadOnly = (chatroomId: string): void => {
  const chatrooms = getChatrooms();
  const chatroom = chatrooms.find((chat) => chat.id === chatroomId);

  if (!chatroom) {
    return;
  }

  chatroom.status = 'read_only';
  localStorage.setItem('chatrooms', JSON.stringify(chatrooms));

  // Notify members
  chatroom.members.forEach((member) => {
    sendNotification({
      userId: member.userId,
      type: 'chatroom_expiring',
      title: 'Chat Expiring Soon',
      message: `The chat for "${chatroom.post.title}" will be deleted soon`,
      link: `/chatroom/${chatroomId}`,
      relatedChatroomId: chatroomId,
    });
  });
};

/**
 * Delete or archive a chatroom
 */
export const deleteChatroom = (chatroomId: string, archive: boolean = false): void => {
  const chatrooms = getChatrooms();
  const chatroom = chatrooms.find((chat) => chat.id === chatroomId);

  if (!chatroom) {
    return;
  }

  chatroom.status = 'deleted';
  chatroom.deletedAt = new Date().toISOString();
  localStorage.setItem('chatrooms', JSON.stringify(chatrooms));

  if (archive) {
    // Move to archives (for admin/analytics)
    const archives = JSON.parse(localStorage.getItem('chatroom_archives') || '[]');
    archives.push(chatroom);
    localStorage.setItem('chatroom_archives', JSON.stringify(archives));
  }
};

/**
 * Cleanup expired chatrooms (called by scheduler)
 */
export const cleanupExpiredChatrooms = (): void => {
  const chatrooms = getChatrooms();
  const now = new Date();

  chatrooms.forEach((chatroom) => {
    if (chatroom.expiresAt && new Date(chatroom.expiresAt) < now && chatroom.status === 'active') {
      // Mark as read-only first (grace period)
      markChatroomReadOnly(chatroom.id);

      // Schedule for deletion after 24 hours
      setTimeout(() => {
        deleteChatroom(chatroom.id, true);
      }, 24 * 60 * 60 * 1000);
    }
  });
};
