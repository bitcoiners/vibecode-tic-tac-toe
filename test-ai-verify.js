// Quick test to verify AI integration
import { createAIGameEngine } from './src/aiGameEngine.js';

async function testAIIntegration() {
  console.log('🧪 Testing AI Game Engine Integration...\n');
  
  const engine = createAIGameEngine();
  
  console.log('1. Testing multiplayer mode (default)...');
  let state = engine.getState();
  console.log('   Game mode:', engine.getGameMode());
  console.log('   Initial board:', state.board);
  
  console.log('\n2. Switching to single-player mode...');
  engine.setGameMode('singleplayer', 'medium');
  state = engine.getState();
  console.log('   Game mode:', engine.getGameMode());
  console.log('   AI difficulty:', state.aiDifficulty);
  
  console.log('\n3. Making human move (center)...');
  engine.makeMove(4);
  state = engine.getState();
  console.log('   Board after human move:', state.board);
  console.log('   Current player:', state.currentPlayer);
  console.log('   Game status:', state.status);
  
  console.log('\n4. Waiting for AI move...');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  state = engine.getState();
  console.log('   Board after AI move:', state.board);
  console.log('   Current player:', state.currentPlayer);
  console.log('   Game status:', state.status);
  console.log('   X moves:', state.board.filter(cell => cell === 'X').length);
  console.log('   O moves:', state.board.filter(cell => cell === 'O').length);
  
  console.log('\n✅ AI Integration Test Complete!');
}

testAIIntegration().catch(console.error);
