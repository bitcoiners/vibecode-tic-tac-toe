/**
 * GameSync - Multiplayer Synchronization Module
 * Now with dependency injection for testability
 * 
 * @param {string} roomId - Unique room identifier
 * @param {Function} [ioDependency] - Socket.io client (optional, defaults to window.io)
 * @returns {Object} GameSync instance with multiplayer methods
 */
export default function createGameSync(roomId, ioDependency) {
  // ========== INPUT VALIDATION ==========
  if (!roomId) {
    throw new Error('Room ID is required');
  }
  
  if (typeof roomId !== 'string') {
    throw new Error('Room ID must be a string');
  }
  
  // ========== DEPENDENCY RESOLUTION ==========
  // Determine the io function to use (browser vs tests)
  const getIo = () => {
    // Priority 1: Provided dependency (for testing)
    if (ioDependency) {
      return ioDependency;
    }
    
    // Priority 2: Browser global (production)
    if (typeof window !== 'undefined' && window.io) {
      return window.io;
    }
    
    // Priority 3: Node.js global (test environment setup)
    if (typeof global !== 'undefined' && global.io) {
      return global.io;
    }
    
    throw new Error(
      'Socket.io client (io) not found. ' +
      'In browser: Load Socket.io client CDN. ' +
      'In tests: Set global.io = mockIoFunction before importing.'
    );
  };
  
  const io = getIo();
  
  // ========== SOCKET INITIALIZATION ==========
  const socket = io('/', {
    query: { roomId },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });
  
  // Store local game engine reference for state synchronization
  let localGameEngine = null;
  
  // Error handlers
  const errorHandlers = [];
  
  // Track reconnection state
  let reconnectionAttempts = 0;
  let isReconnecting = false;
  let lastDisconnectReason = null;
  
  // ========== EVENT HANDLERS ==========
  // Listen for remote game state updates
  socket.on('game:state', (remoteState) => {
    if (!remoteState || !localGameEngine) {
      return;
    }
    
    try {
      // Apply remote state to local game engine
      localGameEngine.applyRemoteState(remoteState);
    } catch (error) {
      console.warn('Failed to apply remote state:', error);
      // Notify error handlers
      errorHandlers.forEach(handler => handler(error, remoteState));
    }
  });
  
  // Reconnection event handlers
  socket.on('reconnect_attempt', (attemptNumber) => {
    reconnectionAttempts = attemptNumber;
    isReconnecting = true;
    console.log(`Reconnection attempt ${attemptNumber}`);
  });
  
  socket.on('reconnect', () => {
    isReconnecting = false;
    reconnectionAttempts = 0;
    console.log('Reconnected successfully');
  });
  
  socket.on('reconnect_error', (error) => {
    console.error('Reconnection error:', error);
  });
  
  socket.on('reconnect_failed', () => {
    isReconnecting = false;
    console.error('Reconnection failed after all attempts');
  });
  
  socket.on('disconnect', (reason) => {
    lastDisconnectReason = reason;
    isReconnecting = false;
    
    if (reason === 'io server disconnect') {
      // Server initiated disconnect, don't reconnect
      console.log('Server disconnected us');
    } else {
      // Unexpected disconnect, will attempt reconnection
      console.log('Unexpected disconnect, will reconnect');
    }
  });
  
  // ========== PUBLIC API ==========
  return {
    // Connection Management
    disconnect: () => {
      if (socket && socket.connected) {
        socket.disconnect();
      }
    },
    
    getIsConnected: () => socket.connected,
    
    // Reconnection Status
    getReconnectionStatus: () => ({
      isReconnecting,
      reconnectionAttempts,
      lastDisconnectReason,
      maxReconnectionAttempts: 5
    }),
    
    // State Synchronization
    broadcastState: (state) => {
      if (!state) {
        throw new Error('State is required for broadcast');
      }
      socket.emit('game:state', state);
    },
    
    registerLocalGameEngine: (engine) => {
      if (!engine || typeof engine.applyRemoteState !== 'function') {
        throw new Error('Valid game engine with applyRemoteState method is required');
      }
      localGameEngine = engine;
    },
    
    // Room Information
    getRoomId: () => roomId,
    
    getShareableUrl: () => {
      // Dynamic window check at call time
      const getCurrentOrigin = () => {
        if (typeof window !== 'undefined' && window.location && window.location.origin) {
          return window.location.origin;
        }
        return 'http://localhost:3000';
      };
      
      return `${getCurrentOrigin()}?room=${encodeURIComponent(roomId)}`;
    },
    
    // Error Handling
    onError: (handler) => {
      errorHandlers.push(handler);
      return () => {
        const index = errorHandlers.indexOf(handler);
        if (index > -1) errorHandlers.splice(index, 1);
      };
    },
    
    // Event Management
    onConnect: (handler) => {
      socket.on('connect', handler);
      return () => socket.off('connect', handler);
    },
    
    onDisconnect: (handler) => {
      socket.on('disconnect', handler);
      return () => socket.off('disconnect', handler);
    },
    
    // For testing only - exposes internal socket
    _getSocket: () => socket,
  };
}
