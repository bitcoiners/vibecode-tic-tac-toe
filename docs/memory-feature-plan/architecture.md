# Memory System Architecture

## Overview
A three-layer system for capturing, generalizing, and reusing project learnings.

## Layer 1: Project Memory System

### Purpose
Document everything happening in the CURRENT project without data loss.

### Components
```
docs/memory-system/
├── sections/               # Modular content by concern
│   ├── 01-project-overview.md
│   ├── 02-architecture.md
│   ├── 03-decisions.md
│   ├── 04-progress.md
│   ├── 05-problems-solved.md
│   └── 06-next-steps.md
├── archive/                # Timestamped versions
├── changelog.md           # All changes tracked
└── scripts/               # Automation
    ├── update-memory.sh
    ├── update-section.sh
    └── update-recent.sh
```

## Layer 2: Generic Knowledge Base

### Purpose
Store project-agnostic patterns that can be reused anywhere.

### Components
```
docs/knowledge-base/
├── categories/
│   ├── workflows/         # Development processes
│   ├── patterns/          # Technical patterns
│   ├── tooling/          # Automation & scripts
│   ├── anti-patterns/    # What to avoid
│   └── templates/        # Project starters
├── index.json            # Search index
└── extraction-guide.md   # How to create entries
```

## Layer 3: Learning Extraction Pipeline

### Purpose
Automatically identify and extract learnings from project activity.

### Components
```
scripts/memory-pipeline/
├── extractors/
│   ├── git-extractor.js    # From commit messages
│   ├── chat-extractor.js   # From conversation logs
│   ├── test-extractor.js   # From test results
│   └── code-extractor.js   # From code changes
├── transformers/
│   ├── generalize.js       # Remove project specifics
│   ├── categorize.js       # Assign categories
│   └── validate.js         # Check completeness
├── storage/
│   ├── save-knowledge.js   # Store in knowledge base
│   └── update-index.js     # Update search
└── pipeline-runner.js      # Orchestrate everything
```

## Extraction Sources

### 1. Project Activity Sources
- **Git History**: Commit messages, PR descriptions, code changes
- **Conversation Logs**: Chat history, meeting notes, decision records
- **Code Changes**: Refactoring patterns, architecture decisions
- **Test Results**: What worked, what failed, coverage patterns
- **Documentation**: README updates, comments, API docs

### 2. Workflow & Process Sources
- **Workflow Documents**: `GIT_WORKFLOW.md`, `CODING_STANDARDS.md`, etc.
- **Configuration Files**: `package.json` scripts, CI/CD configs, linter rules
- **Template Files**: Project starters, code generators, document templates
- **Validation Scripts**: Quality gates, test runners, build scripts

### 3. Meta-Sources (Process about the process)
- **How decisions were made** about workflows
- **Evolution of standards** over time
- **Team feedback** on what works/doesn't work
- **Performance metrics** of different workflows
