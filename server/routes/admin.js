import { Router } from 'express';
import { getUsers, updatePrompts, getEntries, deleteEntries } from '../controllers/adminController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// All admin routes require admin authentication
router.use(verifyAdmin);

router.get('/users', getUsers);
router.put('/prompts', updatePrompts);
router.get('/entries', getEntries);
router.delete('/entries', deleteEntries);

export default router;
