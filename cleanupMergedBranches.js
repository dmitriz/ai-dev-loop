#!/usr/bin/env node

const { execSync } = require('child_process');

function run(cmd, options = {}) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', ...options });
}

function tryRun(cmd) {
  try {
    run(cmd);
  } catch (err) {
    console.warn(`⚠️ Warning (ignored): '${cmd}' failed.`);
  }
}

function getOutput(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

function main() {
  // Enter repo root
  const repoRoot = getOutput('git rev-parse --show-toplevel');
  process.chdir(repoRoot);

  // Beginning-of-Task flow
  const currentBranch = getOutput('git rev-parse --abbrev-ref HEAD');
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
  const mergedList = getOutput('git branch --merged main');
  const branches = mergedList
    .split('\n')
    .map(line => line.replace('*', '').trim())
    .filter(name => name && !['main','develop','release'].includes(name));

  if (branches.length === 0) {
    console.log('✔ No merged branches to delete.');
  } else {
    console.log('Deleting merged branches:');
    branches.forEach(branch => {
      try {
        run(`git branch -d ${branch}`);
        run(`git push origin --delete ${branch}`);
        console.log(`✔ Deleted ${branch}`);
      } catch (err) {
        console.error(`❌ Failed to delete ${branch}: ${err.message}`);
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

main();
