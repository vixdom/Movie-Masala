# Dynamic Port Management System

## Overview

This application uses a dynamic port allocation system to prevent hardcoded port conflicts and ensure reliable service startup across different environments.

## Why Dynamic Ports?

### Problems with Hardcoded Ports
- **Port Conflicts**: Multiple services trying to use the same port
- **Environment Differences**: Development, staging, and production may have different port availability
- **Deployment Issues**: Hardcoded ports can cause deployment failures
- **Maintenance Burden**: Manual port management across multiple services

### Benefits of Dynamic Allocation
- **Automatic Conflict Resolution**: Finds available ports automatically
- **Environment Flexibility**: Adapts to any environment without configuration changes
- **Graceful Degradation**: Falls back to alternative ports when preferred ports are unavailable
- **Better Logging**: Clear visibility into port allocation decisions

## How It Works

### 1. Port Discovery Process
```
1. Check if environment variable specifies a port
2. If specified port is available, use it
3. If not available or not specified, start dynamic search
4. Begin from base port and increment until available port found
5. Log allocation result and reasoning
```

### 2. Service Configuration
```typescript
// Development Environment
{
  webServer: { basePort: 5000, maxPort: 5100 },
  apiServer: { basePort: 3000, maxPort: 3100 },
  viteHmr: { basePort: 24678, maxPort: 24778 }
}

// Production Environment  
{
  webServer: { basePort: 5000, maxPort: 5010 },
  apiServer: { basePort: 3000, maxPort: 3010 }
}
```

### 3. Allocation Strategy
- **Preferred Ports**: Try environment-specified or base ports first
- **Fallback Range**: Search within defined ranges for alternatives
- **Exclusion List**: Avoid ports already allocated to other services
- **Validation**: Verify port availability before allocation

## Usage Examples

### Basic Port Allocation
```typescript
import { allocatePort } from './utils/portManager';

const result = await allocatePort({
  basePort: 5000,
  serviceName: 'web-server'
});

console.log(`Allocated port: ${result.port}`);
```

### Multiple Service Allocation
```typescript
import { allocateMultiplePorts } from './utils/portManager';

const services = [
  { name: 'web-server', basePort: 5000 },
  { name: 'api-server', basePort: 3000 }
];

const allocations = await allocateMultiplePorts(services);
```

### Environment Variable Integration
```typescript
import { getPortFromEnvOrAllocate } from './utils/portManager';

// Try PORT env var, fallback to dynamic allocation from 5000
const port = await getPortFromEnvOrAllocate('PORT', 5000, 'main-server');
```

## Environment Variables

### Supported Variables
- `PORT`: Main server port
- `VITE_HMR_PORT`: Vite Hot Module Replacement port
- `API_TARGET`: API proxy target for development

### Example Configuration
```bash
# .env.development
PORT=5000
VITE_HMR_PORT=24678
API_TARGET=http://localhost:3000

# .env.production  
PORT=5000
```

## Logging and Monitoring

### Allocation Logs
```
🔍 [web-server] Starting port allocation from 5000 (max: 5100)
✅ [web-server] Allocated preferred port 5000 after 1 attempt(s)
⚠️  [api-server] Allocated fallback port 3001 (preferred: 3000) after 2 attempt(s)
```

### Summary Reports
```
📊 PORT ALLOCATION SUMMARY:
==================================================
web-server           | Port: 5000  | ✅ PREFERRED | Attempts: 1
api-server           | Port: 3001  | ⚠️  FALLBACK | Attempts: 2
vite-hmr            | Port: 24678 | ✅ PREFERRED | Attempts: 1
==================================================
📈 Statistics:
   • Total services: 3
   • Preferred ports: 2  
   • Fallback ports: 1
   • Total attempts: 4
   • Success rate: 66.7%
```

## Error Handling

### Common Scenarios
1. **No Available Ports**: Throws descriptive error with range information
2. **Invalid Environment Variables**: Falls back to dynamic allocation with warning
3. **Network Errors**: Graceful handling with fallback mechanisms
4. **Timeout Issues**: 1-second timeout per port check to prevent hanging

### Error Messages
```
🚨 [web-server] No available ports found in range 5000-5100 after 101 attempts.
Consider expanding the port range or checking for port conflicts.
```

## Testing

### Unit Tests
```typescript
// Test port availability checking
describe('isPortAvailable', () => {
  it('should return false for occupied ports', async () => {
    const server = net.createServer().listen(9999);
    const available = await isPortAvailable(9999);
    expect(available).toBe(false);
    server.close();
  });
});

// Test dynamic allocation
describe('allocatePort', () => {
  it('should find available port in range', async () => {
    const result = await allocatePort({
      basePort: 9000,
      maxPort: 9010,
      serviceName: 'test-service'
    });
    expect(result.port).toBeGreaterThanOrEqual(9000);
    expect(result.port).toBeLessThanOrEqual(9010);
  });
});
```

## Migration Guide

### From Hardcoded Ports
```typescript
// Before (Hardcoded)
const PORT = 5000;
server.listen(PORT);

// After (Dynamic)
const config = await getConfig();
server.listen(config.PORT);
```

### Configuration Updates
```typescript
// Before
const viteConfig = {
  server: { port: 5173 }
};

// After  
const viteConfig = {
  server: { 
    port: undefined, // Let dynamic allocation handle this
    strictPort: false 
  }
};
```

## Best Practices

### 1. Always Use Base Ports
- Define logical base ports for each service type
- Use environment variables for overrides
- Document port ranges in configuration

### 2. Service Naming
- Use descriptive service names for logging
- Follow consistent naming conventions
- Include service purpose in names

### 3. Error Handling
- Always handle allocation failures gracefully
- Provide clear error messages with actionable advice
- Log allocation decisions for debugging

### 4. Testing
- Test port allocation in CI/CD pipelines
- Verify fallback mechanisms work correctly
- Include edge cases in test suites

## Troubleshooting

### Common Issues

**Issue**: "Config not initialized" error
**Solution**: Ensure `getConfig()` is called before accessing config properties

**Issue**: Port allocation takes too long
**Solution**: Reduce port range or check for system-level port conflicts

**Issue**: Services can't communicate
**Solution**: Verify all services are using allocated ports, not hardcoded ones

### Debug Commands
```bash
# Check port usage
netstat -tulpn | grep :5000

# Kill processes on specific port
lsof -ti:5000 | xargs kill -9

# Test port availability
nc -z localhost 5000 && echo "Port in use" || echo "Port available"
```

## Future Enhancements

### Planned Features
- **Port Persistence**: Remember successful allocations across restarts
- **Health Checks**: Monitor allocated ports for availability
- **Load Balancing**: Distribute services across multiple ports
- **Docker Integration**: Container-aware port allocation
- **Metrics Collection**: Track allocation patterns and conflicts

### Configuration Extensions
- **Port Pools**: Pre-allocated port ranges for different service types
- **Priority Queues**: Preferred port ordering based on service importance
- **Conflict Resolution**: Automatic service restart on port conflicts