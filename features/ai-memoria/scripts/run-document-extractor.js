#!/usr/bin/env node
import { extractPatternsFromDocument } from "./workflow-document-extractor.js";
import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join, basename } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function extractFromFile(filepath) {
  try {
    console.log(`📖 Reading: ${filepath}`);
    const content = await readFile(filepath, "utf8");

    console.log("🔍 Analyzing document for patterns...");
    const patterns = await extractPatternsFromDocument(content, filepath);

    if (patterns.length === 0) {
      console.log("✅ No new patterns found in document");
      return [];
    }

    console.log(`🎯 Found ${patterns.length} pattern(s)`);

    // Save each pattern
    for (const pattern of patterns) {
      const safeName = basename(filepath).replace(/\.[^/.]+$/, "").replace(/[^a-z0-9]/gi, "-").toLowerCase();
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `doc-${safeName}-${timestamp}-${pattern.type}-${Date.now()}.json`;
      const savePath = join(__dirname, "..", "knowledge-base", "workflows", filename);

      await writeFile(savePath, JSON.stringify(pattern, null, 2));
      console.log(`💾 Saved: ${filename}`);
    }

    return patterns;
  } catch (error) {
    console.error(`❌ Error processing ${filepath}:`, error.message);
    return [];
  }
}

async function main() {
  console.log("📄 AI-Memoria Document Extractor");
  console.log("=================================\n");

  // Check for command line arguments
  const filesToProcess = process.argv.slice(2);

  if (filesToProcess.length === 0) {
    console.log("Usage: node run-document-extractor.js <file1.md> [file2.md ...]");
    console.log("Example: node run-document-extractor.js ../../docs/GIT_WORKFLOW.md");
    return;
  }

  let totalPatterns = 0;

  for (const filepath of filesToProcess) {
    console.log(`\n--- Processing: ${filepath} ---`);
    const patterns = await extractFromFile(filepath);
    totalPatterns += patterns.length;
  }

  console.log(`\n✨ Extraction complete! Found ${totalPatterns} total pattern(s)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(console.error);
}
