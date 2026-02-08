// tests/gameLobby.test.js
import createGameLobby from '../src/client/gameLobby.js';

describe('GameLobby - Module Initialization', () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should export createGameLobby as a function', () => {
    expect(typeof createGameLobby).toBe('function');
  });

  test('should throw error if container is not provided', () => {
    expect(() => createGameLobby()).toThrow('Container element is required');
  });

  test('should return an object with public API', () => {
    const lobby = createGameLobby(container);
    expect(typeof lobby).toBe('object');
    expect(typeof lobby.showLobby).toBe('function');
    expect(typeof lobby.showGame).toBe('function');
  });
});

describe('GameLobby - Lobby Display', () => {
  let container;
  let lobby;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
    lobby = createGameLobby(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should render lobby screen', () => {
    lobby.showLobby();
    expect(container.querySelector('.lobby-container')).not.toBeNull();
  });

  test('should have title and subtitle', () => {
    lobby.showLobby();
    const title = container.querySelector('.lobby-title');
    const subtitle = container.querySelector('.lobby-subtitle');
    expect(title.textContent).toBe('Tic Tac Toe');
    expect(subtitle.textContent).toBe('Play live with friends');
  });

  test('should have "Create New Game" button', () => {
    lobby.showLobby();
    const createBtn = container.querySelector('.lobby-button-primary');
    expect(createBtn).not.toBeNull();
    expect(createBtn.textContent).toContain('Create New Game');
  });

  test('should have "Join Game" section with input and button', () => {
    lobby.showLobby();
    const joinSection = container.querySelector('.lobby-join-section');
    const input = container.querySelector('.lobby-input');
    const joinBtn = container.querySelector('.lobby-button-secondary');
    
    expect(joinSection).not.toBeNull();
    expect(input).not.toBeNull();
    expect(joinBtn.textContent).toContain('Join Game');
  });

  test('should inject CSS styles only once', () => {
    lobby.showLobby();
    const firstStyle = document.getElementById('lobby-styles');
    
    lobby.showLobby();
    const secondStyle = document.getElementById('lobby-styles');
    
    expect(firstStyle).toBe(secondStyle);
  });
});

describe('GameLobby - Create Game', () => {
  let container;
  let lobby;
  let roomCreatedData;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
    lobby = createGameLobby(container);
    
    lobby.on('room:created', (data) => {
      roomCreatedData = data;
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should emit room:created event when "Create Game" is clicked', () => {
    lobby.showLobby();
    const createBtn = container.querySelector('.lobby-button-primary');
    
    createBtn.click();
    
    expect(roomCreatedData).toBeDefined();
    expect(roomCreatedData.roomId).toBeDefined();
    expect(roomCreatedData.role).toBe('host');
  });

  test('should generate unique room IDs', () => {
    const lobby1 = createGameLobby(container);
    const lobby2 = createGameLobby(container);
    
    let roomId1;
    let roomId2;
    
    lobby1.on('room:created', (data) => {
      roomId1 = data.roomId;
    });
    lobby2.on('room:created', (data) => {
      roomId2 = data.roomId;
    });
    
    lobby1.showLobby();
    container.querySelector('.lobby-button-primary').click();
    
    lobby2.showLobby();
    container.querySelector('.lobby-button-primary').click();
    
    expect(roomId1).not.toBe(roomId2);
  });

  test('should set player role to "host" when creating game', () => {
    lobby.showLobby();
    const createBtn = container.querySelector('.lobby-button-primary');
    
    createBtn.click();
    
    expect(lobby.getPlayerRole()).toBe('host');
  });

  test('should store current room ID when game is created', () => {
    lobby.showLobby();
    const createBtn = container.querySelector('.lobby-button-primary');
    
    createBtn.click();
    
    expect(lobby.getRoomId()).toBeDefined();
    expect(lobby.getRoomId()).toBe(roomCreatedData.roomId);
  });
});

