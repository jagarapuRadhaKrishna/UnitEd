import { Router } from 'express';
import postRoutes from './posts.js';
import invitationRoutes from './invitations.js';

const router = Router();

/**
 * API Routes
 * Base: /api/v1
 */

// Posts routes
router.use('/posts', postRoutes);

// Invitation routes
router.use('/invitations', invitationRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
