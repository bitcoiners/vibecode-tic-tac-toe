/**
 * AI Opponent Module
 * Follows coding standards: immutability, pure functions, error handling
 */

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
     * @param {Array} gameBoard - Current game board state
     * @returns {Object} {row, col} coordinates for next move
     */
    getNextMove: (gameBoard) => {
      // Pure function - doesn't mutate input (immutability rule)
      const availableMoves = [];
      
      // Find all empty cells
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (!gameBoard[row][col]) {
            availableMoves.push({ row, col });
          }
        }
      }

      // For now: random move (easy difficulty)
      // Will be enhanced in IMPROVE phase
      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      return availableMoves[randomIndex] || { row: 0, col: 0 };
    },

    // Can add more methods later for different difficulties
    getDifficulty: () => difficulty,
  };
}
