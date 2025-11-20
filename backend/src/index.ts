import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import logger from './utils/logger';
import errorHandler from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import matchingRoutes from './routes/matching.routes';
import chatRoutes from './routes/chat.routes';
import safetyRoutes from './routes/safety.routes';
import supportRoutes from './routes/support.routes';

// Load environment variables
dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.get('/api/v1', (req: Request, res: Response) => {
  res.json({
    message: 'NoJob API v1',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      matching: '/api/v1/matching',
      chat: '/api/v1/chat',
      verification: '/api/v1/verification',
      support: '/api/v1/support',
      safety: '/api/v1/safety',
      meeting: '/api/v1/meeting',
      moderation: '/api/v1/moderation',
      goals: '/api/v1/goals'
    }
  });
});

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/matching', matchingRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/safety', safetyRoutes);
app.use('/api/v1/support', supportRoutes);

// Socket.IO for real-time chat
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on('join-chat', (chatId: string) => {
    socket.join(`chat-${chatId}`);
    logger.info(`Socket ${socket.id} joined chat-${chatId}`);
  });

  socket.on('send-message', (data) => {
    io.to(`chat-${data.chatId}`).emit('new-message', data.message);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Start server
httpServer.listen(PORT, () => {
  logger.info(`🚀 NoJob Backend running on port ${PORT}`);
  logger.info(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 API: http://localhost:${PORT}/api/v1`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

export { app, io };

