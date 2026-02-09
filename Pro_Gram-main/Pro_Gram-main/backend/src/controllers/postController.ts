import { Response } from 'express';
import { AuthRequest, ApiResponse } from '../types/index.js';
import { PostService } from '../services/postService.js';

/**
 * Post Controller - Handles all post-related HTTP requests
 */
export class PostController {
  /**
   * Create a new post
   * POST /api/v1/posts
   */
  static async createPost(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not authenticated',
        });
      }

      const post = await PostService.createPost(req.user.id, req.body);

      return res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: post,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create post',
        error: error.message,
      });
    }
  }

  /**
   * Get all posts with pagination and filters
   * GET /api/v1/posts
   */
  static async getPosts(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const result = await PostService.getPosts(req.query as any);

      return res.status(200).json({
        success: true,
        message: 'Posts retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch posts',
        error: error.message,
      });
    }
  }

  /**
   * Get a single post by ID
   * GET /api/v1/posts/:id
   */
  static async getPostById(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const { id } = req.params;
      const post = await PostService.getPostById(id, req.user?.id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Post retrieved successfully',
        data: post,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch post',
        error: error.message,
      });
    }
  }

  /**
   * Update a post
   * PUT /api/v1/posts/:id
   */
  static async updatePost(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { id } = req.params;
      const post = await PostService.updatePost(id, req.user.id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Post updated successfully',
        data: post,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update post',
        error: error.message,
      });
    }
  }

  /**
   * Delete a post
   * DELETE /api/v1/posts/:id
   */
  static async deletePost(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { id } = req.params;
      const result = await PostService.deletePost(id, req.user.id);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete post',
        error: error.message,
      });
    }
  }

  /**
   * Get user's own posts
   * GET /api/v1/posts/user/my-posts
   */
  static async getUserPosts(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const result = await PostService.getUserPosts(req.user.id, req.query as any);

      return res.status(200).json({
        success: true,
        message: 'User posts retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user posts',
        error: error.message,
      });
    }
  }

  /**
   * Close a post (mark as resolved/closed)
   * PATCH /api/v1/posts/:id/close
   */
  static async closePost(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { id } = req.params;
      const post = await PostService.closePost(id, req.user.id);

      return res.status(200).json({
        success: true,
        message: 'Post closed successfully',
        data: post,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to close post',
        error: error.message,
      });
    }
  }

  /**
   * Search posts
   * GET /api/v1/posts/search?q=searchTerm
   */
  static async searchPosts(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Search query required',
        });
      }

      const result = await PostService.searchPosts(q, req.query as any);

      return res.status(200).json({
        success: true,
        message: 'Posts searched successfully',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to search posts',
        error: error.message,
      });
    }
  }

  /**
   * Get posts by category
   * GET /api/v1/posts/category/:category
   */
  static async getPostsByCategory(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const { category } = req.params;
      const result = await PostService.getPostsByCategory(category, req.query as any);

      return res.status(200).json({
        success: true,
        message: 'Posts retrieved by category',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch posts by category',
        error: error.message,
      });
    }
  }

  /**
   * Get user's own posts (My Posts)
   * GET /api/v1/posts/my-posts
   */
  static async getMyPosts(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not authenticated',
        });
      }

      const result = await PostService.getUserPosts(req.user.id, req.query as any);

      return res.status(200).json({
        success: true,
        message: 'My posts retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch my posts',
        error: error.message,
      });
    }
  }

  /**
   * Get posts matched to user's skills
   * GET /api/v1/posts/matched
   */
  static async getMatchedPosts(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not authenticated',
        });
      }

      // Get user's skills from database
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { skills: true },
      });

      await prisma.$disconnect();

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      const userSkills = user.skills || [];
      const result = await PostService.getMatchedPosts(userSkills, req.query as any);

      return res.status(200).json({
        success: true,
        message: 'Matched posts retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch matched posts',
        error: error.message,
      });
    }
  }
}
