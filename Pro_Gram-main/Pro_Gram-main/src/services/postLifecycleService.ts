/**
 * Post Lifecycle Service
 * Handles automatic post status updates based on deadlines and member limits
 */

import { Post } from '../types';
import { sendNotification } from './notificationService';
import { cleanupExpiredChatrooms } from './chatroomService';

/**
 * Check and update post status based on deadline or member limits
 * @param postId - Post ID to check
 * @returns Updated post or null if not found
 */
export const checkAndUpdatePostStatus = (postId: string): Post | null => {
  const posts = JSON.parse(localStorage.getItem('posts') || '[]') as Post[];
  const postIndex = posts.findIndex(p => p.id === postId);
  
  if (postIndex === -1) return null;
  
  const post = posts[postIndex];
  const now = new Date();
  
  // Skip if already closed or archived
  if (post.status === 'closed' || post.status === 'archived') {
    return post;
  }
  
  let statusChanged = false;
  let newStatus: Post['status'] = post.status;
  let reason = '';
  
  // Check if deadline has passed
  if (post.deadline && new Date(post.deadline) < now) {
    newStatus = 'closed';
    reason = 'deadline reached';
    statusChanged = true;
  }
  
  // Check if max members reached
  if (post.maxMembers && post.currentMembers && post.currentMembers >= post.maxMembers) {
    newStatus = 'filled';
    reason = 'maximum members reached';
    statusChanged = true;
  }
  
  // Update post status if changed
  if (statusChanged) {
    post.status = newStatus;
    post.expiresAt = post.expiresAt || new Date(now.getTime() + (post.chatGraceDays || 7) * 24 * 60 * 60 * 1000).toISOString();
    posts[postIndex] = post;
    localStorage.setItem('posts', JSON.stringify(posts));
    
    // Send notification to post owner
    sendNotification({
      userId: post.author.id,
      type: newStatus === 'filled' ? 'post_filled' : 'post_closed',
      title: `Post ${newStatus === 'filled' ? 'Filled' : 'Closed'}`,
      message: `Your post "${post.title}" has been ${newStatus} (${reason})`,
      link: `/post/${postId}`,
      relatedPostId: postId,
    });
  }
  
  return post;
};

/**
 * Check all active posts and update their status
 * This should be called periodically (e.g., on app load, every hour, etc.)
 */
export const checkAllPostsStatus = (): void => {
  const posts = JSON.parse(localStorage.getItem('posts') || '[]') as Post[];
  
  posts.forEach(post => {
    if (post.status === 'active') {
      checkAndUpdatePostStatus(post.id);
    }
  });
};

/**
 * Archive old posts that have expired
 * @param daysAfterExpiry - Number of days after expiry to archive (default: 30)
 */
export const archiveExpiredPosts = (daysAfterExpiry: number = 30): void => {
  const posts = JSON.parse(localStorage.getItem('posts') || '[]') as Post[];
  const now = new Date();
  const archiveThreshold = now.getTime() - (daysAfterExpiry * 24 * 60 * 60 * 1000);
  
  posts.forEach((post, index) => {
    if ((post.status === 'closed' || post.status === 'filled') && post.expiresAt) {
      const expiryTime = new Date(post.expiresAt).getTime();
      
      if (expiryTime < archiveThreshold) {
        posts[index].status = 'archived';
      }
    }
  });
  
  localStorage.setItem('posts', JSON.stringify(posts));
};

/**
 * Run all lifecycle checks
 * This is the main function to call periodically
 */
export const runPostLifecycleChecks = (): void => {
  // Update post statuses
  checkAllPostsStatus();
  
  // Archive old posts
  archiveExpiredPosts();
  
  // Cleanup expired chatrooms
  cleanupExpiredChatrooms();
};

/**
 * Initialize lifecycle monitoring
 * Sets up periodic checks and returns cleanup function
 */
export const initializePostLifecycle = (): (() => void) => {
  // Run immediately
  runPostLifecycleChecks();
  
  // Set up periodic checks every hour
  const intervalId = setInterval(() => {
    runPostLifecycleChecks();
  }, 60 * 60 * 1000); // Every hour
  
  // Return cleanup function
  return () => clearInterval(intervalId);
};
