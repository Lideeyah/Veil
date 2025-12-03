import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

// Helmet is a collection of middleware functions that set security-related HTTP headers
export const securityHeaders = helmet();

// Basic input sanitization (prevent XSS)
// Note: Modern frameworks like React handle this on frontend, 
// and Zod handles validation, but this is an extra layer if needed.
// For now, we rely on Helmet and Zod.

export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
    // Implementation of custom sanitization if needed
    next();
};
