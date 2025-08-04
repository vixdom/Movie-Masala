/**
 * Test setup for port manager tests
 * 
 * This file configures the testing environment for port allocation tests
 */

import { beforeAll, afterAll } from 'vitest';

// Global test setup
beforeAll(() => {
  // Suppress console logs during tests unless debugging
  if (!process.env.DEBUG_TESTS) {
    console.log = () => {};
    console.warn = () => {};
  }
});

// Global test cleanup
afterAll(() => {
  // Restore console methods
  console.log = console.log;
  console.warn = console.warn;
});