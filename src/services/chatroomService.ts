import type { Chatroom, ChatMember, Message, Post, User } from '../types/united';
import { sendNotification } from './notificationService';

const generateChatroomId = (): string => `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
const generateMessageId = (): string => `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export const createChatroom = (params: { postId: string; ownerI: string; memberIds: string[] }): Chatroom => {
  const { postId, ownerI: ownerId, memberIds } = params;
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const post = posts.find((p: Post) => p.id === postId);
  if (!post) throw new Error('Post not found');

  const existingChatrooms = getChatrooms();
  const existing = existingChatrooms.find((chat) => chat.postId === postId);
  if (existing) return existing;

  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const owner = users.find((u: User) => u.id === ownerId);
  if (!owner) throw new Error('Owner not found');

  const members: ChatMember[] = [{
    userId: ownerId, name: `${owner.firstName} ${owner.lastName}`,
    avatar: owner.profilePicture, role: 'owner', joinedAt: new Date().toISOString(),
  }];

  memberIds.forEach((memberId) => {
    const member = users.find((u: User) => u.id === memberId);
    if (member) {
      members.push({
        userId: memberId, name: `${member.firstName} ${member.lastName}`,
        avatar: member.profilePicture, role: 'member', joinedAt: new Date().toISOString(),
      });
    }
  });

  const graceDays = post.chatGraceDays || 7;
  const expiresAt = post.deadline
    ? new Date(new Date(post.deadline).getTime() + graceDays * 24 * 60 * 60 * 1000).toISOString()
    : undefined;

  const chatroom: Chatroom = {
    id: generateChatroomId(), postId,
    post: { id: post.id, title: post.title, purpose: post.purpose, deadline: post.deadline },
    postTitle: post.title, members, messages: [], status: 'active',
    createdAt: new Date().toISOString(), lastActivity: new Date().toISOString(), expiresAt,
  };

  chatroom.messages.push({
    id: generateMessageId(), chatroomId: chatroom.id, senderId: 'system', senderName: 'System',
    content: `Welcome to the project chat for "${post.title}"!`,
    type: 'system', timestamp: new Date().toISOString(), read: false, readBy: [],
  });

  const chatrooms = getChatrooms();
  chatrooms.push(chatroom);
  localStorage.setItem('chatrooms', JSON.stringify(chatrooms));

  post.chatroomId = chatroom.id;
  post.chatroomEnabled = true;
  localStorage.setItem('posts', JSON.stringify(posts));

  members.forEach((member) => {
    sendNotification({
      userId: member.userId, type: 'chatroom_created', title: 'Chat Room Created',
      message: `Chat room for "${post.title}" is now active`,
      link: `/chatroom/${chatroom.id}`, relatedPostId: postId, relatedChatroomId: chatroom.id,
    });
  });

  return chatroom;
};

export const getChatrooms = (): Chatroom[] => JSON.parse(localStorage.getItem('chatrooms') || '[]');
export const getChatroomById = (chatroomId: string): Chatroom | undefined => getChatrooms().find((chat) => chat.id === chatroomId);
export const getChatroomByPostId = (postId: string): Chatroom | undefined => getChatrooms().find((chat) => chat.postId === postId);

export const getUserChatrooms = (userId: string): Chatroom[] => {
  return getChatrooms()
    .filter((chat) => chat.members.some((m) => m.userId === userId) && chat.status !== 'deleted')
    .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
};

