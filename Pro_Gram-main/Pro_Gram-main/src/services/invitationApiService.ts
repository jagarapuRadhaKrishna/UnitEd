/**
 * Invitation API Service
 * Handles LinkedIn-style invitations: sent/received management with auto-disconnect
 */

import { API_ENDPOINTS, apiClient } from '../config/api';

// Types
export interface Invitation {
  id: string;
  postId: string;
  post?: {
    id: string;
    title: string;
    description?: string;
    status?: string;
  };
  invitedById: string;
  inviterName?: string;
  invitedUserId: string;
  inviteeName?: string;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  createdAt: string;
  respondedAt?: string;
}

export interface SendInvitationDTO {
  postId: string;
  invitedUserId: string;
  message?: string;
}

export interface InvitationResponse {
  success: boolean;
  message: string;
  data?: Invitation | Invitation[] | any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface InvitationStats {
  totalSent: number;
  totalReceived: number;
  acceptedConnections: number;
  pendingInvitations: number;
}

/**
 * Invitation Service
 * All methods make API calls to the backend
 */
export const invitationApiService = {
  /**
   * Get all invitations sent by the current user
   */
  async getSentInvitations(
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<InvitationResponse> {
    try {
      let url = `${API_ENDPOINTS.invitations.getSent}?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }
      const response = (await apiClient.get(url)) as InvitationResponse;
      return response;
    } catch (error: any) {
      console.error('Error fetching sent invitations:', error);
      throw error;
    }
  },

  /**
   * Get all invitations received by the current user
   */
  async getReceivedInvitations(
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<InvitationResponse> {
    try {
      let url = `${API_ENDPOINTS.invitations.getReceived}?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }
      const response = (await apiClient.get(url)) as InvitationResponse;
      return response;
    } catch (error: any) {
      console.error('Error fetching received invitations:', error);
      throw error;
    }
  },

  /**
   * Send an invitation to a user for a specific post
   */
  async sendInvitation(data: SendInvitationDTO): Promise<InvitationResponse> {
    try {
      const response = (await apiClient.post(API_ENDPOINTS.invitations.send, data)) as InvitationResponse;
      return response;
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      throw error;
    }
  },

  /**
   * Accept an invitation
   */
  async acceptInvitation(invitationId: string): Promise<InvitationResponse> {
    try {
      const response = (await apiClient.patch(API_ENDPOINTS.invitations.accept(invitationId), {})) as InvitationResponse;
      return response;
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      throw error;
    }
  },

  /**
   * Reject/Decline an invitation
   */
  async rejectInvitation(invitationId: string): Promise<InvitationResponse> {
    try {
      const response = (await apiClient.patch(API_ENDPOINTS.invitations.decline(invitationId), {})) as InvitationResponse;
      return response;
    } catch (error: any) {
      console.error('Error rejecting invitation:', error);
      throw error;
    }
  },

  /**
   * Cancel an invitation (only works for PENDING status)
   */
  async cancelInvitation(invitationId: string): Promise<InvitationResponse> {
    try {
      const response = (await apiClient.patch(
        `${API_ENDPOINTS.invitations.getById(invitationId)}/cancel`,
        {}
      )) as InvitationResponse;
      return response;
    } catch (error: any) {
      console.error('Error canceling invitation:', error);
      throw error;
    }
  },

  /**
   * Get invitation details
   */
  async getInvitationDetails(invitationId: string): Promise<InvitationResponse> {
    try {
      const response = (await apiClient.get(API_ENDPOINTS.invitations.getById(invitationId))) as InvitationResponse;
      return response;
    } catch (error: any) {
      console.error('Error fetching invitation details:', error);
      throw error;
    }
  },

  /**
   * Disconnect an invitation (only works when post is CLOSED)
   */
  async disconnectInvitation(invitationId: string): Promise<InvitationResponse> {
    try {
      const response = (await apiClient.patch(
        `${API_ENDPOINTS.invitations.getById(invitationId)}/disconnect`,
        {}
      )) as InvitationResponse;
      return response;
    } catch (error: any) {
      console.error('Error disconnecting invitation:', error);
      throw error;
    }
  },

  /**
   * Get all connections for a specific post
   */
  async getPostConnections(postId: string): Promise<InvitationResponse> {
    try {
      const response = (await apiClient.get(
        `${API_ENDPOINTS.invitations.getSent.replace('/sent', '')}/post/${postId}/connections`
      )) as InvitationResponse;
      return response;
    } catch (error: any) {
      console.error('Error fetching post connections:', error);
      throw error;
    }
  },
};

export default invitationApiService;
