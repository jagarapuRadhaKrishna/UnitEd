/**
 * Posts/Opportunities API Service
 */

import { API_ENDPOINTS, apiClient } from '../config/api';

export interface CreatePostData {
  title: string;
  description: string;
  type: 'RESEARCH' | 'PROJECT' | 'HACKATHON';
  requiredSkills: string[];
  desiredSkills?: string[];
  deadline?: string;
  numberOfPositions?: number;
  duration?: string;
  tags?: string[];
}

export interface Post {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  authorId: string;
  author: any;
  requiredSkills: any[];
  deadline: string | null;
  numberOfPositions: number;
  duration: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const postsService = {
  /**
   * Create a new post
   */
  async createPost(data: CreatePostData): Promise<{ success: boolean; data: Post }> {
    return apiClient.post(API_ENDPOINTS.posts.create, data);
  },

  /**
   * Get all posts with optional filters
   */
  async getPosts(params?: {
    type?: string;
    status?: string;
    skills?: string[];
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }): Promise<{ success: boolean; data: { posts: Post[]; total: number; page: number; totalPages: number } }> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      if (params.type) queryParams.append('type', params.type);
      if (params.status) queryParams.append('status', params.status);
      if (params.skills) queryParams.append('skills', params.skills.join(','));
      if (params.search) queryParams.append('search', params.search);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.order) queryParams.append('order', params.order);
    }
    
    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.posts.getAll}?${queryParams.toString()}`
      : API_ENDPOINTS.posts.getAll;
      
    return apiClient.get(url);
  },

  /**
   * Get post by ID
   */
  async getPostById(id: string): Promise<{ success: boolean; data: Post }> {
    return apiClient.get(API_ENDPOINTS.posts.getById(id));
  },

  /**
   * Update post
   */
  async updatePost(id: string, data: Partial<CreatePostData>): Promise<{ success: boolean; data: Post }> {
    return apiClient.put(API_ENDPOINTS.posts.update(id), data);
  },

  /**
   * Delete post
   */
  async deletePost(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(API_ENDPOINTS.posts.delete(id));
  },

  /**
   * Close post
   */
  async closePost(id: string): Promise<{ success: boolean; data: Post }> {
    return apiClient.patch(API_ENDPOINTS.posts.close(id));
  },

  /**
   * Get recommended posts for current user
   */
  async getRecommendedPosts(): Promise<{ success: boolean; data: Post[] }> {
    return apiClient.get(API_ENDPOINTS.posts.getRecommended);
  },
};
