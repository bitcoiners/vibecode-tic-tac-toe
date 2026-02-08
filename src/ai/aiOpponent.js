/**
 * AI Opponent Module - Enhanced with difficulty levels
 * IMPROVE Phase: Complete implementation with 80%+ coverage
 */

// Helper functions (pure, immutable)
const getEmptyCells = (board) => {
  if (!board || !Array.isArray(board) || board.length !== 3) {
    throw new Error('Invalid board: must be 3x3 array');
  }
  
  const emptyCells = [];
  for (let row = 0; row < 3; row++) {
    if (!Array.isArray(board[row]) || board[row].length !== 3) {
      throw new Error(`Invalid board row ${row}: must have 3 columns`);
    }
    for (let col = 0; col < 3; col++) {
      if (!board[row][col]) {
        emptyCells.push({ row, col });
      }
    }
  }
  return emptyCells;
};

const getRandomMove = (board) => {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
};

const checkLine = (board, cells) => {
  const [a, b, c] = cells;
  if (board[a.row][a.col] && 
      board[a.row][a.col] === board[b.row][b.col] && 
      board[a.row][a.col] === board[c.row][c.col]) {
    return board[a.row][a.col];
  }
  return null;
};

const getWinningLines = () => [
  // Rows
  [{row:0,col:0},{row:0,col:1},{row:0,col:2}],
  [{row:1,col:0},{row:1,col:1},{row:1,col:2}],
  [{row:2,col:0},{row:2,col:1},{row:2,col:2}],
  // Columns
  [{row:0,col:0},{row:1,col:0},{row:2,col:0}],
  [{row:0,col:1},{row:1,col:1},{row:2,col:1}],
  [{row:0,col:2},{row:1,col:2},{row:2,col:2}],
  // Diagonals
  [{row:0,col:0},{row:1,col:1},{row:2,col:2}],
  [{row:0,col:2},{row:1,col:1},{row:2,col:0}]
];

const getStrategicMove = (board, player) => {
  const emptyCells = getEmptyCells(board);
  const lines = getWinningLines();
  
  // 1. Check for winning move
  for (const cell of emptyCells) {
    const testBoard = board.map(row => [...row]);
    testBoard[cell.row][cell.col] = player;
    
    for (const line of lines) {
      const winner = checkLine(testBoard, line);
      if (winner === player) {
        return cell;
      }
    }
  }
  
  // 2. Check for blocking move (opponent is 'X' or 'O' opposite to player)
  const opponent = player === 'X' ? 'O' : 'X';
  for (const cell of emptyCells) {
    const testBoard = board.map(row => [...row]);
    testBoard[cell.row][cell.col] = opponent;
    
    for (const line of lines) {
      const winner = checkLine(testBoard, line);
      if (winner === opponent) {
        return cell;
      }
    }
  }
  
  // 3. Prefer center
  if (board[1][1] === '') {
    return { row: 1, col: 1 };
  }
  
  // 4. Prefer corners
  const corners = [
    {row:0,col:0}, {row:0,col:2},
    {row:2,col:0}, {row:2,col:2}
  ];
  const emptyCorners = corners.filter(corner => 
    emptyCells.some(cell => cell.row === corner.row && cell.col === corner.col)
  );
  if (emptyCorners.length > 0) {
    return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
  }
  
  // 5. Random move
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

// Minimax implementation for hard difficulty
const evaluateBoard = (board) => {
  const lines = getWinningLines();
  
  for (const line of lines) {
    const winner = checkLine(board, line);
    if (winner === 'X') return -10; // Assuming AI is 'O'
    if (winner === 'O') return 10;
  }
  
  return 0; // Draw or ongoing
};

const minimax = (board, depth, isMaximizing, alpha = -Infinity, beta = Infinity) => {
  const score = evaluateBoard(board);
  const emptyCells = getEmptyCells(board);
  
  // Terminal states
  if (score === 10) return score - depth;
  if (score === -10) return score + depth;
  if (emptyCells.length === 0) return 0;
  
  if (isMaximizing) {
    let best = -Infinity;
    for (const cell of emptyCells) {
      const newBoard = board.map(row => [...row]);
      newBoard[cell.row][cell.col] = 'O';
      best = Math.max(best, minimax(newBoard, depth + 1, false, alpha, beta));
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return best;
  } else {
    let best = Infinity;
    for (const cell of emptyCells) {
      const newBoard = board.map(row => [...row]);
      newBoard[cell.row][cell.col] = 'X';
      best = Math.min(best, minimax(newBoard, depth + 1, true, alpha, beta));
      beta = Math.min(beta, best);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return best;
  }
};

const getMinimaxMove = (board) => {
  const emptyCells = getEmptyCells(board);
  let bestMove = null;
  let bestValue = -Infinity;
  
  for (const cell of emptyCells) {
    const newBoard = board.map(row => [...row]);
    newBoard[cell.row][cell.col] = 'O'; // AI is 'O'
    const moveValue = minimax(newBoard, 0, false);
    
    if (moveValue > bestValue) {
      bestValue = moveValue;
      bestMove = cell;
    }
  }
  
  return bestMove || emptyCells[0];
};

/**
 * Create AI opponent with specified difficulty
 * @param {string} difficulty - 'easy', 'medium', or 'hard'
 * @returns {Object} AI opponent with getNextMove method
 * @throws {Error} If invalid difficulty level
 */
export function createAIOpponent(difficulty) {
  // Input validation (error handling rule)
  const validDifficulties = ['easy', 'medium', 'hard'];
  if (!validDifficulties.includes(difficulty)) {
    throw new Error('Invalid difficulty level. Must be: easy, medium, hard');
  }

  // Return immutable object (immutability rule)
  return {
    /**
     * Get next move from AI
     * @param {Array} gameBoard - Current 3x3 game board state
     * @returns {Object|null} {row, col} coordinates for next move, or null if board full
     * @throws {Error} If board is invalid
     */
    getNextMove: (gameBoard) => {
      // Validate board structure
      if (!gameBoard || !Array.isArray(gameBoard) || gameBoard.length !== 3) {
        throw new Error('Board must be a 3x3 array');
      }
      
      for (let i = 0; i < 3; i++) {
        if (!Array.isArray(gameBoard[i]) || gameBoard[i].length !== 3) {
          throw new Error(`Board row ${i} must be an array of 3 elements`);
        }
      }
      
      const emptyCells = getEmptyCells(gameBoard);
      if (emptyCells.length === 0) {
        return null; // Board is full
      }
      
      switch (difficulty) {
        case 'easy':
          return getRandomMove(gameBoard);
          
        case 'medium':
          // Medium: strategic but not perfect (uses 'O' as AI player)
          return getStrategicMove(gameBoard, 'O');
          
        case 'hard':
          // Hard: perfect minimax algorithm
          return getMinimaxMove(gameBoard);
          
        default:
          return getRandomMove(gameBoard);
      }
    },

    /**
     * Get configured difficulty level
     * @returns {string} Difficulty level
     */
    getDifficulty: () => difficulty,
    
    /**
     * Get empty cells helper (exposed for testing)
     * @private
     */
    _getEmptyCells: getEmptyCells,
  };
}
