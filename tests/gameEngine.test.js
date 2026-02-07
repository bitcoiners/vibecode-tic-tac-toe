// tests/gameEngine.test.js
import { checkGameStatus, makeMove, getState, resetGame, applyRemoteState } from '../src/gameEngine.js';

describe('GameEngine - checkGameStatus', () => {
  test('should detect a win on the top row for X', () => {
    const winningBoard = ['X', 'X', 'X', '', '', '', '', '', ''];
    const result = checkGameStatus(winningBoard);
    expect(result.status).toBe('win');
    expect(result.winner).toBe('X');
  });

  test('should detect a tie when board is full with no winner', () => {
    const tiedBoard = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    const result = checkGameStatus(tiedBoard);
    expect(result.status).toBe('tie');
    expect(result.winner).toBe(null);
  });
});

describe('GameEngine - State Management', () => {
  beforeEach(() => {
    resetGame(); // Clean state before each test
  });

  test('getState should return initial game state', () => {
    const state = getState();
    expect(state.board).toEqual(['', '', '', '', '', '', '', '', '']);
    expect(state.currentPlayer).toBe('X');
    expect(state.status).toBe('playing');
    expect(state.winner).toBe(null);
  });

  test('makeMove should place X on first move and switch to O', () => {
    makeMove(0); // X places at top-left
    const state = getState();
    
    expect(state.board[0]).toBe('X');
    expect(state.currentPlayer).toBe('O');
    expect(state.status).toBe('playing');
  });

  test('makeMove should not allow move on occupied cell', () => {
    makeMove(0); // X places at 0
    makeMove(0); // O tries to place at 0 (should fail)
    
    const state = getState();
    expect(state.board[0]).toBe('X'); // Should still be X
    expect(state.currentPlayer).toBe('O'); // Should still be O's turn
  });

  test('makeMove should not allow move out of bounds', () => {
    makeMove(9); // Invalid index
    const state = getState();
    expect(state.board).toEqual(['', '', '', '', '', '', '', '', '']);
  });

  test('resetGame should reset to initial state', () => {
    makeMove(0);
    makeMove(1);
    resetGame();
    
    const state = getState();
    expect(state.board).toEqual(['', '', '', '', '', '', '', '', '']);
    expect(state.currentPlayer).toBe('X');
    expect(state.status).toBe('playing');
  });

  test('makeMove should detect when X wins', () => {
    // X:0, O:3, X:1, O:4, X:2 (X wins top row)
    makeMove(0); // X
    makeMove(3); // O
    makeMove(1); // X
    makeMove(4); // O
    makeMove(2); // X - should win
    
    const state = getState();
    expect(state.status).toBe('win');
    expect(state.winner).toBe('X');
  });

  test('makeMove should detect a tie', () => {
    // Create a tie scenario
    const moves = [0, 3, 1, 4, 5, 2, 6, 7, 8]; // Results in tie
    moves.forEach(cellIndex => makeMove(cellIndex));
    
    const state = getState();
    expect(state.status).toBe('tie');
    expect(state.winner).toBe(null);
  });

  test('should not allow moves after game ends', () => {
    // Create a win
    makeMove(0); // X
    makeMove(3); // O
    makeMove(1); // X
    makeMove(4); // O
    makeMove(2); // X - wins
    
    // Try another move after win
    const boardBefore = [...getState().board];
    makeMove(5); // Should not work
    const boardAfter = [...getState().board];
    
    expect(JSON.stringify(boardBefore)).toEqual(JSON.stringify(boardAfter));
  });
});

describe('GameEngine - Remote State Synchronization', () => {
  beforeEach(() => {
    resetGame();
  });

  test('applyRemoteState should replace local state with remote state', () => {
    // Make some moves locally
    makeMove(0);
    makeMove(1);
    
    const remoteState = {
      board: ['X', 'X', 'X', 'O', 'O', '', '', '', ''],
      currentPlayer: 'O',
      status: 'win',
      winner: 'X'
    };
    
    applyRemoteState(remoteState);
    const state = getState();
    
    expect(state.board).toEqual(remoteState.board);
    expect(state.currentPlayer).toBe('O');
    expect(state.status).toBe('win');
    expect(state.winner).toBe('X');
  });

  test('applyRemoteState should validate board length', () => {
    const invalidState = {
      board: ['X', 'X'], // Too short
      currentPlayer: 'O',
      status: 'playing',
      winner: null
    };
    
    const originalState = getState();
    applyRemoteState(invalidState);
    
    // State should not change
    expect(getState()).toEqual(originalState);
  });

  test('applyRemoteState should validate currentPlayer', () => {
    const invalidState = {
      board: ['', '', '', '', '', '', '', '', ''],
      currentPlayer: 'Z', // Invalid
      status: 'playing',
      winner: null
    };
    
    const originalState = getState();
    applyRemoteState(invalidState);
    
    // State should not change
    expect(getState()).toEqual(originalState);
  });

  test('applyRemoteState should validate status', () => {
    const invalidState = {
      board: ['', '', '', '', '', '', '', '', ''],
      currentPlayer: 'X',
      status: 'invalid', // Invalid status
      winner: null
    };
    
    const originalState = getState();
    applyRemoteState(invalidState);
    
    // State should not change
    expect(getState()).toEqual(originalState);
  });

  test('applyRemoteState should handle null or undefined input', () => {
    const originalState = getState();
    
    applyRemoteState(null);
    expect(getState()).toEqual(originalState);
    
    applyRemoteState(undefined);
    expect(getState()).toEqual(originalState);
  });

  test('applyRemoteState should default missing winner to null', () => {
    const remoteState = {
      board: ['X', 'O', '', '', '', '', '', '', ''],
      currentPlayer: 'X',
      status: 'playing'
      // No winner property
    };
    
    applyRemoteState(remoteState);
    expect(getState().winner).toBe(null);
  });
});