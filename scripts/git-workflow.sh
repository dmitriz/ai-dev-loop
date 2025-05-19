#!/bin/bash
set -euo pipefail
# GitHub Copilot Task Workflow Script
# This script implements the workflow guide for maintaining a clean, consistent development workflow
# Function to handle errors
handle_error() {
  echo "ERROR: $1"
  exit 1
}

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
  npm test || handle_error "Tests failed! Please fix before proceeding."
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
  echo "Create a pull request at: https://github.com/dmitriz/ai-dev-loop/pull/new/$current_branch"
}

# If argument is "finish", run the end-of-task workflow
if [ "$1" = "finish" ]; then
  run_tests
  push_changes
fi

echo "Git workflow completed!"
