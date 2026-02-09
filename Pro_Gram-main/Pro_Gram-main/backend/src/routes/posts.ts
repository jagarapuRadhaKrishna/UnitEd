import { Router } from 'express';
import { PostController } from '../controllers/postController.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.js';

const router = Router();

/**
 * Post Routes
 * Base: /api/v1/posts
 */

// Authenticated user routes (must be before /:id routes)
router.get('/my-posts', authMiddleware, PostController.getMyPosts);
router.get('/matched', authMiddleware, PostController.getMatchedPosts);

// Public routes
router.get('/', optionalAuthMiddleware, PostController.getPosts);
router.get('/search', PostController.searchPosts);
router.get('/category/:category', PostController.getPostsByCategory);
router.get('/:id', optionalAuthMiddleware, PostController.getPostById);

// Protected routes (require authentication)
router.post('/', authMiddleware, PostController.createPost);
router.put('/:id', authMiddleware, PostController.updatePost);
router.delete('/:id', authMiddleware, PostController.deletePost);
router.patch('/:id/close', authMiddleware, PostController.closePost);

// User-specific routes
router.get('/user/my-posts/:userId', authMiddleware, PostController.getUserPosts);

export default router;
