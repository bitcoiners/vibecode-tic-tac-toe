import { extractPatternsFromCommits } from '../../scripts/git-history-extractor.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('Git Extractor Integration', () => {
  test('should extract patterns from actual git log', async () => {
    // Skip if not in git repo
    try {
      await execAsync('git rev-parse --is-inside-work-tree');
    } catch {
      console.log('Not in git repo, skipping integration test');
      return;
    }
    
    // Get actual commit messages from git log
    const { stdout } = await execAsync(
      'git log --oneline -10 --pretty=format:"%s"'
    );
    
    const commitMessages = stdout.split('\n').filter(msg => msg.trim());
    
    if (commitMessages.length === 0) {
      console.log('No commit messages found, skipping test');
      return;
    }
    
    // Try to extract patterns
    const patterns = await extractPatternsFromCommits(commitMessages);
    
    // Just verify it doesn't crash and returns array
    expect(Array.isArray(patterns)).toBe(true);
    
    console.log(`Analyzed ${commitMessages.length} commits, found ${patterns.length} patterns`);
  }, 10000); // 10 second timeout for git operations
});
