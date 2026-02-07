// src/gameClient.js

import { getState, makeMove, resetGame } from './gameEngine.js';

// Simple Tic-Tac-Toe client (plain JS + CSS)
// Exported API: initGameClient(containerOrSelector)

function injectStyles() {
  if (document.getElementById('tic-tac-toe-styles')) return;
  const css = `
  .tic-tac-toe { max-width: 480px; margin: 0 auto; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
  .tic-tac-toe-header { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:8px; flex-wrap: wrap; }
  .tic-tac-toe-status { font-size:1.1rem; font-weight:600; flex: 1; min-width: 200px; }
  .tic-tac-toe-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:8px; margin-bottom: 16px; }
  .tic-tac-toe-cell { background:#fff; border:2px solid #222; border-radius:8px; display:flex; align-items:center; justify-content:center; aspect-ratio:1/1; font-size:2.4rem; font-weight:700; color:#111; touch-action:manipulation; user-select:none; -webkit-tap-highlight-color: transparent; }
  .tic-tac-toe-cell:active { transform:scale(0.995); }
  .tic-tac-toe-cell.disabled { opacity:0.6; pointer-events:none; }
  .tic-tac-toe-controls { display:flex; gap:8px; flex-wrap: wrap; }
  .tic-tac-toe-button { background:#0b5; border:none; padding:8px 12px; border-radius:8px; font-weight:600; color:#021; cursor: pointer; transition: all 0.2s; }
  .tic-tac-toe-button:hover { background: #09a; transform: translateY(-1px); }
  .tic-tac-toe-button.secondary { background:#f66; color:#300; }
  .tic-tac-toe-button.secondary:hover { background: #e55; }
  .tic-tac-toe-status-indicator { display: inline-flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #666; }
  .tic-tac-toe-status-dot { width: 8px; height: 8px; border-radius: 50%; background: #ccc; }
  .tic-tac-toe-status-dot.online { background: #0b5; }
  .tic-tac-toe-status-dot.offline { background: #f66; animation: pulse 2s infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
  @media (prefers-reduced-motion: no-preference) { .tic-tac-toe-cell { transition: transform .08s ease; } }
  `;
  const style = document.createElement('style');
  style.id = 'tic-tac-toe-styles';
  style.textContent = css;
  document.head.appendChild(style);
}

function createRoot(container) {
  const root = document.createElement('div');
  root.className = 'tic-tac-toe';

  const header = document.createElement('div');
  header.className = 'tic-tac-toe-header';

  const status = document.createElement('div');
  status.className = 'tic-tac-toe-status';
  status.setAttribute('aria-live', 'polite');

  const controls = document.createElement('div');
  controls.className = 'tic-tac-toe-controls';

  const resetBtn = document.createElement('button');
  resetBtn.className = 'tic-tac-toe-button secondary';
  resetBtn.textContent = 'Reset';
  resetBtn.type = 'button';

  controls.appendChild(resetBtn);
  header.appendChild(status);
  header.appendChild(controls);

  const grid = document.createElement('div');
  grid.className = 'tic-tac-toe-grid';
  grid.setAttribute('role', 'grid');

  root.appendChild(header);
  root.appendChild(grid);

  container.appendChild(root);

  return { root, status, grid, resetBtn };
}

function renderGrid(gridEl, state, onCellClick) {
  // Clear and re-render entire grid
  gridEl.innerHTML = '';
  const board = state.board || Array(9).fill('');
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('button');
    cell.className = 'tic-tac-toe-cell';
    cell.type = 'button';
    cell.setAttribute('data-index', String(i));
    cell.setAttribute('aria-label', `Cell ${i + 1}`);
    cell.setAttribute('role', 'gridcell');
    cell.textContent = board[i] || '';

    if (board[i] !== '' || state.status !== 'playing') {
      cell.classList.add('disabled');
    }

    cell.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof onCellClick === 'function') onCellClick(i);
    });

    gridEl.appendChild(cell);
  }
}

function statusTextForState(state) {
  if (!state) return '';
  if (state.status === 'win') return `${state.winner} Wins!`;
  if (state.status === 'tie' || state.status === 'draw') return `It's a tie.`;
  return `Player ${state.currentPlayer}'s turn`;
}

export function initGameClient(containerOrSelector = document.body, opts = {}) {
  injectStyles();

  const container = typeof containerOrSelector === 'string'
    ? document.querySelector(containerOrSelector)
    : containerOrSelector;

  if (!container) throw new Error('Container not found');

  const { root, status, grid, resetBtn } = createRoot(container);

  let lastStateJSON = '';
  let polling = true;

  function refresh() {
    const state = getState();
    const json = JSON.stringify(state);
    if (json !== lastStateJSON) {
      lastStateJSON = json;
      // Full re-render
      status.textContent = statusTextForState(state);
      renderGrid(grid, state, handleCellClick);
    }
  }

  function handleCellClick(index) {
    makeMove(index);
    // immediate render after attempting move
    refresh();
  }

  resetBtn.addEventListener('click', (e) => {
    e.preventDefault();
    resetGame();
    refresh();
  });

  // Start a small polling loop to detect external state changes
  const pollInterval = opts.pollInterval || 150; // ms
  const pollId = setInterval(() => {
    if (!polling) return;
    refresh();
  }, pollInterval);

  // Initial render
  refresh();

  return {
    refresh,
    destroy() {
      polling = false;
      clearInterval(pollId);
      root.remove();
    }
  };
}

export default initGameClient;
