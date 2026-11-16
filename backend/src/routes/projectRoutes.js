import express from 'express';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects
} from '../controllers/projectController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProjects);
router.post('/', requireAuth, createProject);
router.put('/reorder', requireAuth, reorderProjects);
router.put('/:id', requireAuth, updateProject);
router.delete('/:id', requireAuth, deleteProject);

export default router;
