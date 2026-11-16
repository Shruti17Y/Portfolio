import express from 'express';
import {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
  reorderEducation
} from '../controllers/educationController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getEducation);
router.post('/', requireAuth, createEducation);
router.put('/reorder', requireAuth, reorderEducation);
router.put('/:id', requireAuth, updateEducation);
router.delete('/:id', requireAuth, deleteEducation);

export default router;
