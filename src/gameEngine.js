// src/gameEngine.js

/**
 * Check the status of a Tic-Tac-Toe board.
 * @param {Array} board - A flat array of 9 strings representing the board.
 * @returns {Object} {status: 'win'|'tie'|'playing', winner: 'X'|'O'|null}
 */
export function checkGameStatus(board) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  // Check for a win
  for (const [a, b, c] of winPatterns) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        status: 'win',
        winner: board[a]
      };
    }
  }

  // Check for tie (board full with no winner)
  if (board.every(cell => cell !== '')) {
    return {
      status: 'tie',
      winner: null
    };
  }

  // Game is still in progress
  return {
    status: 'playing',
    winner: null
  };
}

// Note: We'll add makeMove, getState, resetGame later