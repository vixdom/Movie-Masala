import 'module-alias/register';
import express, { type Request, Response, NextFunction } from 'express';
import http from 'http';
import { registerRoutes } from './routes';
import { setupVite, serveStatic, log } from './vite';
import { config } from './config';
import { findFreePort, onError, onListening, gracefulShutdown } from './utils/server';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

// Initialize Express application
const app = express();

// Configure middleware
app.use(helmet()); // Security headers
app.use(compression()); // Response compression
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Configure CORS
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logging
if (config.ENABLE_LOGGING) {
  app.use(morgan('dev')); // HTTP request logger
}

// Request timing and logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { path, method } = req;
  
  // Capture JSON response for logging
  let capturedJsonResponse: Record<string, any> | undefined;
  const originalJson = res.json;
  
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalJson.apply(res, [bodyJson, ...args]);
  };

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLine = `${method} ${path} ${res.statusCode} ${duration}ms`;
    
    if (config.ENABLE_LOGGING) {
      console.log(logLine);
      if (capturedJsonResponse) {
        console.debug('Response:', JSON.stringify(capturedJsonResponse, null, 2));
      }
    }

  });
  
  next();
});

// Error handling middleware - should be after all other middleware and routes
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log the error
  console.error(`[${new Date().toISOString()}] Error:`, {
    message,
    status,
    path: req.path,
    method: req.method,
    stack: config.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Don't leak stack traces in production
  const errorResponse = {
    status,
    message,
    ...(config.NODE_ENV === 'development' && { stack: err.stack })
  };

  res.status(status).json(errorResponse);
});

// 404 handler - should be after all other routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    status: 404,
    message: 'Not Found',
    path: _req.path
  });
});

/**
 * Start the server
 */
async function startServer() {
  try {
    // Create HTTP server
    const server = http.createServer(app);
    
    // Register application routes
    await registerRoutes(app);

    // Configure Vite in development or serve static files in production
    if (config.NODE_ENV === 'development') {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Find an available port and start listening
    const port = await findFreePort(config.PORT);
    
    server.listen(port, config.HOST);
    server.on('error', (error: NodeJS.ErrnoException) => onError(error, port));
    server.on('listening', () => onListening(server));

    // Handle graceful shutdown
    process.on('SIGTERM', () => gracefulShutdown(server, 'SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown(server, 'SIGINT'));
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

export { app, startServer };
