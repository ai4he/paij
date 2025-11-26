import { Router } from 'express';
import { getConversation, saveConversation } from '../controllers/conversationsController.js';

const router = Router();

router.get('/:entryId', getConversation);
router.post('/', saveConversation);

export default router;
