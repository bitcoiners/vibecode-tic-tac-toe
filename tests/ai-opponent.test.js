/**
 * AI Opponent Tests
 * TDD Approach: Write failing test first (RED)
 */
import { createAIOpponent } from '../src/aiOpponent.js';

describe('AI Opponent', () => {
  test('should create AI opponent with valid difficulty level', () => {
    // Test will fail initially - RED phase
    const ai = createAIOpponent('easy');
    expect(ai).toBeDefined();
    expect(typeof ai.getNextMove).toBe('function');
  });

  test('should throw error for invalid difficulty level', () => {
    expect(() => createAIOpponent('invalid')).toThrow('Invalid difficulty level');
  });
});
