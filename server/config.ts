import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({
  path: path.resolve(process.cwd(), process.env.NODE_ENV === 'production' ? '.env.production' : '.env')
});

// Define configuration interface
export interface ServerConfig {
  /**
   * The port on which the server will run
   * @default 3000
   */
  PORT: number;
  
  /**
   * The host on which the server will bind
   * @default '0.0.0.0'
   */
  HOST: string;
  
  /**
   * The environment the application is running in
   * @default 'development'
   */
  NODE_ENV: 'development' | 'production' | 'test';
  
  /**
   * Whether to enable request/response logging
   * @default true in development, false otherwise
   */
  ENABLE_LOGGING: boolean;
  
  /**
   * CORS configuration
   */
  CORS_ORIGIN: string | string[];
  
  /**
   * Database connection string
   * @required in production
   */
  DATABASE_URL?: string;
}

// Default configuration values
const DEFAULT_CONFIG: Partial<ServerConfig> = {
  PORT: 3000,
  HOST: '0.0.0.0',
  NODE_ENV: 'development',
  ENABLE_LOGGING: process.env.NODE_ENV !== 'production',
  CORS_ORIGIN: process.env.NODE_ENV === 'production' 
    ? process.env.CORS_ORIGIN?.split(',') || [] 
    : '*'
};

// Validate required environment variables in production
function validateConfig(config: Partial<ServerConfig>): asserts config is ServerConfig {
  if (process.env.NODE_ENV === 'production' && !config.DATABASE_URL) {
    throw new Error('DATABASE_URL is required in production environment');
  }
}

// Build the configuration object
function buildConfig(): ServerConfig {
  const config: Partial<ServerConfig> = {
    ...DEFAULT_CONFIG,
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : DEFAULT_CONFIG.PORT,
    HOST: process.env.HOST || DEFAULT_CONFIG.HOST,
    NODE_ENV: (process.env.NODE_ENV as ServerConfig['NODE_ENV']) || 'development',
    ENABLE_LOGGING: process.env.ENABLE_LOGGING
      ? process.env.ENABLE_LOGGING === 'true'
      : DEFAULT_CONFIG.ENABLE_LOGGING,
    DATABASE_URL: process.env.DATABASE_URL,
    CORS_ORIGIN: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
      : DEFAULT_CONFIG.CORS_ORIGIN
  };

  validateConfig(config);
  return config as ServerConfig;
}

// Export the configuration
export const config = buildConfig();

// Helper function to get environment variable or throw if not set
export function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  return value;
}
