import express from 'express';
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperiences
} from '../controllers/experienceController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getExperiences);
router.post('/', requireAuth, createExperience);
router.put('/reorder', requireAuth, reorderExperiences);
router.put('/:id', requireAuth, updateExperience);
router.delete('/:id', requireAuth, deleteExperience);

export default router;
