import net from 'net';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import { config } from '../config';

/**
 * Finds an available port starting from the configured port
 * @param preferredPort - The preferred port to start checking from
 * @returns A promise that resolves to an available port number
 */
export async function findFreePort(preferredPort: number = config.PORT): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.once('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        // If the preferred port is in use, try the next one
        server.close(() => resolve(findFreePort(preferredPort + 1)));
      } else {
        reject(err);
      }
    });
    
    server.once('listening', () => {
      const address = server.address();
      const port = typeof address === 'string' ? preferredPort : address?.port || preferredPort;
      server.close(() => resolve(port));
    });
    
    server.listen(preferredPort, '0.0.0.0');
  });
}

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
export function onListening(server: HttpServer | HttpsServer) {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
  console.log(`Server listening on ${bind} in ${config.NODE_ENV} mode`);
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
