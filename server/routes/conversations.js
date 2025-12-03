import { Router } from 'express';
import { getConversation, saveConversation } from '../controllers/conversationsController.js';
import { verifyUser } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/:entryId', verifyUser, getConversation);
router.post('/', verifyUser, saveConversation);

export default router;
