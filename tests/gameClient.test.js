// tests/gameClient.test.js
import { getState, makeMove, resetGame } from '../src/gameEngine.js';
import initGameClient from '../src/gameClient.js';

// Mock the gameEngine to isolate client tests
jest.mock('../src/gameEngine.js');

describe('GameClient - Module Export', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  test('should export initGameClient as default and named export', () => {
    expect(typeof initGameClient).toBe('function');
  });

  test('should throw error if container is not found', () => {
    expect(() => {
      initGameClient('#non-existent-selector');
    }).toThrow('Container not found');
  });
});

describe('GameClient - CSS and DOM Structure', () => {
  let container;

  beforeEach(() => {
    jest.clearAllMocks();
    getState.mockReturnValue({
      board: ['', '', '', '', '', '', '', '', ''],
      currentPlayer: 'X',
      status: 'playing',
      winner: null
    });
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should inject CSS styles on initialization', () => {
    initGameClient(container);
    const style = document.getElementById('tic-tac-toe-styles');
    expect(style).not.toBeNull();
    expect(style.textContent).toContain('.tic-tac-toe');
  });

  test('should inject CSS styles only once', () => {
    initGameClient(container);
    const firstStyle = document.getElementById('tic-tac-toe-styles');
    
    const container2 = document.createElement('div');
    document.body.appendChild(container2);
    initGameClient(container2);
    const secondStyle = document.getElementById('tic-tac-toe-styles');
    
    expect(firstStyle).toBe(secondStyle);
  });

  test('should create main wrapper with correct class', () => {
    initGameClient(container);
    const wrapper = document.querySelector('.tic-tac-toe');
    expect(wrapper).not.toBeNull();
    expect(wrapper.className).toBe('tic-tac-toe');
  });

  test('should render 9 cells in the grid', () => {
    initGameClient(container);
    const cells = document.querySelectorAll('.tic-tac-toe-cell');
    expect(cells).toHaveLength(9);
  });

  test('should create a reset button', () => {
    initGameClient(container);
    const resetBtn = document.querySelector('.tic-tac-toe-button.secondary');
    expect(resetBtn).not.toBeNull();
    expect(resetBtn.textContent).toBe('Reset');
  });

  test('should create status display element with aria-live', () => {
    initGameClient(container);
    const status = document.querySelector('.tic-tac-toe-status');
    expect(status).not.toBeNull();
    expect(status.getAttribute('aria-live')).toBe('polite');
  });
});

describe('GameClient - Status Display', () => {
  let container;

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should display "Player X\'s turn" when it is X\'s turn', () => {
    getState.mockReturnValue({
      board: ['', '', '', '', '', '', '', '', ''],
      currentPlayer: 'X',
      status: 'playing',
      winner: null
    });
    
    initGameClient(container);
    const status = document.querySelector('.tic-tac-toe-status');
    expect(status.textContent).toBe("Player X's turn");
  });

  test('should display "Player O\'s turn" when it is O\'s turn', () => {
    getState.mockReturnValue({
      board: ['X', '', '', '', '', '', '', '', ''],
      currentPlayer: 'O',
      status: 'playing',
      winner: null
    });
    
    initGameClient(container);
    const status = document.querySelector('.tic-tac-toe-status');
    expect(status.textContent).toBe("Player O's turn");
  });

  test('should display "X Wins!" when X wins', () => {
    getState.mockReturnValue({
      board: ['X', 'X', 'X', 'O', 'O', '', '', '', ''],
      currentPlayer: 'O',
      status: 'win',
      winner: 'X'
    });
    
    initGameClient(container);
    const status = document.querySelector('.tic-tac-toe-status');
    expect(status.textContent).toBe('X Wins!');
  });

  test('should display "O Wins!" when O wins', () => {
    getState.mockReturnValue({
      board: ['X', 'X', 'O', 'X', 'O', '', '', '', 'O'],
      currentPlayer: 'X',
      status: 'win',
      winner: 'O'
    });
    
    initGameClient(container);
    const status = document.querySelector('.tic-tac-toe-status');
    expect(status.textContent).toBe('O Wins!');
  });

  test('should display "It\'s a tie." when game is tied', () => {
    getState.mockReturnValue({
      board: ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'],
      currentPlayer: 'X',
      status: 'tie',
      winner: null
    });
    
    initGameClient(container);
    const status = document.querySelector('.tic-tac-toe-status');
    expect(status.textContent).toBe("It's a tie.");
  });
});

