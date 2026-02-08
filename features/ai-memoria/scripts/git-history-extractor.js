import { readFile } from 'fs/promises';

// Load existing patterns to avoid duplicates
export async function loadExistingPatterns() {
  try {
    const existingPattern = JSON.parse(
      await readFile('knowledge-base/workflows/semantic-commits.json', 'utf8')
    );
    return [existingPattern];
  } catch (error) {
    return [];
  }
}

// Analyze commit messages for patterns
export function analyzeCommitPatterns(commitMessages) {
  const patterns = [];
  
  // Check for semantic commits
  const semanticCommits = commitMessages.filter(msg => 
    /^(feat|fix|docs|style|refactor|test|chore|perf)(\(.*\))?:/.test(msg)
  );
  
  if (semanticCommits.length > 0) {
    patterns.push({
      id: `workflow-semantic-commits-auto-${Date.now()}`,
      title: 'Semantic Commit Messages (Auto-extracted)',
      type: 'workflow-rule',
      category: 'git-workflow',
      tags: ['git', 'auto-extracted', 'semantic-commits'],
      content: `Auto-detected semantic commit pattern from ${semanticCommits.length} commit(s). Examples: ${semanticCommits.slice(0, 3).join(', ')}`,
      source: {
        type: 'git-history',
        location: 'git log',
        reference: `Found ${semanticCommits.length} semantic commits out of ${commitMessages.length} total`
      },
      maturity: 'proven',
      patternDetails: {
        commitCount: semanticCommits.length,
        totalCommits: commitMessages.length,
        examples: semanticCommits.slice(0, 5)
      }
    });
  }
  
  return patterns;
}

// Filter out patterns that duplicate existing ones
function filterDuplicates(newPatterns, existingPatterns) {
  return newPatterns.filter(newPattern => 
    !existingPatterns.some(existing => 
      existing.title.includes('Semantic Commit') && newPattern.title.includes('Semantic Commit')
    )
  );
}

// Main export - accepts existing patterns as parameter for testability
export async function extractPatternsFromCommits(commitMessages, existingPatterns = null) {
  const actualExistingPatterns = existingPatterns !== null 
    ? existingPatterns 
    : await loadExistingPatterns();
    
  const newPatterns = analyzeCommitPatterns(commitMessages);
  return filterDuplicates(newPatterns, actualExistingPatterns);
}
