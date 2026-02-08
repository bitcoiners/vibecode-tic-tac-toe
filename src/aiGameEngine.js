/**
 * AI Game Engine Wrapper
 * Provides single-player AI mode using existing gameEngine API
 */
import { 
  getState, 
  makeMove as engineMakeMove, 
  resetGame
} from './engine/gameEngine.js';
import { createAIOpponent } from './ai/aiOpponent.js';
import { convert1DTo2D, convertMoveToIndex } from './boardUtils.js';

let aiPlayer = null;
let gameMode = 'multiplayer';
let aiDifficulty = 'easy';

/**
 * Create a new game engine with AI support
 */
export function createAIGameEngine() {
  return {
    makeMove,
    getState: getGameState,
    resetGame: resetGameWithMode,
    setGameMode,
    makeAIMove,
    getGameMode: () => gameMode
  };
}

/**
 * Get extended game state including AI mode
 */
function getGameState() {
  const baseState = getState();
  return {
    ...baseState,
    gameMode,
    aiDifficulty: gameMode === 'singleplayer' ? aiDifficulty : null
  };
}

/**
 * Make a move with AI support
 */
export function makeMove(cellIndex) {
  // Make the human move
  engineMakeMove(cellIndex);
  
  // Get current state to check if we should trigger AI
  const state = getState();
  
  // If single-player mode and game is still playing, trigger AI move
  if (gameMode === 'singleplayer' && aiPlayer && state.status === 'playing') {
    // Check if it's now AI's turn (O)
    if (state.currentPlayer === 'O') {
      // AI's turn - make move after a short delay
      setTimeout(() => {
        makeAIMove();
      }, 500);
    }
  }
}

/**
 * Make an AI move
 */
export function makeAIMove() {
  if (gameMode !== 'singleplayer' || !aiPlayer) {
    throw new Error('AI move only available in singleplayer mode');
  }
  
  const state = getState();
  
  // Only proceed if it's AI's turn and game is still playing
  if (state.status !== 'playing' || state.currentPlayer !== 'O') {
    return false;
  }
  
  try {
    // Convert board to 2D for AI
    const board2D = convert1DTo2D(state.board);
    
    // Get AI move
    const aiMove = aiPlayer.getNextMove(board2D);
    
    if (aiMove === null) {
      // No valid moves - game might be over
      return false;
    }
    
    // Convert AI move to cell index and make it
    const cellIndex = convertMoveToIndex(aiMove);
    engineMakeMove(cellIndex);
    return true;
  } catch (error) {
    console.error('AI move error:', error);
    return false;
  }
}

/**
 * Set game mode (multiplayer or singleplayer)
 */
export function setGameMode(mode, difficulty = 'easy') {
  if (!['multiplayer', 'singleplayer'].includes(mode)) {
    throw new Error('Game mode must be "multiplayer" or "singleplayer"');
  }
  
  gameMode = mode;
  
  if (mode === 'singleplayer') {
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      throw new Error('Difficulty must be easy, medium, or hard');
    }
    aiDifficulty = difficulty;
    aiPlayer = createAIOpponent(difficulty);
  } else {
    aiDifficulty = null;
    aiPlayer = null;
  }
  
  // Reset the game for new mode
  resetGame();
}

/**
 * Reset game while preserving game mode
 */
function resetGameWithMode() {
  resetGame();
  // Game mode and AI settings are preserved
}
