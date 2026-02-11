import express from 'express';
import { signup, signin, getProfile, signout } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/signin', signin);

// Protected routes
router.get('/profile', authenticateUser, getProfile);
router.get('/me', authenticateUser, getProfile); // Alias for /profile
router.post('/signout', signout);

export default router;