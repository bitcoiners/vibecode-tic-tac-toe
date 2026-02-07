// src/gameLobby.js
// Multiplayer lobby: Create/join rooms, share URLs, manage player roles

/**
 * GameLobby - Multiplayer lobby UI manager
 * Handles: create game, join game, share room URL, display player roles
 * 
 * Events:
 * - "room:created" -> { roomId }
 * - "room:joined" -> { roomId }
 * - "room:error" -> { message }
 */

export default function createGameLobby(container) {
  if (!container) {
    throw new Error('Container element is required');
  }

  const eventListeners = new Map();
  let currentRoomId = null;
  let playerRole = null; // 'host' | 'guest' | null

  // ═══════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════

  /**
   * Generate a unique room ID
   */
  function generateRoomId() {
    return `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Parse room ID from URL query parameter
   */
  function getRoomIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('room');
  }

  /**
   * Get shareable URL for the current room
   */
  function getShareableUrl() {
    if (!currentRoomId) return null;
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?room=${encodeURIComponent(currentRoomId)}`;
  }

  // ═══════════════════════════════════════════════════════════
  // UI RENDERING
  // ═══════════════════════════════════════════════════════════

  /**
   * Render the lobby screen
   */
  function renderLobby() {
    injectStyles();

    container.innerHTML = '';
    const lobby = document.createElement('div');
    lobby.className = 'lobby-container';

    // Header
    const header = document.createElement('header');
    header.className = 'lobby-header';

    const title = document.createElement('h1');
    title.textContent = 'Tic Tac Toe';
    title.className = 'lobby-title';

    const subtitle = document.createElement('p');
    subtitle.textContent = 'Play live with friends';
    subtitle.className = 'lobby-subtitle';

    header.appendChild(title);
    header.appendChild(subtitle);

    // Content
    const content = document.createElement('div');
    content.className = 'lobby-content';

    // Create Game Button
    const createBtn = document.createElement('button');
    createBtn.className = 'lobby-button lobby-button-primary';
    createBtn.textContent = '🎮 Create New Game';
    createBtn.type = 'button';
    createBtn.addEventListener('click', handleCreateGame);

    // Divider
    const divider = document.createElement('div');
    divider.className = 'lobby-divider';
    divider.textContent = 'or';

    // Join Game Input
    const joinDiv = document.createElement('div');
    joinDiv.className = 'lobby-join-section';

    const joinLabel = document.createElement('label');
    joinLabel.textContent = 'Join with room code:';
    joinLabel.className = 'lobby-label';

    const joinInput = document.createElement('input');
    joinInput.type = 'text';
    joinInput.placeholder = 'e.g., room-1234567890-abc';
    joinInput.className = 'lobby-input';
    joinInput.id = 'room-input';

    const joinBtn = document.createElement('button');
    joinBtn.className = 'lobby-button lobby-button-secondary';
    joinBtn.textContent = '🔗 Join Game';
    joinBtn.type = 'button';
    joinBtn.addEventListener('click', () => handleJoinGame(joinInput.value));
    joinInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleJoinGame(joinInput.value);
    });

    joinDiv.appendChild(joinLabel);
    joinDiv.appendChild(joinInput);
    joinDiv.appendChild(joinBtn);

    content.appendChild(createBtn);
    content.appendChild(divider);
    content.appendChild(joinDiv);

    // Footer/Status
    const footer = document.createElement('footer');
    footer.className = 'lobby-footer';
    footer.textContent = '✨ Works offline • 📱 Installable on mobile';

    lobby.appendChild(header);
    lobby.appendChild(content);
    lobby.appendChild(footer);

    container.appendChild(lobby);
  }

  /**
   * Render the game room screen
   */
  function renderRoomInfo() {
    injectStyles();

    const roomPanel = document.createElement('div');
    roomPanel.className = 'room-info-panel';

    const roleIcon = playerRole === 'host' ? '👑' : '👤';
    const roleName = playerRole === 'host' ? 'Game Host' : 'Player';

    const roleDiv = document.createElement('div');
    roleDiv.className = 'room-role';
    roleDiv.innerHTML = `<span class="role-icon">${roleIcon}</span><span class="role-name">${roleName}</span>`;

    const roomIdDiv = document.createElement('div');
    roomIdDiv.className = 'room-id';
    roomIdDiv.textContent = `Room: ${currentRoomId}`;

    const shareUrl = getShareableUrl();
    const shareDiv = document.createElement('div');
    shareDiv.className = 'room-share';

    const shareInput = document.createElement('input');
    shareInput.type = 'text';
    shareInput.value = shareUrl;
    shareInput.readOnly = true;
    shareInput.className = 'room-share-input';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'room-share-btn';
    copyBtn.textContent = '📋 Copy';
    copyBtn.type = 'button';
    copyBtn.addEventListener('click', () => copyToClipboard(shareUrl, copyBtn));

    shareDiv.appendChild(shareInput);
    shareDiv.appendChild(copyBtn);

    roomPanel.appendChild(roleDiv);
    roomPanel.appendChild(roomIdDiv);
    roomPanel.appendChild(shareDiv);

    return roomPanel;
  }

  /**
   * Inject CSS styles
   */
  function injectStyles() {
    if (document.getElementById('lobby-styles')) return;

    const css = `
      .lobby-container {
        max-width: 500px;
        margin: 0 auto;
        padding: 20px;
        text-align: center;
        font-family: system-ui, -apple-system, 'Segoe UI', Roboto;
      }
      .lobby-header {
        margin-bottom: 30px;
      }
      .lobby-title {
        margin: 0 0 8px;
        font-size: 2.5rem;
        color: #2c3e50;
      }
      .lobby-subtitle {
        margin: 0;
        font-size: 1rem;
        color: #666;
      }
      .lobby-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 30px;
      }
      .lobby-button {
        padding: 14px 20px;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        user-select: none;
      }
      .lobby-button-primary {
        background: #0b5;
        color: #021;
      }
      .lobby-button-primary:hover {
        background: #09a;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 187, 85, 0.3);
      }
      .lobby-button-secondary {
        background: #f66;
        color: #300;
      }
      .lobby-button-secondary:hover {
        background: #e55;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255, 102, 102, 0.3);
      }
      .lobby-divider {
        font-size: 0.9rem;
        color: #999;
        position: relative;
        margin: 10px 0;
      }
      .lobby-divider::before,
      .lobby-divider::after {
        content: '';
        position: absolute;
        top: 50%;
        width: calc(50% - 20px);
        height: 1px;
        background: #ddd;
      }
      .lobby-divider::before {
        left: 0;
      }
      .lobby-divider::after {
        right: 0;
      }
      .lobby-join-section {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .lobby-label {
        text-align: left;
        font-size: 0.9rem;
        color: #333;
        font-weight: 500;
      }
      .lobby-input {
        padding: 10px 12px;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 0.95rem;
        font-family: monospace;
      }
      .lobby-input:focus {
        outline: none;
        border-color: #0b5;
        box-shadow: 0 0 0 3px rgba(0, 187, 85, 0.1);
      }
      .lobby-footer {
        font-size: 0.85rem;
        color: #999;
      }
      .room-info-panel {
        background: white;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        padding: 16px;
        margin: 12px 0;
        font-size: 0.9rem;
      }
      .room-role {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-bottom: 12px;
        font-weight: 600;
      }
      .role-icon {
        font-size: 1.5rem;
      }
      .role-name {
        color: #2c3e50;
      }
      .room-id {
        font-size: 0.85rem;
        color: #666;
        font-family: monospace;
        margin-bottom: 12px;
        word-break: break-all;
      }
      .room-share {
        display: flex;
        gap: 8px;
      }
      .room-share-input {
        flex: 1;
        padding: 8px 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 0.85rem;
        font-family: monospace;
        background: #f8f9fa;
      }
      .room-share-btn {
        padding: 8px 12px;
        background: #0b5;
        color: white;
        border: none;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
      }
      .room-share-btn:hover {
        background: #09a;
      }
      .room-share-btn.copied {
        background: #666;
      }
    `;

    const style = document.createElement('style');
    style.id = 'lobby-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  /**
   * Copy text to clipboard with visual feedback
   */
  function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
      const originalText = button.textContent;
      button.textContent = '✓ Copied!';
      button.classList.add('copied');
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('copied');
      }, 2000);
    });
  }

  // ═══════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ═══════════════════════════════════════════════════════════

  function handleCreateGame() {
    currentRoomId = generateRoomId();
    playerRole = 'host';
    emitEvent('room:created', { roomId: currentRoomId, role: playerRole });
  }

  function handleJoinGame(roomId) {
    if (!roomId || roomId.trim() === '') {
      emitEvent('room:error', { message: 'Please enter a room code' });
      return;
    }
    currentRoomId = roomId.trim();
    playerRole = 'guest';
    emitEvent('room:joined', { roomId: currentRoomId, role: playerRole });
  }

  // ═══════════════════════════════════════════════════════════
  // EVENTS
  // ═══════════════════════════════════════════════════════════

  function emitEvent(eventName, data) {
    if (eventListeners.has(eventName)) {
      eventListeners.get(eventName).forEach((handler) => {
        handler(data);
      });
    }
  }

  // ═══════════════════════════════════════════════════════════
  // PUBLIC API
  // ═══════════════════════════════════════════════════════════

  return {
    /**
     * Show the lobby screen
     */
    showLobby() {
      currentRoomId = null;
      playerRole = null;
      renderLobby();
    },

    /**
     * Show the game with room info panel
     */
    showGame(roomId, role = null) {
      currentRoomId = roomId;
      playerRole = role;
      return renderRoomInfo();
    },

    /**
     * Get current room ID
     */
    getRoomId() {
      return currentRoomId;
    },

    /**
     * Get current player role
     */
    getPlayerRole() {
      return playerRole;
    },

    /**
     * Get shareable URL
     */
    getShareableUrl() {
      return getShareableUrl();
    },

    /**
     * Check if room ID exists in URL
     */
    getRoomIdFromUrl() {
      return getRoomIdFromUrl();
    },

    /**
     * Register event listener
     */
    on(eventName, handler) {
      if (!eventListeners.has(eventName)) {
        eventListeners.set(eventName, []);
      }
      eventListeners.get(eventName).push(handler);
    },

    /**
     * Remove event listener
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

    /**
     * Set player role
     */
    setPlayerRole(role) {
      playerRole = role;
    },
  };
}
