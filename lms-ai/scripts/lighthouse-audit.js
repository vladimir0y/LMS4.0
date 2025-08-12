#!/usr/bin/env node

/**
 * Lighthouse Audit Script for LMS Application
 * 
 * This script runs Lighthouse audits on the LMS application to verify:
 * - Performance score > 90
 * - Accessibility score > 90
 * 
 * Usage:
 * 1. Start dev server: npm run dev
 * 2. Run audit: node scripts/lighthouse-audit.js
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // URL to audit (make sure dev server is running)
  url: 'http://localhost:3000',
  
  // Lighthouse options
  options: {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility'],
    port: undefined, // will be set when Chrome launches
  },

  // Chrome flags for consistent testing
  chromeFlags: [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage'
  ],

  // Score thresholds
  thresholds: {
    performance: 90,
    accessibility: 90
  }
};

/**
 * Launch Chrome and run Lighthouse audit
 */
async function runAudit() {
  console.log('🚀 Starting Lighthouse audit...\n');
  
  let chrome;
  
  try {
    // Launch Chrome
    console.log('📱 Launching Chrome...');
    chrome = await chromeLauncher.launch({
      chromeFlags: CONFIG.chromeFlags
    });
    
    CONFIG.options.port = chrome.port;
    
    // Run Lighthouse
    console.log(`🔍 Auditing ${CONFIG.url}...`);
    const runnerResult = await lighthouse(CONFIG.url, CONFIG.options);
    
    // Extract scores
    const scores = {
      performance: Math.round(runnerResult.lhr.categories.performance.score * 100),
      accessibility: Math.round(runnerResult.lhr.categories.accessibility.score * 100)
    };
    
    // Save HTML report
    const reportPath = path.join(__dirname, '..', 'lighthouse-report.html');
    fs.writeFileSync(reportPath, runnerResult.report);
    console.log(`📊 Report saved to: ${reportPath}`);
    
    // Display results
    displayResults(scores);
    
    // Check if scores meet thresholds
    const passed = checkThresholds(scores);
    
    if (passed) {
      console.log('\n✅ All Lighthouse audits PASSED!');
      process.exit(0);
    } else {
      console.log('\n❌ Some Lighthouse audits FAILED!');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 Lighthouse audit failed:', error.message);
    process.exit(1);
  } finally {
    if (chrome) {
      await chrome.kill();
    }
  }
}

/**
 * Display audit results in a formatted table
 */
function displayResults(scores) {
  console.log('\n📈 LIGHTHOUSE AUDIT RESULTS');
  console.log('════════════════════════════');
  
  Object.entries(scores).forEach(([category, score]) => {
    const threshold = CONFIG.thresholds[category];
    const status = score >= threshold ? '✅ PASS' : '❌ FAIL';
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    
    console.log(`${categoryName.padEnd(15)}: ${score}/100 ${status} (threshold: ${threshold})`);
  });
}

/**
 * Check if all scores meet the defined thresholds
 */
function checkThresholds(scores) {
  let allPassed = true;
  
  Object.entries(CONFIG.thresholds).forEach(([category, threshold]) => {
    if (scores[category] < threshold) {
      allPassed = false;
    }
  });
  
  return allPassed;
}

/**
 * Check if dev server is running
 */
async function checkDevServer() {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(CONFIG.url, { method: 'HEAD', timeout: 5000 });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🧪 LMS Lighthouse Audit Tool');
  console.log('═══════════════════════════\n');
  
  // Check if dev server is running
  console.log('🔍 Checking if dev server is running...');
  const serverRunning = await checkDevServer();
  
  if (!serverRunning) {
    console.error(`❌ Dev server is not running at ${CONFIG.url}`);
    console.log('💡 Please start the dev server first:');
    console.log('   npm run dev\n');
    process.exit(1);
  }
  
  console.log('✅ Dev server is running\n');
  
  // Run the audit
  await runAudit();
}

// Handle unhandled errors
process.on('unhandledRejection', (error) => {
  console.error('💥 Unhandled error:', error);
  process.exit(1);
});

// Run the main function if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = { runAudit, CONFIG };
