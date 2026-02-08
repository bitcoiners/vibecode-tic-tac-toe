// Tests for gameSync.js - Real-time multiplayer synchronization

const createGameSync = require('../src/client/gameSync').default;

describe('GameSync', () => {
  let mockIo;
  let mockSocket;
  let gameSync;
  let originalIo;
  let originalWarn;
  let originalLog;
  let originalWindow;
  
  beforeEach(() => {
    mockSocket = {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
      connected: true,
      io: {
        opts: {}
      }
    };
    
    mockIo = jest.fn(() => mockSocket);
    
    // Set global.io for the module
    originalIo = global.io;
    global.io = mockIo;
    
    // Mock console.warn to prevent test output
    originalWarn = console.warn;
    originalLog = console.log;
    console.warn = jest.fn();
    console.log = jest.fn();
    
    // Mock window
    originalWindow = global.window;
    global.window = { location: { origin: 'http://localhost' } };
    
    gameSync = createGameSync('test-room');
  });
  
  afterEach(() => {
    // Restore globals
    global.io = originalIo;
    console.warn = originalWarn;
    console.log = originalLog;
    global.window = originalWindow;
  });
  
  describe('Initialization', () => {
    test('should initialize with Socket.io instance', () => {
      expect(gameSync).toBeDefined();
      expect(global.io).toHaveBeenCalledWith('/', {
        query: { roomId: 'test-room' },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000
      });
    });
    
    test('should set up socket event handlers', () => {
      const eventNames = mockSocket.on.mock.calls.map(call => call[0]);
      expect(eventNames).toContain('game:state');
      expect(eventNames).toContain('reconnect_attempt');
      expect(eventNames).toContain('reconnect');
      expect(eventNames).toContain('disconnect');
    });
    
    test('should handle missing roomId', () => {
      expect(() => createGameSync(null)).toThrow('Room ID is required');
      expect(() => createGameSync(123)).toThrow('Room ID must be a string');
    });
    
    test('should handle missing io', () => {
      global.io = undefined;
      expect(() => createGameSync('test-room')).toThrow('Socket.io client (io) not found');
      global.io = mockIo;
    });
  });
  
  describe('Connection Status', () => {
    test('getIsConnected should return socket connection status', () => {
      expect(gameSync.getIsConnected()).toBe(true);
      
      mockSocket.connected = false;
      expect(gameSync.getIsConnected()).toBe(false);
    });
    
    test('getReconnectionStatus should return current status', () => {
      const status = gameSync.getReconnectionStatus();
      expect(status).toEqual({
        isReconnecting: false,
        reconnectionAttempts: 0,
        maxReconnectionAttempts: 5,
        lastDisconnectReason: null
      });
    });
  });
  
  describe('Room Management', () => {
    test('getRoomId should return current room ID', () => {
      expect(gameSync.getRoomId()).toBe('test-room');
    });
    
    test('getShareableUrl should return URL with room ID', () => {
      const url = gameSync.getShareableUrl();
      expect(url).toBe('http://localhost?room=test-room');
    });
  });
  
  describe('Event Subscription', () => {
    test('onConnect should register and allow unsubscribing', () => {
      const handler = jest.fn();
      const unsubscribe = gameSync.onConnect(handler);
      
      expect(typeof unsubscribe).toBe('function');
      unsubscribe();
    });
    
    test('onDisconnect should register handler', () => {
      const handler = jest.fn();
      const unsubscribe = gameSync.onDisconnect(handler);
      
      expect(typeof unsubscribe).toBe('function');
      unsubscribe();
    });
    
    test('onError should handle game engine errors', () => {
      const handler = jest.fn();
      gameSync.onError(handler);
      
      const mockEngine = {
        applyRemoteState: jest.fn().mockImplementation(() => {
          throw new Error('Test error');
        })
      };
      gameSync.registerLocalGameEngine(mockEngine);
      
      const gameStateCall = mockSocket.on.mock.calls.find(call => call[0] === 'game:state');
      if (gameStateCall && gameStateCall[1]) {
        const testState = { board: ['X', null, null, null, null, null, null, null, null] };
        gameStateCall[1](testState);
        
        expect(handler).toHaveBeenCalledWith(expect.any(Error), testState);
      }
    });
  });
  
  describe('Game State Management', () => {
    test('broadcastState should emit game state', () => {
      const gameState = {
        board: ['X', null, null, null, null, null, null, null, null],
        currentPlayer: 'O',
        gameOver: false,
        winner: null
      };
      
      gameSync.broadcastState(gameState);
      expect(mockSocket.emit).toHaveBeenCalledWith('game:state', gameState);
    });
    
    test('registerLocalGameEngine should process incoming states', () => {
      const mockEngine = { applyRemoteState: jest.fn() };
      gameSync.registerLocalGameEngine(mockEngine);
      
      const gameStateCall = mockSocket.on.mock.calls.find(call => call[0] === 'game:state');
      if (gameStateCall && gameStateCall[1]) {
        const remoteState = { board: ['X', 'O', null, null, null, null, null, null, null] };
        gameStateCall[1](remoteState);
        
        expect(mockEngine.applyRemoteState).toHaveBeenCalledWith(remoteState);
      }
    });
    
    test('should handle null game state', () => {
      const mockEngine = { applyRemoteState: jest.fn() };
      gameSync.registerLocalGameEngine(mockEngine);
      
      const gameStateCall = mockSocket.on.mock.calls.find(call => call[0] === 'game:state');
      if (gameStateCall && gameStateCall[1]) {
        gameStateCall[1](null);
        gameStateCall[1](undefined);
        
        expect(mockEngine.applyRemoteState).not.toHaveBeenCalled();
      }
    });
    
    test('should handle missing local game engine', () => {
      const gameStateCall = mockSocket.on.mock.calls.find(call => call[0] === 'game:state');
      if (gameStateCall && gameStateCall[1]) {
        expect(() => {
          gameStateCall[1]({ board: ['X', null, null, null, null, null, null, null, null] });
        }).not.toThrow();
      }
    });
  });
  
  describe('Disconnection', () => {
    test('disconnect method should call socket.disconnect', () => {
      gameSync.disconnect();
      expect(mockSocket.disconnect).toHaveBeenCalled();
    });
  });
});
