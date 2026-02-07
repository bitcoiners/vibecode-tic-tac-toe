// Tests for gameClient.js

describe('GameClient', () => {
  let originalDocument;
  let originalWindow;
  let originalGameSync;
  
  beforeEach(() => {
    // Store original globals
    originalDocument = global.document;
    originalWindow = global.window;
    originalGameSync = global.gameSync;
    
    // Mock document
    global.document = {
      createElement: (tag) => {
        const elem = {
          tagName: tag,
          innerHTML: '',
          textContent: '',
          className: '',
          style: {},
          appendChild: jest.fn(),
          addEventListener: jest.fn(),
          querySelector: jest.fn(() => null),
          querySelectorAll: jest.fn(() => []),
          setAttribute: jest.fn(),
          removeAttribute: jest.fn(),
          dataset: {}
        };
        if (tag === 'button') {
          elem.type = 'button';
        }
        return elem;
      },
      querySelector: jest.fn(() => null)
    };
    
    // Mock window
    global.window = {
      location: {
        origin: 'http://localhost:3000',
        href: 'http://localhost:3000'
      },
      navigator: {
        clipboard: {
          writeText: jest.fn()
        }
      }
    };
    
    // Mock gameSync
    global.gameSync = {
      onConnect: jest.fn(() => jest.fn()),
      onDisconnect: jest.fn(() => jest.fn()),
      onError: jest.fn(() => jest.fn()),
      getReconnectionStatus: jest.fn(() => ({
        isReconnecting: false,
        reconnectionAttempts: 0,
        lastDisconnectReason: null
      })),
      getIsConnected: jest.fn(() => true),
      broadcastState: jest.fn(),
      registerLocalGameEngine: jest.fn(),
      getRoomId: jest.fn(() => 'test-room'),
      getShareableUrl: jest.fn(() => 'http://localhost:3000?room=test-room')
    };
    
    jest.resetModules();
  });
  
  afterEach(() => {
    // Restore original globals
    global.document = originalDocument;
    global.window = originalWindow;
    global.gameSync = originalGameSync;
  });
  
  test('should create game client with container', () => {
    const createGameClient = require('../src/gameClient').default;
    
    const mockContainer = {
      innerHTML: '',
      appendChild: jest.fn(),
      querySelector: jest.fn(() => null)
    };
    
    const gameClient = createGameClient(mockContainer);
    expect(gameClient).toBeDefined();
    
    // Should have created UI elements
    expect(mockContainer.appendChild).toHaveBeenCalled();
  });
  
  test('should return an object with methods', () => {
    const createGameClient = require('../src/gameClient').default;
    
    const mockContainer = {
      innerHTML: '',
      appendChild: jest.fn(),
      querySelector: jest.fn(() => null)
    };
    
    const gameClient = createGameClient(mockContainer);
    
    // Check it returns an object
    expect(typeof gameClient).toBe('object');
    expect(gameClient).not.toBeNull();
  });
  
  test('should handle basic initialization', () => {
    const createGameClient = require('../src/gameClient').default;
    
    const mockContainer = {
      innerHTML: '',
      appendChild: jest.fn(),
      querySelector: jest.fn(() => null)
    };
    
    expect(() => {
      createGameClient(mockContainer);
    }).not.toThrow();
  });
});
