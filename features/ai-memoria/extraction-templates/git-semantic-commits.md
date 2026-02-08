# Pattern Extraction: Semantic Commit Messages

## Pattern Name
Semantic Commit Messages with Conventional Commits

## Knowledge Type
workflow-rule

## Description
Standardized format for Git commit messages that clearly communicates the intent and type of change. Based on Conventional Commits specification.

## Context/Problem Solved
Inconsistent commit messages make project history hard to read, automate changelog generation difficult, and reduce team collaboration efficiency.

## Source
docs/GIT_WORKFLOW.md (Project documentation)

## Pattern Details
```markdown
Format: `<type>[optional scope]: <description>`

Types:
- feat:     New feature or functionality
- fix:      Bug fix
- docs:     Documentation changes
- style:    Code style/formatting (no logic change)
- refactor: Code restructuring (no behavior change)
- test:     Test-related changes
- chore:    Maintenance/building tasks
- perf:     Performance improvements

Rules:
1. Type is required and must be lowercase
2. Scope is optional in parentheses
3. Description is required, imperative mood ("add" not "added")
4. Body (optional) explains WHAT and WHY
5. Footer (optional) for breaking changes or issue references

Examples:
- feat(auth): add OAuth2 login support
- fix: resolve memory leak in cache layer
- docs: update API endpoint documentation
- chore: update dependencies to latest versions
```

## Implementation Steps
1. Install commitlint and husky if not present
2. Add commitlint.config.js with conventional config
3. Set up git hook to validate commits
4. Train team on commit types and format

## Validation Criteria
- Commit messages follow `<type>: <description>` format
- Type is one of allowed values
- Description is in imperative mood
- No trailing punctuation in subject line

## Related Patterns
Branch naming conventions, PR template, automated changelog generation

## Maturity Level
proven (tested in production across multiple projects)

## Dependencies
git, commitlint (optional but recommended)
