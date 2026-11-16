import express from 'express';
import {
  createMessage,
  getMessages,
  toggleRead,
  deleteMessage
} from '../controllers/messageController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createMessage); // Public form submission
router.get('/', requireAuth, getMessages); // Admin view messages
router.put('/:id/read', requireAuth, toggleRead); // Admin toggle read
router.delete('/:id', requireAuth, deleteMessage); // Admin delete message

export default router;
