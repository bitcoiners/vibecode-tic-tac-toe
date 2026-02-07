# Technical Blueprint: Tic-Tac-Toe PWA

## 1. System Architecture

The application follows a **Model-View-Controller (MVC)** pattern adapted for a PWA with live sync:

| Component | Module | Technology | Responsibility |
| :--- | :--- | :--- | :--- |
| **Model** | `GameEngine` | Pure JavaScript | Game state, business logic, and rules. |
| **View** | `GameClient` | HTML5, CSS3, JS | Mobile-responsive UI, touch handling, display. |
| **Controller** | `GameSync` | WebSockets (Socket.io) | Network communication, state synchronization. |
| **PWA Shell** | - | Web App Manifest, Service Worker | Installability, offline capability, app-like feel. |

## 2. Core Module: GameEngine Specification

### 2.1 State Representation
```javascript
// The single source of truth for game state
{
    board: ['', '', '', '', '', '', '', '', ''], // Flat array, index 0 = top-left
    currentPlayer: 'X', // 'X' or 'O'
    status: 'playing', // 'playing', 'win', 'tie'
    winner: null // null, 'X', or 'O' (only if status === 'win')
}

## 3. Module: GameClient (View)

### 3.1 Responsibilities
- Render the `board` array as a 3x3 grid of tappable cells.
- Display the `status` and `currentPlayer` as text.
- On cell tap: call `gameEngine.makeMove(index)` and re-render.
- Visually highlight winning cells when `status === 'win'`.

### 3.2 Technology & Structure
- **Core**: Plain JavaScript DOM manipulation (no UI frameworks for initial MVP).
- **CSS**: Mobile-first, responsive grid using Flexbox/Grid.
- **File**: `src/gameClient.js`

## 4. Module: GameSync (Controller/Network)

### 4.1 Responsibilities
- Establish a real-time connection between two browser instances.
- Transmit `gameEngine.getState()` after each `makeMove`.
- Receive state updates and sync them to the local `gameEngine`.

### 4.2 Technology & Strategy
- **Library**: Socket.io (handles WebSocket fallback).
- **Connection Strategy**: "Shareable Link" model.
    - Player A creates a room, gets a unique URL.
    - Player B visits the URL to join the same room.
- **File**: `src/gameSync.js`

## 5. PWA Configuration

### 5.1 Files
- `manifest.json`: Defines app name, icons, and display mode (`standalone`).
- `service-worker.js` (Phase 2): Caches static assets for offline use.

## 6. Development Workflow & TDD Plan

### Core TDD Protocol: Red-Green-Refactor
All development must strictly follow this cycle:

1.  **Red**: Write a failing test that describes the desired functionality.
2.  **Green**: Write the minimal amount of code required to make the test pass.
3.  **Refactor**: Improve the code structure and clarity while keeping all tests passing.

### 6.1 Test-Driven Development Order
We will build **from the inside out**, starting with the most isolated, business-logic module.

1.  **PHASE 1: Core Logic (`GameEngine`)**
    - Write failing tests for `checkGameStatus()` → Implement.
    - Write failing tests for `makeMove()` → Implement.
    - Write tests for `resetGame()` and `getState()`.

2.  **PHASE 2: Local UI & Integration (`GameClient` with `GameEngine`)**
    - Test that UI renders an empty board from state.
    - Test that a cell click triggers `makeMove`.
    - Test that UI updates after state change.

3.  **PHASE 3: Live Multiplayer (`GameSync`)**
    - Test network module in isolation (mocking sockets).
    - Integrate with `GameEngine`.

4.  **PHASE 4: PWA Enhancements**
    - Add manifest and verify install prompt.
    - Add service worker for offline caching.
