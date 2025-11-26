import { Router } from 'express';
import { getEntries, createEntry, getEntry } from '../controllers/entriesController.js';

const router = Router();

router.get('/', getEntries);
router.post('/', createEntry);
router.get('/:id', getEntry);

export default router;
