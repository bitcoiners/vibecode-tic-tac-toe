# Standalone Package Example

## Package: \`ai-memoria\`

### Installation:
\`\`\`bash
npm install --save-dev ai-memoria
# or globally
npm install -g ai-memoria
\`\`\`

### Basic Usage:

#### 1. Initialize in existing project:
\`\`\`bash
npx memory-system init
# Creates:
# - .memory-system/ directory
# - ai-memoria.config.js
# - Initial knowledge base structure
# - Git hooks for auto-extraction
\`\`\`

#### 2. Extract learnings from project history:
\`\`\`bash
npx memory-system extract --source git --since "1 month ago"
npx memory-system extract --source chat --file slack-export.json
npx memory-system extract --source docs --pattern "*.md"
\`\`\`

#### 3. Create new project with accumulated knowledge:
\`\`\`bash
npx memory-system new-project \
  --type web-app \
  --name my-new-app \
  --knowledge git-workflow testing security \
  --template react-node-postgres
\`\`\`

#### 4. Search knowledge base:
\`\`\`bash
npx memory-system search "testing strategy"
npx memory-system search --tag refactoring
npx memory-system search --category workflow
\`\`\`

#### 5. Sync across projects (optional):
\`\`\`bash
npx memory-system sync --to github
npx memory-system sync --from team-repo
\`\`\`

### Configuration Example (\`ai-memoria.config.js\`):
\`\`\`javascript
module.exports = {
  // Core settings
  projectType: "web-app",
  knowledgeBasePath: ".memory-system/knowledge/",
  
  // Extraction settings
  extractors: {
    git: {
      enabled: true,
      branch: "main",
      since: "6 months ago"
    },
    chat: {
      enabled: true,
      sources: ["slack", "discord"]
    },
    code: {
      enabled: true,
      patterns: ["refactor", "optimization", "bugfix"]
    }
  },
  
  // Storage settings
  storage: {
    local: true,
    cloud: {
      enabled: false,
      provider: "github",
      repo: "org/project-knowledge"
    }
  },
  
  // Plugin settings
  plugins: [
    "@ai-memoria/git-extractor",
    "@ai-memoria/chat-analyzer",
    "@ai-memoria/ai-patterns"
  ],
  
  // Template settings
  templates: {
    webApp: {
      structure: "feature-based",
      testing: "jest",
      styling: "tailwind"
    }
  }
};
\`\`\`

### Programmatic API Example:
\`\`\`javascript
const { ai-memoria } = require("ai-memoria");

// Initialize
const memory = new ai-memoria({
  projectPath: "./my-project"
});

// Extract learnings
await memory.extract({
  sources: ["git", "docs", "tests"],
  timeframe: "3 months"
});

// Search knowledge
const results = await memory.search({
  query: "error handling",
  categories: ["patterns", "workflows"]
});

// Create new project
await memory.createProject({
  type: "cli-tool",
  name: "my-cli",
  knowledge: ["git-workflow", "testing", "error-handling"]
});

// Get recommendations
const recommendations = await memory.getRecommendations({
  context: "adding tests to legacy code",
  projectType: "api-service"
});
\`\`\`

### Plugin Development Example:
\`\`\`javascript
// plugins/custom-extractor.js
module.exports = {
  name: "custom-extractor",
  version: "1.0.0",
  
  extract: async (context) => {
    // Custom extraction logic
    const learnings = await analyzeCustomSource(context);
    return learnings;
  },
  
  validate: (learning) => {
    // Custom validation logic
    return learning.hasPattern && learning.isGeneralizable;
  },
  
  categorize: (learning) => {
    // Custom categorization
    return {
      category: learning.type,
      tags: learning.keywords,
      confidence: learning.confidenceScore
    };
  }
};
\`\`\`

### Benefits of Standalone Package:
1. **Reusable**: Works with any project, any stack
2. **Extensible**: Plugin system for custom needs
3. **Community-driven**: Others can contribute patterns
4. **Maintainable**: Single codebase, regular updates
5. **Documented**: Centralized documentation
6. **Supported**: Issue tracking, releases, updates

### Publishing Plan:
1. **Alpha**: Internal use, basic functionality
2. **Beta**: Limited external testing
3. **v1.0**: Stable API, comprehensive features
4. **v2.0+:**: Community plugins, advanced features
