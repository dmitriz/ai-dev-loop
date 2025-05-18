/**
 * This module provides functionality to delete branches that have been merged into main
 * Each function accepts a custom execution function for testability
 */

const { execSync } = require('child_process');

// Helper functions
/**
 * Executes a shell command and prints it to console
 * 
 * @param {string} cmd - The shell command to execute
 * @param {object} options - Options to pass to execSync
 * @returns {Buffer} - The command output
 */
function run(cmd, options = {}) {
  console.log(`$ ${cmd}`);
  return execSync(cmd, { stdio: 'inherit', ...options });
}

/**
 * Attempts to run a command but does not throw if it fails
 * 
 * @param {string} cmd - The shell command to execute
 * @returns {boolean} - True if command succeeded, false if it failed
 */
function tryRun(cmd) {
  try {
    run(cmd);
    return true;
  } catch (err) {
    console.warn(`⚠️ Warning (ignored): '${cmd}' failed.`);
    return false;
  }
}

/**
 * Executes a command and returns its output as a string
 * 
 * @param {string} cmd - The shell command to execute
 * @returns {string} - The command output as a trimmed string
 */
function getOutput(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

// Core functionality, extracted for testability
/**
 * Identifies branches that have been merged into main
 * 
 * @param {Function} execFn - Function that executes git commands (for testing)
 * @returns {string[]} - Array of branch names that have been merged, excluding main and master
 */
function getMergedBranches(execFn) {
  const fn = execFn || getOutput;
  const mergedList = fn('git branch --merged main');
  return mergedList
    .split('\n')
    .map(line => line.replace('*', '').trim())
    .filter(name => name && !['main','master'].includes(name));
}

/**
 * Deletes a branch both locally and remotely
 * 
 * @param {string} branch - The name of the branch to delete
 * @param {Function} execFn - Function that executes git commands (for testing)
 * @param {boolean} dryRun - If true, only simulates deletion without executing commands
 * @returns {boolean} - True if deletion succeeded, false otherwise
 */
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

// Split functions for local and remote deletion
/**
 * Deletes a branch locally only
 * 
 * @param {string} branch - The name of the branch to delete
 * @param {Function} execFn - Function that executes git commands (for testing)
 * @returns {boolean} - True if local deletion succeeded, false otherwise
 */
function deleteLocalBranch(branch, execFn) {
  const fn = execFn || run;
  try {
    fn(`git branch -d ${branch}`);
    return true;
  } catch (err) {
    console.error(`❌ Failed to delete local branch ${branch}: ${err.message}`);
    return false;
  }
}

/**
 * Deletes a branch from the remote repository
 * 
 * @param {string} branch - The name of the branch to delete from remote
 * @param {Function} execFn - Function that executes git commands (for testing)
 * @returns {boolean} - True if remote deletion succeeded, false otherwise
 */
function deleteRemoteBranch(branch, execFn) {
  const fn = execFn || run;
  try {
    fn(`git push origin --delete ${branch}`);
    return true;
  } catch (err) {
    console.error(`❌ Failed to delete remote branch ${branch}: ${err.message}`);
    return false;
  }
}

/**
 * Deletes all branches that have been merged into main
 * 
 * @param {Function} execFn - Function that executes git commands (for testing)
 * @returns {Object} - Object with arrays of deleted and failed branches
 * @returns {string[]} deleted - Names of branches successfully deleted
 * @returns {string[]} failed - Names of branches that failed to delete
 */
function deleteMergedBranches(execFn) {
  const branches = getMergedBranches(execFn);
  
  if (branches.length === 0) {
    console.log('✔ No merged branches to delete.');
    return { deleted: [], failed: [] };
  }
  
  const results = { deleted: [], failed: [] };
  
  branches.forEach(branch => {
    const localSuccess = deleteLocalBranch(branch, execFn);
    const remoteSuccess = deleteRemoteBranch(branch, execFn);
    
    if (localSuccess && remoteSuccess) {
      results.deleted.push(branch);
      console.log(`✔ Deleted ${branch} locally and remotely`);
    } else {
      results.failed.push(branch);
    }
  });
  
  return results;
}

/**
 * Gets the current branch name and repository root path
 * 
 * @param {Function} execFn - Function that executes git commands (for testing)
 * @returns {Object} - Object containing current branch name and repo root path
 * @returns {string} currentBranch - Name of the current branch
 * @returns {string} repoRoot - Path to the repository root
 */
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

  // Delete merged branches using our main function
  const results = deleteMergedBranches();
  
  if (results.deleted.length === 0) {
    console.log('No branches were deleted.');
  } else {
    console.log(`✅ Successfully deleted ${results.deleted.length} branches.`);
    if (results.failed.length > 0) {
      console.warn(`⚠️ Failed to delete ${results.failed.length} branches.`);
    }
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
  // Core functions
  getMergedBranches,                      // Main function to identify merged branches
  identifyMergedBranches: getMergedBranches, // Alias for backward compatibility
  deleteBranch,                           // Combined deletion function
  deleteLocalBranch,                      // Local-only deletion
  deleteRemoteBranch,                     // Remote-only deletion
  deleteMergedBranches,                   // Main deletion workflow
  cleanupMergedBranches: deleteMergedBranches, // Alias for backward compatibility
  
  // Helper functions
  getBranchState,
  getOutput,
  run,
  tryRun,
  
  // Main entry
  main
};
