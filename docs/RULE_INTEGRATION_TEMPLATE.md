# RULE INTEGRATION TEMPLATE
## For Everything Claude Code Rule: [RULE_NAME.md]

### 📋 Integration Checklist

#### Phase 1: Source Analysis
- [ ] Locate and review source file: \`rules/common/[RULE_NAME.md]\`
- [ ] Extract core principles and requirements
- [ ] Identify project-specific adaptations needed

#### Phase 2: Documentation
- [ ] Create adapted version in \`docs/[ADAPTED_NAME].md\`
- [ ] Include: Core requirements, examples, project-specific guidance
- [ ] Update integration roadmap: \`docs/everything-claude-code-tips-integration-roadmap.md\`

#### Phase 3: AI Agent Brief Update
- [ ] Add to AI Agent Brief in \`docs/deepseek-chat-continue.md\`:
  \`\`\`
  #### [N]. [RULE_NAME] ([RULE_NAME.md]) - ✅ INTEGRATED
  **CORE REQUIREMENT:** [BRIEF SUMMARY]
  - **Key Point 1:** [Specific requirement]
  - **Key Point 2:** [Specific requirement]
  - **Examples:** [If applicable]
  - **Documentation:** [Reference to adapted file]
  \`\`\`

#### Phase 4: Validation
- [ ] Test rule application with a small, real task
- [ ] Verify rule is correctly followed by AI/developer
- [ ] Update success metrics in integration roadmap

#### Phase 5: Completion
- [ ] Mark as complete in integration roadmap
- [ ] Commit with appropriate type: \`docs: Integrate [RULE_NAME] rule\`
- [ ] Push and update memory document if needed

### 📝 Template for AI Agent Brief Entry
Copy-paste this format when adding new rules to the AI Agent Brief:

\`\`\`
#### [NEXT_NUMBER]. [RULE_NAME] ([RULE_NAME.md]) - ✅ INTEGRATED
**CORE REQUIREMENT:** [ONE_SENTENCE_SUMMARY]
- **Key Principle 1:** [Specific, actionable requirement]
- **Key Principle 2:** [Specific, actionable requirement]
- **Validation:** [How to verify compliance]
- **Documentation:** Full details in \`docs/[ADAPTED_NAME].md\`
\`\`\`

### 🎯 Example: Git Workflow Integration (Reference)
\`\`\`
#### 2. GIT WORKFLOW (git-workflow.md) - ✅ INTEGRATED & VERIFIED
**CORE REQUIREMENT:** Conventional Commit Format
- **Format:** \`<type>: <description>\` with detailed body
- **Types:** \`feat\`, \`fix\`, \`refactor\`, \`docs\`, \`test\`, \`chore\`, \`perf\`, \`ci\`
- **Validation:** Commit messages must match pattern
- **Documentation:** Full workflow in \`docs/GIT_WORKFLOW.md\`
\`\`\`

---
*Template created: 2026-02-07*
*Part of systematic Claude Code integration workflow*
