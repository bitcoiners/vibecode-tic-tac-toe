/**
 * AI + GameEngine Integration Tests
 */
import { createAIGameEngine } from '../src/aiGameEngine.js';
import { createAIOpponent } from '../src/ai/aiOpponent.js';
import { 
  convert1DTo2D, 
  convert2DTo1D, 
  convertMoveToIndex,
  convertIndexToMove 
} from '../src/boardUtils.js';

describe('AI + GameEngine Integration', () => {
  describe('Board Format Conversion', () => {
    test('should convert 1D board to 2D correctly', () => {
      const board1D = ['X', '', 'O', '', 'X', '', '', '', 'O'];
      const board2D = convert1DTo2D(board1D);
      
      expect(board2D).toEqual([
        ['X', '', 'O'],
        ['', 'X', ''],
        ['', '', 'O']
      ]);
    });

    test('should convert 2D board to 1D correctly', () => {
      const board2D = [
        ['X', '', 'O'],
        ['', 'X', ''],
        ['', '', 'O']
      ];
      const board1D = convert2DTo1D(board2D);
      
      expect(board1D).toEqual(['X', '', 'O', '', 'X', '', '', '', 'O']);
    });

    test('should convert move to index correctly', () => {
      expect(convertMoveToIndex({ row: 0, col: 0 })).toBe(0);
      expect(convertMoveToIndex({ row: 1, col: 1 })).toBe(4);
      expect(convertMoveToIndex({ row: 2, col: 2 })).toBe(8);
    });

    test('should convert index to move correctly', () => {
      expect(convertIndexToMove(0)).toEqual({ row: 0, col: 0 });
      expect(convertIndexToMove(4)).toEqual({ row: 1, col: 1 });
      expect(convertIndexToMove(8)).toEqual({ row: 2, col: 2 });
    });

    test('should throw errors for invalid inputs', () => {
      expect(() => convert1DTo2D([])).toThrow();
      expect(() => convert2DTo1D([])).toThrow();
      expect(() => convertMoveToIndex({})).toThrow();
      expect(() => convertIndexToMove(-1)).toThrow();
    });
  });

  describe('AI Integration with GameEngine', () => {
    test('AI should make valid move based on game state', () => {
      const engine = createAIGameEngine();
      const ai = createAIOpponent('easy');
      
      // Get initial state
      const state = engine.getState();
      expect(state.board.length).toBe(9);
      
      // Convert to 2D for AI
      const board2D = convert1DTo2D(state.board);
      
      // AI should make a move
      const aiMove = ai.getNextMove(board2D);
      expect(aiMove).toHaveProperty('row');
      expect(aiMove).toHaveProperty('col');
      
      // Convert back to index for gameEngine
      const cellIndex = convertMoveToIndex(aiMove);
      expect(cellIndex).toBeGreaterThanOrEqual(0);
      expect(cellIndex).toBeLessThan(9);
    });

    test('should simulate complete human vs AI game', () => {
      const engine = createAIGameEngine();
      engine.setGameMode('singleplayer', 'easy');
      const ai = createAIOpponent('easy');
      
      // Human makes first move
      engine.makeMove(4); // Center
      
      // Simulate AI response
      const state = engine.getState();
      const board2D = convert1DTo2D(state.board);
      const aiMove = ai.getNextMove(board2D);
      
      expect(aiMove).toBeDefined();
      // AI should not try to take occupied center
      expect(aiMove).not.toEqual({ row: 1, col: 1 });
    });
  });

  describe('Single-Player Game Mode', () => {
    test('should set single-player mode with AI difficulty', () => {
      const engine = createAIGameEngine();
      
      engine.setGameMode('singleplayer', 'medium');
      expect(engine.getGameMode()).toBe('singleplayer');
      
      const state = engine.getState();
      expect(state.gameMode).toBe('singleplayer');
      expect(state.aiDifficulty).toBe('medium');
    });

    test('should throw error for invalid game mode', () => {
      const engine = createAIGameEngine();
      expect(() => engine.setGameMode('invalid')).toThrow();
    });

    test('should throw error for invalid difficulty', () => {
      const engine = createAIGameEngine();
      expect(() => engine.setGameMode('singleplayer', 'invalid')).toThrow();
    });

    test('AI should make move after human move in single-player mode', (done) => {
      const engine = createAIGameEngine();
      engine.setGameMode('singleplayer', 'easy');
      
      // Human makes move
      engine.makeMove(4); // Center
      
      // AI should make a move automatically (after timeout)
      setTimeout(() => {
        const state = engine.getState();
        // AI should have made a move (O player)
        expect(state.board.filter(cell => cell === 'O').length).toBe(1);
        done();
      }, 600); // Slightly longer than AI delay
    }, 1000);

    test('should handle AI move errors gracefully', () => {
      const engine = createAIGameEngine();
      engine.setGameMode('singleplayer', 'easy');
      
      // We can't easily simulate AI errors without mocking
      // This test verifies the AI wrapper handles missing AI
      engine.setGameMode('multiplayer');
      
      expect(() => engine.makeAIMove()).toThrow('AI move only available in singleplayer mode');
    });
  });
});
