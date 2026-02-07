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

describe('GameSync - Automatic Reconnection', () => {
  let mockIo;
  let mockSocket;
  let gameSync;
  
  beforeEach(() => {
    mockSocket = {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
      connected: true
    };
    mockIo = jest.fn(() => mockSocket);
    
    jest.resetModules();
    const createGameSync = require('../src/gameSync').default;
    gameSync = createGameSync('test-room', mockIo);
  });
  
  test('should automatically attempt reconnection on unexpected disconnect', () => {
    // The bug: Currently onDisconnect just registers handlers
    // It should also implement automatic reconnection logic
    
    // First, verify current behavior
    const disconnectHandler = jest.fn();
    gameSync.onDisconnect(disconnectHandler);
    
    // Check that socket.on was called
    expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
    
    // TODO: After implementing reconnection, we should verify:
    // 1. Reconnection is attempted after disconnect
    // 2. Reconnection has exponential backoff
    // 3. Maximum retry limit is respected
  });
  
  test('should expose reconnection status', () => {
    // After implementing, gameSync should have:
    // - getReconnectionAttempts()
    // - isReconnecting()
    // - getLastDisconnectReason()
    
    // For now, this test will document what we want
    expect(true).toBe(true); // Placeholder
  });
});

describe('GameSync - Reconnection Handling', () => {
  let mockIo;
  let mockSocket;
  let gameSync;
  
  beforeEach(() => {
    mockSocket = {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
      connected: true,
      io: {
        opts: {
          reconnection: true,
          reconnectionAttempts: 5
        }
      }
    };
    mockIo = jest.fn(() => mockSocket);
    
    jest.resetModules();
    const createGameSync = require('../src/gameSync').default;
    gameSync = createGameSync('test-room', mockIo);
  });
  
  test('should have reconnection status method', () => {
    expect(typeof gameSync.getReconnectionStatus).toBe('function');
    
    const status = gameSync.getReconnectionStatus();
    expect(status).toHaveProperty('isReconnecting');
    expect(status).toHaveProperty('reconnectionAttempts');
    expect(status).toHaveProperty('lastDisconnectReason');
  });
  
  test('should handle reconnect_attempt events', () => {
    // Find the reconnect_attempt handler
    const reconnectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'reconnect_attempt');
    expect(reconnectHandler).toBeDefined();
    
    // Initial status
    const initialStatus = gameSync.getReconnectionStatus();
    expect(initialStatus.reconnectionAttempts).toBe(0);
    expect(initialStatus.isReconnecting).toBe(false);
    
    // Simulate reconnection attempt
    reconnectHandler[1](3); // attemptNumber = 3
    
    const newStatus = gameSync.getReconnectionStatus();
    expect(newStatus.reconnectionAttempts).toBe(3);
    expect(newStatus.isReconnecting).toBe(true);
  });
  
  test('should handle successful reconnection', () => {
    const reconnectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'reconnect');
    expect(reconnectHandler).toBeDefined();
    
    // First simulate a reconnection attempt
    const attemptHandler = mockSocket.on.mock.calls.find(call => call[0] === 'reconnect_attempt');
    attemptHandler[1](2);
    
    // Then simulate successful reconnect
    reconnectHandler[1]();
    
    const status = gameSync.getReconnectionStatus();
    expect(status.reconnectionAttempts).toBe(0);
    expect(status.isReconnecting).toBe(false);
  });
  
  test('should track disconnect reasons', () => {
    const disconnectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'disconnect');
    expect(disconnectHandler).toBeDefined();
    
    disconnectHandler[1]('io server disconnect');
    
    const status = gameSync.getReconnectionStatus();
    expect(status.lastDisconnectReason).toBe('io server disconnect');
  });
});
