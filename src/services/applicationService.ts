import type { Application, Post, User } from '../types/united';
import { sendNotification } from './notificationService';
import { createChatroom } from './chatroomService';
import { getLocalDateKey, normalizeDeadlineKey } from './postAvailabilityService';

const generateApplicationId = (): string => `app_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export const createApplication = (params: {
  postId: string; applicantId: string; appliedForSkill?: string;
  resume?: string; coverLetter?: string; answers?: { question: string; answer: string }[];
}): Application => {
  const { postId, applicantId, appliedForSkill, resume, coverLetter, answers = [] } = params;
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const post = posts.find((p: Post) => p.id === postId);
  if (!post) throw new Error('Post not found');
  if (post.status !== 'active') throw new Error('Post is no longer accepting applications');
  if (post.maxMembers && post.currentMembers >= post.maxMembers) throw new Error('Post has reached maximum members');
  if (post.deadline) {
    const deadlineKey = normalizeDeadlineKey(post.deadline);
    if (deadlineKey && getLocalDateKey() > deadlineKey) throw new Error('Post deadline has passed');
  }

  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const applicant = users.find((u: User) => u.id === applicantId);
  if (!applicant) throw new Error('Applicant not found');

  const existingApplications = getApplications();
  const duplicate = existingApplications.find(app => app.postId === postId && app.applicantId === applicantId);
  if (duplicate) throw new Error('You have already applied to this post');

  const application: Application = {
    id: generateApplicationId(), postId,
    post: { id: post.id, title: post.title, purpose: post.purpose, status: post.status, author: { id: post.author.id, name: post.author.name } },
    applicantId,
    applicant: {
      id: applicant.id, name: `${applicant.firstName} ${applicant.lastName}`, email: applicant.email,
      avatar: applicant.profilePicture, skills: applicant.skills, profile: applicant,
      cgpa: applicant.role === 'student' ? applicant.cgpa : undefined,
      department: applicant.role === 'student' ? applicant.department : undefined,
      year: applicant.role === 'student' ? `${applicant.yearOfGraduation}` : undefined,
    },
    appliedForSkill, resume, coverLetter, answers, status: 'applied', isRecommended: false,
    appliedAt: new Date().toISOString(),
  };

  const applications = getApplications();
  applications.push(application);
  localStorage.setItem('applications', JSON.stringify(applications));

  sendNotification({
    userId: post.author.id, type: 'application_received', title: 'New Application',
    message: `${applicant.firstName} ${applicant.lastName} applied for "${post.title}"`,
    link: `/post/${postId}`, relatedUserId: applicantId, relatedPostId: postId,
  });

  return application;
};

export const getApplications = (): Application[] => JSON.parse(localStorage.getItem('applications') || '[]');
export const getPostApplications = (postId: string): Application[] => getApplications().filter(app => app.postId === postId);

export const getUserApplications = (userId: string): Application[] => {
  return getApplications().filter(app => app.applicantId === userId)
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
};

export const updateApplicationStatus = (applicationId: string, ownerId: string, status: 'shortlisted' | 'accepted' | 'rejected'): Application => {
  const applications = getApplications();
  const application = applications.find(app => app.id === applicationId);
  if (!application) throw new Error('Application not found');

  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const post = posts.find((p: Post) => p.id === application.postId);
  if (!post || post.author.id !== ownerId) throw new Error('Unauthorized');
  if (post.status !== 'active') throw new Error('Cannot update applications for inactive post');

  if (status === 'accepted') {
    if (post.maxMembers && post.currentMembers >= post.maxMembers) throw new Error('Post has reached maximum members');
    post.currentMembers += 1;
    localStorage.setItem('posts', JSON.stringify(posts));

    if (post.maxMembers && post.currentMembers >= post.maxMembers) {
      post.status = 'filled';
      localStorage.setItem('posts', JSON.stringify(posts));
      sendNotification({ userId: ownerId, type: 'post_filled', title: 'Post Filled', message: `Your post "${post.title}" has reached maximum members`, link: `/post/${post.id}`, relatedPostId: post.id });
    }
  }

  application.status = status;
  application.updatedAt = new Date().toISOString();
  application.reviewedAt = new Date().toISOString();
  localStorage.setItem('applications', JSON.stringify(applications));

  if (status === 'accepted') {
    sendNotification({ userId: application.applicantId, type: 'application_accepted', title: 'Application Accepted! 🎉', message: `Your application for "${post.title}" has been accepted`, link: `/post/${post.id}`, relatedUserId: ownerId, relatedPostId: post.id });
    try {
      const existingChatroom = getChatroomByPostId(post.id);
      if (!existingChatroom) {
        createChatroom({ postId: post.id, ownerI: ownerId, memberIds: [application.applicantId] });
      } else {
        addChatroomMember(existingChatroom.id, application.applicantId);
      }
    } catch (error) { console.error('Error creating/updating chatroom:', error); }
  } else if (status === 'rejected') {
    sendNotification({ userId: application.applicantId, type: 'application_rejected', title: 'Application Update', message: `Your application for "${post.title}" was not selected`, link: `/applications`, relatedPostId: post.id });
  }

  return application;
};

export const withdrawApplication = (applicationId: string, userId: string): void => {
  const applications = getApplications();
  const application = applications.find(app => app.id === applicationId);
  if (!application) throw new Error('Application not found');
  if (application.applicantId !== userId) throw new Error('Unauthorized');

  if (application.status === 'accepted') {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const post = posts.find((p: Post) => p.id === application.postId);
    if (post) {
      post.currentMembers = Math.max(0, post.currentMembers - 1);
      if (post.status === 'filled' && post.currentMembers < (post.maxMembers || 0)) post.status = 'active';
      localStorage.setItem('posts', JSON.stringify(posts));
    }
  }

  application.status = 'withdrawn';
  application.updatedAt = new Date().toISOString();
  localStorage.setItem('applications', JSON.stringify(applications));
};

export const getApplicationStats = (postId: string) => {
  const applications = getPostApplications(postId);
  return {
    total: applications.length,
    applied: applications.filter(app => app.status === 'applied').length,
    shortlisted: applications.filter(app => app.status === 'shortlisted').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    withdrawn: applications.filter(app => app.status === 'withdrawn').length,
  };
};

const getChatroomByPostId = (postId: string) => {
  const chatrooms = JSON.parse(localStorage.getItem('chatrooms') || '[]');
  return chatrooms.find((chat: any) => chat.postId === postId);
};

const addChatroomMember = (chatroomId: string, userId: string) => {
  console.log(`Adding member ${userId} to chatroom ${chatroomId}`);
};
