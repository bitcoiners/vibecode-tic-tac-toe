# 🔧 Git Workflow & Commit Standards
*Adapted from Everything Claude Code \`rules/common/git-workflow.md\`*

**Integration Date:** $(date +"%Y-%m-%d")
**Status:** Phase 1, Step 1 of Claude Code Integration Roadmap  
**Source:** Everything Claude Code → \`rules/common/git-workflow.md\`

## 📋 Core Principles (From Original)

### 1. Commit Message Format
\`\`\`
<type>: <description>

<optional body>
\`\`\`

**Types:** feat, fix, refactor, docs, test, chore, perf, ci

### 2. Pull Request Workflow
When creating PRs:
1. Analyze full commit history (not just latest commit)
2. Use \`git diff [base-branch]...HEAD\` to see all changes
3. Draft comprehensive PR summary
4. Include test plan with TODOs
5. Push with \`-u\` flag if new branch

### 3. Feature Implementation Workflow
1. **Plan First** - Create implementation plan
2. **TDD Approach** - Write tests first (RED), implement (GREEN), refactor (IMPROVE)
3. **Code Review** - Review code immediately after writing
4. **Commit & Push** - Detailed commit messages following format

## 🛠️ Project Adaptation for Tic-Tac-Toe PWA

### Agent Usage Adaptation
Since we'\''re not using Claude Code IDE, we adapt agent concepts:

| Original Agent | Our Adaptation |
|----------------|----------------|
| **planner agent** | Use \`docs/\` for planning: feature plans, integration roadmap |
| **tdd-guide agent** | Follow TDD workflow from \`testing.md\`: RED→GREEN→IMPROVE |
| **code-reviewer agent** | Self-review checklist in \`docs/deepseek-chat-continue.md\` |

### Detailed PR Workflow (Solo Developer)
1. **Before PR Creation:**
   \`\`\`bash
   # Analyze all changes vs main
   git diff main...HEAD --stat
   git diff main...HEAD --name-only
   \`\`\`
   
2. **PR Summary Template:**
   \`\`\`markdown
   ## What Changed
   [Brief description]
   
   ## Why This Change
   [Context, issue, feature]
   
   ## Testing Performed
   - [ ] \`npm test\` (73 tests passing)
   - [ ] \`npm run test:coverage\` (88.42%+ coverage)
   - [ ] Manual browser testing
   - [ ] Multiplayer testing (if applicable)
   
   ## Test Plan with TODOs
   - [ ] Future test improvements needed
   - [ ] Edge cases to test later
   - [ ] Integration test suggestions
   
   ## Screenshots (UI changes)
   [If applicable]
   \`\`\`

3. **Branch Management:**
   \`\`\`bash
   # New feature branch
   git checkout -b feature/ai-opponent
   
   # Push with upstream tracking
   git push -u origin feature/ai-opponent
   \`\`\`

### Feature Implementation Workflow (Adapted)
1. **Plan First**
   - Document approach in relevant \`docs/\` file
   - Identify dependencies in existing codebase
   - Break into TDD-friendly units

2. **TDD Approach** 
   - RED: Write failing Jest test
   - GREEN: Minimal implementation to pass
   - IMPROVE: Refactor with confidence (tests protect)
   - VERIFY: \`npm run test:coverage\` ensures 80%+

3. **Code Review** (Self-Review)
   - After each logical unit, review against:
     - Error handling completeness
     - Test coverage adequacy  
     - Code clarity and documentation
     - Security considerations (input validation, etc.)

4. **Commit & Push**
   - Atomic commits with conventional format
   - Descriptive commit bodies when needed
   - Regular pushes to avoid large changesets

## 📝 Practical Examples

### Implementing AI Opponent Feature:
\`\`\`bash
# 1. Plan in docs/ai-opponent-plan.md
# 2. Create branch
git checkout -b feature/ai-opponent

# 3. TDD cycles
#    test: Write test for AI valid move
#    feat: Implement random move logic
#    test: Add test for AI difficulty levels  
#    feat: Implement minimax algorithm

# 4. Self-review after each major component
# 5. Commit with conventional format
git commit -m "feat: Add minimax algorithm for AI opponent

- Implement minimax with alpha-beta pruning
- Add three difficulty levels (easy, medium, hard)
- Update gameEngine to support AI player turns"

# 6. Push and create PR
git push -u origin feature/ai-opponent
\`\`\`

### Fixing a Bug:
\`\`\`bash
# 1. Create bugfix branch  
git checkout -b bugfix/socket-reconnection

# 2. Write failing test reproducing issue
# 3. Fix the issue
# 4. Add regression test

# 5. Commit
git commit -m "fix: Resolve socket reconnection race condition

- Add mutex lock for reconnection state updates
- Prevent multiple simultaneous reconnection attempts
- Add test for reconnection race condition"

# 6. Push and PR with detailed test plan
\`\`\`

## 🔍 Quality Gates & Verification

**Pre-Commit:**
- [ ] Commit message follows \`<type>: <description>\` format
- [ ] All tests pass (\`npm test\`)
- [ ] Atomic change (single logical unit)

**Pre-PR:**
- [ ] \`git diff main...HEAD\` reviewed
- [ ] PR summary drafted with test plan
- [ ] 80%+ coverage maintained

**Pre-Merge:**
- [ ] Manual testing completed
- [ ] Documentation updated if needed
- [ ] No console warnings/errors

## 📚 Integration Status

This workflow integrates with:
- ✅ \`testing.md\` rule (80% coverage, TDD)
- 🔄 \`coding-style.md\` (next in Phase 1)
- 🔄 Agent concepts adapted for our toolchain

---
*Part of Claude Code Integration - Phase 1: Foundational Rules*
*See: [Integration Roadmap](everything-claude-code-tips-integration-roadmap.md)*
*Original: [git-workflow.md](https://github.com/affaan-m/everything-claude-code/blob/main/rules/common/git-workflow.md)*

## 🧪 Enhanced Workflow Test
Test commit following all enhanced workflow rules:
1. ✅ Conventional commit format
2. ✅ Agent concepts adapted
3. ✅ PR workflow simulated
4. ✅ git diff usage verification

Test completed: $(date +"%Y-%m-%d %H:%M:%S")
