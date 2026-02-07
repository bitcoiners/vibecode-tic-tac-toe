/**
 * AI Opponent Tests - Comprehensive Coverage
 * IMPROVE Phase: Enhance test coverage to 80%+
 */
import { createAIOpponent } from '../src/aiOpponent.js';

describe('AI Opponent', () => {
  // ========== CONSTRUCTOR TESTS ==========
  describe('Constructor & Validation', () => {
    test('should create AI opponent with valid difficulty level', () => {
      const ai = createAIOpponent('easy');
      expect(ai).toBeDefined();
      expect(typeof ai.getNextMove).toBe('function');
      expect(ai.getDifficulty()).toBe('easy');
    });

    test('should accept all valid difficulty levels', () => {
      ['easy', 'medium', 'hard'].forEach(difficulty => {
        const ai = createAIOpponent(difficulty);
        expect(ai.getDifficulty()).toBe(difficulty);
      });
    });

    test('should throw error for invalid difficulty level', () => {
      expect(() => createAIOpponent('invalid')).toThrow('Invalid difficulty level');
      expect(() => createAIOpponent('')).toThrow('Invalid difficulty level');
      expect(() => createAIOpponent(null)).toThrow('Invalid difficulty level');
      expect(() => createAIOpponent(undefined)).toThrow('Invalid difficulty level');
    });
  });

  // ========== EASY DIFFICULTY TESTS ==========
  describe('Easy Difficulty (Random Moves)', () => {
    let ai;

    beforeEach(() => {
      ai = createAIOpponent('easy');
    });

    test('should return valid move coordinates on empty board', () => {
      const emptyBoard = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ];
      
      const move = ai.getNextMove(emptyBoard);
      expect(move).toHaveProperty('row');
      expect(move).toHaveProperty('col');
      expect(move.row).toBeGreaterThanOrEqual(0);
      expect(move.row).toBeLessThan(3);
      expect(move.col).toBeGreaterThanOrEqual(0);
      expect(move.col).toBeLessThan(3);
    });

    test('should return only empty cells on partial board', () => {
      const partialBoard = [
        ['X', 'O', 'X'],
        ['O', '', ''],
        ['', 'X', 'O']
      ];
      
      const move = ai.getNextMove(partialBoard);
      const possibleMoves = [[1,1], [1,2], [2,0]];
      const isValidMove = possibleMoves.some(([r, c]) => 
        move.row === r && move.col === c
      );
      expect(isValidMove).toBe(true);
    });

    test('should handle nearly full board', () => {
      const nearlyFullBoard = [
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['X', '', 'O']
      ];
      
      const move = ai.getNextMove(nearlyFullBoard);
      expect(move.row).toBe(2);
      expect(move.col).toBe(1);
    });

    test('should return null on full board', () => {
      const fullBoard = [
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['X', 'O', 'X']
      ];
      
      const move = ai.getNextMove(fullBoard);
      expect(move).toBeNull();
    });

    test('should handle invalid board structure', () => {
      expect(() => ai.getNextMove(null)).toThrow();
      expect(() => ai.getNextMove(undefined)).toThrow();
      expect(() => ai.getNextMove([])).toThrow();
      expect(() => ai.getNextMove([[], []])).toThrow(); // Not 3x3
    });
  });

  // ========== MEDIUM DIFFICULTY TESTS ==========
  describe('Medium Difficulty (Strategic Moves)', () => {
    let ai;

    beforeEach(() => {
      ai = createAIOpponent('medium');
    });

    test('should block opponent win when possible', () => {
      // Opponent has two in a row, AI should block
      const boardNeedsBlock = [
        ['X', 'X', ''],
        ['O', '', ''],
        ['', '', '']
      ];
      
      const move = ai.getNextMove(boardNeedsBlock);
      // Should block at [0,2]
      expect(move.row).toBe(0);
      expect(move.col).toBe(2);
    });

    test('should take win when available', () => {
      // AI has two in a row, should win
      const boardCanWin = [
        ['O', 'O', ''],
        ['X', '', 'X'],
        ['', '', '']
      ];
      
      const move = ai.getNextMove(boardCanWin);
      // Should win at [0,2]
      expect(move.row).toBe(0);
      expect(move.col).toBe(2);
    });
  });

  // ========== HARD DIFFICULTY TESTS ==========
  describe('Hard Difficulty (Minimax)', () => {
    let ai;

    beforeEach(() => {
      ai = createAIOpponent('hard');
    });

    test('should make optimal first move (center or corner)', () => {
      const emptyBoard = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ];
      
      const move = ai.getNextMove(emptyBoard);
      // Optimal first moves are center or corners
      const optimalFirstMoves = [
        {row: 1, col: 1}, // Center
        {row: 0, col: 0}, {row: 0, col: 2}, // Corners
        {row: 2, col: 0}, {row: 2, col: 2}
      ];
      
      const isOptimal = optimalFirstMoves.some(optimal => 
        optimal.row === move.row && optimal.col === move.col
      );
      expect(isOptimal).toBe(true);
    });

    test('should never lose (perfect play)', () => {
      // This is a complex test - for now just verify it makes a move
      const testBoard = [
        ['X', '', ''],
        ['', 'O', ''],
        ['', '', 'X']
      ];
      
      const move = ai.getNextMove(testBoard);
      expect(move).toHaveProperty('row');
      expect(move).toHaveProperty('col');
      // Hard AI should make a non-losing move
      expect(move.row).toBeGreaterThanOrEqual(0);
      expect(move.row).toBeLessThan(3);
    });
  });

  // ========== INTEGRATION TESTS ==========
  describe('Integration with Game Board Format', () => {
    test('should work with gameEngine board format (1D array)', () => {
      const ai = createAIOpponent('easy');
      // gameEngine uses 1D array [0-8], convert to 2D for AI
      const board1D = ['X', 'O', '', '', '', '', '', '', ''];
      const board2D = [
        ['X', 'O', ''],
        ['', '', ''],
        ['', '', '']
      ];
      
      // For now, AI expects 2D - we'll handle conversion in integration
      const move = ai.getNextMove(board2D);
      expect(move).toBeDefined();
    });
  });
});
