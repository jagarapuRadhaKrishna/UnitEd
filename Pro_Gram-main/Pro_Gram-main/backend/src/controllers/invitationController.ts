import { Response } from 'express';
import { AuthRequest, ApiResponse } from '../types/index.js';
import { InvitationService } from '../services/invitationService.js';

/**
 * Invitation Controller - Handles all invitation-related HTTP requests
 */
export class InvitationController {
  /**
   * Get invitations I SENT to others
   * GET /api/v1/invitations/sent
   */
  static async getSentInvitations(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not authenticated',
        });
      }

      const result = await InvitationService.getSentInvitations(req.user.id, req.query as any);

      return res.status(200).json({
        success: true,
        message: 'Sent invitations retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch sent invitations',
        error: error.message,
      });
    }
  }

  /**
   * Get invitations I RECEIVED from others
   * GET /api/v1/invitations/received
   */
  static async getReceivedInvitations(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not authenticated',
        });
      }

      const result = await InvitationService.getReceivedInvitations(req.user.id, req.query as any);

      return res.status(200).json({
        success: true,
        message: 'Received invitations retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch received invitations',
        error: error.message,
      });
    }
  }

  /**
   * Send invitation to a user for a post
   * POST /api/v1/invitations
   */
  static async sendInvitation(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not authenticated',
        });
      }

      const { postId, invitedUserId, message } = req.body;

      if (!postId || !invitedUserId) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: postId, invitedUserId',
        });
      }

      const invitation = await InvitationService.sendInvitation({
        postId,
        invitedUserId,
        message,
        invitedById: req.user.id,
      });

      return res.status(201).json({
        success: true,
        message: 'Invitation sent successfully',
        data: invitation,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send invitation',
        error: error.message,
      });
    }
  }

  /**
   * Accept an invitation (I received)
   * PATCH /api/v1/invitations/:id/accept
   */
  static async acceptInvitation(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not authenticated',
        });
      }

      const { id } = req.params;

      const invitation = await InvitationService.acceptInvitation(id, req.user.id);

      return res.status(200).json({
        success: true,
        message: 'Invitation accepted successfully - connection established',
        data: invitation,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to accept invitation',
        error: error.message,
      });
    }
  }

  /**
   * Reject an invitation (I received)
   * PATCH /api/v1/invitations/:id/reject
   */
  static async rejectInvitation(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not authenticated',
        });
      }

      const { id } = req.params;

      const invitation = await InvitationService.rejectInvitation(id, req.user.id);

      return res.status(200).json({
        success: true,
        message: 'Invitation rejected',
        data: invitation,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to reject invitation',
        error: error.message,
      });
    }
  }

  /**
   * Cancel an invitation (I sent)
   * PATCH /api/v1/invitations/:id/cancel
   */
  static async cancelInvitation(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not authenticated',
        });
      }

      const { id } = req.params;

      const invitation = await InvitationService.cancelInvitation(id, req.user.id);

      return res.status(200).json({
        success: true,
        message: 'Invitation cancelled',
        data: invitation,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to cancel invitation',
        error: error.message,
      });
    }
  }

  /**
   * Get invitation details
   * GET /api/v1/invitations/:id
   */
  static async getInvitationDetails(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const { id } = req.params;

      const invitation = await InvitationService.getInvitationDetails(id, req.user?.id);

      if (!invitation) {
        return res.status(404).json({
          success: false,
          message: 'Invitation not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Invitation details retrieved',
        data: invitation,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch invitation details',
        error: error.message,
      });
    }
  }

  /**
   * Disconnect/Remove connection when post is completed
   * PATCH /api/v1/invitations/:id/disconnect
   */
  static async disconnectInvitation(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not authenticated',
        });
      }

      const { id } = req.params;

      const invitation = await InvitationService.disconnectInvitation(id, req.user.id);

      return res.status(200).json({
        success: true,
        message: 'Connection disconnected - project completed',
        data: invitation,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to disconnect invitation',
        error: error.message,
      });
    }
  }

  /**
   * Get active connections for a post (accepted invitations only)
   * GET /api/v1/invitations/post/:postId/connections
   */
  static async getPostConnections(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const { postId } = req.params;

      const connections = await InvitationService.getPostConnections(postId);

      return res.status(200).json({
        success: true,
        message: 'Post connections retrieved',
        data: connections,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch post connections',
        error: error.message,
      });
    }
  }
}
