// tests/gameEngine.test.js
import { checkGameStatus } from '../src/gameEngine.js';

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

  test('debug: check why tie board is detected as win', () => {
    const tiedBoard = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    console.log('Tied board:', tiedBoard);
    
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8], 
      [0, 4, 8], [2, 4, 6]
    ];
    
    for (const [a, b, c] of winPatterns) {
      const values = [tiedBoard[a], tiedBoard[b], tiedBoard[c]];
      const isWin = values[0] && values[0] === values[1] && values[0] === values[2];
      console.log(`Pattern [${a},${b},${c}]: ${values} => win? ${isWin}`);
    }
  });
});