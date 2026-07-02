#!/usr/bin/env node

/**
 * Sync version from package.json to index.html
 * This script is automatically run after npm version command
 */

const fs = require('fs');
const path = require('path');

// Read package.json version
const packageJson = require('../package.json');
const version = packageJson.version;

// Read index.html
const indexPath = path.join(__dirname, '../public/index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Replace version in index.html
const versionRegex = /<small style="font-size: 0\.7em; opacity: 0\.7;">v[\d.]+<\/small>/;
const newVersionTag = `<small style="font-size: 0.7em; opacity: 0.7;">v${version}</small>`;

if (versionRegex.test(indexHtml)) {
  indexHtml = indexHtml.replace(versionRegex, newVersionTag);
  fs.writeFileSync(indexPath, indexHtml, 'utf8');
  console.log(`✓ Updated index.html to version ${version}`);
} else {
  console.error('✗ Could not find version tag in index.html');
  process.exit(1);
}
