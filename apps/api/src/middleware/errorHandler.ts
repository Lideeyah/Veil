import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        logger.warn(`Operational Error: ${err.message}`);
        return res.status(err.statusCode).json({
            success: false,
            error: {
                code: 'OPERATIONAL_ERROR',
                message: err.message,
            },
        });
    }

    if (err instanceof ZodError) {
        logger.warn(`Validation Error: ${err.message}`);
        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid input data',
                details: err.errors,
            },
        });
    }

    logger.error(err, 'Unhandled Error');

    return res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong',
        },
    });
};
