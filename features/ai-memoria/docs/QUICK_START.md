# Quick Start Guide
## Get Started with AI-Memoria in 5 Minutes

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- Git installed
- Basic terminal/command line knowledge

### 1. Clone and Navigate
```bash
# Navigate to your project
cd /path/to/your/project

# If starting fresh:
git clone <your-repo-url>
cd <project-name>/features/ai-memoria
```

### 2. Verify Installation
```bash
# Check Node.js version
node --version  # Should be 18+

# Run validation test
node scripts/validate-entry.js schemas/example-workflow-rule.json
# Should see: "✓ Entry is valid against schema"
```

## 🎯 Your First 5 Minutes

### Minute 1-2: Understand the Concept
AI-Memoria captures reusable patterns from your work. Think:
- "What patterns do I keep re-creating?"
- "What standards does my team always forget?"
- "What solutions work consistently?"

### Minute 3: Capture Your First Pattern
```bash
# Look at the manual extraction template
cat extraction-templates/manual-extraction.md

# Or use the automated extractor on a document
node scripts/run-document-extractor.js ../../docs/GIT_WORKFLOW.md
```

### Minute 4: Validate Your Pattern
```bash
# If you created a pattern manually, validate it
node scripts/validate-entry.js path/to/your-pattern.json
```

### Minute 5: Use Cross-Chat Continuity
```bash
# End your session
node scripts/capture-session-state.js --id "my-first-session" --summary "Learned AI-Memoria basics" --next "Extract patterns from my project"

# Next session, continue where you left off
node scripts/load-session-state.js --id "my-first-session"
```

## 📖 Common Use Cases

### For Individual Developers
```bash
# 1. Capture your coding standards
node scripts/run-document-extractor.js ../../docs/CODING_STANDARDS.md

# 2. Remember context between AI sessions
node scripts/capture-session-state.js --id "feature-dev-$(date +%F)"

# 3. Build personal knowledge base
#    Add patterns to knowledge-base/workflows/
```

### For Team Leads
```bash
# 1. Establish team standards
#    Capture patterns in knowledge-base/workflows/

# 2. Ensure consistency
#    Reference patterns during code reviews

# 3. Accelerate onboarding
#    New team members learn from knowledge base
```

### For Project Managers
```bash
# 1. Capture project decisions
#    Add to knowledge-base/workflows/decision-logging.md

# 2. Maintain project continuity
#    Use session states for handoffs

# 3. Build institutional memory
#    Prevent knowledge loss when team members leave
```

## 🔧 Essential Commands Cheat Sheet

### Pattern Management
```bash
# Extract patterns from documents
node scripts/run-document-extractor.js <path/to/document.md>

# Validate a pattern
node scripts/validate-entry.js <path/to/pattern.json>

# List all patterns
find knowledge-base/ -name "*.json" -o -name "*.md" | sort
```

### Session Continuity
```bash
# Start: Load previous session
node scripts/load-session-state.js --latest

# During: Work as normal

# End: Capture for next time
node scripts/capture-session-state.js --id "descriptive-name" --summary "What you did" --next "What's next"
```

### Development & Testing
```bash
# Run all tests
npm test

# Run specific test
npm test -- <test-file-name>

# Check project status
node scripts/validate-entry.js schemas/example-workflow-rule.json
```

## 📚 Next Steps After Quick Start

### Day 1: Exploration
1. Browse existing patterns in `knowledge-base/`
2. Try extracting patterns from your documentation
3. Test cross-chat continuity with a real work session

### Week 1: Integration
1. Make capturing patterns part of your workflow
2. Start using session continuity daily
3. Identify gaps in your knowledge base

### Month 1: Mastery
1. Have 50+ patterns in your knowledge base
2. Experience zero context loss between sessions
3. Measure productivity improvements

## 🆘 Troubleshooting

### Common Issues
**"Command not found"**: Ensure you're in `features/ai-memoria/` directory

**"Module not found"**: Run `npm install` if you see module errors

**"Session not found"**: Check available sessions with `node scripts/load-session-state.js --list`

### Getting Help
1. Check the [INDEX.md](INDEX.md) for documentation
2. Review error messages carefully
3. Ensure Node.js version is 18+

## 📞 Support & Community

### Documentation
- [INDEX.md](INDEX.md) - Complete documentation index
- [FEATURE_PLAN.md](FEATURE_PLAN.md) - Project vision and roadmap
- [PROGRESS_REPORT.md](PROGRESS_REPORT.md) - Current status and achievements

### Learning Resources
- Start with this Quick Start guide
- Review patterns in `knowledge-base/` for examples
- Practice with your own documentation

### Next Level
Once comfortable with basics:
1. Create custom extractors for your specific needs
2. Integrate with your CI/CD pipeline
3. Build team knowledge sharing workflows

---
*Start capturing your institutional memory today--- >> docs/QUICK_START.md
