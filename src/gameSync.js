// src/gameSync.js

import io from 'socket.io-client';

/**
 * GameSync - Network controller for real-time multiplayer state sync
 * Manages WebSocket communication between two players in the same room.
 * 
 * Architecture:
 * - Each player running the game shares a roomId via a URL
 * - Socket.io handles real-time bidirectional communication
 * - Remote state updates are applied via gameEngine.applyRemoteState()
 * - Local moves broadcast state via broadcastState()
 */

export default function createGameSync(roomId) {
  // ═══════════════════════════════════════════════════════════
  // VALIDATION
  // ═══════════════════════════════════════════════════════════
  if (!roomId || typeof roomId !== 'string' || roomId.trim() === '') {
    throw new Error('Room ID is required');
  }

  // ═══════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════
  const socket = io('/', {
    query: { roomId },
    transports: ['websocket', 'polling'],
  });

  let engine = null;
  const eventListeners = new Map();

  // ═══════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ═══════════════════════════════════════════════════════════

  /**
   * Handle incoming state from remote player
   */
  function handleRemoteState(data) {
    if (!data || !data.state) return;
    if (engine && typeof engine.applyRemoteState === 'function') {
      engine.applyRemoteState(data.state);
    }
  }

  socket.on('game:state', handleRemoteState);

  // ═══════════════════════════════════════════════════════════
  // PUBLIC API
  // ═══════════════════════════════════════════════════════════
  return {
    // Properties exposed for testing
    socket,
    engine,
    eventListeners,

    // ─────────────────────────────────────────────────────────
    // Engine Integration
    // ─────────────────────────────────────────────────────────

    /**
     * Register the local game engine instance.
     * This engine will receive remote state updates.
     * @param {Object} gameEngine - Instance with getState() and applyRemoteState()
     */
    setLocalEngine(gameEngine) {
      if (!gameEngine) {
        throw new Error('Game engine is required');
      }
      engine = gameEngine;
      this.engine = gameEngine;
    },

    // ─────────────────────────────────────────────────────────
    // State Broadcasting
    // ─────────────────────────────────────────────────────────

    /**
     * Broadcast the current game state to the remote player.
     * Called after the local player makes a move.
     * @param {Object} state - Game state object with board, currentPlayer, status, winner
     */
    broadcastState(state) {
      if (!state) {
        throw new Error('Game state is required');
      }

      socket.emit('game:state', {
        roomId,
        state,
        timestamp: Date.now(),
      });
    },

    // ─────────────────────────────────────────────────────────
    // Connection Management
    // ─────────────────────────────────────────────────────────

    /**
     * Disconnect from the server.
     */
    disconnect() {
      socket.disconnect();
    },

    /**
     * Get the current connection status.
     * @returns {boolean} true if connected to server
     */
    getIsConnected() {
      return socket.connected === true;
    },

    // ─────────────────────────────────────────────────────────
    // Room & Sharing
    // ─────────────────────────────────────────────────────────

    /**
     * Get the room ID for this game session.
     * @returns {string} Unique room identifier
     */
    getRoomId() {
      return roomId;
    },

    /**
     * Generate a shareable URL that another player can visit to join.
     * The URL includes the room ID as a query parameter.
     * @returns {string} Full shareable URL
     */
    getShareableUrl() {
      const baseUrl = window.location.origin + window.location.pathname;
      return `${baseUrl}?room=${encodeURIComponent(roomId)}`;
    },

    // ─────────────────────────────────────────────────────────
    // Custom Event Listeners
    // ─────────────────────────────────────────────────────────

    /**
     * Register a custom event listener.
     * @param {string} eventName - Name of the event
     * @param {Function} handler - Callback function
     */
    on(eventName, handler) {
      if (!eventListeners.has(eventName)) {
        eventListeners.set(eventName, []);
      }
      eventListeners.get(eventName).push(handler);
    },

    /**
     * Remove a custom event listener.
     * @param {string} eventName - Name of the event
     * @param {Function} handler - Callback function to remove
     */
    off(eventName, handler) {
      if (eventListeners.has(eventName)) {
        const listeners = eventListeners.get(eventName);
        const index = listeners.indexOf(handler);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    },
  };
}
