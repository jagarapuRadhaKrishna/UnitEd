import type { Post } from '../types/united';
import { sendNotification } from './notificationService';
import { cleanupExpiredChatrooms } from './chatroomService';

export const checkAndUpdatePostStatus = (postId: string): Post | null => {
  const posts = JSON.parse(localStorage.getItem('posts') || '[]') as Post[];
  const postIndex = posts.findIndex(p => p.id === postId);
  if (postIndex === -1) return null;

  const post = posts[postIndex];
  const now = new Date();
  if (post.status === 'closed' || post.status === 'archived') return post;

  let statusChanged = false;
  let newStatus: Post['status'] = post.status;
  let reason = '';

  if (post.deadline && new Date(post.deadline) < now) { newStatus = 'closed'; reason = 'deadline reached'; statusChanged = true; }
  if (post.maxMembers && post.currentMembers && post.currentMembers >= post.maxMembers) { newStatus = 'filled'; reason = 'maximum members reached'; statusChanged = true; }

  if (statusChanged) {
    post.status = newStatus;
    post.expiresAt = post.expiresAt || new Date(now.getTime() + (post.chatGraceDays || 7) * 24 * 60 * 60 * 1000).toISOString();
    posts[postIndex] = post;
    localStorage.setItem('posts', JSON.stringify(posts));

    sendNotification({
      userId: post.author.id, type: newStatus === 'filled' ? 'post_filled' : 'post_closed',
      title: `Post ${newStatus === 'filled' ? 'Filled' : 'Closed'}`,
      message: `Your post "${post.title}" has been ${newStatus} (${reason})`,
      link: `/post/${postId}`, relatedPostId: postId,
    });
  }

  return post;
};

export const checkAllPostsStatus = (): void => {
  const posts = JSON.parse(localStorage.getItem('posts') || '[]') as Post[];
  posts.forEach(post => { if (post.status === 'active') checkAndUpdatePostStatus(post.id); });
};

export const archiveExpiredPosts = (daysAfterExpiry: number = 30): void => {
  const posts = JSON.parse(localStorage.getItem('posts') || '[]') as Post[];
  const archiveThreshold = Date.now() - (daysAfterExpiry * 24 * 60 * 60 * 1000);

  posts.forEach((post, index) => {
    if ((post.status === 'closed' || post.status === 'filled') && post.expiresAt) {
      if (new Date(post.expiresAt).getTime() < archiveThreshold) posts[index].status = 'archived';
    }
  });

  localStorage.setItem('posts', JSON.stringify(posts));
};

export const runPostLifecycleChecks = (): void => {
  checkAllPostsStatus();
  archiveExpiredPosts();
  cleanupExpiredChatrooms();
};

export const initializePostLifecycle = (): (() => void) => {
  runPostLifecycleChecks();
  const intervalId = setInterval(runPostLifecycleChecks, 60 * 60 * 1000);
  return () => clearInterval(intervalId);
};
