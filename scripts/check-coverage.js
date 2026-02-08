import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 Checking test coverage against 80% threshold...\n');

try {
  // Run jest coverage
  console.log('Running jest coverage...');
  execSync('npx jest --coverage', { 
    encoding: 'utf8',
    stdio: 'inherit'
  });

  // Read the correct coverage file
  const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-final.json');
  
  if (!fs.existsSync(coveragePath)) {
    console.error('❌ Coverage report not found at:', coveragePath);
    
    // List available coverage files
    const coverageDir = path.join(process.cwd(), 'coverage');
    if (fs.existsSync(coverageDir)) {
      const files = fs.readdirSync(coverageDir);
      console.log('Available coverage files:', files.join(', '));
    }
    
    process.exit(1);
  }

  const coverageData = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
  
  // Extract gameSync.js coverage from the Istanbul format
  const gameSyncKey = Object.keys(coverageData).find(key => 
    key.includes('gameSync.js') || key.endsWith('src/client/gameSync.js')
  );
  
  if (!gameSyncKey) {
    console.error('❌ Could not find gameSync.js in coverage data');
    console.log('Available keys (first 5):', Object.keys(coverageData).slice(0, 5).join(', '));
    process.exit(1);
  }

  const gameSyncCoverage = coverageData[gameSyncKey];
  
  // Calculate percentages from Istanbul data structure
  const statements = gameSyncCoverage.s;
  const branches = gameSyncCoverage.b;
  const functions = gameSyncCoverage.f;
  const lines = gameSyncCoverage.statementMap;
  
  const statementCount = Object.keys(statements).length;
  const coveredStatements = Object.values(statements).filter(v => v > 0).length;
  const statementPct = statementCount > 0 ? Math.round((coveredStatements / statementCount) * 10000) / 100 : 0;
  
  const branchCount = Object.keys(branches).length;
  const coveredBranches = Object.values(branches).filter(arr => arr.some(v => v > 0)).length;
  const branchPct = branchCount > 0 ? Math.round((coveredBranches / branchCount) * 10000) / 100 : 0;
  
  const functionCount = Object.keys(functions).length;
  const coveredFunctions = Object.values(functions).filter(v => v > 0).length;
  const functionPct = functionCount > 0 ? Math.round((coveredFunctions / functionCount) * 10000) / 100 : 0;
  
  const lineCount = Object.keys(lines).length;
  const coveredLines = Object.values(statements).filter(v => v > 0).length;
  const linePct = lineCount > 0 ? Math.round((coveredLines / lineCount) * 10000) / 100 : 0;

  console.log('\n📊 Current gameSync.js coverage:');
  console.log(`   Statements: ${statementPct}% (${coveredStatements}/${statementCount})`);
  console.log(`   Branches:   ${branchPct}% (${coveredBranches}/${branchCount})`);
  console.log(`   Functions:  ${functionPct}% (${coveredFunctions}/${functionCount})`);
  console.log(`   Lines:      ${linePct}% (${coveredLines}/${lineCount})`);
  console.log('');

  // Check against 80% threshold
  const thresholds = {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80
  };

  const actualValues = {
    statements: statementPct,
    branches: branchPct,
    functions: functionPct,
    lines: linePct
  };

  let failed = false;
  
  for (const [metric, threshold] of Object.entries(thresholds)) {
    const actual = actualValues[metric];
    if (actual < threshold) {
      console.error(`❌ ${metric}: ${actual}% < ${threshold}% threshold`);
      failed = true;
    } else {
      console.log(`✅ ${metric}: ${actual}% >= ${threshold}%`);
    }
  }

  if (failed) {
    console.error('\n🚫 Phase 6 Rule Violated: gameSync.js coverage below 80%');
    console.error('   Action: Fix bugs and add tests for uncovered lines');
    process.exit(1);
  } else {
    console.log('\n✅ Phase 6 Rule Satisfied: gameSync.js coverage meets 80% threshold');
  }

} catch (error) {
  console.error('Error checking coverage:', error.message);
  process.exit(1);
}
