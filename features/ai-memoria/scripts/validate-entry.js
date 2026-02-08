#!/usr/bin/env node

import { readFileSync } from 'fs';
import { dirname, join, basename, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load schema
const schemaPath = join(__dirname, '../schemas/knowledge-entry.schema.json');
const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));

function validateEntry(entryPath) {
  try {
    const entry = JSON.parse(readFileSync(entryPath, 'utf8'));
    
    console.log(`\n🔍 Validating: ${basename(entryPath)}`);
    
    // Check required fields
    const required = schema.required || [];
    const missing = required.filter(field => !entry[field]);
    
    if (missing.length > 0) {
      console.error(`❌ Missing required fields: ${missing.join(', ')}`);
      return false;
    }
    
    // Check type enum
    if (schema.properties.type && schema.properties.type.enum) {
      if (!schema.properties.type.enum.includes(entry.type)) {
        console.error(`❌ Invalid type: ${entry.type}. Must be one of: ${schema.properties.type.enum.join(', ')}`);
        return false;
      }
    }
    
    // Check tags array
    if (entry.tags && (!Array.isArray(entry.tags) || entry.tags.length === 0)) {
      console.error('❌ Tags must be a non-empty array');
      return false;
    }
    
    console.log('✅ Entry is valid!');
    console.log(`   Title: ${entry.title}`);
    console.log(`   Type: ${entry.type}`);
    console.log(`   Category: ${entry.category}`);
    console.log(`   Tags: ${entry.tags.join(', ')}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Error validating ${entryPath}:`, error.message);
    return false;
  }
}

// If file path provided as argument, validate it
if (process.argv[2]) {
  const entryPath = resolve(process.argv[2]);
  process.exit(validateEntry(entryPath) ? 0 : 1);
} else {
  console.log('Usage: node validate-entry.js <path-to-json-entry>');
  console.log('Example: node validate-entry.js ../schemas/example-workflow-rule.json');
}
