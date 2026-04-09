#!/usr/bin/env node
/**
 * Test the daily article generation system
 * 
 * This generates a few test articles to verify:
 * - Content generation works
 * - Images are properly assigned
 * - Files are saved correctly
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const TEST_ARTICLES = [
  { title: 'Quick Tips for Better Sleep', category: 'health' },
  { title: 'Smart Ways to Save Money Fast', category: 'finance' },
  { title: 'Best AI Tools for 2025', category: 'technology' },
];

function titleToSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function testGeneration() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('❌ ANTHROPIC_API_KEY not set');
    process.exit(1);
  }

  console.log('🧪 Testing Daily Article Generation System\n');
  console.log('📋 Test Articles:');
  TEST_ARTICLES.forEach((a, i) => {
    console.log(`  ${i + 1}. "${a.title}" (${a.category})`);
  });
  console.log();

  const client = new Anthropic({ apiKey });
  const results = { success: 0, failed: 0 };

  for (const article of TEST_ARTICLES) {
    const slug = titleToSlug(article.title);
    const outputPath = path.join('content', 'posts', article.category, `${slug}.md`);
    
    // Remove test file if it exists
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
      console.log(`🗑️  Removed existing: ${slug}`);
    }

    console.log(`\n📝 Generating: "${article.title}"`);
    console.log(`   Category: ${article.category}`);

    try {
      const { spawn } = require('child_process');
      
      await new Promise((resolve, reject) => {
        const proc = spawn('node', ['generate-article.js', article.title, article.category], {
          cwd: process.cwd(),
          stdio: 'inherit'
        });

        proc.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Process exited with code ${code}`));
          }
        });
      });

      if (fs.existsSync(outputPath)) {
        const content = fs.readFileSync(outputPath, 'utf8');
        const lines = content.split('\n');
        
        // Extract image URL from frontmatter
        const imageMatch = content.match(/coverImage: "([^"]+)"/);
        const image = imageMatch ? imageMatch[1] : 'NOT FOUND';
        
        console.log(`   ✅ Saved: ${outputPath}`);
        console.log(`   🖼️  Image: ${image}`);
        console.log(`   📊 Lines: ${lines.length}`);
        
        results.success++;
      } else {
        console.log(`   ❌ File not found after generation`);
        results.failed++;
      }
    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
      results.failed++;
    }
  }

  console.log('\n═══════════════════════════════════════');
  console.log(`📊 Test Results: ${results.success}/${TEST_ARTICLES.length} successful`);
  
  if (results.success === TEST_ARTICLES.length) {
    console.log('✅ All tests passed! System is ready.');
    console.log('\nNext steps:');
    console.log('1. Review generated articles in content/posts/');
    console.log('2. Check that images match article content');
    console.log('3. Run: npm run generate:daily  (to generate 15 articles)');
    console.log('4. Setup automation:');
    console.log('   - Windows: setup-windows-scheduler.bat');
    console.log('   - Mac/Linux: ./setup-linux-cron.sh');
  } else {
    console.log(`❌ ${results.failed} tests failed. Check errors above.`);
    process.exit(1);
  }
}

testGeneration().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
