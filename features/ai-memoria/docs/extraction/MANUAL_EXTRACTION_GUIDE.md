# Manual Pattern Extraction Guide
*How to extract reusable knowledge from project documentation*

## 📋 Overview
This guide documents the process we followed to extract the first two patterns for ai-memoria. Use this as a template for future extractions.

## 🎯 Step-by-Step Process

### Step 1: Identify Source Material
1. **Browse project documentation** for reusable patterns:
   - Workflow standards (git, CI/CD, processes)
   - Code patterns and architecture decisions
   - Tooling and automation scripts
   - Best practices and anti-patterns

2. **Good candidate patterns:**
   - Repeated processes
   - Standards that work across projects
   - Solutions to common problems
   - Things teams often forget/re-learn

**Example:** We started with `docs/GIT_WORKFLOW.md`

### Step 2: Select Specific Pattern
Choose one specific, valuable pattern to extract:

**Criteria for good patterns:**
- ✅ Self-contained (can be understood independently)
- ✅ Reusable (applies to other projects)
- ✅ Tested/proven (has been used successfully)
- ✅ Clear value (solves a real problem)

**Example:** Semantic commit message format from git workflow

### Step 3: Fill Extraction Template
Use the manual extraction template:

```bash
cp extraction-templates/manual-extraction.md extraction-templates/your-pattern-name.md
```

**Template sections to complete:**
- Pattern Name
- Knowledge Type (workflow-rule, code-pattern, best-practice, etc.)
- Description & Problem Solved
- Pattern Details (format, rules, examples)
- Implementation Steps
- Validation Criteria
- Related Patterns
- Maturity Level

### Step 4: Convert to JSON Schema
Transform the template content into our unified JSON format:

**Key required fields:**
```json
{
  "id": "unique-id-001",
  "title": "Pattern Title",
  "content": "Detailed description",
  "type": "workflow-rule|code-pattern|best-practice|etc",
  "category": "category-name",
  "tags": ["tag1", "tag2"],
  "source": {
    "type": "project-doc|git-history|chat-log|etc",
    "location": "source/file/path",
    "reference": "specific section"
  }
}
```

### Step 5: Validate the Pattern
```bash
node scripts/validate-entry.js your-pattern.json
```


### Step 6: Store in Knowledge Base
Place the validated JSON in the appropriate directory:
- `knowledge-base/workflows/` - Processes and standards
- `knowledge-base/patterns/` - Code and architecture
- `knowledge-base/best-practices/` - Proven approaches
- `knowledge-base/anti-patterns/` - What to avoid
- `knowledge-base/tooling/` - Automation scripts

### Step 7: Update Progress
1. **Update memory file:** Document what was extracted
2. **Commit with semantic message:** Use the pattern you just extracted!
3. **Consider root project integration:** Does this pattern need to be referenced elsewhere?

## 🎯 Real Example: Semantic Commit Messages

### Source Analysis
From `docs/GIT_WORKFLOW.md` we identified:
- Commit message format specification
- 8 commit types with descriptions
- 5 formatting rules
- Practical examples

### Extraction Decisions
1. **Type:** `workflow-rule` (it's a process standard)
2. **Category:** `git-workflow` (specific domain)
3. **Maturity:** `proven` (widely adopted standard)
4. **Tags:** `git, workflow, commit, conventional-commits, automation`

### Validation Success
```bash
✅ Entry is valid!
   Title: Semantic Commit Messages with Conventional Commits
   Type: workflow-rule
   Category: git-workflow
   Tags: git, workflow, commit, conventional-commits, automation
```

## 🚨 Common Issues & Solutions

### Issue: Schema validation fails
**Solution:** Check required fields:
- ✅ id, title, content, type, category, tags
- ✅ source object with type, location, reference

### Issue: Markdown formatting breaks in commands
**Solution:** Use techniques from our pattern:
- Heredoc with unique delimiters
- Escaped backticks
- printf for multi-line

### Issue: Pattern too vague or too specific
**Solution:** Ensure pattern is:
- Specific enough to implement
- General enough to reuse
- Includes clear examples

## 🚀 Next: Automated Extraction
Once manual extraction is mastered, we'll build:
1. Git history extractor (patterns from commit messages)
2. Document parser (patterns from markdown/docs)
3. Chat log analyzer (patterns from AI conversations)

---

*Documented based on extracting first 2 patterns for ai-memoria*
*Date: 2024-01-15*
*Status: Tested and validated*
