import { Request } from 'express';

// JWT Payload Type
export interface JWTPayload {
  id: string;
  email: string;
  role: 'STUDENT' | 'FACULTY' ;
  iat?: number;
  exp?: number;
}

// Extended Express Request with user
export interface AuthRequest extends Request {
  user?: JWTPayload;
  userId?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// Post Related Types
export interface CreatePostDTO {
  title: string;
  description: string;
  purpose?: string;
  category?: 'PROJECT' | 'RESEARCH' | 'COMPETITION' | 'WORKSHOP' | 'OTHER';
  requiredSkills?: string[];
  teamSizeNeeded?: number;
  duration?: string;
  deadline?: string;
  location?: string;
  visibility?: 'PUBLIC' | 'DEPARTMENT' | 'PRIVATE';
  tags?: string[];
}

export interface UpdatePostDTO {
  title?: string;
  description?: string;
  purpose?: string;
  category?: string;
  requiredSkills?: string[];
  teamSizeNeeded?: number;
  duration?: string;
  deadline?: string;
  location?: string;
  visibility?: string;
  status?: string;
  tags?: string[];
}

export interface PostQuery extends PaginationQuery {
  search?: string;
  category?: string;
  status?: string;
  authorId?: string;
  visibility?: string;
  tags?: string;
}

// Application Related Types
export interface CreateApplicationDTO {
  postId: string;
  coverLetter?: string;
}

export interface UpdateApplicationDTO {
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN' | 'INTERVIEW' | 'OFFERED';
  rating?: number;
  feedback?: string;
}

// Invitation Related Types
export interface SendInvitationDTO {
  postId: string;
  invitedUserId: string;
  message?: string;
}

export interface InvitationResponse {
  id: string;
  postId: string;
  invitedById: string;
  invitedUserId: string;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  createdAt: Date;
  respondedAt?: Date;
}

export interface InvitationStats {
  totalSent: number;
  totalReceived: number;
  acceptedConnections: number;
  pendingInvitations: number;
}

// Validation Error Type
export interface ValidationError {
  field: string;
  message: string;
}

// Pagination Helper
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
