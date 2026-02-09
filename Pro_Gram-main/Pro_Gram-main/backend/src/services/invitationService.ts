import { PrismaClient } from '@prisma/client';
import { PaginatedResult, PostQuery } from '../types/index.js';

const prisma = new PrismaClient();

/**
 * Invitation Service - Handles all invitation business logic
 * LinkedIn-style system: Sent & Received sections
 */
export class InvitationService {
  /**
   * Get invitations I SENT to others
   */
  static async getSentInvitations(
    userId: string,
    query: PostQuery
  ): Promise<PaginatedResult<any>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      invitedById: userId, // I sent these
    };

    // Filter by status
    if (query.status) {
      where.status = query.status; // PENDING, ACCEPTED, REJECTED, CANCELLED
    }

    try {
      const [invitations, total] = await Promise.all([
        prisma.invitation.findMany({
          where,
          include: {
            post: {
              select: {
                id: true,
                title: true,
                category: true,
                status: true,
                author: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profilePicture: true,
                  },
                },
              },
            },
            invitedUser: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profilePicture: true,
                department: true,
                skills: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limit,
        }),
        prisma.invitation.count({ where }),
      ]);

      return {
        data: invitations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch sent invitations: ${error}`);
    }
  }

  /**
   * Get invitations I RECEIVED from others
   */
  static async getReceivedInvitations(
    userId: string,
    query: PostQuery
  ): Promise<PaginatedResult<any>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      invitedUserId: userId, // I received these
    };

    // Filter by status
    if (query.status) {
      where.status = query.status;
    }

    try {
      const [invitations, total] = await Promise.all([
        prisma.invitation.findMany({
          where,
          include: {
            post: {
              select: {
                id: true,
                title: true,
                description: true,
                category: true,
                status: true,
                requiredSkills: true,
                deadline: true,
                author: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profilePicture: true,
                    department: true,
                    designation: true,
                  },
                },
              },
            },
            invitedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profilePicture: true,
                department: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limit,
        }),
        prisma.invitation.count({ where }),
      ]);

      return {
        data: invitations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch received invitations: ${error}`);
    }
  }

  /**
   * Send invitation to a user for a post
   */
  static async sendInvitation(data: {
    postId: string;
    invitedUserId: string;
    message?: string;
    invitedById: string;
  }) {
    try {
      // Check if post exists
      const post = await prisma.post.findUnique({
        where: { id: data.postId },
      });

      if (!post) {
        throw new Error('Post not found');
      }

      // Check if user to invite exists
      const invitedUser = await prisma.user.findUnique({
        where: { id: data.invitedUserId },
      });

      if (!invitedUser) {
        throw new Error('Invited user not found');
      }

      // Check if invitation already exists
      const existingInvitation = await prisma.invitation.findUnique({
        where: {
          postId_invitedUserId: {
            postId: data.postId,
            invitedUserId: data.invitedUserId,
          },
        },
      });

      if (existingInvitation && existingInvitation.status === 'PENDING') {
        throw new Error('Invitation already pending for this user');
      }

      // Create new invitation
      const invitation = await prisma.invitation.create({
        data: {
          postId: data.postId,
          invitedById: data.invitedById,
          invitedUserId: data.invitedUserId,
          message: data.message,
          status: 'PENDING',
        },
        include: {
          post: {
            select: {
              id: true,
              title: true,
              category: true,
            },
          },
          invitedUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          invitedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return invitation;
    } catch (error) {
      throw new Error(`Failed to send invitation: ${error}`);
    }
  }

  /**
   * Accept an invitation (I received)
   * Status changes from PENDING to ACCEPTED
   */
  static async acceptInvitation(invitationId: string, userId: string) {
    try {
      // Verify that the user receiving the invitation is the invited user
      const invitation = await prisma.invitation.findUnique({
        where: { id: invitationId },
      });

      if (!invitation) {
        throw new Error('Invitation not found');
      }

      if (invitation.invitedUserId !== userId) {
        throw new Error('Unauthorized: You can only accept invitations sent to you');
      }

      if (invitation.status !== 'PENDING') {
        throw new Error(`Cannot accept invitation with status: ${invitation.status}`);
      }

      // Update invitation status to ACCEPTED
      const acceptedInvitation = await prisma.invitation.update({
        where: { id: invitationId },
        data: {
          status: 'ACCEPTED',
          respondedAt: new Date(),
        },
        include: {
          post: {
            select: {
              id: true,
              title: true,
              category: true,
              author: true,
            },
          },
          invitedUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          invitedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      // Optional: Add user as team member to the post
      await prisma.teamMember.create({
        data: {
          postId: invitation.postId,
          userId: userId,
          role: 'MEMBER', // Regular team member (not lead)
          joinedAt: new Date(),
        },
      }).catch(() => {
        // Ignore if already exists
      });

      return acceptedInvitation;
    } catch (error) {
      throw new Error(`Failed to accept invitation: ${error}`);
    }
  }

  /**
   * Reject an invitation (I received)
   * Status changes from PENDING to REJECTED
   */
  static async rejectInvitation(invitationId: string, userId: string) {
    try {
      const invitation = await prisma.invitation.findUnique({
        where: { id: invitationId },
      });

      if (!invitation) {
        throw new Error('Invitation not found');
      }

      if (invitation.invitedUserId !== userId) {
        throw new Error('Unauthorized: You can only reject invitations sent to you');
      }

      const rejectedInvitation = await prisma.invitation.update({
        where: { id: invitationId },
        data: {
          status: 'REJECTED',
          respondedAt: new Date(),
        },
        include: {
          invitedUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          invitedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return rejectedInvitation;
    } catch (error) {
      throw new Error(`Failed to reject invitation: ${error}`);
    }
  }

  /**
   * Cancel an invitation (I sent)
   * Status changes from PENDING to CANCELLED
   */
  static async cancelInvitation(invitationId: string, userId: string) {
    try {
      const invitation = await prisma.invitation.findUnique({
        where: { id: invitationId },
      });

      if (!invitation) {
        throw new Error('Invitation not found');
      }

      if (invitation.invitedById !== userId) {
        throw new Error('Unauthorized: You can only cancel invitations you sent');
      }

      if (invitation.status !== 'PENDING') {
        throw new Error(`Cannot cancel invitation with status: ${invitation.status}`);
      }

      const cancelledInvitation = await prisma.invitation.update({
        where: { id: invitationId },
        data: {
          status: 'CANCELLED',
        },
        include: {
          invitedUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return cancelledInvitation;
    } catch (error) {
      throw new Error(`Failed to cancel invitation: ${error}`);
    }
  }

  /**
   * Get invitation details
   */
  static async getInvitationDetails(invitationId: string, _userId?: string) {
    try {
      const invitation = await prisma.invitation.findUnique({
        where: { id: invitationId },
        include: {
          post: {
            include: {
              author: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  profilePicture: true,
                  department: true,
                },
              },
            },
          },
          invitedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profilePicture: true,
            },
          },
          invitedUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profilePicture: true,
              skills: true,
            },
          },
        },
      });

      return invitation;
    } catch (error) {
      throw new Error(`Failed to fetch invitation details: ${error}`);
    }
  }

  /**
   * Disconnect/Remove connection when post is completed
   * When post status changes to CLOSED, accepted invitations become DISCONNECTED
   */
  static async disconnectInvitation(invitationId: string, userId: string) {
    try {
      const invitation = await prisma.invitation.findUnique({
        where: { id: invitationId },
      });

      if (!invitation) {
        throw new Error('Invitation not found');
      }

      // Check authorization - either user who sent or received the invitation
      if (invitation.invitedById !== userId && invitation.invitedUserId !== userId) {
        throw new Error('Unauthorized to disconnect this invitation');
      }

      // Verify the post is completed
      const post = await prisma.post.findUnique({
        where: { id: invitation.postId },
      });

      if (!post || post.status !== 'CLOSED') {
        throw new Error('Can only disconnect when post is closed');
      }

      // Update invitation status to DISCONNECTED and set disconnectReason
      const disconnectedInvitation = await prisma.invitation.update({
        where: { id: invitationId },
        data: {
          status: 'CANCELLED', // Use CANCELLED for disconnected state, or add new enum
          respondedAt: new Date(), // Mark time of disconnection
        },
        include: {
          post: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
          invitedUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          invitedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      // Remove user from team members when post closes
      await prisma.teamMember.deleteMany({
        where: {
          postId: invitation.postId,
          userId: invitation.invitedUserId,
        },
      });

      return disconnectedInvitation;
    } catch (error) {
      throw new Error(`Failed to disconnect invitation: ${error}`);
    }
  }

  /**
   * Get active connections for a post (accepted invitations only)
   * Returns list of team members connected through accepted invitations
   */
  static async getPostConnections(postId: string) {
    try {
      // Verify post exists
      const post = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        throw new Error('Post not found');
      }

      // Get only ACCEPTED invitations for this post
      const connections = await prisma.invitation.findMany({
        where: {
          postId: postId,
          status: 'ACCEPTED', // Only active connections
        },
        include: {
          invitedUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profilePicture: true,
              department: true,
              skills: true,
              bio: true,
            },
          },
          invitedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePicture: true,
            },
          },
        },
        orderBy: {
          respondedAt: 'desc',
        },
      });

      return connections;
    } catch (error) {
      throw new Error(`Failed to fetch post connections: ${error}`);
    }
  }

  /**
   * Auto-disconnect all accepted invitations when post is closed
   * Call this when updating post status to CLOSED
   */
  static async autoDisconnectPostInvitations(postId: string) {
    try {
      // Find all accepted invitations for this post
      const acceptedInvitations = await prisma.invitation.findMany({
        where: {
          postId: postId,
          status: 'ACCEPTED',
        },
      });

      // Update all to CANCELLED (disconnected)
      const disconnectPromises = acceptedInvitations.map(invitation =>
        prisma.invitation.update({
          where: { id: invitation.id },
          data: {
            status: 'CANCELLED',
            respondedAt: new Date(),
          },
        })
      );

      await Promise.all(disconnectPromises);

      // Remove all team members from the post
      await prisma.teamMember.deleteMany({
        where: { postId: postId },
      });

      return {
        success: true,
        disconnected: acceptedInvitations.length,
        message: `Disconnected ${acceptedInvitations.length} connections`,
      };
    } catch (error) {
      throw new Error(`Failed to auto-disconnect invitations: ${error}`);
    }
  }

  /**
   * Get invitation statistics for a user
   */
  static async getUserInvitationStats(userId: string) {
    try {
      const [sent, received, accepted, pending] = await Promise.all([
        prisma.invitation.count({ where: { invitedById: userId } }),
        prisma.invitation.count({ where: { invitedUserId: userId } }),
        prisma.invitation.count({
          where: { invitedUserId: userId, status: 'ACCEPTED' },
        }),
        prisma.invitation.count({
          where: { invitedUserId: userId, status: 'PENDING' },
        }),
      ]);

      return {
        totalSent: sent,
        totalReceived: received,
        acceptedConnections: accepted,
        pendingInvitations: pending,
      };
    } catch (error) {
      throw new Error(`Failed to fetch user invitation stats: ${error}`);
    }
  }
}
