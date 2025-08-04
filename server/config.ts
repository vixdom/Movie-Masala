import dotenv from 'dotenv';
import path from 'path';
import { getPortFromEnvOrAllocate } from './utils/portManager';

// Load environment variables from .env file
dotenv.config({
  path: path.resolve(process.cwd(), process.env.NODE_ENV === 'production' ? '.env.production' : '.env')
});

// Define configuration interface
export interface ServerConfig {
  /**
   * The port on which the server will run (dynamically allocated)
   * @default Dynamically allocated starting from 5000
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

// Default configuration values (base ports for dynamic allocation)
const DEFAULT_BASE_PORTS = {
  WEB_SERVER: 5000,
  API_SERVER: 3000,
  DEV_SERVER: 24678
};

const DEFAULT_CONFIG: Partial<Omit<ServerConfig, 'PORT'>> = {
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
async function buildConfig(): Promise<ServerConfig> {
  // Dynamically allocate port to prevent conflicts
  const allocatedPort = await getPortFromEnvOrAllocate(
    'PORT',
    DEFAULT_BASE_PORTS.WEB_SERVER,
    'web-server'
  );
  
  const config: Partial<ServerConfig> = {
    ...DEFAULT_CONFIG,
    PORT: allocatedPort,
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

// Export the configuration (async initialization)
let configInstance: ServerConfig | null = null;

export async function getConfig(): Promise<ServerConfig> {
  if (!configInstance) {
    configInstance = await buildConfig();
  }
  return configInstance;
}

// Synchronous config getter for backwards compatibility (will use cached value)
export const config = {
  get PORT() { 
    if (!configInstance) {
      throw new Error('Config not initialized. Call getConfig() first.');
    }
    return configInstance.PORT; 
  },
  get HOST() { 
    if (!configInstance) {
      throw new Error('Config not initialized. Call getConfig() first.');
    }
    return configInstance.HOST; 
  },
  get NODE_ENV() { 
    if (!configInstance) {
      throw new Error('Config not initialized. Call getConfig() first.');
    }
    return configInstance.NODE_ENV; 
  },
  get ENABLE_LOGGING() { 
    if (!configInstance) {
      throw new Error('Config not initialized. Call getConfig() first.');
    }
    return configInstance.ENABLE_LOGGING; 
  },
  get CORS_ORIGIN() { 
    if (!configInstance) {
      throw new Error('Config not initialized. Call getConfig() first.');
    }
    return configInstance.CORS_ORIGIN; 
  },
  get DATABASE_URL() { 
    if (!configInstance) {
      throw new Error('Config not initialized. Call getConfig() first.');
    }
    return configInstance.DATABASE_URL; 
  }
};

// Helper function to get environment variable or throw if not set
export function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  return value;
}
