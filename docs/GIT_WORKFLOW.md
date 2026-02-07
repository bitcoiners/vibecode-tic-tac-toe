# 🔧 Git Workflow & Commit Standards
*Adapted from Everything Claude Code \`rules/common/git-workflow.md\`*

**Integration Date:** $(date +"%Y-%m-%d")
**Status:** Phase 1, Step 1 of Claude Code Integration Roadmap
**Source:** Everything Claude Code → \`rules/common/git-workflow.md\`

## 📋 Core Principles

### 1. Commit Message Format
Follow the Conventional Commits specification exactly as defined in source:

\`\`\`
<type>: <description>

<optional body>
\`\`\`

**Types from source:** \`feat\`, \`fix\`, \`refactor\`, \`docs\`, \`test\`, \`chore\`, \`perf\`, \`ci\`

**Project-specific guidance:**
- \`feat:\` Use for Phase 7 features (AI opponent, score tracking, etc.)
- \`fix:\` Bug fixes discovered during testing
- \`refactor:\` Code improvements without changing behavior
- \`docs:\` Documentation updates (like this integration)
- \`test:\` Adding or improving tests (TDD workflow)
- \`chore:\` Build process, tooling, or configuration changes
- \`perf:\` Performance improvements (if needed for game sync)
- \`ci:\` CI/CD pipeline changes (Render.com deployment)

**Examples for our project:**
\`\`\`
feat: Add AI opponent with minimax algorithm
fix: Resolve socket reconnection race condition
docs: Integrate git-workflow from Everything Claude Code
test: Add HTML integration test for API consistency
refactor: Improve gameSync error handling structure
\`\`\`

### 2. Pull Request Workflow (Adapted for Solo Development)
**Even as a solo developer, follow PR discipline:**
1. **Analyze full commit history** before creating PR
2. **Use \`git diff main...HEAD\`** to review all changes in feature branch
3. **Draft comprehensive PR summary** on GitHub including:
   - What changed and why
   - Testing performed (\`npm test\`, \`npm run test:coverage\`)
   - Manual testing results
   - Related to which Phase/feature
4. **Include test plan with TODOs** for future improvements
5. **Push with \`-u\` flag** for new branches: \`git push -u origin feature/ai-opponent\`

### 3. Feature Implementation Workflow
**Adapted from source with our TDD integration:**
1. **Plan First** (Enhanced for our project)
   - Review existing implementation plan in \`docs/\`
   - Identify dependencies (e.g., AI opponent needs gameEngine enhancements)
   - Break into TDD-friendly chunks
   - Document in \`docs/\` before coding

2. **TDD Approach** (Already integrated from \`testing.md\`)
   - **RED:** Write failing test for smallest unit of behavior
   - **GREEN:** Implement minimal code to pass test
   - **IMPROVE:** Refactor while keeping tests green
   - **VERIFY:** Ensure 80%+ coverage with \`npm run test:coverage\`

3. **Code Review** (Self-review process)
   - After each significant change, review your own code
   - Check for: Code smells, test coverage, error handling
   - Use checklist from \`docs/deepseek-chat-continue.md\`
   - Address critical issues immediately

4. **Commit & Push**
   - Write detailed commit messages following format above
   - Ensure atomic commits (one logical change per commit)
   - Push regularly to avoid large, unwieldy changesets

## 🛠️ Practical Implementation for Tic-Tac-Toe PWA

### Branch Strategy for Phase 7:
\`\`\`
main (stable, deployed)
├── feature/ai-opponent           # AI player implementation
├── feature/score-tracking        # Win/loss statistics
├── feature/player-avatars        # User customization
├── docs/claude-code-integration  # Workflow improvements
└── bugfix/                       # Any discovered issues
\`\`\`

### Workflow for Implementing AI Opponent:
\`\`\`bash
# 1. Plan
#    - Review gameEngine.js capabilities
#    - Design minimax/algorithm approach
#    - Create test plan

# 2. Create feature branch
git checkout -b feature/ai-opponent

# 3. TDD Cycle
#    test: Write test for AI making valid move
#    feat: Implement random move AI (simplest)
#    test: Add test for AI blocking
#    feat: Implement defensive logic
#    ... continue TDD cycles

# 4. Self-review
#    - Run all tests: npm test
#    - Check coverage: npm run test:coverage
#    - Manual test in browser

# 5. Commit with conventional format
git commit -m "feat: Implement basic AI opponent with random moves"

# 6. Push and create PR (for tracking)
git push -u origin feature/ai-opponent
# Create PR on GitHub with comprehensive summary
\`\`\`

### Quality Gates (From source + our adaptations):
- **Pre-commit:** All tests pass, commit message follows format
- **Pre-PR:** Full diff reviewed, test plan documented
- **Pre-merge:** 80%+ coverage, manual testing completed

## 📝 Integration with Existing Workflow
### Connection to Already-Integrated \`testing.md\`:
- Git workflow provides the **commit/PR discipline**
- Testing rules provide the **quality standards** (80% coverage)
- Together they form complete development workflow

### Updates to Project Documentation:
1. **CONTRIBUTING.md** should reference this git workflow
2. **Phase 7 feature plans** should follow this process
3. **Future commits** must use the conventional format

## 🔍 Verification & Success Metrics
**Success Criteria for This Integration:**
- [ ] Next 5 commits use correct conventional format
- [ ] Next feature branch follows the workflow above
- [ ] PR created on GitHub with comprehensive summary (even solo)
- [ ] All quality gates pass before merge

## 📚 Next Steps in Integration Roadmap
1. **Immediate:** Apply this workflow to next commit
2. **Next:** Review \`coding-style.md\` for Phase 1 completion
3. **Future:** Consider implementing git hooks for automated format validation

---
*Part of Claude Code Integration - Phase 1: Foundational Rules*
*See: [Integration Roadmap](everything-claude-code-tips-integration-roadmap.md)*
*Previous Integration: [Testing Rules](docs/deepseek-chat-continue.md#phase-6-retrospective--key-learnings)*
