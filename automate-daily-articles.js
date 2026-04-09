#!/usr/bin/env node
/**
 * Daily Article Auto-Generator
 * 
 * Generates 15 articles daily with relevant images from daily-articles.txt
 * 
 * Usage:
 *   node automate-daily-articles.js
 * 
 * Setup (Windows Task Scheduler):
 *   1. Open Task Scheduler
 *   2. Create Basic Task → "InfoDaily Auto-Generate Articles"
 *   3. Trigger: Daily at 2:00 AM
 *   4. Action: Program = node.exe
 *   5. Arguments: C:\path\to\automate-daily-articles.js
 *   6. Start in: C:\path\to\project\
 * 
 * Setup (Mac/Linux cron):
 *   crontab -e
 *   0 2 * * * cd /path/to/project && node automate-daily-articles.js
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function getLogFile() {
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  const today = formatDate(new Date());
  return path.join(logsDir, `articles-${today}.log`);
}

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  
  const logFile = getLogFile();
  fs.appendFileSync(logFile, logMessage + '\n', 'utf8');
}

async function generateDailyArticles() {
  log('========================================');
  log('📝 Starting daily article generation');
  log('========================================');

  const batchFile = path.join(process.cwd(), 'daily-articles.txt');
  
  if (!fs.existsSync(batchFile)) {
    log('❌ daily-articles.txt not found');
    process.exit(1);
  }

  // Check API key
  if (!process.env.ANTHROPIC_API_KEY) {
    log('❌ ANTHROPIC_API_KEY not set');
    log('   Set it in your environment variables before scheduling');
    process.exit(1);
  }

  return new Promise((resolve, reject) => {
    log(`📂 Loading articles from: ${batchFile}`);
    
    const generateProcess = spawn('node', ['generate-article.js', '--batch', 'daily-articles.txt'], {
      cwd: process.cwd(),
      stdio: 'pipe',
      env: {
        ...process.env,
        FORCE_COLOR: '1'
      }
    });

    let output = '';
    let errorOutput = '';

    generateProcess.stdout.on('data', (data) => {
      output += data.toString();
      log(data.toString().trimEnd());
    });

    generateProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      log('ERR: ' + data.toString().trimEnd());
    });

    generateProcess.on('close', (code) => {
      if (code === 0) {
        log('✅ Daily generation completed successfully');
        
        // Parse success count from output
        const successMatch = output.match(/(\d+) created/);
        if (successMatch) {
          log(`📊 Generated ${successMatch[1]} articles with relevant Unsplash images`);
        }
        
        log('========================================\n');
        resolve();
      } else {
        log(`❌ Generator exited with code ${code}`);
        log('========================================\n');
        reject(new Error(`Generator failed with code ${code}`));
      }
    });

    generateProcess.on('error', (err) => {
      log(`❌ Failed to start generator: ${err.message}`);
      reject(err);
    });
  });
}

async function main() {
  try {
    await generateDailyArticles();
    process.exit(0);
  } catch (err) {
    log(`❌ Error: ${err.message}`);
    process.exit(1);
  }
}

main();
