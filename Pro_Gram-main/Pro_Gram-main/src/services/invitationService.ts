import { Invitation, Post, User } from '../types';
import { sendNotification } from './notificationService';

/**
 * Invitation Service
 * Handles the invitation workflow: owner invites candidates to apply for posts
 */

// Generate unique invitation ID
const generateInvitationId = (): string => {
  return `inv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Create an invitation from post owner to candidate
 * @param postId - The post ID
 * @param inviterId - Owner/poster ID
 * @param inviteeId - Candidate ID to invite
 * @returns Created invitation object
 */
export const createInvitation = (
  postId: string,
  inviterId: string,
  inviteeId: string
): Invitation => {
  // Get post details
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const post = posts.find((p: Post) => p.id === postId);
  
  if (!post) {
    throw new Error('Post not found');
  }

  // Verify inviter is the post owner
  if (post.author.id !== inviterId) {
    throw new Error('Only post owner can send invitations');
  }

  // Check if post is still active
  if (post.status !== 'active') {
    throw new Error('Cannot invite to inactive post');
  }

  // Get inviter and invitee details
  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const inviter = users.find((u: User) => u.id === inviterId);
  const invitee = users.find((u: User) => u.id === inviteeId);

  if (!inviter || !invitee) {
    throw new Error('User not found');
  }

  // Check for duplicate invitation
  const existingInvitations = getInvitations();
  const duplicate = existingInvitations.find(
    (inv) => inv.postId === postId && inv.inviteeId === inviteeId && inv.status === 'pending'
  );

  if (duplicate) {
    throw new Error('Invitation already sent to this candidate');
  }

  // Create invitation
  const invitation: Invitation = {
    id: generateInvitationId(),
    postId,
    post: {
      id: post.id,
      title: post.title,
      purpose: post.purpose,
      deadline: post.deadline,
      author: {
        id: post.author.id,
        name: post.author.name,
        avatar: post.author.avatar,
      },
    },
    inviterId,
    inviter: {
      id: inviter.id,
      name: `${inviter.firstName} ${inviter.lastName}`,
      avatar: inviter.profilePicture,
    },
    inviteeId,
    invitee: {
      id: invitee.id,
      name: `${invitee.firstName} ${invitee.lastName}`,
      email: invitee.email,
      avatar: invitee.profilePicture,
      skills: invitee.skills,
    },
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  // Save to localStorage
  const invitations = getInvitations();
  invitations.push(invitation);
  localStorage.setItem('invitations', JSON.stringify(invitations));

  // Send notification to invitee
  sendNotification({
    userId: inviteeId,
    type: 'invitation_received',
    title: 'New Invitation',
    message: `${inviter.firstName} ${inviter.lastName} invited you to apply for "${post.title}"`,
    link: `/post/${postId}`,
    relatedUserId: inviterId,
    relatedPostId: postId,
  });

  // Dispatch invitation update event
  window.dispatchEvent(new Event('invitationUpdate'));

  return invitation;
};

/**
 * Get all invitations from localStorage
 */
export const getInvitations = (): Invitation[] => {
  return JSON.parse(localStorage.getItem('invitations') || '[]');
};

/**
 * Get invitations for a specific user (invitee)
 * @param userId - User ID to get invitations for
 * @returns Array of invitations
 */
export const getUserInvitations = (userId: string): Invitation[] => {
  const invitations = getInvitations();
  return invitations
    .filter((inv) => inv.inviteeId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

/**
 * Get invitations sent for a specific post
 * @param postId - Post ID
 * @returns Array of invitations
 */
export const getPostInvitations = (postId: string): Invitation[] => {
  const invitations = getInvitations();
  return invitations.filter((inv) => inv.postId === postId);
};

/**
 * Mark invitation as seen by invitee
 * @param invitationId - Invitation ID
 * @param userId - User ID (must be invitee)
 */
export const markInvitationSeen = (invitationId: string, userId: string): void => {
  const invitations = getInvitations();
  const invitation = invitations.find((inv) => inv.id === invitationId);

  if (!invitation) {
    throw new Error('Invitation not found');
  }

  if (invitation.inviteeId !== userId) {
    throw new Error('Unauthorized');
  }

  if (!invitation.seenAt) {
    invitation.seenAt = new Date().toISOString();
    localStorage.setItem('invitations', JSON.stringify(invitations));
  }
};

/**
 * Accept or decline an invitation
 * @param invitationId - Invitation ID
 * @param userId - User ID (must be invitee)
 * @param action - 'accepted' or 'declined'
 */
export const respondToInvitation = (
  invitationId: string,
  userId: string,
  action: 'accepted' | 'declined'
): void => {
  const invitations = getInvitations();
  const invitation = invitations.find((inv) => inv.id === invitationId);

  if (!invitation) {
    throw new Error('Invitation not found');
  }

  if (invitation.inviteeId !== userId) {
    throw new Error('Unauthorized');
  }

  if (invitation.status !== 'pending') {
    throw new Error('Invitation already responded to');
  }

  invitation.status = action;
  invitation.respondedAt = new Date().toISOString();
  localStorage.setItem('invitations', JSON.stringify(invitations));

  // Dispatch invitation update event
  window.dispatchEvent(new Event('invitationUpdate'));

  // Note: If accepted, user should proceed to apply to the post
  // The apply button will be shown on the post detail page
};

/**
 * Cancel an invitation (by inviter/owner)
 * @param invitationId - Invitation ID
 * @param userId - User ID (must be inviter)
 */
export const cancelInvitation = (invitationId: string, userId: string): void => {
  const invitations = getInvitations();
  const invitation = invitations.find((inv) => inv.id === invitationId);

  if (!invitation) {
    throw new Error('Invitation not found');
  }

  if (invitation.inviterId !== userId) {
    throw new Error('Unauthorized');
  }

  if (invitation.status !== 'pending') {
    throw new Error('Cannot cancel invitation that is not pending');
  }

  invitation.status = 'cancelled';
  invitation.respondedAt = new Date().toISOString();
  localStorage.setItem('invitations', JSON.stringify(invitations));
};

/**
 * Get invitation statistics for a post
 * @param postId - Post ID
 */
export const getInvitationStats = (postId: string) => {
  const invitations = getPostInvitations(postId);
  
  return {
    total: invitations.length,
    pending: invitations.filter((inv) => inv.status === 'pending').length,
    accepted: invitations.filter((inv) => inv.status === 'accepted').length,
    declined: invitations.filter((inv) => inv.status === 'declined').length,
    seen: invitations.filter((inv) => inv.seenAt).length,
  };
};
