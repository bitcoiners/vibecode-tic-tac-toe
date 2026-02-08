import { analyzeCommitPatterns } from '../../scripts/git-history-extractor.js';

describe('Git Extractor - New Pattern Detection', () => {
  test('should detect branch naming pattern from commits', () => {
    // Arrange: Commits that might indicate branch naming conventions
    const commitMessages = [
      'merge branch feature/auth-login',
      'merge branch fix/memory-leak',
      'merge branch docs/api-update',
      'merge branch chore/deps-upgrade'
    ];
    
    const patterns = analyzeCommitPatterns(commitMessages);
    
    // Currently won't detect branch patterns - we need to enhance the analyzer
    // This test will FAIL initially (RED phase for new feature)
    expect(patterns.length).toBeGreaterThan(0);
  });
  
  test('should extract commit frequency pattern', () => {
    // Simulate time-based patterns (e.g., frequent commits on Mondays)
    const commitMessages = [
      'feat: monday morning feature',
      'fix: monday afternoon fix',
      'docs: tuesday documentation',
      'chore: wednesday maintenance'
    ];
    
    const patterns = analyzeCommitPatterns(commitMessages);
    
    // This is a future enhancement - test will fail for now
    expect(patterns.some(p => p.title.includes('Commit Frequency'))).toBe(true);
  });
});
