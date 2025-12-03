import { Router } from 'express';
import * as creatorController from '../controllers/creators';
import { validate } from '../middleware/validation';
import { requireAuth, isCreator } from '../middleware/auth';
import {
    RegisterCreatorSchema,
    LoginSchema,
    CreateTierSchema
} from '@veil/types';

const router = Router();

// Public routes
router.get('/', creatorController.getAllCreators);
router.post('/register', validate(RegisterCreatorSchema), creatorController.register);
router.post('/login', validate(LoginSchema), creatorController.login);
router.get('/:username', creatorController.getProfile);

// Protected routes (require valid JWT)
router.get('/:id/stats', requireAuth, isCreator, creatorController.getStats);
router.post('/tiers', requireAuth, isCreator, validate(CreateTierSchema), creatorController.createTier);
router.post('/content', requireAuth, isCreator, creatorController.createContent);

export default router;
