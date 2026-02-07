# 🎨 Coding Standards & Style Guide  
*Inspired by Everything Claude Code \`coding-style.md\` principles*

**Integration Date:** 2026-02-07
**Status:** Phase 1, Step 2 of Claude Code Integration Roadmap
**Source Principles:** Immutability, file organization, naming conventions

## 📋 Core Principles

### 1. Immutability First
- **Prefer \`const\`** over \`let\` or \`var\`
- **Avoid mutation** - create new objects/arrays instead of modifying
- **Pure functions** when possible (same input → same output, no side effects)

**Good:**
\`\`\`javascript
// Immutable approach
const updatedBoard = board.map(row => [...row]);
updatedBoard[1][1] = 'X';

// Pure function
function calculateWinner(board) {
  // No side effects, returns new value
  return checkWinConditions(board);
}
\`\`\`

**Avoid:**
\`\`\`javascript
// Mutating existing object
board[1][1] = 'X'; // ❌ Direct mutation
\`\`\`

### 2. File Organization
**Project Structure Pattern:**
\`\`\`
src/
├── gameEngine.js      # Core game logic (stateless)
├── gameClient.js      # UI rendering (stateful UI)
├── gameSync.js        # Network communication  
├── gameLobby.js       # Lobby management
└── server.js          # Backend server

tests/
├── gameEngine.test.js
├── gameClient.test.js
└── integration.test.js

docs/
├── architectural decisions
├── workflow guidelines
└── integration status
\`\`\`

**File Size Guidelines:**
- **≤ 300 lines** for logic files (gameEngine.js, gameSync.js)
- **≤ 500 lines** for UI/files with HTML templates
- Split larger files by responsibility

### 3. Naming Conventions

**Variables & Functions:**
- \`camelCase\` for variables and functions
- Descriptive names over abbreviations
- Booleans: \`isGameOver\`, \`hasWinner\`, \`canMakeMove\`

**Files:**
- \`kebab-case.js\` for test files: \`game-engine.test.js\`
- \`camelCase.js\` for source files: \`gameEngine.js\`

**Classes/Constructors:** (if used)
- \`PascalCase\`: \`class GameEngine { ... }\`

**Constants:** 
- \`UPPER_SNAKE_CASE\`: \`const WINNING_COMBINATIONS = [...]\`

### 4. Function Design
- **Single responsibility** per function
- **≤ 3 parameters** - use objects for more
- **Descriptive names** that indicate purpose

**Good:**
\`\`\`javascript
function checkForWinner(gameBoard) {
  // Single responsibility: win detection
  return WINNING_COMBINATIONS.some(combo => 
    combo.every(([row, col]) => gameBoard[row][col] === currentPlayer)
  );
}
\`\`\`

### 5. Error Handling
- **Use try/catch** for expected errors (network, parsing)
- **Throw meaningful errors** with context
- **Validate inputs** at function boundaries

**Example from gameSync.js:**
\`\`\`javascript
export default function createGameSync(roomId, ioDependency) {
  // Input validation at boundary
  if (!roomId) {
    throw new Error('Room ID is required');
  }
  
  if (typeof roomId !== 'string') {
    throw new Error('Room ID must be a string');
  }
  // ...
}
\`\`\`

## 🛠️ Project-Specific Standards

### Tic-Tac-Toe PWA Conventions

**Game State Management:**
- State objects are immutable
- Use helper functions to create new state
- Centralize state transformation logic

**Example from gameEngine.js pattern:**
\`\`\`javascript
// Instead of mutating state
function makeMove(state, row, col) {
  // Create new state object
  const newBoard = state.board.map(r => [...r]);
  newBoard[row][col] = state.currentPlayer;
  
  return {
    ...state,
    board: newBoard,
    currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
    moveCount: state.moveCount + 1
  };
}
\`\`\`

**Module Exports:**
- Named exports for multiple utilities
- Default export for main component/function
- Consistent export patterns across files

**Test Naming:**
- Describe behavior, not implementation
- Follow: \`describe('component') → test('should do something when condition')\`
- Example: \`test('should detect horizontal win on top row')\`

## 🔍 Code Review Checklist

**When reviewing code, check for:**
- [ ] Immutability respected (no direct mutation)
- [ ] Descriptive variable/function names
- [ ] Single responsibility per function
- [ ] Error handling for expected cases
- [ ] Input validation at boundaries
- [ ] Tests cover edge cases
- [ ] No commented-out code
- [ ] Consistent formatting

**Formatting Consistency:**
- 2-space indentation (existing project standard)
- Semicolons (existing project uses them)
- Single quotes for strings (existing standard)
- Trailing commas in objects/arrays (optional but consistent)

## 📝 Integration with Existing Codebase

**Current Alignment Assessment:**
- ✅ **Immutability**: Mostly followed in gameEngine.js
- ✅ **File organization**: Well-structured project
- 🔄 **Naming conventions**: Generally good, could be more consistent
- ✅ **Error handling**: Good examples in gameSync.js
- ✅ **Module exports**: Consistent patterns

**Areas for Improvement:**
1. **gameClient.js** (77.38% coverage) - could benefit from stricter immutability
2. **Test file names** - currently mixed (some kebab-case, some camelCase)
3. **Function size** - some functions could be broken down

## 🧪 Applying Standards to Phase 7 Features

**When implementing AI opponent:**
1. **Immutability**: AI functions should not mutate game state
2. **Pure functions**: Minimax algorithm should be pure
3. **Clear naming**: \`calculateBestMove()\`, \`evaluateBoard()\`, \`getAvailableMoves()\`
4. **Error handling**: Validate AI difficulty levels

**Example structure:**
\`\`\`javascript
// AI module structure
export function createAIOpponent(difficulty) {
  // Validate input
  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    throw new Error('Invalid difficulty level');
  }
  
  // Return object with pure functions
  return {
    getNextMove: (gameBoard) => {
      // Pure function - doesn't mutate input
      const availableMoves = getAvailableMoves(gameBoard);
      return selectMove(availableMoves, difficulty);
    },
    // ...
  };
}
\`\`\`

## 🔄 Integration Status

This standard integrates with:
- ✅ \`git-workflow.md\` (commit discipline)
- ✅ \`testing.md\` (code quality for tests)
- 🔄 \`patterns.md\` (next in Phase 1)

**Next Steps:**
1. Review existing code against these standards
2. Update any inconsistent patterns
3. Apply to Phase 7 feature implementation

---
*Part of Claude Code Integration - Phase 1: Foundational Rules*
*See: [Integration Roadmap](everything-claude-code-tips-integration-roadmap.md)*
*Previous: [Git Workflow](GIT_WORKFLOW.md)*
