import { extractPatternsFromDocument, analyzeMarkdownContent } from '../../scripts/workflow-document-extractor.js';

describe('Workflow Document Extractor', () => {
  test('should extract git workflow patterns from markdown', async () => {
    const markdownContent = `
# Git Workflow

## Commit Messages

We use semantic commit messages:

\`\`\`
feat: new feature
fix: bug fix
docs: documentation
\`\`\`

## Branch Naming

Branches should follow: feature/name, fix/name, docs/name
    `;
    
    const patterns = await extractPatternsFromDocument(markdownContent, 'docs/GIT_WORKFLOW.md');
    
    expect(patterns.length).toBeGreaterThan(0);
    expect(patterns.some(p => p.title.includes('Git'))).toBe(true);
  });
  
  test('should return empty array for non-pattern content', async () => {
    const markdownContent = `
# Some Random Document
    
Just some text without any patterns or standards.
Nothing to extract here.
    `;
    
    const patterns = await extractPatternsFromDocument(markdownContent, 'random.md');
    
    expect(patterns).toHaveLength(0);
  });
  
  test('should detect semantic commit message pattern specifically', async () => {
    const markdownContent = `
## Commit Messages

We follow the Conventional Commits specification:

\`\`\`
<type>[optional scope]: <description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance
- perf: Performance
\`\`\`
    `;
    
    const patterns = await extractPatternsFromDocument(markdownContent, 'docs/GIT_WORKFLOW.md', []);
    
    expect(patterns.some(p => 
      p.title.includes('Semantic') || p.title.includes('Commit')
    )).toBe(true);
  });
  
  test('should detect branch naming pattern', async () => {
    const markdownContent = `
## Branch Strategy

### Branch Naming Convention

- \`feature/<name>\` - New features
- \`fix/<name>\` - Bug fixes  
- \`docs/<name>\` - Documentation
- \`refactor/<name>\` - Code refactoring
- \`test/<name>\` - Test additions
    `;
    
    const patterns = await extractPatternsFromDocument(markdownContent, 'docs/GIT_WORKFLOW.md');
    
    expect(patterns.some(p => p.title.includes('Branch'))).toBe(true);
  });
  
  test('analyzeMarkdownContent should detect at least one pattern', () => {
    const markdownContent = `
## Some Standards

Use \`feature/\` for features, \`fix/\` for bugs.
Also use semantic commits: feat:, fix:, docs:
    `;
    
    const patterns = analyzeMarkdownContent(markdownContent, 'test.md');
    
    // Should detect at least one pattern (branch naming OR semantic commits)
    expect(patterns.length).toBeGreaterThan(0);
    
    // Check that detected patterns have expected properties
    if (patterns.length > 0) {
      expect(patterns[0]).toHaveProperty('title');
      expect(patterns[0]).toHaveProperty('type', 'workflow-rule');
    }
  });
});
