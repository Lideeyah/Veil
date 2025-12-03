import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from './errorHandler';
import { prisma } from '../utils/db';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        username: string;
    };
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new AppError('No token provided', 401);
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, config.jwt.secret) as { id: string; username: string };
            req.user = decoded;
            next();
        } catch (error) {
            throw new AppError('Invalid or expired token', 401);
        }
    } catch (error) {
        next(error);
    }
};

export const isCreator = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const creator = await prisma.creator.findUnique({
            where: { id: req.user.id },
        });

        if (!creator) {
            throw new AppError('Creator profile not found', 404);
        }

        next();
    } catch (error) {
        next(error);
    }
};
