# ai-memoria 🧠

**Capture everything valuable from your projects: learnings, workflow rules, patterns, and best practices.**

> *A comprehensive memory system that extracts reusable knowledge from projects. Currently embedded in vibecode-tic-tac-toe, but designed to become a standalone NPM package.*

## 🚀 What Does It Capture?

### 1. **Project Learnings**
- Code patterns that worked well
- Architectural decisions and trade-offs
- Testing strategies and coverage patterns
- Problem-solving approaches

### 2. **Workflow Rules & Processes**
- Git workflows and commit conventions
- Code review standards and quality gates
- CI/CD pipeline configurations
- Team collaboration patterns

### 3. **Tooling & Automation**
- Scripts that automate repetitive tasks
- Development environment setups
- Code generation templates
- Monitoring and alerting configurations

### 4. **Best Practices & Anti-Patterns**
- What consistently works well across projects
- What to avoid and why
- Common pitfalls and solutions

### 5. **External Knowledge Integration**
- AI development patterns (from everything-claude-code)
- Cross-project insights and benchmarks

## 📁 Quick Start
```bash
# Once complete:
npm install ai-memoria
npx memoria init          # Initialize memory system
npx memoria extract       # Extract from project docs, git, chat logs
npx memoria new-project   # Create project with accumulated knowledge
npx memoria search        # Search workflow rules and patterns
```

## 🏗️ Structure
```
ai-memoria/
├── ai-memoria-memory.md     # Tracks THIS project's development
├── docs/                    # Planning, architecture, examples
├── schemas/                 # Data schemas for ALL knowledge types
├── knowledge-base/          # Extracted patterns and rules
│   ├── workflows/          # Git, CI/CD, review processes
│   ├── patterns/           # Code, architecture patterns
│   ├── tooling/            # Automation scripts
│   ├── anti-patterns/      # What to avoid
│   └── best-practices/     # Proven approaches
├── scripts/                 # Extraction tools
└── templates/               # Project startup templates
```

## 🎯 Current Status: **Milestone 1 (MVP Foundation)**
We're building the foundational MVP. See [ai-memoria-memory.md](ai-memoria-memory.md) for real-time progress.

### Immediate Tasks:
1. [ ] Define data schemas for ALL knowledge types
2. [ ] Create knowledge base structure with 5 categories
3. [ ] Build workflow document extractor (GIT_WORKFLOW.md, etc.)
4. [ ] Extract first patterns from current project

## 📚 Documentation
- **[Feature Plan](docs/FEATURE_PLAN.md)** - Complete project overview and scope
- **[Architecture](docs/architecture.md)** - Three-layer system design
- **[Roadmap](docs/roadmap.md)** - 5 milestones from MVP to standalone package
- **[Next Steps](docs/next-steps.md)** - Immediate tasks
- **[Examples](docs/)** - Workflow extraction, external integration, startup scripts

## 🔗 Real-World Sources We Extract From
- **Project Documentation**: `GIT_WORKFLOW.md`, `CODING_STANDARDS.md`, `AI_AGENT_BRIEF*.md`
- **Git History**: Commit messages, PR descriptions, code changes
- **Conversation Logs**: AI chat history, meeting notes, decision records
- **External Sources**: `everything-claude-code` repository (AI development patterns)

## 🛠️ Development
Follow our progress in [ai-memoria-memory.md](ai-memoria-memory.md) where we're building this tool while using it to capture our own development patterns.

---

**Part of**: vibecode-tic-tac-toe project  
**Future**: Standalone NPM package `ai-memoria`
