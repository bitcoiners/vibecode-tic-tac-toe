# Project Startup Script Example

## Vision: \`new-project --type web-app --name myapp\`

### What it would do:
1. **Create project structure** with best-practice organization
2. **Set up memory system** for capturing new learnings
3. **Inject relevant knowledge** from past projects
4. **Configure tooling** (testing, linting, CI/CD)
5. **Initialize git** with proper hooks and workflows
6. **Set up documentation** with templates and guides

### Example Script Structure:
\`\`\`javascript
// scripts/project-startup/project-startup.js
const { program } = require("commander");
const inquirer = require("inquirer");
const fs = require("fs-extra");
const path = require("path");

program
  .name("new-project")
  .description("Initialize new project with accumulated knowledge")
  .version("1.0.0");

program
  .command("init")
  .description("Interactive project initialization")
  .action(async () => {
    // 1. Ask project type
    const { projectType } = await inquirer.prompt([
      {
        type: "list",
        name: "projectType",
        message: "Select project type:",
        choices: [
          "web-app",
          "api-service",
          "cli-tool",
          "library",
          "documentation"
        ]
      }
    ]);

    // 2. Ask project name
    const { projectName } = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: "Project name:",
        default: "my-project"
      }
    ]);

    // 3. Select knowledge to include
    const { knowledgeSelection } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "knowledgeSelection",
        message: "Select knowledge to include:",
        choices: [
          { name: "Git workflow rules", value: "git-workflow", checked: true },
          { name: "Testing strategies", value: "testing", checked: true },
          { name: "Code organization", value: "organization", checked: true },
          { name: "Security practices", value: "security", checked: true },
          { name: "Performance patterns", value: "performance", checked: false },
          { name: "AI development patterns", value: "ai-patterns", checked: true }
        ]
      }
    ]);

    console.log(\`Creating ${projectType}: ${projectName}...\`);
    
    // 4. Create project structure
    await createProjectStructure(projectType, projectName);
    
    // 5. Inject selected knowledge
    await injectKnowledge(projectType, knowledgeSelection);
    
    // 6. Set up memory system
    await setupMemorySystem(projectName);
    
    // 7. Configure tooling
    await configureTooling(projectType);
    
    console.log("✅ Project created successfully!");
    console.log("📚 Knowledge injected:", knowledgeSelection.join(", "));
    console.log("💡 Next: cd", projectName, "&& git init && npm install");
  });

program.parse();
\`\`\`

### Knowledge Injection Example:
\`\`\`javascript
// scripts/project-startup/knowledge-injector/injector.js
async function injectKnowledge(projectType, knowledgeSelection) {
  const knowledgeBase = await loadKnowledgeBase();
  
  // Filter knowledge relevant to project type and selection
  const relevantKnowledge = knowledgeBase.filter(item => 
    knowledgeSelection.includes(item.category) &&
    item.applicableTo.includes(projectType)
  );
  
  // Inject into appropriate files
  for (const knowledge of relevantKnowledge) {
    await injectIntoFile(knowledge, projectType);
  }
  
  // Create knowledge summary
  await createKnowledgeSummary(relevantKnowledge);
}

function injectIntoFile(knowledge, projectType) {
  // Example: Inject testing pattern into test setup
  if (knowledge.category === "testing") {
    const testFile = path.join(projectDir, "tests", "setup.js");
    const content = \`// ${knowledge.title}\\n// ${knowledge.description}\\n\\n${knowledge.implementationExample}\`;
    fs.appendFileSync(testFile, content);
  }
  
  // Example: Add git hooks for workflow rules
  if (knowledge.category === "git-workflow") {
    const hookFile = path.join(projectDir, ".git", "hooks", "pre-commit");
    fs.writeFileSync(hookFile, knowledge.hookImplementation);
  }
}
\`\`\`

### Benefits:
- **Accelerated start**: No need to research best practices
- **Consistency**: Same high standards across all projects
- **Knowledge preservation**: Patterns don't get lost between projects
- **Continuous improvement**: New projects benefit from all past learning
- **Customizable**: Tailored to specific project needs

### Integration Points:
- Works with existing knowledge base
- Can be extended with new project types
- Supports plugin system for custom knowledge
- Integrates with CI/CD for validation
- Tracks usage for pattern improvement
