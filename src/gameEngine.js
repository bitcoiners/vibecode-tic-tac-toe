// src/gameEngine.js

// Game state (private)
let gameState = {
  board: ['', '', '', '', '', '', '', '', ''],
  currentPlayer: 'X',
  status: 'playing',
  winner: null
};

// Private helper function
function updateGameStatus() {
  const result = checkGameStatus(gameState.board);
  gameState.status = result.status;
  gameState.winner = result.winner;
}

// Public API functions
export function checkGameStatus(board) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const [a, b, c] of winPatterns) {
    if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
      return { status: 'win', winner: board[a] };
    }
  }

  if (board.every(cell => cell !== '')) {
    return { status: 'tie', winner: null };
  }

  return { status: 'playing', winner: null };
}

export function getState() {
  return { ...gameState }; // Return a copy to prevent direct mutation
}

export function makeMove(cellIndex) {
  // Validate move
  if (cellIndex < 0 || cellIndex > 8) return; // Out of bounds
  if (gameState.status !== 'playing') return; // Game ended
  if (gameState.board[cellIndex] !== '') return; // Cell occupied

  // Make the move
  gameState.board[cellIndex] = gameState.currentPlayer;
  
  // Update game status
  updateGameStatus();
  
  // Switch player if game is still playing
  if (gameState.status === 'playing') {
    gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
  }
}

export function resetGame() {
  gameState = {
    board: ['', '', '', '', '', '', '', '', ''],
    currentPlayer: 'X',
    status: 'playing',
    winner: null
  };
}

export function applyRemoteState(remoteState) {
  // Validate remote state
  if (!remoteState || typeof remoteState !== 'object') return;
  if (!Array.isArray(remoteState.board) || remoteState.board.length !== 9) return;
  if (!['X', 'O'].includes(remoteState.currentPlayer)) return;
  if (!['playing', 'win', 'tie'].includes(remoteState.status)) return;

  // Replace local state with remote state
  gameState = {
    board: [...remoteState.board],
    currentPlayer: remoteState.currentPlayer,
    status: remoteState.status,
    winner: remoteState.winner || null
  };
}