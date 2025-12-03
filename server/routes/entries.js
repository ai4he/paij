import { Router } from 'express';
import { getEntries, createEntry, getEntry } from '../controllers/entriesController.js';
import { verifyUser } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', verifyUser, getEntries);
router.post('/', verifyUser, createEntry);
router.get('/:id', verifyUser, getEntry);

export default router;
