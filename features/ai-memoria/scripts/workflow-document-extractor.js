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

// STRICTER pattern detection with better context
export function analyzeMarkdownContent(markdownContent, filepath) {
  const patterns = [];
  const content = markdownContent.toLowerCase();
  const filename = filepath.toLowerCase();
  
  // 1. SEMANTIC COMMITS: Very specific detection
  const hasExplicitSemanticCommits = (content.includes('feat:') || content.includes('feat(')) && 
                                     (content.includes('fix:') || content.includes('fix(')) &&
                                     (content.includes('semantic commit') || 
                                      content.includes('conventional commit') ||
                                      content.includes('commit message format'));
  
  const hasCommitTypeList = content.includes('feat') && content.includes('fix') && 
                           content.includes('docs') && content.includes('type') &&
                           (content.includes('commit') || content.includes('message'));
  
  if (hasExplicitSemanticCommits || hasCommitTypeList) {
    patterns.push({
      id: `workflow-semantic-commits-doc-${Date.now()}`,
      title: 'Semantic Commit Messages (Document-extracted)',
      type: 'workflow-rule',
      category: 'git-workflow',
      tags: ['git', 'document-extracted', 'semantic-commits', 'markdown'],
      content: 'Semantic commit message format following Conventional Commits specification.',
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
  
  // 2. BRANCH NAMING: FIXED - Skip detection in AI documents
  // Check if this is an AI document first
  const isAIDoc = filename.includes('ai') || filename.includes('agent') || 
                  filename.includes('llm') || filename.includes('chat');
  
  // Only proceed with branch detection if NOT an AI document
  if (!isAIDoc) {
    const hasStrongGitContext = (content.includes('git') || content.includes('version control')) &&
                               (content.includes('branch') || content.includes('merge') || 
                                content.includes('checkout') || filename.includes('git'));
    
    // FIXED regex that handles backticks and <placeholders>
    const hasExplicitBranchExamples = /(?:`)?(feature|fix|docs|refactor|test|chore|perf|bugfix|hotfix)[\/\-<].*/i.test(markdownContent);
    
    const hasBranchNamingSection = content.includes('branch naming') || 
                                  content.includes('branch strategy') ||
                                  content.includes('git branch');
    
    // Only trigger if we have STRONG evidence of git branch patterns
    if ((hasExplicitBranchExamples || hasBranchNamingSection) && hasStrongGitContext) {
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
  }
  
  // 3. CODING STANDARDS: More specific
  const hasCodingStandards = (content.includes('eslint') || content.includes('prettier') ||
                             content.includes('linter') || content.includes('formatter')) &&
                             (content.includes('coding') || content.includes('standard') ||
                              content.includes('style guide') || filename.includes('coding'));
  
  const hasConfigExamples = content.includes('indent:') || content.includes('quotes:') ||
                           content.includes('semi:') || content.includes('printwidth:') ||
                           content.includes('tabwidth:');
  
  if ((hasCodingStandards || hasConfigExamples) && filename.includes('standard')) {
    patterns.push({
      id: `best-practice-coding-standards-${Date.now()}`,
      title: 'Coding Standards with ESLint/Prettier (Document-extracted)',
      type: 'best-practice',
      category: 'code-quality',
      tags: ['javascript', 'document-extracted', 'eslint', 'prettier', 'formatting'],
      content: 'Code formatting and linting standards using ESLint and Prettier.',
      source: {
        type: 'project-doc',
        location: filepath,
        reference: 'Coding Standards section'
      },
      maturity: 'proven',
      patternDetails: {
        tools: ['ESLint', 'Prettier'],
        commonRules: ['indent: 2 spaces', 'quotes: single', 'semi: true']
      }
    });
  }
  
  // 4. AI AGENT: More specific - only in AI files
  if (isAIDoc) {
    const hasAIAgentTerms = (content.includes('ai agent') || content.includes('llm') ||
                            content.includes('large language model') || content.includes('assistant')) &&
                            (content.includes('prompt') || content.includes('interaction') ||
                             content.includes('conversation') || filename.includes('ai'));
    
    const hasAgentPatterns = content.includes('system prompt') || content.includes('user:') ||
                            content.includes('assistant:') || content.includes('role:') ||
                            content.includes('temperature:') || content.includes('max tokens:');
    
    if ((hasAIAgentTerms || hasAgentPatterns) && filename.includes('ai')) {
      patterns.push({
        id: `workflow-ai-agent-${Date.now()}`,
        title: 'AI Agent Interaction Patterns (Document-extracted)',
        type: 'workflow-rule',
        category: 'ai-interaction',
        tags: ['ai', 'document-extracted', 'llm', 'prompt', 'interaction'],
        content: 'Patterns for interacting with AI assistants and LLMs.',
        source: {
          type: 'project-doc',
          location: filepath,
          reference: 'AI Agent section'
        },
        maturity: 'tested',
        patternDetails: {
          interactionTypes: ['system prompts', 'user messages', 'assistant responses']
        }
      });
    }
  }
  
  return patterns;
}

// Filter out duplicates
function filterDuplicates(newPatterns, existingPatterns) {
  return newPatterns.filter(newPattern => {
    return !existingPatterns.some(existing => {
      const sameCategory = existing.category === newPattern.category;
      const similarTitle = (existing.title.includes('Semantic') && newPattern.title.includes('Semantic')) ||
                          (existing.title.includes('Branch') && newPattern.title.includes('Branch')) ||
                          (existing.title.includes('Coding') && newPattern.title.includes('Coding')) ||
                          (existing.title.includes('AI') && newPattern.title.includes('AI'));
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