describe('GameClient - Board Rendering', () => {
  let container;

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should display empty cells initially', () => {
    getState.mockReturnValue({
      board: ['', '', '', '', '', '', '', '', ''],
      currentPlayer: 'X',
      status: 'playing',
      winner: null
    });
    
    initGameClient(container);
    const cells = document.querySelectorAll('.tic-tac-toe-cell');
    cells.forEach(cell => {
      expect(cell.textContent).toBe('');
    });
  });

  test('should display board state with X and O', () => {
    getState.mockReturnValue({
      board: ['X', 'O', '', 'X', '', 'O', '', '', ''],
      currentPlayer: 'X',
      status: 'playing',
      winner: null
    });
    
    initGameClient(container);
    const cells = document.querySelectorAll('.tic-tac-toe-cell');
    expect(cells[0].textContent).toBe('X');
    expect(cells[1].textContent).toBe('O');
    expect(cells[2].textContent).toBe('');
    expect(cells[3].textContent).toBe('X');
    expect(cells[4].textContent).toBe('');
    expect(cells[5].textContent).toBe('O');
  });

  test('should add disabled class to occupied cells', () => {
    getState.mockReturnValue({
      board: ['X', '', '', '', '', '', '', '', ''],
      currentPlayer: 'O',
      status: 'playing',
      winner: null
    });
    
    initGameClient(container);
    const cells = document.querySelectorAll('.tic-tac-toe-cell');
    expect(cells[0].classList.contains('disabled')).toBe(true);
    expect(cells[1].classList.contains('disabled')).toBe(false);
  });

  test('should add disabled class to all cells when game is won', () => {
    getState.mockReturnValue({
      board: ['X', 'X', 'X', 'O', 'O', '', '', '', ''],
      currentPlayer: 'O',
      status: 'win',
      winner: 'X'
    });
    
    initGameClient(container);
    const cells = document.querySelectorAll('.tic-tac-toe-cell');
    cells.forEach(cell => {
      expect(cell.classList.contains('disabled')).toBe(true);
    });
  });

  test('should add disabled class to all cells when game is tied', () => {
    getState.mockReturnValue({
      board: ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'],
      currentPlayer: 'X',
      status: 'tie',
      winner: null
    });
    
    initGameClient(container);
    const cells = document.querySelectorAll('.tic-tac-toe-cell');
    cells.forEach(cell => {
      expect(cell.classList.contains('disabled')).toBe(true);
    });
  });
});

describe('GameClient - User Interactions', () => {
  let container;

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
    
    getState.mockReturnValue({
      board: ['', '', '', '', '', '', '', '', ''],
      currentPlayer: 'X',
      status: 'playing',
      winner: null
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should call makeMove with correct index when cell is clicked', () => {
    initGameClient(container);
    const cells = document.querySelectorAll('.tic-tac-toe-cell');
    
    cells[4].click();
    
    expect(makeMove).toHaveBeenCalledWith(4);
  });

  test('should call makeMove for each cell click on different cells', () => {
    initGameClient(container);
    const cells = document.querySelectorAll('.tic-tac-toe-cell');
    
    cells[0].click();
    expect(makeMove).toHaveBeenCalledWith(0);
    
    cells[8].click();
    expect(makeMove).toHaveBeenCalledWith(8);
  });

  test('should call resetGame when reset button is clicked', () => {
    initGameClient(container);
    const resetBtn = document.querySelector('.tic-tac-toe-button.secondary');
    
    resetBtn.click();
    
    expect(resetGame).toHaveBeenCalled();
  });

  test('should not call makeMove if cell is disabled', () => {
    getState.mockReturnValue({
      board: ['X', '', '', '', '', '', '', '', ''],
      currentPlayer: 'O',
      status: 'playing',
      winner: null
    });
    
    initGameClient(container);
    const cells = document.querySelectorAll('.tic-tac-toe-cell');
    
    cells[0].click(); // Try to click occupied cell
    
    expect(makeMove).toHaveBeenCalledWith(0); // Still called, game logic handles rejection
  });
});

describe('GameClient - Re-rendering', () => {
  let container;

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should re-render when game state changes', (done) => {
    const initialState = {
      board: ['', '', '', '', '', '', '', '', ''],
      currentPlayer: 'X',
      status: 'playing',
      winner: null
    };
    
    getState.mockReturnValue(initialState);
    initGameClient(container);
    
    let cells = document.querySelectorAll('.tic-tac-toe-cell');
    expect(cells[0].textContent).toBe('');
    
    // Simulate state change
    const newState = {
      board: ['X', '', '', '', '', '', '', '', ''],
      currentPlayer: 'O',
      status: 'playing',
      winner: null
    };
    getState.mockReturnValue(newState);
    
    // Wait for polling to detect change
    setTimeout(() => {
      cells = document.querySelectorAll('.tic-tac-toe-cell');
      expect(cells[0].textContent).toBe('X');
      done();
    }, 200);
  });

  test('should expose a refresh method to manually trigger re-render', () => {
    const initialState = {
      board: ['', '', '', '', '', '', '', '', ''],
      currentPlayer: 'X',
      status: 'playing',
      winner: null
    };
    
    getState.mockReturnValue(initialState);
    const client = initGameClient(container);
    
    expect(typeof client.refresh).toBe('function');
    
    const newState = {
      board: ['X', '', '', '', '', '', '', '', ''],
      currentPlayer: 'O',
      status: 'playing',
      winner: null
    };
    getState.mockReturnValue(newState);
    
    client.refresh();
    const cells = document.querySelectorAll('.tic-tac-toe-cell');
    expect(cells[0].textContent).toBe('X');
  });

  test('should expose a destroy method to clean up resources', () => {
    const initialState = {
      board: ['', '', '', '', '', '', '', '', ''],
      currentPlayer: 'X',
      status: 'playing',
      winner: null
    };
    
    getState.mockReturnValue(initialState);
    const client = initGameClient(container);
    
    expect(typeof client.destroy).toBe('function');
    
    const wrapper = document.querySelector('.tic-tac-toe');
    expect(wrapper).not.toBeNull();
    
    client.destroy();
    
    expect(document.querySelector('.tic-tac-toe')).toBeNull();
  });
});

describe('GameClient - String Selector Support', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
    getState.mockReturnValue({
      board: ['', '', '', '', '', '', '', '', ''],
      currentPlayer: 'X',
      status: 'playing',
      winner: null
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should accept a string selector and find the container', () => {
    const container = document.createElement('div');
    container.id = 'game-container';
    document.body.appendChild(container);
    
    initGameClient('#game-container');
    const wrapper = document.querySelector('.tic-tac-toe');
    expect(wrapper).not.toBeNull();
    expect(wrapper.parentElement.id).toBe('game-container');
  });
});
