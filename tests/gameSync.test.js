// tests/gameSync.test.js
import createGameSync from '../src/gameSync.js';

// Mock Socket.io
jest.mock('socket.io-client', () => {
  return jest.fn(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    off: jest.fn(),
    disconnect: jest.fn(),
    connected: true,
  }));
});

describe('GameSync - Module Initialization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should export createGameSync as default function', () => {
    expect(typeof createGameSync).toBe('function');
  });

  test('should initialize with a room ID', () => {
    const sync = createGameSync('room-123');
    expect(sync).toBeDefined();
    expect(typeof sync).toBe('object');
  });

  test('should throw error if room ID is missing', () => {
    expect(() => createGameSync()).toThrow('Room ID is required');
  });

  test('should throw error if room ID is empty string', () => {
    expect(() => createGameSync('')).toThrow('Room ID is required');
  });
});

describe('GameSync - Connection Management', () => {
  let sync;

  beforeEach(() => {
    jest.clearAllMocks();
    sync = createGameSync('room-test');
  });

  test('should create a socket connection', () => {
    expect(sync.socket).toBeDefined();
  });

  test('should listen for "game:state" events on connect', () => {
    // Check that the socket was created with event listeners
    expect(sync.socket.on).toHaveBeenCalledWith('game:state', expect.any(Function));
  });

  test('should have a disconnect method', () => {
    expect(typeof sync.disconnect).toBe('function');
  });

  test('should call socket.disconnect() when disconnect is called', () => {
    sync.disconnect();
    expect(sync.socket.disconnect).toHaveBeenCalled();
  });
});

describe('GameSync - State Broadcasting', () => {
  let sync;

  beforeEach(() => {
    jest.clearAllMocks();
    sync = createGameSync('room-test');
  });

  test('should have a broadcastState method', () => {
    expect(typeof sync.broadcastState).toBe('function');
  });

  test('should emit game state via socket', () => {
    const state = {
      board: ['X', '', '', '', '', '', '', '', ''],
      currentPlayer: 'O',
      status: 'playing',
      winner: null,
    };

    sync.broadcastState(state);

    expect(sync.socket.emit).toHaveBeenCalledWith('game:state', {
      roomId: 'room-test',
      state,
      timestamp: expect.any(Number),
    });
  });

  test('should throw error if state is missing', () => {
    expect(() => sync.broadcastState()).toThrow('Game state is required');
  });
});

describe('GameSync - Remote State Synchronization', () => {
  let sync;
  let onRemoteStateCallback;

  beforeEach(() => {
    jest.clearAllMocks();
    sync = createGameSync('room-test');

    // Capture the 'game:state' listener
    onRemoteStateCallback = sync.socket.on.mock.calls.find(
      (call) => call[0] === 'game:state'
    )?.[1];
  });

  test('should have a method to register local gameEngine', () => {
    expect(typeof sync.setLocalEngine).toBe('function');
  });

  test('should accept a gameEngine instance', () => {
    const mockEngine = {
      getState: jest.fn(() => ({
        board: ['', '', '', '', '', '', '', '', ''],
        currentPlayer: 'X',
        status: 'playing',
        winner: null,
      })),
      applyRemoteState: jest.fn(),
    };

    sync.setLocalEngine(mockEngine);
    expect(sync.engine).toBe(mockEngine);
  });

  test('should call applyRemoteState on engine when remote state is received', () => {
    const mockEngine = {
      getState: jest.fn(),
      applyRemoteState: jest.fn(),
    };

    sync.setLocalEngine(mockEngine);

    const remoteState = {
      board: ['X', '', '', '', '', '', '', '', ''],
      currentPlayer: 'O',
      status: 'playing',
      winner: null,
    };

    // Simulate receiving a remote state
    if (onRemoteStateCallback) {
      onRemoteStateCallback({ state: remoteState, roomId: 'room-test' });
    }

    expect(mockEngine.applyRemoteState).toHaveBeenCalledWith(remoteState);
  });

  test('should ignore remote state if it is from same room but invalid', () => {
    const mockEngine = {
      getState: jest.fn(),
      applyRemoteState: jest.fn(),
    };

    sync.setLocalEngine(mockEngine);

    // Simulate receiving invalid state
    if (onRemoteStateCallback) {
      onRemoteStateCallback({ state: null, roomId: 'room-test' });
    }

    expect(mockEngine.applyRemoteState).not.toHaveBeenCalled();
  });
});

describe('GameSync - Shareable URL Generation', () => {
  let sync;

  beforeEach(() => {
    jest.clearAllMocks();
    sync = createGameSync('room-abc123');
  });

  test('should have a getShareableUrl method', () => {
    expect(typeof sync.getShareableUrl).toBe('function');
  });

  test('should return a URL with room ID as query parameter', () => {
    const url = sync.getShareableUrl();
    expect(url).toContain('room=room-abc123');
  });

  test('should use current origin for URL', () => {
    const url = sync.getShareableUrl();
    expect(url).toContain(window.location.origin);
  });

  test('should parse room ID from URL query parameter', () => {
    const sync2 = createGameSync('room-xyz');
    const url = sync2.getShareableUrl();
    const roomMatch = url.match(/room=([^&]+)/);
    expect(roomMatch?.[1]).toBe('room-xyz');
  });
});

describe('GameSync - Utility Methods', () => {
  let sync;

  beforeEach(() => {
    jest.clearAllMocks();
    sync = createGameSync('room-test');
  });

  test('should have a getRoomId method', () => {
    expect(typeof sync.getRoomId).toBe('function');
  });

  test('should return the room ID', () => {
    expect(sync.getRoomId()).toBe('room-test');
  });

  test('should have a getIsConnected method', () => {
    expect(typeof sync.getIsConnected).toBe('function');
  });

  test('should return connection status', () => {
    const isConnected = sync.getIsConnected();
    expect(typeof isConnected).toBe('boolean');
  });
});

describe('GameSync - Event Listeners', () => {
  let sync;

  beforeEach(() => {
    jest.clearAllMocks();
    sync = createGameSync('room-test');
  });

  test('should have methods to register custom event handlers', () => {
    expect(typeof sync.on).toBe('function');
    expect(typeof sync.off).toBe('function');
  });

  test('should allow registering a handler for "connect" event', () => {
    const handler = jest.fn();
    sync.on('connect', handler);

    // Verify internal listener was set up
    expect(sync.eventListeners).toBeDefined();
  });

  test('should allow removing event listeners', () => {
    const handler = jest.fn();
    sync.on('connect', handler);
    sync.off('connect', handler);

    // Handler should no longer be registered
    expect(sync.eventListeners.get('connect')).not.toContain(handler);
  });
});
