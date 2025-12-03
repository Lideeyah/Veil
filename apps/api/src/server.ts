import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { securityHeaders } from './middleware/security';
import { generalLimiter } from './middleware/rateLimit';

// Initialize Express
const app = express();

// Security Middleware
app.use(securityHeaders);
app.use(cors({
    origin: config.security.corsOrigin,
    credentials: true,
}));

// Rate Limiting
app.use(generalLimiter);

// Logging
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim()),
    },
}));

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

import creatorRoutes from './routes/creators';
import paymentRoutes from './routes/payments';
import contentRoutes from './routes/content';

// Routes
app.use('/api/creators', creatorRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/content', contentRoutes);

// Error Handling
app.use(errorHandler);

// Export app for testing
export { app };

// Only start server if this file is run directly
if (require.main === module) {
    const server = app.listen(config.port, () => {
        logger.info(`🚀 Server running on port ${config.port} in ${config.env} mode`);
    });

    // Graceful Shutdown
    process.on('SIGTERM', () => {
        logger.info('SIGTERM received, shutting down gracefully');
        server.close(() => {
            logger.info('Process terminated');
        });
    });

    process.on('SIGINT', () => {
        logger.info('SIGINT received, shutting down gracefully');
        server.close(() => {
            logger.info('Process terminated');
        });
    });
}
