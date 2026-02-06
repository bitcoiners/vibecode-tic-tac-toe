# Tic-Tac-Toe Game for Smart Phones

A live, two-player Tic-Tac-Toe game designed for quick, fun sessions between friends. Players can instantly start a game by sharing a link and take turns directly from their mobile browsers—no downloads required.

## 📋 Project Overview

| **Aspect**         | **Description**                                                                 |
| :----------------- | :------------------------------------------------------------------------------ |
| **Project Type**   | Mobile Web Application (PWA-friendly)                                           |
| **Core Technology**| HTML, CSS, JavaScript (with Test-Driven Development)                            |
| **Key Feature**    | Live multiplayer sync via shared link                                           |
| **Testing Approach**| Jest framework with TDD methodology (Red-Green-Refactor cycle)                  |
| **Priority**       | Mobile-first, responsive design                                                 |

## 🎯 Vision & Core Problem

- **Vision:** To create the perfect 2-minute distraction—a familiar, zero-friction game that connects friends remotely.
- **Core Problem:** Provide an instantly accessible, live multiplayer experience for the classic game of Tic-Tac-Toe, eliminating the need for app installations or complex setups.

## 👥 Target User & Core Use Case

- **Target User:** Anyone looking for a quick, social, and straightforward game to play with a friend remotely.
- **Core Use Case:** Sarah is waiting for a bus. She texts a game link to her friend Alex. Alex opens the link on his phone. They immediately see the same game board and take turns playing until one wins or the game ends in a draw—all during their short wait.

## 🛠️ Features (MoSCoW Prioritization)

### MUST HAVE (MVP - Non-Negotiable)
1.  **M1: Responsive Game Board** - A 3x3 grid that displays correctly on mobile screens.
2.  **M2: Turn Logic** - Two-player alternating turns (X and O).
3.  **M3: Tap Interaction** - Players can tap empty cells to place their symbol.
4.  **M4: Win/Tie Detection** - Correctly identifies 3-in-a-row (rows, columns, diagonals) and full-board ties.
5.  **M5: Game State Messaging** - Clear UI messages showing turn status, winner, or tie.
6.  **M6: Live Multiplayer Sync** - Two devices share game state via link; moves sync instantly.
7.  **M7: Game Reset** - "New Game" button to reset board without page refresh.

### SHOULD HAVE (Post-MVP Enhancement)
1.  **S1: Score Tracker** - Visual score display (e.g., "X: 1 | O: 2").
2.  **S2: Player Role Display** - Indicates creator (Player X) and joiner (Player O).

## 📊 Success Criteria

1.  **Board & Interaction** - Mobile browser displays tappable 3x3 grid; symbols appear immediately on tap.
2.  **Turn Enforcement** - Players cannot act out of turn or place symbols in occupied cells.
3.  **Game Logic**:
    - *Win Detection*: Correctly declares winner for any row, column, or diagonal.
    - *Tie Detection*: Correctly declares tie when board is full with no winner.
4.  **Game State Communication** - Clear status area shows: "Player X's turn", "Player O's turn", "X Wins!", "O Wins!", or "It's a Tie!".
5.  **Live Multiplayer Sync** - Move made on Device A appears on Device B within **5 seconds**; turn switches automatically.
6.  **Game Management** - "New Game" button appears after game end; resets board and state for both players.
7.  **Score Tracking** - Score tracker increments correctly; persists until page reload.
8.  **Player Role Assignment** - UI clearly indicates Player X (creator) and Player O (joiner).

## 🧪 Development Approach: Test-Driven Development (TDD)

This project will follow the **Red-Green-Refactor** TDD cycle:
1.  **Red** - Write a failing test describing desired functionality
2.  **Green** - Write minimal code to pass the test
3.  **Refactor** - Improve code while keeping tests passing

## 🚀 Getting Started

*Next steps will include:*
1. Creating Technical Blueprint: How we will build it. It outlines the core structures, rules, and components before we write a single line of code. This is the map for our TDD tests.

2. Creating Development Plan (Later): The order in which we will build it. In TDD, this often emerges naturally from the blueprint as we write tests for the smallest, most isolated components first (like game logic) before moving to complex integrations
3.  Creating the first failing test for game board logic
4.  Implementing core game mechanics iteratively

---