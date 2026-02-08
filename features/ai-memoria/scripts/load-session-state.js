
/**
 * AI-Memoria Session State Loader
 * Loads previous session state for cross-chat continuity
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class SessionStateLoader {
  constructor(options = {}) {
    this.stateDir = options.stateDir || path.join(__dirname, '..', 'session-states');
  }

  async listSessions() {
    try {
      await fs.mkdir(this.stateDir, { recursive: true });
      const files = await fs.readdir(this.stateDir);
      
      const sessions = [];
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(this.stateDir, file);
          const content = await fs.readFile(filePath, 'utf8');
          const session = JSON.parse(content);
          sessions.push({
            id: session.sessionId,
            capturedAt: session.capturedAt,
            summary: session.summary,
            file: file
          });
        }
      }
      
      return sessions.sort((a, b) => 
        new Date(b.capturedAt) - new Date(a.capturedAt)
      );
    } catch (error) {
      return [];
    }
  }

  async loadSession(sessionId) {
    try {
      const filePath = path.join(this.stateDir, `${sessionId}.json`);
      const content = await fs.readFile(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Try to find by partial match
        const sessions = await this.listSessions();
        const matched = sessions.find(s => s.id.includes(sessionId));
        if (matched) {
          return this.loadSession(matched.id);
        }
      }
      throw error;
    }
  }

  async displaySession(session) {
    console.log('\n🚀 WELCOME BACK TO AI-MEMORIA');
    console.log('═══════════════════════════════════════════════');
    console.log(`📅 Session: ${session.sessionId}`);
    console.log(`⏰ Captured: ${new Date(session.capturedAt).toLocaleString()}`);
    console.log('');
    
    console.log('📋 PREVIOUS SESSION SUMMARY:');
    console.log('────────────────────────────');
    console.log(session.summary);
    console.log('');
    
    if (session.nextSteps && session.nextSteps.length > 0) {
      console.log('🎯 NEXT STEPS:');
      console.log('──────────────');
      session.nextSteps.forEach((step, i) => {
        console.log(`${i + 1}. ${step.trim()}`);
      });
      console.log('');
    }
    
    if (session.modifiedFiles && session.modifiedFiles.length > 0) {
      console.log('📁 RECENTLY MODIFIED FILES:');
      console.log('───────────────────────────');
      session.modifiedFiles.forEach(file => {
        console.log(`  • ${file}`);
      });
      console.log('');
    }
    
    if (session.gitStatus) {
      console.log('🔄 GIT STATUS:');
      console.log('──────────────');
      console.log(session.gitStatus);
      console.log('');
    }
    
    if (session.lastCommit) {
      console.log('💾 LAST COMMIT:');
      console.log('───────────────');
      console.log(session.lastCommit);
      console.log('');
    }
    
    if (session.notes) {
      console.log('📝 NOTES:');
      console.log('─────────');
      console.log(session.notes);
      console.log('');
    }
    
    console.log('💡 SUGGESTED START:');
    console.log('───────────────────');
    console.log('1. Review the above context');
    console.log('2. Continue with the next steps listed');
    console.log('3. Use: `node scripts/capture-session-state.js --id "new-session-id"` when done');
    console.log('');
    console.log('═══════════════════════════════════════════════\n');
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
    } else if (args[i] === '--latest' || args[i] === '-l') {
      options.latest = true;
    } else if (args[i] === '--list') {
      options.list = true;
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
🚀 AI-Memoria Session Loader Tool

Usage:
  node scripts/load-session-state.js [options]

Options:
  --id <session-id>     Load specific session by ID
  --latest, -l         Load the most recent session
  --list               List all available sessions
  --help, -h           Show this help message

Examples:
  node scripts/load-session-state.js --latest
  node scripts/load-session-state.js --id "feature-x"
  node scripts/load-session-state.js --list
      `);
      return;
    }
  }
  
  const loader = new SessionStateLoader(options);
  
  if (options.list) {
    const sessions = await loader.listSessions();
    if (sessions.length === 0) {
      console.log('No sessions found. Start by capturing one:');
      console.log('  node scripts/capture-session-state.js --id "your-session"');
    } else {
      console.log('\n📚 AVAILABLE SESSIONS:');
      console.log('═══════════════════════════════════════════════');
      sessions.forEach((session, i) => {
        console.log(`${i + 1}. ${session.id}`);
        console.log(`   📅 ${new Date(session.capturedAt).toLocaleString()}`);
        console.log(`   📋 ${session.summary.substring(0, 60)}...`);
        console.log('');
      });
      console.log('💡 Load with: node scripts/load-session-state.js --id "session-id"');
      console.log('═══════════════════════════════════════════════\n');
    }
    return;
  }
  
  let session;
  if (options.sessionId) {
    try {
      session = await loader.loadSession(options.sessionId);
    } catch (error) {
      console.error(`❌ Session not found: ${options.sessionId}`);
      console.log('💡 Try: node scripts/load-session-state.js --list');
      return;
    }
  } else if (options.latest) {
    const sessions = await loader.listSessions();
    if (sessions.length === 0) {
      console.log('No sessions found. Start by capturing one:');
      console.log('  node scripts/capture-session-state.js --id "your-first-session"');
      return;
    }
    session = await loader.loadSession(sessions[0].id);
  } else {
    console.log('❌ Please specify --id <session-id> or --latest');
    console.log('💡 Try: node scripts/load-session-state.js --help');
    return;
  }
  
  await loader.displaySession(session);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { SessionStateLoader };
