import { PrismaClient } from '@prisma/client';
import { CreatePostDTO, UpdatePostDTO, PostQuery, PaginatedResult } from '../types/index.js';

const prisma = new PrismaClient();

/**
 * Post Service - Handles all post/opportunity CRUD operations
 */
export class PostService {
  /**
   * Create a new post
   */
  static async createPost(authorId: string, data: CreatePostDTO) {
    try {
      const post = await prisma.post.create({
        data: {
          ...data,
          authorId,
          requiredSkills: data.requiredSkills || [],
          deadline: data.deadline ? new Date(data.deadline) : null,
          category: data.category || 'PROJECT',
          visibility: data.visibility || 'PUBLIC',
          status: 'OPEN',
        },
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
      });

      return post;
    } catch (error) {
      throw new Error(`Failed to create post: ${error}`);
    }
  }

  /**
   * Get all posts with pagination and filters
   */
  static async getPosts(
    query: PostQuery
  ): Promise<PaginatedResult<any>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      isPublished: true,
      status: { not: 'DRAFT' },
    };

    // Apply filters
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.visibility && query.visibility !== 'PUBLIC') {
      where.visibility = query.visibility;
    }

    try {
      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where,
          include: {
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
            _count: {
              select: {
                applications: true,
                comments: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limit,
        }),
        prisma.post.count({ where }),
      ]);

      return {
        data: posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch posts: ${error}`);
    }
  }

  /**
   * Get a single post by ID
   */
  static async getPostById(postId: string, userId?: string) {
    try {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePicture: true,
              bio: true,
              skills: true,
              department: true,
              designation: true,
            },
          },
          applications: {
            where: userId ? { applicantId: userId } : {},
            select: {
              id: true,
              status: true,
              appliedAt: true,
              coverLetter: true,
            },
          },
          teamMembers: {
            select: {
              userId: true,
              role: true,
              joinedAt: true,
            },
          },
          comments: {
            take: 10,
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              applications: true,
              comments: true,
            },
          },
        },
      });

      if (!post) {
        return null;
      }

      // Increment view count
      await prisma.post.update({
        where: { id: postId },
        data: { views: { increment: 1 } },
      });

      return post;
    } catch (error) {
      throw new Error(`Failed to fetch post: ${error}`);
    }
  }

  /**
   * Update a post
   */
  static async updatePost(postId: string, authorId: string, data: UpdatePostDTO) {
    try {
      // Verify ownership
      const post = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post || post.authorId !== authorId) {
        throw new Error('Unauthorized: You can only update your own posts');
      }

      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          ...data,
          deadline: data.deadline ? new Date(data.deadline) : undefined,
          category: data.category ? (data.category.toUpperCase() as any) : undefined,
          status: data.status ? (data.status.toUpperCase() as any) : undefined,
          visibility: data.visibility ? (data.visibility.toUpperCase() as any) : undefined,
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePicture: true,
            },
          },
        },
      });

      return updatedPost;
    } catch (error) {
      throw new Error(`Failed to update post: ${error}`);
    }
  }

  /**
   * Delete a post
   */
  static async deletePost(postId: string, authorId: string) {
    try {
      const post = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post || post.authorId !== authorId) {
        throw new Error('Unauthorized: You can only delete your own posts');
      }

      await prisma.post.delete({
        where: { id: postId },
      });

      return { success: true, message: 'Post deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete post: ${error}`);
    }
  }

  /**
   * Get user's posts
   */
  static async getUserPosts(userId: string, query: PostQuery): Promise<PaginatedResult<any>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    try {
      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where: { authorId: userId },
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePicture: true,
              },
            },
            _count: {
              select: {
                applications: true,
                comments: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.post.count({ where: { authorId: userId } }),
      ]);

      return {
        data: posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch user posts: ${error}`);
    }
  }

  /**
   * Close a post (mark as closed)
   * When post closes, all accepted invitations are automatically disconnected
   */
  static async closePost(postId: string, authorId: string) {
    try {
      const post = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post || post.authorId !== authorId) {
        throw new Error('Unauthorized');
      }

      // Find all accepted invitations for this post
      const acceptedInvitations = await prisma.invitation.findMany({
        where: {
          postId: postId,
          status: 'ACCEPTED',
        },
      });

      // Update all accepted invitations to CANCELLED (disconnected)
      if (acceptedInvitations.length > 0) {
        await Promise.all([
          // Update invitations to disconnected status
          prisma.invitation.updateMany({
            where: {
              postId: postId,
              status: 'ACCEPTED',
            },
            data: {
              status: 'CANCELLED',
              respondedAt: new Date(),
            },
          }),
          // Remove all team members from the post
          prisma.teamMember.deleteMany({
            where: { postId: postId },
          }),
        ]);
      }

      // Close the post
      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          status: 'CLOSED',
          closedAt: new Date(),
        },
      });

      return {
        ...updatedPost,
        disconnectedConnections: acceptedInvitations.length,
      };
    } catch (error) {
      throw new Error(`Failed to close post: ${error}`);
    }
  }

  /**
   * Search posts
   */
  static async searchPosts(searchTerm: string, query: PostQuery): Promise<PaginatedResult<any>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    try {
      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where: {
            isPublished: true,
            OR: [
              { title: { contains: searchTerm, mode: 'insensitive' } },
              { description: { contains: searchTerm, mode: 'insensitive' } },
              { tags: { hasSome: [searchTerm.toLowerCase()] } },
            ],
          },
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePicture: true,
              },
            },
            _count: {
              select: {
                applications: true,
                comments: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.post.count({
          where: {
            isPublished: true,
            OR: [
              { title: { contains: searchTerm, mode: 'insensitive' } },
              { description: { contains: searchTerm, mode: 'insensitive' } },
              { tags: { hasSome: [searchTerm.toLowerCase()] } },
            ],
          },
        }),
      ]);

      return {
        data: posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Failed to search posts: ${error}`);
    }
  }

  /**
   * Get posts by category
   */
  static async getPostsByCategory(category: string, query: PostQuery): Promise<PaginatedResult<any>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    try {
      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where: {
            category: category.toUpperCase() as any,
            isPublished: true,
            status: { not: 'DRAFT' },
          },
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePicture: true,
              },
            },
            _count: {
              select: {
                applications: true,
                comments: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.post.count({
          where: {
            category: category.toUpperCase() as any,
            isPublished: true,
            status: { not: 'DRAFT' },
          },
        }),
      ]);

      return {
        data: posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch posts by category: ${error}`);
    }
  }

  /**
   * Get posts matched to user's skills
   */
  static async getMatchedPosts(
    userSkills: string[],
    query: PostQuery
  ): Promise<PaginatedResult<any>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    try {
      // Get all posts and filter by skill match
      const allPosts = await prisma.post.findMany({
        where: {
          isPublished: true,
          status: { not: 'DRAFT' },
        },
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
          _count: {
            select: {
              applications: true,
              comments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Filter posts where user has matching skills
      const matchedPosts = allPosts.filter((post: any) => {
        if (!post.requiredSkills || post.requiredSkills.length === 0) {
          return true; // Show posts with no required skills
        }
        
        // Check if user has at least one matching skill
        return post.requiredSkills.some((requiredSkill: string) =>
          userSkills.some(
            (userSkill: string) =>
              userSkill.toLowerCase() === requiredSkill.toLowerCase()
          )
        );
      });

      // Apply pagination
      const paginatedPosts = matchedPosts.slice(skip, skip + limit);
      const total = matchedPosts.length;

      return {
        data: paginatedPosts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch matched posts: ${error}`);
    }
  }}