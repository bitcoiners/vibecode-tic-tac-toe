# Next Session Guide

## Where We Are
- **Branch**: \`memory\`
- **Directory**: \`docs/memory-feature-plan/\`
- **Status**: Planning complete, ready for MVP implementation

## What to Do First
\`\`\`bash
# Start fresh
git checkout memory
cd docs/memory-feature-plan

# Review the plan
cat next-steps.md

# Begin MVP implementation
mkdir schemas
\`\`\`

## MVP Tasks (Milestone 1)
1. **Define data schemas** (\`schemas/\` directory)
2. **Create knowledge base structure** (\`knowledge-base/\` directory)
3. **Build git history extractor** (simple script)
4. **Build workflow document extractor** (for GIT_WORKFLOW.md, etc.)
5. **Create manual extraction template**
6. **Test with current project data**
7. **Document the process**

## Key Principles
1. **Start simple**: Manual extraction before automation
2. **Generalize**: Remove project-specific details
3. **Validate**: Ensure patterns are truly reusable
4. **Document**: Record everything as we build

## Success Criteria for Next Session
- Can manually create 5 knowledge entries
- Can extract 3 workflow rules from existing documents
- Basic directory structure exists
- Extraction template is usable

## Files to Reference
- \`next-steps.md\` - Detailed task list
- \`roadmap.md\` - Full development timeline
- \`architecture.md\` - System design
- \`WORKFLOW_EXTRACTION_EXAMPLE.md\` - Example pattern extraction
- \`EXTERNAL_INTEGRATION_EXAMPLE.md\` - External source integration example

## Questions to Ask During Implementation
1. Is this pattern truly reusable across projects?
2. Have we removed all project-specific details?
3. Is the implementation simple enough to maintain?
4. Can others easily understand and use this?
5. Does this solve a real problem others face?
