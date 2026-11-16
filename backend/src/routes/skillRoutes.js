import express from 'express';
import {
  getSkills,
  createCategory,
  updateCategory,
  deleteCategory,
  createSkill,
  updateSkill,
  deleteSkill
} from '../controllers/skillController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/', getSkills);

// Categories (Admin)
router.post('/categories', requireAuth, createCategory);
router.put('/categories/:id', requireAuth, updateCategory);
router.delete('/categories/:id', requireAuth, deleteCategory);

// Skills (Admin)
router.post('/', requireAuth, createSkill);
router.put('/:id', requireAuth, updateSkill);
router.delete('/:id', requireAuth, deleteSkill);

export default router;
