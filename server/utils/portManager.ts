/**
 * Dynamic Port Management System
 * 
 * This module provides utilities for dynamic port allocation to prevent
 * hardcoded port usage and handle port conflicts gracefully.
 * 
 * Key Features:
 * - Automatic port discovery starting from a base port
 * - Graceful fallback when ports are unavailable
 * - Environment variable integration
 * - Comprehensive logging for debugging
 * - Prevention of port conflicts in multi-service environments
 */

import net from 'net';

export interface PortAllocationOptions {
  /** Base port to start searching from */
  basePort: number;
  /** Maximum port number to try */
  maxPort?: number;
  /** Host to bind to for port checking */
  host?: string;
  /** Service name for logging purposes */
  serviceName?: string;
  /** Array of ports to avoid */
  excludePorts?: number[];
}

export interface PortAllocationResult {
  /** The allocated port number */
  port: number;
  /** Whether this was the preferred port */
  isPreferred: boolean;
  /** Number of attempts made to find the port */
  attempts: number;
  /** Service name for identification */
  serviceName: string;
}

/**
 * Checks if a specific port is available on the given host
 * @param port - Port number to check
 * @param host - Host to check (defaults to '0.0.0.0')
 * @returns Promise that resolves to true if port is available
 */
export async function isPortAvailable(port: number, host: string = '0.0.0.0'): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
        resolve(false);
      } else {
        // For other errors, assume port is not available
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    
    // Set a timeout to prevent hanging
    const timeout = setTimeout(() => {
      server.close(() => resolve(false));
    }, 1000);
    
    server.listen(port, host, () => {
      clearTimeout(timeout);
    });
  });
}

/**
 * Finds the next available port starting from a base port
 * @param options - Port allocation configuration
 * @returns Promise that resolves to port allocation result
 */
export async function allocatePort(options: PortAllocationOptions): Promise<PortAllocationResult> {
  const {
    basePort,
    maxPort = basePort + 100, // Default to checking 100 ports
    host = '0.0.0.0',
    serviceName = 'unknown-service',
    excludePorts = []
  } = options;

  console.log(`🔍 [${serviceName}] Starting port allocation from ${basePort} (max: ${maxPort})`);
  
  let attempts = 0;
  let currentPort = basePort;
  
  while (currentPort <= maxPort) {
    attempts++;
    
    // Skip excluded ports
    if (excludePorts.includes(currentPort)) {
      console.log(`⏭️  [${serviceName}] Skipping excluded port ${currentPort}`);
      currentPort++;
      continue;
    }
    
    const available = await isPortAvailable(currentPort, host);
    
    if (available) {
      const isPreferred = currentPort === basePort;
      const result: PortAllocationResult = {
        port: currentPort,
        isPreferred,
        attempts,
        serviceName
      };
      
      if (isPreferred) {
        console.log(`✅ [${serviceName}] Allocated preferred port ${currentPort} after ${attempts} attempt(s)`);
      } else {
        console.log(`⚠️  [${serviceName}] Allocated fallback port ${currentPort} (preferred: ${basePort}) after ${attempts} attempt(s)`);
      }
      
      return result;
    }
    
    console.log(`❌ [${serviceName}] Port ${currentPort} unavailable, trying next...`);
    currentPort++;
  }
  
  // If we reach here, no ports were available in the range
  throw new Error(
    `🚨 [${serviceName}] No available ports found in range ${basePort}-${maxPort} after ${attempts} attempts. ` +
    `Consider expanding the port range or checking for port conflicts.`
  );
}

/**
 * Allocates multiple ports for different services
 * @param services - Array of service configurations
 * @returns Promise that resolves to map of service names to allocated ports
 */
