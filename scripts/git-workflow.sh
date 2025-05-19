#!/bin/bash
set -euo pipefail

# GitHub Copilot Task Workflow Script
# -----------------------------------
# This script implements a workflow guide for maintaining a clean, consistent development process.
# It handles:
#  - Branch management (creating feature branches from main)
#  - Saving work-in-progress
#  - Running appropriate tests based on project type
#  - Pushing changes to remote repository
#  - Generating pull request URL dynamically based on repository
#
# Usage:
#  - To start a new task: ./git-workflow.sh [new-branch-name]
#  - To finish a task:    ./git-workflow.sh finish
#
# Note: The script dynamically detects your repository URL and test framework.
# Function to handle errors
handle_error() {
  echo "ERROR: $1"
  exit 1
}

# Check if git is installed and current directory is a git repository
if ! command -v git &> /dev/null; then
  handle_error "Git is not installed. Please install git first."
fi

if ! git rev-parse --is-inside-work-tree &> /dev/null; then
  handle_error "Not in a git repository. Please run this script from a git repository."
fi

# Get current branch
current_branch=$(git branch --show-current)
echo "Current branch: $current_branch"

# Check if on main branch
if [ "$current_branch" = "main" ]; then
  echo "On main branch, pulling latest changes and creating feature branch..."
  
  # Pull latest changes from main
  git pull origin main || handle_error "Failed to pull from main branch"
  
  # Prompt for new branch name if not provided
  if [ -z "$1" ]; then
    read -p "Enter new feature branch name: " branch_name
  else
    branch_name=$1
  fi
  
  # Create and switch to new branch
  git checkout -b "$branch_name" || handle_error "Failed to create branch: $branch_name"
  echo "Successfully created and switched to branch: $branch_name"
else
  echo "Already on feature branch: $current_branch"
  
  # Try to commit any local changes
  echo "Attempting to commit any local changes..."
  git add .
  git commit -m "WIP: Saving progress before starting new task" || echo "No changes to commit"
  
  # Pull latest changes from remote if the branch exists remotely
  if git ls-remote --heads origin "$current_branch" | grep -q "$current_branch"; then
    echo "Remote branch exists, pulling latest changes..."
    git pull --tags origin "$current_branch" || handle_error "Failed to pull from remote branch '$current_branch'. Please resolve conflicts manually and re-run."
  else
    echo "No remote branch found. If this is a new branch, you'll need to push it."
  fi
fi

# Function to run tests at the end of a task
run_tests() {
  echo "Running tests..."
  
  # Check for package.json and determine appropriate test command
  if [ -f "package.json" ]; then
    # Check if a specific test script is defined in package.json
    test_cmd=$(node -e "try { const pkg = require('./package.json'); console.log(pkg.scripts && pkg.scripts.test ? 'npm test' : ''); } catch(e) { console.log(''); }")
    
    if [ -n "$test_cmd" ]; then
      echo "Detected Node.js project with test script. Running: $test_cmd"
      eval "$test_cmd" || handle_error "Tests failed! Please fix before proceeding."
    else
      # Try to detect testing framework
      if [ -d "node_modules/jest" ] || grep -q "\"jest\"" package.json; then
        echo "Detected Jest. Running: npx jest"
        npx jest || handle_error "Tests failed! Please fix before proceeding."
      elif [ -d "node_modules/mocha" ] || grep -q "\"mocha\"" package.json; then
        echo "Detected Mocha. Running: npx mocha"
        npx mocha || handle_error "Tests failed! Please fix before proceeding."
      else
        echo "Warning: Node.js project detected but couldn't determine test runner. Attempting 'npm test'..."
        npm test || echo "Warning: Tests failed or not configured properly."
      fi
    fi
  # Check for Maven project
  elif [ -f "pom.xml" ]; then
    echo "Detected Maven project. Running: mvn test"
    mvn test || handle_error "Tests failed! Please fix before proceeding."
  # Check for Python project
  elif [ -f "requirements.txt" ] || [ -f "setup.py" ] || [ -f "pyproject.toml" ]; then
    if command -v pytest &> /dev/null; then
      echo "Detected Python project. Running: pytest"
      pytest || handle_error "Tests failed! Please fix before proceeding."
    elif command -v python &> /dev/null; then
      echo "Detected Python project. Running: python -m unittest discover"
      python -m unittest discover || handle_error "Tests failed! Please fix before proceeding."
    else
      echo "Warning: Python project detected but pytest/python not found. Skipping tests."
    fi
  # Check for Gradle project
  elif [ -f "build.gradle" ] || [ -f "build.gradle.kts" ]; then
    echo "Detected Gradle project. Running: ./gradlew test"
    ./gradlew test || handle_error "Tests failed! Please fix before proceeding."
  # Check for cargo project (Rust)
  elif [ -f "Cargo.toml" ]; then
    echo "Detected Rust project. Running: cargo test"
    cargo test || handle_error "Tests failed! Please fix before proceeding."
  # Check for Go project
  elif [ -f "go.mod" ]; then
    echo "Detected Go project. Running: go test ./..."
    go test ./... || handle_error "Tests failed! Please fix before proceeding."
  else
    echo "Warning: Could not detect project type. Skipping tests."
    echo "If your project has tests, run them manually before proceeding."
    return 0
  fi
  
  echo "Tests passed successfully!"
}

# Function to push changes
push_changes() {
  echo "Pushing changes to remote..."
  
  if git ls-remote --heads origin "$current_branch" | grep -q "$current_branch"; then
    # Branch already exists remotely
    git push origin "$current_branch" || handle_error "Failed to push to remote"
  else
    # New branch, push and set upstream
    git push -u origin "$current_branch" || handle_error "Failed to push to remote"
  fi
  
  echo "Successfully pushed changes to remote!"
  
  # Dynamically determine repository URL
  repo_url=$(git config --get remote.origin.url)
  if [[ "$repo_url" == *"github.com"* ]]; then
    # Extract the repository path from the URL (works with both HTTPS and SSH URLs)
    if [[ "$repo_url" == *"https"* ]]; then
      repo_path=$(echo "$repo_url" | sed -E 's|https://github.com/(.+).git$|\1|' || echo "$repo_url" | sed -E 's|https://github.com/(.+)$|\1|')
    else
      repo_path=$(echo "$repo_url" | sed -E 's|git@github.com:(.+).git$|\1|' || echo "$repo_url" | sed -E 's|git@github.com:(.+)$|\1|')
    fi
    echo "Create a pull request at: https://github.com/$repo_path/pull/new/$current_branch"
  else
    echo "Repository hosted at: $repo_url"
    echo "To create a pull request, please visit your repository's web interface."
  fi
}

# If argument is "finish", run the end-of-task workflow
if [ "$1" = "finish" ]; then
  # Update current branch in case it changed
  current_branch=$(git branch --show-current)
  run_tests
  push_changes
fi

echo "Git workflow completed!"
