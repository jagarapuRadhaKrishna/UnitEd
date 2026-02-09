import type { Invitation, Post, User } from '../types/united';
import { sendNotification } from './notificationService';

const generateInvitationId = (): string => `inv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export const createInvitation = (postId: string, inviterId: string, inviteeId: string): Invitation => {
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const post = posts.find((p: Post) => p.id === postId);
  if (!post) throw new Error('Post not found');
  if (post.author.id !== inviterId) throw new Error('Only post owner can send invitations');
  if (post.status !== 'active') throw new Error('Cannot invite to inactive post');

  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const inviter = users.find((u: User) => u.id === inviterId);
  const invitee = users.find((u: User) => u.id === inviteeId);
  if (!inviter || !invitee) throw new Error('User not found');

  const existingInvitations = getInvitations();
  const duplicate = existingInvitations.find(inv => inv.postId === postId && inv.inviteeId === inviteeId && inv.status === 'pending');
  if (duplicate) throw new Error('Invitation already sent to this candidate');

  const invitation: Invitation = {
    id: generateInvitationId(), postId,
    post: { id: post.id, title: post.title, purpose: post.purpose, deadline: post.deadline, author: { id: post.author.id, name: post.author.name, avatar: post.author.avatar } },
    inviterId,
    inviter: { id: inviter.id, name: `${inviter.firstName} ${inviter.lastName}`, avatar: inviter.profilePicture },
    inviteeId,
    invitee: { id: invitee.id, name: `${invitee.firstName} ${invitee.lastName}`, email: invitee.email, avatar: invitee.profilePicture, skills: invitee.skills },
    status: 'pending', createdAt: new Date().toISOString(),
  };

  const invitations = getInvitations();
  invitations.push(invitation);
  localStorage.setItem('invitations', JSON.stringify(invitations));

  sendNotification({
    userId: inviteeId, type: 'invitation_received', title: 'New Invitation',
    message: `${inviter.firstName} ${inviter.lastName} invited you to apply for "${post.title}"`,
    link: `/post/${postId}`, relatedUserId: inviterId, relatedPostId: postId,
  });

  window.dispatchEvent(new Event('invitationUpdate'));
  return invitation;
};

export const getInvitations = (): Invitation[] => JSON.parse(localStorage.getItem('invitations') || '[]');

export const getUserInvitations = (userId: string): Invitation[] => {
  return getInvitations().filter(inv => inv.inviteeId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getPostInvitations = (postId: string): Invitation[] => getInvitations().filter(inv => inv.postId === postId);

export const markInvitationSeen = (invitationId: string, userId: string): void => {
  const invitations = getInvitations();
  const invitation = invitations.find(inv => inv.id === invitationId);
  if (!invitation) throw new Error('Invitation not found');
  if (invitation.inviteeId !== userId) throw new Error('Unauthorized');
  if (!invitation.seenAt) {
    invitation.seenAt = new Date().toISOString();
    localStorage.setItem('invitations', JSON.stringify(invitations));
  }
};

export const respondToInvitation = (invitationId: string, userId: string, action: 'accepted' | 'declined'): void => {
  const invitations = getInvitations();
  const invitation = invitations.find(inv => inv.id === invitationId);
  if (!invitation) throw new Error('Invitation not found');
  if (invitation.inviteeId !== userId) throw new Error('Unauthorized');
  if (invitation.status !== 'pending') throw new Error('Invitation already responded to');

  invitation.status = action;
  invitation.respondedAt = new Date().toISOString();
  localStorage.setItem('invitations', JSON.stringify(invitations));
  window.dispatchEvent(new Event('invitationUpdate'));
};

export const cancelInvitation = (invitationId: string, userId: string): void => {
  const invitations = getInvitations();
  const invitation = invitations.find(inv => inv.id === invitationId);
  if (!invitation) throw new Error('Invitation not found');
  if (invitation.inviterId !== userId) throw new Error('Unauthorized');
  if (invitation.status !== 'pending') throw new Error('Cannot cancel invitation that is not pending');

  invitation.status = 'cancelled';
  invitation.respondedAt = new Date().toISOString();
  localStorage.setItem('invitations', JSON.stringify(invitations));
};

export const getInvitationStats = (postId: string) => {
  const invitations = getPostInvitations(postId);
  return {
    total: invitations.length,
    pending: invitations.filter(inv => inv.status === 'pending').length,
    accepted: invitations.filter(inv => inv.status === 'accepted').length,
    declined: invitations.filter(inv => inv.status === 'declined').length,
    seen: invitations.filter(inv => inv.seenAt).length,
  };
};
