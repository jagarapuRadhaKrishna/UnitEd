import { Application, Post, User } from '../types';
import { sendNotification } from './notificationService';
import { createChatroom } from './chatroomService';

/**
 * Application Service
 * Handles the application workflow: candidates apply, owners review and accept/reject
 */

// Generate unique application ID
const generateApplicationId = (): string => {
  return `app_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Create an application for a post
 * @param postId - Post ID to apply for
 * @param applicantId - User ID applying
 * @param data - Application data (resume, cover letter, answers)
 * @returns Created application
 */
export const createApplication = (params: {
  postId: string;
  applicantId: string;
  appliedForSkill?: string;
  resume?: string;
  coverLetter?: string;
  answers?: { question: string; answer: string }[];
}): Application => {
  const { postId, applicantId, appliedForSkill, resume, coverLetter, answers = [] } = params;

  // Get post
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const post = posts.find((p: Post) => p.id === postId);

  if (!post) {
    throw new Error('Post not found');
  }

  // Check if post is still active
  if (post.status !== 'active') {
    throw new Error('Post is no longer accepting applications');
  }

  // Check if max members reached
  if (post.maxMembers && post.currentMembers >= post.maxMembers) {
    throw new Error('Post has reached maximum members');
  }

  // Check if deadline passed
  if (post.deadline && new Date(post.deadline) < new Date()) {
    throw new Error('Post deadline has passed');
  }

  // Get applicant details
  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const applicant = users.find((u: User) => u.id === applicantId);

  if (!applicant) {
    throw new Error('Applicant not found');
  }

  // Check for duplicate application
  const existingApplications = getApplications();
  const duplicate = existingApplications.find(
    (app) => app.postId === postId && app.applicantId === applicantId
  );

  if (duplicate) {
    throw new Error('You have already applied to this post');
  }

  // Create application
  const application: Application = {
    id: generateApplicationId(),
    postId,
    post: {
      id: post.id,
      title: post.title,
      purpose: post.purpose,
      status: post.status,
      author: {
        id: post.author.id,
        name: post.author.name,
      },
    },
    applicantId,
    applicant: {
      id: applicant.id,
      name: `${applicant.firstName} ${applicant.lastName}`,
      email: applicant.email,
      avatar: applicant.profilePicture,
      skills: applicant.skills,
      profile: applicant,
      cgpa: applicant.role === 'student' ? applicant.cgpa : undefined,
      department: applicant.role === 'student' ? applicant.department : undefined,
      year: applicant.role === 'student' ? `${applicant.yearOfGraduation}` : undefined,
    },
    appliedForSkill,
    resume,
    coverLetter,
    answers,
    status: 'applied',
    isRecommended: false,
    appliedAt: new Date().toISOString(),
  };

  // Save application
  const applications = getApplications();
  applications.push(application);
  localStorage.setItem('applications', JSON.stringify(applications));

  // Send notification to post owner
  sendNotification({
    userId: post.author.id,
    type: 'application_received',
    title: 'New Application',
    message: `${applicant.firstName} ${applicant.lastName} applied for "${post.title}"`,
    link: `/post/${postId}`,
    relatedUserId: applicantId,
    relatedPostId: postId,
  });

  return application;
};

/**
 * Get all applications
 */
export const getApplications = (): Application[] => {
  return JSON.parse(localStorage.getItem('applications') || '[]');
};

/**
 * Get applications for a specific post
 */
export const getPostApplications = (postId: string): Application[] => {
  const applications = getApplications();
  return applications.filter((app) => app.postId === postId);
};

/**
 * Get applications by a specific user
 */
export const getUserApplications = (userId: string): Application[] => {
  const applications = getApplications();
  return applications
    .filter((app) => app.applicantId === userId)
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
};

/**
 * Update application status (shortlist, accept, reject)
 * @param applicationId - Application ID
 * @param ownerId - Post owner ID (for authorization)
 * @param status - New status
 */
export const updateApplicationStatus = (
  applicationId: string,
  ownerId: string,
  status: 'shortlisted' | 'accepted' | 'rejected'
): Application => {
  const applications = getApplications();
  const application = applications.find((app) => app.id === applicationId);

  if (!application) {
    throw new Error('Application not found');
  }

  // Get post to verify ownership
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const post = posts.find((p: Post) => p.id === application.postId);

  if (!post || post.author.id !== ownerId) {
    throw new Error('Unauthorized: Only post owner can update applications');
  }

  // Check if post is still active
  if (post.status !== 'active') {
    throw new Error('Cannot update applications for inactive post');
  }

  // Check if max members would be exceeded
  if (status === 'accepted') {
    if (post.maxMembers && post.currentMembers >= post.maxMembers) {
      throw new Error('Post has reached maximum members');
    }

    // Increment current members count
    post.currentMembers += 1;
    localStorage.setItem('posts', JSON.stringify(posts));

    // Check if post should be marked as filled
    if (post.maxMembers && post.currentMembers >= post.maxMembers) {
      post.status = 'filled';
      localStorage.setItem('posts', JSON.stringify(posts));

      // Send notification to owner
      sendNotification({
        userId: ownerId,
        type: 'post_filled',
        title: 'Post Filled',
        message: `Your post "${post.title}" has reached maximum members`,
        link: `/post/${post.id}`,
        relatedPostId: post.id,
      });
    }
  }

  // Update application
  application.status = status;
  application.updatedAt = new Date().toISOString();
  application.reviewedAt = new Date().toISOString();
  localStorage.setItem('applications', JSON.stringify(applications));

  // Send notification to applicant
  if (status === 'accepted') {
    sendNotification({
      userId: application.applicantId,
      type: 'application_accepted',
      title: 'Application Accepted! 🎉',
      message: `Your application for "${post.title}" has been accepted`,
      link: `/post/${post.id}`,
      relatedUserId: ownerId,
      relatedPostId: post.id,
    });

    // Check if we should create chatroom
    // Rule: Create chat when all accepted members are ready
    // For simplicity, we'll create chat immediately upon first acceptance
    // (can be modified to wait for all acceptances)
    try {
      const existingChatroom = getChatroomByPostId(post.id);
      if (!existingChatroom) {
        // Create chatroom with owner and accepted applicant
        createChatroom({
          postId: post.id,
          ownerI: ownerId,
          memberIds: [application.applicantId],
        });
      } else {
        // Add new member to existing chatroom
        addChatroomMember(existingChatroom.id, application.applicantId);
      }
    } catch (error) {
      console.error('Error creating/updating chatroom:', error);
    }
  } else if (status === 'rejected') {
    sendNotification({
      userId: application.applicantId,
      type: 'application_rejected',
      title: 'Application Update',
      message: `Your application for "${post.title}" was not selected`,
      link: `/applications`,
      relatedPostId: post.id,
    });
  }

  return application;
};

/**
 * Withdraw an application (by applicant)
 */
export const withdrawApplication = (applicationId: string, userId: string): void => {
  const applications = getApplications();
  const application = applications.find((app) => app.id === applicationId);

  if (!application) {
    throw new Error('Application not found');
  }

  if (application.applicantId !== userId) {
    throw new Error('Unauthorized');
  }

  if (application.status === 'accepted') {
    // Decrement current members if already accepted
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const post = posts.find((p: Post) => p.id === application.postId);
    if (post) {
      post.currentMembers = Math.max(0, post.currentMembers - 1);
      if (post.status === 'filled' && post.currentMembers < (post.maxMembers || 0)) {
        post.status = 'active';
      }
      localStorage.setItem('posts', JSON.stringify(posts));
    }
  }

  application.status = 'withdrawn';
  application.updatedAt = new Date().toISOString();
  localStorage.setItem('applications', JSON.stringify(applications));
};

/**
 * Get application statistics for a post
 */
export const getApplicationStats = (postId: string) => {
  const applications = getPostApplications(postId);

  return {
    total: applications.length,
    applied: applications.filter((app) => app.status === 'applied').length,
    shortlisted: applications.filter((app) => app.status === 'shortlisted').length,
    accepted: applications.filter((app) => app.status === 'accepted').length,
    rejected: applications.filter((app) => app.status === 'rejected').length,
    withdrawn: applications.filter((app) => app.status === 'withdrawn').length,
  };
};

// Helper functions (to be implemented in chatroomService)
const getChatroomByPostId = (postId: string) => {
  const chatrooms = JSON.parse(localStorage.getItem('chatrooms') || '[]');
  return chatrooms.find((chat: any) => chat.postId === postId);
};

const addChatroomMember = (chatroomId: string, userId: string) => {
  // Will be implemented in chatroomService
  console.log(`Adding member ${userId} to chatroom ${chatroomId}`);
};
