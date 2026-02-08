describe('Phase 4 Integration', () => {
  test('All Phase 4 files exist', () => {
    const fs = require('fs');
    expect(fs.existsSync('public/manifest.json')).toBe(true);
    expect(fs.existsSync('public/service-worker.js')).toBe(true);
    expect(fs.existsSync('src/client/gameLobby.js')).toBe(true);
  });
});
