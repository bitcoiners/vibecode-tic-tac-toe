# Workflow Extraction Example

## Source: GIT_WORKFLOW.md

### Raw Rule:
"All commits must follow conventional commit format: type(scope): description"

### Extracted Pattern:
**Category**: Workflow/Git
**Type**: Mandatory Rule
**Pattern**: Conventional Commit Format
**Format**: \`type(scope): description\`
**Allowed Types**: feat, fix, docs, style, refactor, test, chore
**Scope**: Optional component/feature name
**Description**: Concise summary of changes

### Why This is Valuable:
- Enables automated changelog generation
- Makes commit history searchable and meaningful
- Provides context for code reviewers
- Standardizes team communication

### How to Apply to Other Projects:
1. Add commitlint configuration
2. Set up pre-commit hook
3. Document allowed commit types
4. Train team on the format

### Implementation Example:
\`\`\`bash
# package.json
{
  "scripts": {
    "commit": "cz",
    "lint:commit": "commitlint --edit"
  },
  "devDependencies": {
    "@commitlint/cli": "^17.0.0",
    "@commitlint/config-conventional": "^17.0.0",
    "commitizen": "^4.0.0"
  }
}

# .commitlintrc.js
module.exports = {
  extends: ["@commitlint/config-conventional"]
};
\`\`\`

### Tags:
#git #workflow #commit #conventional-commits #automation
