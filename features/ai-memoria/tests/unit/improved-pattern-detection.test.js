import { analyzeMarkdownContent } from '../../scripts/workflow-document-extractor.js';

describe('Improved Pattern Detection', () => {
  test('should NOT detect branch pattern in AI agent document', () => {
    // Arrange: AI agent document that should NOT have branch patterns
    const aiAgentContent = `
# AI Agent Brief

This document describes AI agent interaction patterns.
It contains words like "feature" and "fix" but NOT about git branches.

## Agent Communication
- The agent should feature clear communication
- Fix any misunderstandings promptly
- Document all interactions
    `;

    // Act
    const patterns = analyzeMarkdownContent(aiAgentContent, 'docs/AI_AGENT_BRIEF.md');

    // Assert: Should NOT find branch pattern (this test will FAIL initially)
    const branchPatterns = patterns.filter(p => p.title.includes('Branch'));
    expect(branchPatterns).toHaveLength(0);
  });

  test('should detect coding standards pattern specifically', () => {
    // Arrange: Coding standards content
    const codingContent = `
# Coding Standards

## ESLint Configuration
We use ESLint with the following rules:
- indent: 2 spaces
- quotes: single
- semi: true

## Prettier Setup
Prettier configuration:
- printWidth: 80
- tabWidth: 2
- semi: true
    `;

    const patterns = analyzeMarkdownContent(codingContent, 'docs/CODING_STANDARDS.md');

    // Assert: Should detect coding standards pattern (will FAIL initially)
    expect(patterns.some(p =>
      p.title.includes('Coding') || p.title.includes('ESLint') || p.title.includes('Prettier')
    )).toBe(true);
  });

  test('should distinguish between git and general "feature/fix" terms', () => {
    // Test 1: Git-specific content SHOULD trigger branch pattern
    const gitContent = `
## Git Branch Strategy
Create branches like: feature/new-auth, fix/login-bug, docs/api-update
Use git flow methodology.
    `;

    const gitPatterns = analyzeMarkdownContent(gitContent, 'docs/GIT_WORKFLOW.md');
    const hasBranchPattern = gitPatterns.some(p => p.title.includes('Branch'));

    // Test 2: General content should NOT trigger branch pattern
    const generalContent = `
## Product Features
Main features: user authentication, payment processing
Bug fixes: login issues, performance problems
    `;

    const generalPatterns = analyzeMarkdownContent(generalContent, 'product.md');
    const hasFalsePositive = generalPatterns.some(p => p.title.includes('Branch'));

    // Assert: Git content should trigger, general should not
    expect(hasBranchPattern).toBe(true);
    expect(hasFalsePositive).toBe(false);
  });
});
