import express from 'express';
import { login, getMe, updateCredentials } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', requireAuth, getMe);
router.put('/credentials', requireAuth, updateCredentials);

export default router;
