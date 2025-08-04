/**
 * Unit tests for the dynamic port allocation system
 * 
 * These tests verify that the port management system works correctly
 * and handles edge cases gracefully.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import net from 'net';
import { 
  isPortAvailable, 
  allocatePort, 
  allocateMultiplePorts,
  getPortFromEnvOrAllocate 
} from '../portManager';

describe('Dynamic Port Allocation', () => {
  let testServers: net.Server[] = [];
  
  // Cleanup test servers after each test
  afterEach(async () => {
    await Promise.all(
      testServers.map(server => 
        new Promise<void>(resolve => {
          if (server.listening) {
            server.close(() => resolve());
          } else {
            resolve();
          }
        })
      )
    );
    testServers = [];
  });

  describe('isPortAvailable', () => {
    it('should return true for available ports', async () => {
      const available = await isPortAvailable(9876);
      expect(available).toBe(true);
    });

    it('should return false for occupied ports', async () => {
      // Occupy a port
      const server = net.createServer();
      testServers.push(server);
      
      await new Promise<void>(resolve => {
        server.listen(9877, () => resolve());
      });

      const available = await isPortAvailable(9877);
      expect(available).toBe(false);
    });

    it('should handle invalid ports gracefully', async () => {
      const available = await isPortAvailable(-1);
      expect(available).toBe(false);
    });

    it('should timeout on hanging connections', async () => {
      // This test verifies the 1-second timeout works
      const start = Date.now();
      const available = await isPortAvailable(1); // Port 1 typically requires root
      const duration = Date.now() - start;
      
      expect(available).toBe(false);
      expect(duration).toBeLessThan(2000); // Should timeout within 2 seconds
    });
  });

  describe('allocatePort', () => {
    it('should allocate preferred port when available', async () => {
      const result = await allocatePort({
        basePort: 9800,
        serviceName: 'test-service'
      });

      expect(result.port).toBe(9800);
      expect(result.isPreferred).toBe(true);
      expect(result.attempts).toBe(1);
      expect(result.serviceName).toBe('test-service');
    });

    it('should find fallback port when preferred is occupied', async () => {
      // Occupy the preferred port
      const server = net.createServer();
      testServers.push(server);
      
      await new Promise<void>(resolve => {
        server.listen(9801, () => resolve());
      });

      const result = await allocatePort({
        basePort: 9801,
        maxPort: 9810,
        serviceName: 'test-fallback'
      });

      expect(result.port).toBe(9802); // Should get next available
      expect(result.isPreferred).toBe(false);
      expect(result.attempts).toBe(2);
    });

    it('should respect excluded ports', async () => {
      const result = await allocatePort({
        basePort: 9820,
        maxPort: 9825,
        serviceName: 'test-exclude',
        excludePorts: [9820, 9821]
      });

      expect(result.port).toBe(9822); // Should skip excluded ports
      expect(result.isPreferred).toBe(false);
    });

    it('should throw error when no ports available in range', async () => {
      // Occupy all ports in a small range
      const servers = [];
      for (let port = 9830; port <= 9832; port++) {
        const server = net.createServer();
        testServers.push(server);
        servers.push(server);
        
        await new Promise<void>(resolve => {
          server.listen(port, () => resolve());
        });
      }

      await expect(allocatePort({
        basePort: 9830,
        maxPort: 9832,
        serviceName: 'test-no-ports'
      })).rejects.toThrow(/No available ports found/);
    });
  });

  describe('allocateMultiplePorts', () => {
    it('should allocate ports for multiple services', async () => {
      const services = [
        { name: 'service-1', basePort: 9840 },
        { name: 'service-2', basePort: 9841 },
        { name: 'service-3', basePort: 9842 }
      ];

      const allocations = await allocateMultiplePorts(services);

      expect(allocations.size).toBe(3);
      expect(allocations.get('service-1')?.port).toBe(9840);
      expect(allocations.get('service-2')?.port).toBe(9841);
      expect(allocations.get('service-3')?.port).toBe(9842);
    });

    it('should handle conflicts between services', async () => {
      // Occupy port 9851
      const server = net.createServer();
      testServers.push(server);
      
      await new Promise<void>(resolve => {
        server.listen(9851, () => resolve());
      });

      const services = [
        { name: 'service-a', basePort: 9850 },
        { name: 'service-b', basePort: 9851 }, // This will conflict
        { name: 'service-c', basePort: 9852 }
      ];

      const allocations = await allocateMultiplePorts(services);

      expect(allocations.get('service-a')?.port).toBe(9850);
      expect(allocations.get('service-b')?.port).toBe(9853); // Should skip 9851 and 9852 (used by service-c)
      expect(allocations.get('service-c')?.port).toBe(9852);
    });
  });

  describe('getPortFromEnvOrAllocate', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should use environment variable when valid and available', async () => {
      process.env.TEST_PORT = '9860';
      
      const port = await getPortFromEnvOrAllocate('TEST_PORT', 9999, 'test-env');
      expect(port).toBe(9860);
    });

    it('should fall back to dynamic allocation when env var is invalid', async () => {
      process.env.TEST_PORT_INVALID = 'not-a-number';
      
      const port = await getPortFromEnvOrAllocate('TEST_PORT_INVALID', 9870, 'test-invalid');
      expect(port).toBe(9870); // Should use base port
    });

    it('should fall back when env port is occupied', async () => {
      // Occupy the environment-specified port
      const server = net.createServer();
      testServers.push(server);
      
      await new Promise<void>(resolve => {
        server.listen(9880, () => resolve());
      });

      process.env.TEST_PORT_OCCUPIED = '9880';
      
      const port = await getPortFromEnvOrAllocate('TEST_PORT_OCCUPIED', 9880, 'test-occupied');
      expect(port).toBe(9881); // Should get next available
    });

    it('should use dynamic allocation when no env var set', async () => {
      const port = await getPortFromEnvOrAllocate('NONEXISTENT_PORT', 9890, 'test-none');
      expect(port).toBe(9890);
    });
  });

  describe('Edge Cases', () => {
    it('should handle port range boundaries correctly', async () => {
      const result = await allocatePort({
        basePort: 65534,
        maxPort: 65535, // Near max port number
        serviceName: 'test-boundary'
      });

      expect(result.port).toBeGreaterThanOrEqual(65534);
      expect(result.port).toBeLessThanOrEqual(65535);
    });

    it('should handle single port range', async () => {
      const result = await allocatePort({
        basePort: 9900,
        maxPort: 9900, // Same as base port
        serviceName: 'test-single'
      });

      expect(result.port).toBe(9900);
      expect(result.isPreferred).toBe(true);
    });
  });
});

// Integration test for the complete system
describe('Integration Tests', () => {
  it('should start server with dynamically allocated ports', async () => {
    // This would be an integration test that starts the actual server
    // and verifies it uses dynamic ports correctly
    
    // Mock implementation for demonstration
    const mockServerStart = async () => {
      const result = await allocatePort({
        basePort: 9950,
        serviceName: 'integration-test'
      });
      return result.port;
    };

    const port = await mockServerStart();
    expect(typeof port).toBe('number');
    expect(port).toBeGreaterThanOrEqual(9950);
  });
});