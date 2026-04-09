#!/usr/bin/env node
/**
 * Verification script to check if the daily generation system is properly set up
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n🔍 Checking Daily Article Generation System Setup\n');

const checks = {
  passed: [],
  failed: [],
  warnings: []
};

// Check 1: Node.js version
try {
  const version = execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`✓ Node.js ${version} installed`);
  checks.passed.push('Node.js');
} catch (err) {
  console.log('✗ Node.js not found');
  checks.failed.push('Node.js');
}

// Check 2: ANTHROPIC_API_KEY
if (process.env.ANTHROPIC_API_KEY) {
  const keyLength = process.env.ANTHROPIC_API_KEY.length;
  console.log(`✓ ANTHROPIC_API_KEY set (${keyLength} chars)`);
  checks.passed.push('API Key');
} else {
  console.log('✗ ANTHROPIC_API_KEY not set');
  checks.failed.push('API Key');
  checks.warnings.push('Set API key: setx ANTHROPIC_API_KEY "sk-ant-..."');
}

// Check 3: Required files
const requiredFiles = [
  'generate-article.js',
  'automate-daily-articles.js',
  'daily-articles.txt',
  'test-generation.js'
];

console.log('\nRequired files:');
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`  ✓ ${file}`);
    checks.passed.push(file);
  } else {
    console.log(`  ✗ ${file} missing`);
    checks.failed.push(file);
  }
}

// Check 4: Setup scripts
console.log('\nSetup scripts available:');
if (fs.existsSync('setup-windows-scheduler.bat')) {
  console.log('  ✓ setup-windows-scheduler.bat (Windows)');
  checks.passed.push('Windows setup');
} else {
  console.log('  ✗ setup-windows-scheduler.bat missing');
}

if (fs.existsSync('setup-linux-cron.sh')) {
  console.log('  ✓ setup-linux-cron.sh (Mac/Linux)');
  checks.passed.push('Linux setup');
} else {
  console.log('  ✗ setup-linux-cron.sh missing');
}

// Check 5: npm packages
console.log('\nDependencies:');
try {
  require('@anthropic-ai/sdk');
  console.log('  ✓ @anthropic-ai/sdk installed');
  checks.passed.push('Anthropic SDK');
} catch (err) {
  console.log('  ✗ @anthropic-ai/sdk not installed');
  checks.failed.push('Anthropic SDK');
  checks.warnings.push('Run: npm install');
}

// Check 6: Content directory
if (fs.existsSync('content/posts')) {
  console.log('\n✓ content/posts directory exists');
  checks.passed.push('Content directory');
} else {
  console.log('\n✗ content/posts directory not found');
  checks.failed.push('Content directory');
}

// Check 7: npm scripts
console.log('\nAvailable npm scripts:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const scripts = ['generate:article', 'generate:daily', 'automate:start', 'test-generation'];
for (const script of scripts) {
  if (packageJson.scripts[script]) {
    console.log(`  ✓ npm run ${script}`);
  } else {
    console.log(`  ✗ npm run ${script}`);
  }
}

// Summary
console.log('\n' + '═'.repeat(50));
console.log('📊 SUMMARY');
console.log('═'.repeat(50));
console.log(`✓ Passed: ${checks.passed.length}`);
console.log(`✗ Failed: ${checks.failed.length}`);

if (checks.warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  checks.warnings.forEach(w => console.log(`  • ${w}`));
}

if (checks.failed.length === 0) {
  console.log('\n✅ System is ready for daily article generation!');
  console.log('\nNext steps:');
  console.log('1. Test: node test-generation.js');
  console.log('2. Setup scheduler:');
  console.log('   • Windows: setup-windows-scheduler.bat');
  console.log('   • Mac/Linux: ./setup-linux-cron.sh');
  console.log('3. Monitor: tail -f logs/articles-*.log');
} else {
  console.log('\n⚠️  Please fix issues above before deploying');
}

console.log('\n' + '═'.repeat(50) + '\n');
