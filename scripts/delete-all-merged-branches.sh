#!/usr/bin/env bash
# A comprehensive script to delete all merged branches (both local and remote)
set -euo pipefail

echo "=== Starting Branch Cleanup Process ==="

# Save current branch to return to it later
current_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
echo "Current branch: $current_branch"

# Step 1: Ensure we have latest remote info
echo "Fetching latest from remote..."
git fetch --all --prune

# Step 2: Switch to main branch
default_branch=$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null | sed 's@^origin/@@' || echo "main")
echo "Switching to $default_branch branch..."
git checkout "$default_branch"

# Step 3: Get local merged branches
echo "Checking for local merged branches..."
merged_local=$(git branch --merged "$default_branch" | grep -vE '^\*|main|HEAD' | sed 's/^[[:space:]]*//' || echo "")

if [ -z "$merged_local" ]; then
  echo "No local merged branches found."
else
  echo "Found local merged branches to delete:"
  echo "$merged_local"
  echo "Deleting local merged branches..."
  
  # Process each branch
  echo "$merged_local" | while IFS= read -r branch; do
    if [ -n "$branch" ]; then
      echo "Deleting local branch: $branch"
      git branch -d "$branch" || echo "Failed to delete branch $branch (it may not be fully merged)"
    fi
  done
  
  echo "Local merged branches processed."
fi

# Step 4: Get remote merged branches
echo "Checking for remote merged branches..."
merged_remote=$(git branch -r --merged origin/"$default_branch" | grep -v "origin/$default_branch" | grep -v "origin/HEAD" | sed 's/origin\///' | sed 's/^[[:space:]]*//' || echo "")

if [ -z "$merged_remote" ]; then
  echo "No remote merged branches found."
else
  echo "Found remote merged branches to delete:"
  echo "$merged_remote"
  echo "Do you want to delete these remote branches? (y/n)"
  read -r answer
  
  if [[ "$answer" == "y" ]]; then
    echo "Deleting remote merged branches..."
    
    # Process each branch
    echo "$merged_remote" | while IFS= read -r branch; do
      if [ -n "$branch" ]; then
        echo "Deleting remote branch: $branch"
        git push origin --delete "$branch" || echo "Failed to delete remote branch $branch"
      fi
    done
    
    echo "Remote merged branches deleted."
  else
    echo "Remote branch deletion skipped."
  fi
fi

# Step 5: Return to the original branch if it still exists
if [ "$current_branch" != "$default_branch" ]; then
  if git show-ref --verify --quiet refs/heads/"$current_branch"; then
    echo "Returning to original branch: $current_branch"
    git checkout "$current_branch"
  else
    echo "Original branch $current_branch no longer exists. Staying on $default_branch."
  fi
fi

echo "=== Branch Cleanup Completed ==="
