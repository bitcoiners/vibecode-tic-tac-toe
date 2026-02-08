import { extractPatternsFromCommits, analyzeCommitPatterns } from '../../scripts/git-history-extractor.js';

describe('Git History Extractor', () => {
  test('should detect semantic commit pattern when no existing pattern', async () => {
    // Arrange: Pass empty array for existing patterns
    const commitMessages = [
      'feat(auth): add OAuth2 login support',
      'fix: resolve memory leak'
    ];
    
    // Act: Pass empty array to simulate no existing patterns
    const patterns = await extractPatternsFromCommits(commitMessages, []);
    
    // Assert: Should detect pattern
    expect(patterns).toHaveLength(1);
    expect(patterns[0].title).toContain('Semantic Commit');
  });
  
  test('should NOT detect pattern when already exists', async () => {
    // Arrange: Simulate existing semantic commit pattern
    const existingPatterns = [{
      title: 'Semantic Commit Messages with Conventional Commits',
      type: 'workflow-rule'
    }];
    
    const commitMessages = [
      'feat(api): add endpoint',
      'fix: bug fix'
    ];
    
    // Act
    const patterns = await extractPatternsFromCommits(commitMessages, existingPatterns);
    
    // Assert: Should return empty (filtered out duplicate)
    expect(patterns).toHaveLength(0);
  });
  
  test('should return empty array for non-semantic commits', async () => {
    // Arrange
    const commitMessages = ['update', 'wip', 'fix bug'];
    
    // Act
    const patterns = await extractPatternsFromCommits(commitMessages, []);
    
    // Assert
    expect(patterns).toHaveLength(0);
  });
  
  test('analyzeCommitPatterns should detect semantic commits', () => {
    // Test the synchronous analyzer directly
    const commitMessages = [
      'feat: add feature',
      'fix: bug fix',
      'random commit'
    ];
    
    const patterns = analyzeCommitPatterns(commitMessages);
    
    expect(patterns).toHaveLength(1);
    expect(patterns[0].patternDetails.commitCount).toBe(2);
    expect(patterns[0].patternDetails.totalCommits).toBe(3);
  });
});
