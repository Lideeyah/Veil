import { Router } from 'express';
import * as paymentController from '../controllers/payments';
import { validate } from '../middleware/validation';
import { requireAuth } from '../middleware/auth';
import {
    InitiatePaymentSchema,
    VerifyPaymentSchema
} from '@veil/types';

const router = Router();

// Public routes (or semi-public)
router.post('/initiate', validate(InitiatePaymentSchema), paymentController.initiate);
router.post('/verify', validate(VerifyPaymentSchema), paymentController.verify);
router.get('/content/:commitment', paymentController.getContent);
router.post('/access/:commitment', paymentController.proveAccess);

// Webhook for Zcash Monitor (should be secured with API key in real app)
router.post('/webhook/process', paymentController.processPayment);

export default router;
