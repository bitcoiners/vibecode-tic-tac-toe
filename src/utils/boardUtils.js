/**
 * Board Format Utilities
 * Convert between 1D (gameEngine) and 2D (AI) board formats
 */

/**
 * Convert 1D board (9 elements) to 2D board (3x3)
 * @param {Array} board1D - 1D array of 9 elements
 * @returns {Array} 2D 3x3 array
 * @throws {Error} If board is not valid 1D array
 */
export function convert1DTo2D(board1D) {
  if (!Array.isArray(board1D) || board1D.length !== 9) {
    throw new Error('Board must be 1D array with 9 elements');
  }

  const board2D = [[], [], []];
  
  for (let i = 0; i < 9; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    board2D[row][col] = board1D[i];
  }
  
  return board2D;
}

/**
 * Convert 2D board (3x3) to 1D board (9 elements)
 * @param {Array} board2D - 2D 3x3 array
 * @returns {Array} 1D array of 9 elements
 * @throws {Error} If board is not valid 3x3 array
 */
export function convert2DTo1D(board2D) {
  if (!Array.isArray(board2D) || board2D.length !== 3) {
    throw new Error('Board must be 2D 3x3 array');
  }

  const board1D = [];
  
  for (let row = 0; row < 3; row++) {
    if (!Array.isArray(board2D[row]) || board2D[row].length !== 3) {
      throw new Error(`Board row ${row} must have 3 elements`);
    }
    
    for (let col = 0; col < 3; col++) {
      board1D.push(board2D[row][col]);
    }
  }
  
  return board1D;
}

/**
 * Convert AI move format {row, col} to cell index (0-8)
 * @param {Object} move - AI move with row and col properties
 * @returns {number} Cell index (0-8)
 */
export function convertMoveToIndex(move) {
  if (!move || typeof move.row !== 'number' || typeof move.col !== 'number') {
    throw new Error('Move must have row and col properties');
  }
  
  if (move.row < 0 || move.row > 2 || move.col < 0 || move.col > 2) {
    throw new Error('Move coordinates must be between 0 and 2');
  }
  
  return move.row * 3 + move.col;
}

/**
 * Convert cell index (0-8) to AI move format {row, col}
 * @param {number} index - Cell index (0-8)
 * @returns {Object} Move with row and col properties
 */
export function convertIndexToMove(index) {
  if (typeof index !== 'number' || index < 0 || index > 8) {
    throw new Error('Index must be number between 0 and 8');
  }
  
  return {
    row: Math.floor(index / 3),
    col: index % 3
  };
}
