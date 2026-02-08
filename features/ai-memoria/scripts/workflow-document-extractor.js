import { readFile } from 'fs/promises';

// Load existing patterns to avoid duplicates
async function loadExistingPatterns() {
  const patterns = [];
  
  try {
    // Check for existing semantic commits pattern
    const semanticCommits = JSON.parse(
      await readFile('knowledge-base/workflows/semantic-commits.json', 'utf8')
    );
    patterns.push(semanticCommits);
  } catch (error) {
    // File doesn't exist, that's OK
  }
  
  return patterns;
}

// Analyze markdown content for patterns
export function analyzeMarkdownContent(markdownContent, filepath) {
  const patterns = [];
  const content = markdownContent.toLowerCase();
  
  // Check for semantic commit pattern (more flexible detection)
  const hasSemanticCommits = (content.includes('feat:') || content.includes('feat(')) && 
                            (content.includes('fix:') || content.includes('fix(')) &&
                            (content.includes('semantic commit') || content.includes('conventional commit'));
  
  // Also check for commit type listings
  const hasCommitTypes = content.includes('feat') && content.includes('fix') && 
                        content.includes('docs') && content.includes('type');
  
  if (hasSemanticCommits || hasCommitTypes) {
    patterns.push({
      id: `workflow-semantic-commits-doc-${Date.now()}`,
      title: 'Semantic Commit Messages (Document-extracted)',
      type: 'workflow-rule',
      category: 'git-workflow',
      tags: ['git', 'document-extracted', 'semantic-commits', 'markdown'],
      content: 'Semantic commit message format following Conventional Commits specification. Extracted from project documentation.',
      source: {
        type: 'project-doc',
        location: filepath,
        reference: 'Commit Messages section'
      },
      maturity: 'proven',
      patternDetails: {
        types: ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf'],
        format: '<type>[optional scope]: <description>'
      }
    });
  }
  
  // Check for branch naming pattern (more flexible)
  const hasBranchNaming = (content.includes('feature/') || content.includes('feature-')) && 
                         (content.includes('fix/') || content.includes('fix-')) &&
                         (content.includes('branch') || content.includes('naming'));
  
  // Also check for common branch patterns
  const hasBranchPatterns = /(feature|fix|docs|refactor|test)[\/\-]/.test(content) &&
                           content.includes('name') || content.includes('convention');
  
  if (hasBranchNaming || hasBranchPatterns) {
    patterns.push({
      id: `workflow-branch-naming-doc-${Date.now()}`,
      title: 'Git Branch Naming Convention (Document-extracted)',
      type: 'workflow-rule',
      category: 'git-workflow',
      tags: ['git', 'document-extracted', 'branch', 'naming'],
      content: 'Standard branch naming convention for feature development, bug fixes, and documentation.',
      source: {
        type: 'project-doc',
        location: filepath,
        reference: 'Branch Strategy section'
      },
      maturity: 'proven',
      patternDetails: {
        formats: ['feature/<name>', 'fix/<name>', 'docs/<name>', 'refactor/<name>', 'test/<name>']
      }
    });
  }
  
  return patterns;
}

// Filter out duplicates
function filterDuplicates(newPatterns, existingPatterns) {
  return newPatterns.filter(newPattern => {
    // Check if a similar pattern already exists
    return !existingPatterns.some(existing => {
      const sameCategory = existing.category === newPattern.category;
      const similarTitle = (existing.title.includes('Semantic') && newPattern.title.includes('Semantic')) ||
                          (existing.title.includes('Branch') && newPattern.title.includes('Branch')) ||
                          (existing.title.includes('Commit') && newPattern.title.includes('Commit'));
      return sameCategory && similarTitle;
    });
  });
}

// Main export
export async function extractPatternsFromDocument(markdownContent, filepath, existingPatterns = null) {
  const actualExistingPatterns = existingPatterns !== null 
    ? existingPatterns 
    : await loadExistingPatterns();
    
  const newPatterns = analyzeMarkdownContent(markdownContent, filepath);
  return filterDuplicates(newPatterns, actualExistingPatterns);
}

// Also export for testing
export { filterDuplicates };
