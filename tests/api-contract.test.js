/**
 * API Contract Test - Ensures gameSync API matches what consumers expect
 * This test would fail if the API changes without updating consumers
 */
describe('API Contract Tests', () => {
  let createGameSync;
  
  beforeAll(() => {
    // Mock io for testing
    global.io = jest.fn(() => ({
      on: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
      connected: true
    }));
    
    // Import the module
    createGameSync = require('../src/client/gameSync.js').default;
  });
  
  test('gameSync should have registerLocalGameEngine method (not setLocalEngine)', () => {
    const gameSync = createGameSync('test-room');
    
    // The correct method should exist
    expect(typeof gameSync.registerLocalGameEngine).toBe('function');
    
    // The old method name should NOT exist
    expect(gameSync.setLocalEngine).toBeUndefined();
  });
  
  test('registerLocalGameEngine should accept a game engine with applyRemoteState', () => {
    const gameSync = createGameSync('test-room');
    const mockEngine = {
      applyRemoteState: jest.fn()
    };
    
    // Should not throw when called with valid engine
    expect(() => {
      gameSync.registerLocalGameEngine(mockEngine);
    }).not.toThrow();
  });
});
