
/**
 * AI-Memoria Session State Capture
 * Captures project state at end of development session for cross-chat continuity
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class SessionStateCapture {
  constructor(options = {}) {
    this.sessionId = options.sessionId || `session-${Date.now()}`;
    this.stateDir = options.stateDir || path.join(__dirname, '..', 'session-states');
    this.projectRoot = path.join(__dirname, '..', '..', '..');
  }

  async getGitStatus() {
    try {
      return execSync('git status --short', { 
        cwd: this.projectRoot,
        encoding: 'utf8' 
      }).trim();
    } catch (error) {
      return 'Git status not available';
    }
  }

  async getModifiedFiles() {
    try {
      const output = execSync('git status --porcelain', { 
        cwd: this.projectRoot,
        encoding: 'utf8' 
      });
      
      return output
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.substring(3).trim())
        .filter(file => file.includes('ai-memoria'))
        .slice(0, 10); // Limit to 10 most relevant files
    } catch (error) {
      return [];
    }
  }

  async getLastCommitMessage() {
    try {
      return execSync('git log -1 --oneline', { 
        cwd: this.projectRoot,
        encoding: 'utf8' 
      }).trim();
    } catch (error) {
      return 'No recent commits';
    }
  }

  async captureState(stateData) {
    try {
      // Ensure directory exists
      await fs.mkdir(this.stateDir, { recursive: true });
      
      // Get additional context
      const gitStatus = await this.getGitStatus();
      const modifiedFiles = await this.getModifiedFiles();
      const lastCommit = await this.getLastCommitMessage();
      
      // Create state object
      const state = {
        sessionId: this.sessionId,
        capturedAt: new Date().toISOString(),
        project: 'ai-memoria',
        gitStatus,
        modifiedFiles,
        lastCommit,
        ...stateData
      };
      
      // Save to file
      const filePath = path.join(this.stateDir, `${this.sessionId}.json`);
      await fs.writeFile(filePath, JSON.stringify(state, null, 2));
      
      console.log('\n📋 SESSION STATE CAPTURED');
      console.log('═══════════════════════════════════════════════');
      console.log(`Session ID: ${this.sessionId}`);
      console.log(`Saved to: ${filePath}`);
      console.log(`Summary: ${stateData.summary || 'No summary provided'}`);
      console.log('');
      console.log('📌 Next session, load with:');
      console.log(`  node scripts/load-session-state.js --id ${this.sessionId}`);
      console.log('═══════════════════════════════════════════════\n');
      
      return filePath;
    } catch (error) {
      console.error('❌ Error capturing session state:', error.message);
      return null;
    }
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  const options = {};
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--id' && args[i + 1]) {
      options.sessionId = args[i + 1];
      i++;
    } else if (args[i] === '--summary' && args[i + 1]) {
      options.summary = args[i + 1];
      i++;
    } else if (args[i] === '--next' && args[i + 1]) {
      options.nextSteps = args[i + 1];
      i++;
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
📋 AI-Memoria Session Capture Tool

Usage:
  node scripts/capture-session-state.js [options]

Options:
  --id <session-id>     Unique identifier for this session
  --summary <text>      Brief summary of what was accomplished
  --next <text>         Next steps (comma-separated)
  --help, -h           Show this help message

Examples:
  node scripts/capture-session-state.js --id "feature-x" --summary "Implemented pattern extraction" --next "Test extraction, update docs"
  node scripts/capture-session-state.js --id "debug-session" --summary "Fixed false positives in pattern detection"
      `);
      return;
    }
  }
  
  const capturer = new SessionStateCapture(options);
  
  const stateData = {
    summary: options.summary || 'Development session completed',
    nextSteps: options.nextSteps ? options.nextSteps.split(',') : ['Continue development'],
    notes: 'Add any additional notes about decisions, challenges, or insights'
  };
  
  await capturer.captureState(stateData);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { SessionStateCapture };
