/**
 * Standardized error handling for Tic-Tac-Toe game
 */

/**
 * GameError - Custom error class for game-related errors
 */
export class GameError extends Error {
  /**
   * Create a new GameError
   * @param {string} message - Error message
   * @param {string} code - Error code from ERROR_CODES
   */
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = 'GameError';
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Error codes for consistent error handling
 */
export const ERROR_CODES = {
  // Game engine errors
  INVALID_MOVE: 'INVALID_MOVE',
  GAME_OVER: 'GAME_OVER',
  CELL_OCCUPIED: 'CELL_OCCUPIED',
  INVALID_BOARD: 'INVALID_BOARD',
  INVALID_PLAYER: 'INVALID_PLAYER',
  
  // AI errors
  AI_NO_VALID_MOVE: 'AI_NO_VALID_MOVE',
  INVALID_DIFFICULTY: 'INVALID_DIFFICULTY',
  
  // Game mode errors
  INVALID_GAME_MODE: 'INVALID_GAME_MODE',
  AI_NOT_AVAILABLE: 'AI_NOT_AVAILABLE',
  
  // Validation errors
  INVALID_INDEX: 'INVALID_INDEX',
  INVALID_COORDINATES: 'INVALID_COORDINATES',
  INVALID_BOARD_FORMAT: 'INVALID_BOARD_FORMAT'
};

/**
 * Check if an error is a GameError
 * @param {Error} error - Error to check
 * @returns {boolean} True if error is a GameError
 */
export function isGameError(error) {
  return error && error.name === 'GameError';
}
