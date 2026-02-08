#!/usr/bin/env node
import { extractPatternsFromCommits } from './git-history-extractor.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));

async function getGitCommitMessages(limit = 50) {
  try {
    const { stdout } = await execAsync(
      `git log --oneline -${limit} --pretty=format:"%s"`
    );
    return stdout.split('\n').filter(msg => msg.trim());
  } catch (error) {
    console.error('Error reading git log:', error.message);
    return [];
  }
}

async function savePattern(pattern) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `git-extracted-${timestamp}.json`;
  const filepath = join(__dirname, '..', 'knowledge-base', 'workflows', filename);
  
  try {
    await writeFile(filepath, JSON.stringify(pattern, null, 2));
    console.log(`✅ Pattern saved: ${filepath}`);
    return true;
  } catch (error) {
    console.error('Error saving pattern:', error.message);
    return false;
  }
}

async function main() {
  console.log('🔍 AI-Memoria Git History Extractor');
  console.log('====================================\n');
  
  // Get commit messages
  console.log('📝 Reading git history...');
  const commitMessages = await getGitCommitMessages();
  
  if (commitMessages.length === 0) {
    console.log('❌ No commit messages found');
    return;
  }
  
  console.log(`📊 Found ${commitMessages.length} commit(s)\n`);
  
  // Extract patterns
  console.log('🔧 Analyzing commit patterns...');
  const patterns = await extractPatternsFromCommits(commitMessages);
  
  if (patterns.length === 0) {
    console.log('✅ No new patterns found (or duplicates filtered out)');
    console.log('Examples of commit messages analyzed:');
    commitMessages.slice(0, 5).forEach((msg, i) => {
      console.log(`  ${i + 1}. ${msg}`);
    });
    return;
  }
  
  // Save patterns
  console.log(`🎯 Found ${patterns.length} new pattern(s):`);
  
  for (const pattern of patterns) {
    console.log(`\n📋 Pattern: ${pattern.title}`);
    console.log(`   Type: ${pattern.type}`);
    console.log(`   Source: ${pattern.source.reference}`);
    
    const saved = await savePattern(pattern);
    if (saved) {
      console.log('   Status: ✅ Saved to knowledge base');
    }
  }
  
  console.log('\n✨ Extraction complete!');
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(console.error);
}
