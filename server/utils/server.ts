import net from 'net';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import { getConfig } from '../config';

// NOTE: findFreePort function moved to portManager.ts for better organization
// Use allocatePort() from portManager.ts instead of this deprecated function

/**
 * Normalizes the port from a string or number
 * @param val - The port value to normalize
 * @returns The normalized port number or false if invalid
 */
export function normalizePort(val: string | number): number | false {
  const port = typeof val === 'string' ? parseInt(val, 10) : val;
  
  if (isNaN(port)) {
    return false;
  }
  
  if (port >= 0) {
    return port;
  }
  
  return false;
}

/**
 * Event listener for HTTP server "error" event
 */
export function onError(error: NodeJS.ErrnoException, port: number | string | boolean) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event
 */
export async function onListening(server: HttpServer | HttpsServer) {
  const config = await getConfig();
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
  console.log(`🎉 Server listening on ${bind} in ${config.NODE_ENV} mode`);
  
  if (config.NODE_ENV === 'development') {
    console.log(`🔗 Local development URL: http://localhost:${addr?.port || config.PORT}`);
  }
}

/**
 * Gracefully shuts down the server
 * @param server - The HTTP/HTTPS server instance
 * @param signal - The signal that triggered the shutdown
 */
export function gracefulShutdown(server: HttpServer | HttpsServer, signal: string) {
  console.log(`${signal} received: closing HTTP server`);
  
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
  
  // Force close the server after 5 seconds
  setTimeout(() => {
    console.error('Forcing server shutdown');
    process.exit(1);
  }, 5000);
}
