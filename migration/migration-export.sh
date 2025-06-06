#!/bin/bash

# Step 1: Check current branch and save progress before creating a new project
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" = "main" ]; then
  git pull origin main
  git checkout -b task/export-branch-cleanup
else
  git add .
  git commit -m "WIP: Saving progress before exporting branch cleanup functionality" || echo "No changes to commit"
fi

# Step 2: Create a new directory structure for the exported project
EXPORT_DIR=~/repos/git-branch-cleanup
mkdir -p $EXPORT_DIR/src
mkdir -p $EXPORT_DIR/test

# Step 3: Copy the relevant files
cp ~/repos/ai-dev-loop/src/branchCleanup.js $EXPORT_DIR/src/index.js
cp ~/repos/ai-dev-loop/src/branchCleanup.test.js $EXPORT_DIR/test/index.test.js
cp ~/repos/ai-dev-loop/src/branchCleanup.e2e.test.js $EXPORT_DIR/test/e2e.test.js

# Step 4: Create package.json for the new project
cat > $EXPORT_DIR/package.json << 'EOF'
{
  "name": "git-branch-cleanup",
  "version": "1.0.0",
  "description": "A tool to safely delete Git branches that have been merged into main",
  "main": "src/index.js",
  "bin": {
    "git-branch-cleanup": "./bin/cleanup.js"
  },
  "scripts": {
    "test": "jest",
    "clean": "node ./bin/cleanup.js"
  },
  "engines": {
    "node": ">=14.0.0"
  },
  "keywords": [
    "git",
    "branch",
    "cleanup",
    "delete",
    "merged"
  ],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "jest": "^29.7.0"
  }
}
EOF

# Step 5: Create README.md for the new project
cat > $EXPORT_DIR/README.md << 'EOF'
# Git Branch Cleanup

A simple tool to safely delete Git branches that have been merged into main.

## Features

- Identifies branches that have been merged into main
- Safely deletes branches both locally and remotely
- Excludes main and master branches from deletion
- Provides clean output with success/failure status

## Installation

```bash
# Install globally
npm install -g git-branch-cleanup

# Or use directly with npx
npx git-branch-cleanup
```

## Usage

```bash
# Run the cleanup process
git-branch-cleanup

# Or if installed locally
npm run clean
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test
```

## License

MIT
EOF

# Step 6: Create bin directory and entry script
mkdir -p $EXPORT_DIR/bin
cat > $EXPORT_DIR/bin/cleanup.js << 'EOF'
#!/usr/bin/env node

// Just import and run the main function from our module
const { main } = require('../src/index');
main();
EOF
chmod +x $EXPORT_DIR/bin/cleanup.js

# Step 7: Create Jest config
cat > $EXPORT_DIR/jest.config.js << 'EOF'
module.exports = {
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: 'coverage',
};
EOF

# Step 8: Update file paths in test files
sed -i 's/\.\/branchCleanup/\.\.\/src\/index/g' $EXPORT_DIR/test/index.test.js
sed -i 's/\.\/branchCleanup/\.\.\/src\/index/g' $EXPORT_DIR/test/e2e.test.js

# Step 9: Add .gitignore
cat > $EXPORT_DIR/.gitignore << 'EOF'
node_modules
coverage
.DS_Store
.env
*.log
EOF

# Step 10: Initialize git repository in the new project
cd $EXPORT_DIR
git init
git add .
git commit -m "Initial commit: Project setup from export"

echo "Project successfully exported to $EXPORT_DIR"
echo "To test the new project, run: cd $EXPORT_DIR && npm install && npm test"
