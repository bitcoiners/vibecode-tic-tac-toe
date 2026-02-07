import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const app = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: { origin: '*' },
  transports: ['websocket', 'polling'],
});

// Middleware
app.use(express.static('.'));
app.use('/public', express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "..", 'index.html'));
});

app.get('/service-worker.js', (req, res) => {
  res.setHeader('Service-Worker-Allowed', '/');
  res.sendFile(path.join(__dirname, "..", 'public', 'service-worker.js'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    rooms: rooms.size,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Room management - compatible with gameSync.js
const rooms = new Map();

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // CREATE-GAME: Handle game creation (gameSync compatibility)
  socket.on('create-game', (callback) => {
    const roomId = generateRoomId();
    rooms.set(roomId, {
      players: [socket.id],
      spectators: [],
      gameState: null,
      createdAt: Date.now()
    });
    
    socket.join(roomId);
    console.log(`✅ Room ${roomId} created by ${socket.id}`);
    
    if (typeof callback === 'function') {
      callback(roomId);
    }
  });

  // JOIN-GAME: Handle joining existing room (gameSync compatibility)
  socket.on('join-game', (roomId, callback) => {
    if (!roomId || typeof roomId !== 'string') {
      if (typeof callback === 'function') {
        callback({ success: false, message: 'Invalid room ID' });
      }
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      if (typeof callback === 'function') {
        callback({ success: false, message: 'Room does not exist' });
      }
      return;
    }

    if (room.players.length >= 2) {
      // Join as spectator
      room.spectators.push(socket.id);
      socket.join(roomId);
      console.log(`👁️ Spectator ${socket.id} joined room ${roomId}`);
      
      if (typeof callback === 'function') {
        callback({ success: true, message: 'Joined as spectator', isSpectator: true });
      }
    } else {
      // Join as player
      room.players.push(socket.id);
      socket.join(roomId);
      console.log(`🎮 Player ${socket.id} joined room ${roomId}`);
      
      // Notify other players
      socket.to(roomId).emit('player-joined', { 
        playerId: socket.id,
        playerCount: room.players.length
      });
      
      if (typeof callback === 'function') {
        callback({ success: true, message: 'Successfully joined game', isSpectator: false });
      }
    }
  });

  // GAME-STATE: Handle state updates (compatibility)
  socket.on('game-state', (roomId, gameState) => {
    const room = rooms.get(roomId);
    if (room) {
      room.gameState = gameState;
      // Broadcast to all except sender
      socket.to(roomId).emit('game-state', gameState);
      console.log(`🔄 Game state updated in room ${roomId}`);
    }
  });

  // PLAYER-MOVE: Handle player moves (gameSync compatibility)
  socket.on('player-move', (data) => {
    if (!data || !data.roomId) return;
    
    const { roomId, cellIndex, player } = data;
    const room = rooms.get(roomId);
    
    if (room) {
      // Forward the move to other players
      socket.to(roomId).emit('player-move', { 
        cellIndex, 
        player,
        timestamp: Date.now()
      });
      console.log(`🎯 Player ${player} moved to cell ${cellIndex} in room ${roomId}`);
    }
  });

  // RESET-GAME: Handle game reset (gameSync compatibility)
  socket.on('reset-game', (roomId) => {
    const room = rooms.get(roomId);
    if (room) {
      room.gameState = null;
      // Broadcast reset to all players in room
      io.to(roomId).emit('game-reset');
      console.log(`🔄 Game reset in room ${roomId}`);
    }
  });

  // DISCONNECT: Handle player disconnection
  socket.on('disconnect', () => {
    console.log(`❌ Player disconnected: ${socket.id}`);
    
    // Find and clean up rooms with disconnected player
    for (const [roomId, room] of rooms.entries()) {
      const playerIndex = room.players.indexOf(socket.id);
      if (playerIndex !== -1) {
        // Remove player from room
        room.players.splice(playerIndex, 1);
        
        // Notify other players in the room
        socket.to(roomId).emit('player-disconnected', { 
          playerId: socket.id,
          message: 'A player has disconnected',
          remainingPlayers: room.players.length
        });
        
        // Clean up empty rooms (after delay)
        if (room.players.length === 0 && room.spectators.length === 0) {
          setTimeout(() => {
            if (rooms.get(roomId)?.players.length === 0) {
              rooms.delete(roomId);
              console.log(`🧹 Cleaned up empty room: ${roomId}`);
            }
          }, 300000); // 5 minutes
        }
        break;
      }
    }
  });
});

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`\n✨ Tic-Tac-Toe PWA Server`);
  console.log(`📍 Listening on http://localhost:${PORT}`);
  console.log(`🎮 Open in your browser to play!`);
  console.log(`📱 PWA ready for installation\n`);
});
