/**
 * This module exports the main functionality from cleanupMergedBranches.js
 * but with injectable dependencies to make it testable
 */

const { execSync } = require('child_process');

// Helper functions
function run(cmd, options = {}) {
  console.log(`$ ${cmd}`);
  return execSync(cmd, { stdio: 'inherit', ...options });
}

function tryRun(cmd) {
  try {
    run(cmd);
    return true;
  } catch (err) {
    console.warn(`⚠️ Warning (ignored): '${cmd}' failed.`);
    return false;
  }
}

function getOutput(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

// Core functionality, extracted for testability
function identifyMergedBranches(execFn) {
  const fn = execFn || getOutput;
  const mergedList = fn('git branch --merged main');
  return mergedList
    .split('\n')
    .map(line => line.replace('*', '').trim())
    .filter(name => name && !['main','develop','release'].includes(name));
}

function deleteBranch(branch, execFn, dryRun = false) {
  const fn = execFn || run;
  try {
    if (!dryRun) {
      fn(`git branch -d ${branch}`);
      fn(`git push origin --delete ${branch}`);
    }
    return true;
  } catch (err) {
    console.error(`❌ Failed to delete ${branch}: ${err.message}`);
    return false;
  }
}

function getBranchState(execFn) {
  const fn = execFn || getOutput;
  return {
    currentBranch: fn('git rev-parse --abbrev-ref HEAD'),
    repoRoot: fn('git rev-parse --show-toplevel')
  };
}

// Main entrypoint
function main() {
  // Enter repo root
  const { repoRoot, currentBranch } = getBranchState();
  process.chdir(repoRoot);

  // Beginning-of-Task flow
  if (currentBranch === 'main') {
    run('git pull origin main');
    const name = `cleanup/merged-branches-${new Date().toISOString().slice(0,10).replace(/-/g,'')}`;
    run(`git checkout -b ${name}`);
  } else {
    tryRun('git add .');
    tryRun('git commit -m "WIP: saving progress before branch cleanup"');
  }

  // Ensure up-to-date main
  run('git checkout main');
  run('git pull origin main');

  // Identify merged branches
  const branches = identifyMergedBranches();

  if (branches.length === 0) {
    console.log('✔ No merged branches to delete.');
  } else {
    console.log('Deleting merged branches:');
    branches.forEach(branch => {
      const success = deleteBranch(branch);
      if (success) {
        console.log(`✔ Deleted ${branch}`);
      }
    });
  }

  // End-of-Task: run tests
  try {
    console.log('Running tests...');
    run('npm test');
    console.log('✅ Cleanup complete!');
  } catch (err) {
    console.error('❌ Tests failed – aborting.');
    process.exit(1);
  }
}

// Only run main when this script is executed directly
if (require.main === module) {
  main();
}

// Export for testing
module.exports = {
  identifyMergedBranches,
  deleteBranch,
  getBranchState,
  getOutput,
  run,
  tryRun,
  main
};