describe('GameLobby - Join Game', () => {
  let container;
  let lobby;
  let roomJoinedData;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
    lobby = createGameLobby(container);
    
    lobby.on('room:joined', (data) => {
      roomJoinedData = data;
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should emit room:joined event when "Join Game" is clicked', () => {
    lobby.showLobby();
    const input = container.querySelector('.lobby-input');
    const joinBtn = container.querySelector('.lobby-button-secondary');
    
    input.value = 'room-123';
    joinBtn.click();
    
    expect(roomJoinedData).toBeDefined();
    expect(roomJoinedData.roomId).toBe('room-123');
    expect(roomJoinedData.role).toBe('guest');
  });

  test('should set player role to "guest" when joining game', () => {
    lobby.showLobby();
    const input = container.querySelector('.lobby-input');
    const joinBtn = container.querySelector('.lobby-button-secondary');
    
    input.value = 'room-xyz';
    joinBtn.click();
    
    expect(lobby.getPlayerRole()).toBe('guest');
  });

  test('should emit error when no room ID is provided', (done) => {
    lobby.on('room:error', (data) => {
      expect(data.message).toContain('Please enter a room code');
      done();
    });
    
    lobby.showLobby();
    const joinBtn = container.querySelector('.lobby-button-secondary');
    joinBtn.click();
  });

  test('should allow joining via Enter key in input', (done) => {
    lobby.on('room:joined', (data) => {
      expect(data.roomId).toBe('room-test');
      done();
    });
    
    lobby.showLobby();
    const input = container.querySelector('.lobby-input');
    input.value = 'room-test';
    input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
  });
});

describe('GameLobby - Game Display', () => {
  let container;
  let lobby;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
    lobby = createGameLobby(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should render room info panel when showGame is called', () => {
    const roomPanel = lobby.showGame('room-123', 'host');
    expect(roomPanel.classList.contains('room-info-panel')).toBe(true);
  });

  test('should display host role in room info', () => {
    const roomPanel = lobby.showGame('room-123', 'host');
    expect(roomPanel.textContent).toContain('Game Host');
    expect(roomPanel.textContent).toContain('👑');
  });

  test('should display guest role in room info', () => {
    const roomPanel = lobby.showGame('room-123', 'guest');
    expect(roomPanel.textContent).toContain('Player');
    expect(roomPanel.textContent).toContain('👤');
  });

  test('should display room ID in room info', () => {
    const roomPanel = lobby.showGame('room-abc123', 'host');
    expect(roomPanel.textContent).toContain('room-abc123');
  });

  test('should generate shareable URL', () => {
    lobby.showGame('room-test-123', 'host');
    const shareUrl = lobby.getShareableUrl();
    
    expect(shareUrl).toContain(window.location.origin);
    expect(shareUrl).toContain('room=room-test-123');
  });
});

describe('GameLobby - Room Management', () => {
  let container;
  let lobby;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
    lobby = createGameLobby(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should return null room ID before any action', () => {
    expect(lobby.getRoomId()).toBeNull();
  });

  test('should return null player role before any action', () => {
    expect(lobby.getPlayerRole()).toBeNull();
  });

  test('should update room ID and role when game is created', () => {
    lobby.showLobby();
    const createBtn = container.querySelector('.lobby-button-primary');
    createBtn.click();
    
    expect(lobby.getRoomId()).not.toBeNull();
    expect(lobby.getPlayerRole()).toBe('host');
  });

  test('should update room ID and role when game is joined', () => {
    lobby.showLobby();
    const input = container.querySelector('.lobby-input');
    const joinBtn = container.querySelector('.lobby-button-secondary');
    
    input.value = 'room-joined';
    joinBtn.click();
    
    expect(lobby.getRoomId()).toBe('room-joined');
    expect(lobby.getPlayerRole()).toBe('guest');
  });

  test('should allow setting player role', () => {
    lobby.setPlayerRole('spectator');
    expect(lobby.getPlayerRole()).toBe('spectator');
  });

  test('should reset room ID and role when showing lobby', () => {
    lobby.showGame('room-123', 'host');
    expect(lobby.getRoomId()).toBe('room-123');
    
    lobby.showLobby();
    expect(lobby.getRoomId()).toBeNull();
    expect(lobby.getPlayerRole()).toBeNull();
  });
});

describe('GameLobby - Event System', () => {
  let container;
  let lobby;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
    lobby = createGameLobby(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should support event listeners', () => {
    let called = false;
    lobby.on('room:created', () => {
      called = true;
    });
    
    lobby.showLobby();
    container.querySelector('.lobby-button-primary').click();
    
    expect(called).toBe(true);
  });

  test('should support removing event listeners', () => {
    let callCount = 0;
    const handler = () => {
      callCount++;
    };
    
    lobby.on('room:created', handler);
    lobby.off('room:created', handler);
    
    lobby.showLobby();
    container.querySelector('.lobby-button-primary').click();
    
    expect(callCount).toBe(0);
  });

  test('should allow multiple listeners for same event', (done) => {
    let count = 0;
    
    lobby.on('room:created', () => {
      count++;
    });
    lobby.on('room:created', () => {
      count++;
    });
    
    lobby.showLobby();
    container.querySelector('.lobby-button-primary').click();
    
    setTimeout(() => {
      expect(count).toBe(2);
      done();
    }, 0);
  });
});