export const addChatroomMember = (chatroomId: string, userId: string): void => {
  const chatrooms = getChatrooms();
  const chatroom = chatrooms.find((chat) => chat.id === chatroomId);
  if (!chatroom) throw new Error('Chatroom not found');
  if (chatroom.members.some((m) => m.userId === userId)) return;

  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const user = users.find((u: User) => u.id === userId);
  if (!user) throw new Error('User not found');

  const newMember: ChatMember = {
    userId, name: `${user.firstName} ${user.lastName}`, avatar: user.profilePicture,
    role: 'member', joinedAt: new Date().toISOString(),
  };

  chatroom.members.push(newMember);
  chatroom.lastActivity = new Date().toISOString();
  chatroom.messages.push({
    id: generateMessageId(), chatroomId: chatroom.id, senderId: 'system', senderName: 'System',
    content: `${newMember.name} joined the chat`, type: 'system',
    timestamp: new Date().toISOString(), read: false, readBy: [],
  });

  localStorage.setItem('chatrooms', JSON.stringify(chatrooms));

  sendNotification({
    userId, type: 'chatroom_invite', title: 'Added to Chat',
    message: `You've been added to the chat for "${chatroom.post.title}"`,
    link: `/chatroom/${chatroom.id}`, relatedChatroomId: chatroom.id, relatedPostId: chatroom.postId,
  });
};

export const sendMessage = (params: {
  chatroomId: string; senderId: string; content: string;
  type?: 'text' | 'file'; fileUrl?: string; fileName?: string;
}): Message => {
  const { chatroomId, senderId, content, type = 'text', fileUrl, fileName } = params;
  const chatrooms = getChatrooms();
  const chatroom = chatrooms.find((chat) => chat.id === chatroomId);
  if (!chatroom) throw new Error('Chatroom not found');
  if (chatroom.status === 'deleted') throw new Error('Cannot send messages to deleted chatroom');

  const member = chatroom.members.find((m) => m.userId === senderId);
  if (!member) throw new Error('Unauthorized: Not a member of this chatroom');

  const message: Message = {
    id: generateMessageId(), chatroomId, senderId, senderName: member.name, senderAvatar: member.avatar,
    content, type, fileUrl, fileName, timestamp: new Date().toISOString(), read: false, readBy: [senderId],
  };

  chatroom.messages.push(message);
  chatroom.lastActivity = new Date().toISOString();
  localStorage.setItem('chatrooms', JSON.stringify(chatrooms));

  chatroom.members.forEach((m) => {
    if (m.userId !== senderId) {
      sendNotification({
        userId: m.userId, type: 'new_message', title: `${member.name} sent a message`,
        message: content.substring(0, 100), link: `/chatroom/${chatroomId}`,
        relatedUserId: senderId, relatedChatroomId: chatroomId,
      });
    }
  });

  return message;
};

export const markChatroomReadOnly = (chatroomId: string): void => {
  const chatrooms = getChatrooms();
  const chatroom = chatrooms.find((chat) => chat.id === chatroomId);
  if (!chatroom) return;
  chatroom.status = 'read_only';
  localStorage.setItem('chatrooms', JSON.stringify(chatrooms));

  chatroom.members.forEach((member) => {
    sendNotification({
      userId: member.userId, type: 'chatroom_expiring', title: 'Chat Expiring Soon',
      message: `The chat for "${chatroom.post.title}" will be deleted soon`,
      link: `/chatroom/${chatroomId}`, relatedChatroomId: chatroomId,
    });
  });
};

export const deleteChatroom = (chatroomId: string, archive: boolean = false): void => {
  const chatrooms = getChatrooms();
  const chatroom = chatrooms.find((chat) => chat.id === chatroomId);
  if (!chatroom) return;
  chatroom.status = 'deleted';
  chatroom.deletedAt = new Date().toISOString();
  localStorage.setItem('chatrooms', JSON.stringify(chatrooms));

  if (archive) {
    const archives = JSON.parse(localStorage.getItem('chatroom_archives') || '[]');
    archives.push(chatroom);
    localStorage.setItem('chatroom_archives', JSON.stringify(archives));
  }
};

export const cleanupExpiredChatrooms = (): void => {
  const chatrooms = getChatrooms();
  const now = new Date();
  chatrooms.forEach((chatroom) => {
    if (chatroom.expiresAt && new Date(chatroom.expiresAt) < now && chatroom.status === 'active') {
      markChatroomReadOnly(chatroom.id);
      setTimeout(() => deleteChatroom(chatroom.id, true), 24 * 60 * 60 * 1000);
    }
  });
};
