import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient({
    log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
    ],
});

prisma.$on('query', (e: any) => {
    if (process.env.NODE_ENV === 'development') {
        logger.debug(`Query: ${e.query} - Duration: ${e.duration}ms`);
    }
});

prisma.$on('error', (e: any) => {
    logger.error(`Prisma Error: ${e.message}`);
});

export { prisma };
