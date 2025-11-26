import { Router } from 'express';
import { getUsers, updatePrompts } from '../controllers/adminController.js';

const router = Router();

router.get('/users', getUsers);
router.put('/prompts', updatePrompts);

export default router;
