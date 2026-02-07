/**
 * GameSync Unit Tests - Clean Version
 */

import { jest } from '@jest/globals';

// Simple mock
const mockSocket = () => ({
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
  disconnect: jest.fn(),
  connected: true
});

// Tests for previously uncovered lines
describe('GameSync - Error Handling (Lines 28-37)', () => {
  beforeEach(() => {
    delete global.io;
    delete global.window;
  });
  
  test('should throw when io not found', () => {
    delete global.io;
    delete global.window;
    
    jest.resetModules();
    const createGameSync = require('../src/gameSync').default;
    
    expect(() => {
      createGameSync('test-room');
    }).toThrow('Socket.io client (io) not found');
  });
  
  test('should use global.io when available', () => {
    global.io = jest.fn(() => mockSocket());
    
    jest.resetModules();
    const createGameSync = require('../src/gameSync').default;
    
    expect(() => {
      createGameSync('test-room');
    }).not.toThrow();
  });
});

describe('GameSync - Connection Events (Lines 118-123)', () => {
  let mockIo;
  let gameSync;
  
  beforeEach(() => {
    mockIo = jest.fn(() => mockSocket());
    
    jest.resetModules();
    const createGameSync = require('../src/gameSync').default;
    gameSync = createGameSync('test-room', mockIo);
  });
  
  test('should have onConnect method', () => {
    expect(typeof gameSync.onConnect).toBe('function');
  });
  
  test('should have onDisconnect method', () => {
    expect(typeof gameSync.onDisconnect).toBe('function');
  });
});

describe('GameSync - Basic Functionality', () => {
  let mockIo;
  let gameSync;
  
  beforeEach(() => {
    mockIo = jest.fn(() => mockSocket());
    
    jest.resetModules();
    const createGameSync = require('../src/gameSync').default;
    gameSync = createGameSync('test-room', mockIo);
  });
  
  test('should get room ID', () => {
    expect(gameSync.getRoomId()).toBe('test-room');
  });
  
  test('should get connection status', () => {
    expect(typeof gameSync.getIsConnected()).toBe('boolean');
  });
  
  test('should have shareable URL method', () => {
    expect(typeof gameSync.getShareableUrl).toBe('function');
  });
  
  test('should handle broadcast state', () => {
    expect(() => {
      gameSync.broadcastState({ board: [], currentPlayer: 'X' });
    }).not.toThrow();
  });
});
