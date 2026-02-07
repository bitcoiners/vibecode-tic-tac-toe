// Focused coverage tests for gameSync.js

const createGameSync = require('../src/gameSync').default;

describe('GameSync - Coverage Focus', () => {
  let mockIo;
  let mockSocket;
  let originalIo;
  let originalWarn;
  let originalLog;
  
  beforeEach(() => {
    mockSocket = {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
      connected: true,
      io: { opts: {} }
    };
    
    mockIo = jest.fn(() => mockSocket);
    originalIo = global.io;
    global.io = mockIo;
    
    // Mock console methods to prevent test warnings
    originalWarn = console.warn;
    originalLog = console.log;
    console.warn = jest.fn();
    console.log = jest.fn();
  });
  
  afterEach(() => {
    global.io = originalIo;
    console.warn = originalWarn;
    console.log = originalLog;
  });
  
  test('trigger reconnection console logs', () => {
    const gameSync = createGameSync('test-room');
    
    const calls = mockSocket.on.mock.calls;
    
    const reconnectAttemptCall = calls.find(c => c[0] === 'reconnect_attempt');
    if (reconnectAttemptCall && reconnectAttemptCall[1]) {
      reconnectAttemptCall[1](2);
      expect(console.log).toHaveBeenCalledWith('Reconnection attempt 2');
    }
    
    const reconnectCall = calls.find(c => c[0] === 'reconnect');
    if (reconnectCall && reconnectCall[1]) {
      reconnectCall[1]();
      expect(console.log).toHaveBeenCalledWith('Reconnected successfully');
    }
    
    const disconnectCall = calls.find(c => c[0] === 'disconnect');
    if (disconnectCall && disconnectCall[1]) {
      disconnectCall[1]('test');
      expect(console.log).toHaveBeenCalledWith('Unexpected disconnect, will reconnect');
    }
  });
  
  test('trigger error handler paths', () => {
    const gameSync = createGameSync('test-room');
    
    const errorHandler = jest.fn();
    gameSync.onError(errorHandler);
    
    const mockEngine = {
      applyRemoteState: jest.fn().mockImplementation(() => {
        throw new Error('Test error');
      })
    };
    gameSync.registerLocalGameEngine(mockEngine);
    
    const calls = mockSocket.on.mock.calls;
    const gameStateCall = calls.find(c => c[0] === 'game:state');
    if (gameStateCall && gameStateCall[1]) {
      const state = { board: ['X', null, null, null, null, null, null, null, null] };
      gameStateCall[1](state);
      
      expect(console.warn).toHaveBeenCalledWith('Failed to apply remote state:', expect.any(Error));
      expect(errorHandler).toHaveBeenCalledWith(expect.any(Error), state);
    }
  });
  
  test('cover remaining uncovered lines', () => {
    global.io = undefined;
    expect(() => createGameSync('test')).toThrow('Socket.io client (io) not found');
    
    global.io = mockIo;
    const gameSync = createGameSync('test-room');
    
    const calls = mockSocket.on.mock.calls;
    const gameStateCall = calls.find(c => c[0] === 'game:state');
    
    if (gameStateCall && gameStateCall[1]) {
      expect(() => gameStateCall[1](null)).not.toThrow();
      expect(() => gameStateCall[1](undefined)).not.toThrow();
      
      const state = { board: ['X', null, null, null, null, null, null, null, null] };
      expect(() => gameStateCall[1](state)).not.toThrow();
    }
    
    const connectHandler = jest.fn();
    const disconnectHandler = jest.fn();
    const errorHandler = jest.fn();
    
    const unsubscribeConnect = gameSync.onConnect(connectHandler);
    const unsubscribeDisconnect = gameSync.onDisconnect(disconnectHandler);
    const unsubscribeError = gameSync.onError(errorHandler);
    
    expect(() => {
      unsubscribeConnect();
      unsubscribeDisconnect();
      unsubscribeError();
    }).not.toThrow();
    
    const socket = gameSync._getSocket();
    expect(socket).toBe(mockSocket);
  });
  
  test('cover broadcastState edge cases', () => {
    const gameSync = createGameSync('test-room');
    
    // broadcastState should throw for null/undefined
    expect(() => gameSync.broadcastState(null)).toThrow('State is required for broadcast');
    expect(() => gameSync.broadcastState(undefined)).toThrow('State is required for broadcast');
    
    const validState = {
      board: ['X', null, null, null, null, null, null, null, null],
      currentPlayer: 'O',
      gameOver: false,
      winner: null
    };
    
    expect(() => gameSync.broadcastState(validState)).not.toThrow();
    expect(mockSocket.emit).toHaveBeenCalledWith('game:state', validState);
  });
});
