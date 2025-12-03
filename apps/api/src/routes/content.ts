import { Router } from 'express';
import * as contentController from '../controllers/content';

const router = Router();

router.get('/', contentController.listContent);
router.get('/:id', contentController.getContent);

export default router;
