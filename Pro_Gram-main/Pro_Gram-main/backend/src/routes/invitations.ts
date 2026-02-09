import { Router } from 'express';
import { InvitationController } from '../controllers/invitationController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

/**
 * Invitation Routes
 * Base: /api/v1/invitations
 */

/**
 * Get Invitations - Two Sections
 */

// Get invitations I SENT to others
router.get('/sent', authMiddleware, InvitationController.getSentInvitations);

// Get invitations I RECEIVED from others
router.get('/received', authMiddleware, InvitationController.getReceivedInvitations);

/**
 * Manage Invitations
 */

// Send invitation to a user for a post
router.post('/', authMiddleware, InvitationController.sendInvitation);

// Accept an invitation (received by me)
router.patch('/:id/accept', authMiddleware, InvitationController.acceptInvitation);

// Reject an invitation (received by me)
router.patch('/:id/reject', authMiddleware, InvitationController.rejectInvitation);

// Cancel an invitation (sent by me)
router.patch('/:id/cancel', authMiddleware, InvitationController.cancelInvitation);

// Get invitation details
router.get('/:id', authMiddleware, InvitationController.getInvitationDetails);

// Auto-disconnect when post is closed
router.patch('/:id/disconnect', authMiddleware, InvitationController.disconnectInvitation);

// Get active connections for a post (only show accepted invitations)
router.get('/post/:postId/connections', authMiddleware, InvitationController.getPostConnections);

export default router;