export async function allocateMultiplePorts(
  services: Array<{ name: string; basePort: number; maxPort?: number }>
): Promise<Map<string, PortAllocationResult>> {
  const allocatedPorts = new Map<string, PortAllocationResult>();
  const usedPorts: number[] = [];
  
  console.log(`🎯 Allocating ports for ${services.length} service(s)...`);
  
  for (const service of services) {
    try {
      const result = await allocatePort({
        basePort: service.basePort,
        maxPort: service.maxPort,
        serviceName: service.name,
        excludePorts: usedPorts
      });
      
      allocatedPorts.set(service.name, result);
      usedPorts.push(result.port);
      
    } catch (error) {
      console.error(`💥 Failed to allocate port for ${service.name}:`, error);
      throw error;
    }
  }
  
  console.log(`🎉 Successfully allocated ports for all services:`);
  allocatedPorts.forEach((result, serviceName) => {
    console.log(`   • ${serviceName}: ${result.port} ${result.isPreferred ? '(preferred)' : '(fallback)'}`);
  });
  
  return allocatedPorts;
}

/**
 * Gets port from environment variable with dynamic fallback
 * @param envVarName - Environment variable name
 * @param basePort - Base port for dynamic allocation
 * @param serviceName - Service name for logging
 * @returns Promise that resolves to allocated port
 */
export async function getPortFromEnvOrAllocate(
  envVarName: string,
  basePort: number,
  serviceName: string = 'service'
): Promise<number> {
  const envPort = process.env[envVarName];
  
  if (envPort) {
    const port = parseInt(envPort, 10);
    if (isNaN(port) || port <= 0 || port > 65535) {
      console.warn(`⚠️  [${serviceName}] Invalid port in ${envVarName}: ${envPort}, using dynamic allocation`);
    } else {
      // Check if the environment-specified port is available
      const available = await isPortAvailable(port);
      if (available) {
        console.log(`✅ [${serviceName}] Using port ${port} from environment variable ${envVarName}`);
        return port;
      } else {
        console.warn(`⚠️  [${serviceName}] Port ${port} from ${envVarName} is unavailable, using dynamic allocation`);
      }
    }
  }
  
  // Fall back to dynamic allocation
  const result = await allocatePort({ basePort, serviceName });
  return result.port;
}

/**
 * Creates a port allocation strategy for development vs production
 * @param isDevelopment - Whether running in development mode
 * @returns Port allocation configuration
 */
export function createPortStrategy(isDevelopment: boolean) {
  if (isDevelopment) {
    return {
      // Development: Use wider port ranges for flexibility
      webServer: { basePort: 5000, maxPort: 5100 },
      apiServer: { basePort: 3000, maxPort: 3100 },
      viteHmr: { basePort: 24678, maxPort: 24778 },
      devTools: { basePort: 9229, maxPort: 9329 }
    };
  } else {
    return {
      // Production: Use standard ports with limited fallback
      webServer: { basePort: 5000, maxPort: 5010 },
      apiServer: { basePort: 3000, maxPort: 3010 }
    };
  }
}

/**
 * Validates port allocation results and logs summary
 * @param allocations - Map of service allocations
 */
export function validateAndLogAllocations(allocations: Map<string, PortAllocationResult>): void {
  console.log(`\n📊 PORT ALLOCATION SUMMARY:`);
  console.log(`${'='.repeat(50)}`);
  
  let totalAttempts = 0;
  let preferredCount = 0;
  let fallbackCount = 0;
  
  allocations.forEach((result, serviceName) => {
    const status = result.isPreferred ? '✅ PREFERRED' : '⚠️  FALLBACK';
    console.log(`${serviceName.padEnd(20)} | Port: ${result.port.toString().padEnd(5)} | ${status} | Attempts: ${result.attempts}`);
    
    totalAttempts += result.attempts;
    if (result.isPreferred) preferredCount++;
    else fallbackCount++;
  });
  
  console.log(`${'='.repeat(50)}`);
  console.log(`📈 Statistics:`);
  console.log(`   • Total services: ${allocations.size}`);
  console.log(`   • Preferred ports: ${preferredCount}`);
  console.log(`   • Fallback ports: ${fallbackCount}`);
  console.log(`   • Total attempts: ${totalAttempts}`);
  console.log(`   • Success rate: ${((preferredCount / allocations.size) * 100).toFixed(1)}%`);
  
  if (fallbackCount > 0) {
    console.log(`\n💡 TIP: Some services are using fallback ports. Consider:`);
    console.log(`   • Stopping conflicting services`);
    console.log(`   • Using different base ports in configuration`);
    console.log(`   • Checking for port conflicts with other applications`);
  }
}