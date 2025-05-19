#!/usr/bin/env bash
# A script to safely delete merged branches (both local and remote)
set -euo pipefail

echo "=== Branch Cleanup Script ==="

# Save current branch to return to it later
current_branch=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $current_branch"

# Make sure we're working with the latest information
echo "Fetching latest from remote..."
git fetch --all --prune

# Switch to main branch to get correct merge information
echo "Switching to main branch..."
git checkout main

# Handle local merged branches
echo "Looking for local merged branches..."
merged_local=$(git branch --merged main | grep -vE '^\*|main|HEAD' || echo "")

if [ -z "$merged_local" ]; then
  echo "No local merged branches found."
else
  echo "Found local merged branches:"
  echo "$merged_local"
  echo "Deleting local merged branches..."
  
  # Process each branch
  while IFS= read -r branch; do
    if [ -n "$branch" ]; then
      branch=$(echo "$branch" | xargs) # Trim whitespace
      echo "Deleting local branch: $branch"
      git branch -d "$branch" || echo "Failed to delete branch $branch"
    fi
  done <<< "$merged_local"
  
  echo "Local merged branches deleted."
fi

# Handle remote merged branches
echo "Looking for remote merged branches..."
merged_remote=$(git branch -r --merged origin/main | grep -v 'origin/main' | grep -v 'origin/HEAD' | sed 's/origin\///' || echo "")

if [ -z "$merged_remote" ]; then
  echo "No remote merged branches found."
else
  echo "Found remote merged branches:"
  echo "$merged_remote"
  echo "Do you want to delete these remote branches? (y/n)"
  read -r answer
  
  if [[ "$answer" == "y" ]]; then
    echo "Deleting remote merged branches..."
    
    # Process each branch
    while IFS= read -r branch; do
      if [ -n "$branch" ]; then
        branch=$(echo "$branch" | xargs) # Trim whitespace
        echo "Deleting remote branch: $branch"
        git push origin --delete "$branch" || echo "Failed to delete remote branch $branch"
      fi
    done <<< "$merged_remote"
    
    echo "Remote merged branches deleted."
  else
    echo "Remote branch deletion skipped."
  fi
fi

# Return to the original branch
if [ "$current_branch" != "main" ]; then
  echo "Returning to original branch: $current_branch"
  git checkout "$current_branch" || echo "Failed to return to branch $current_branch"
else
  echo "Already on main branch."
fi

echo "Branch cleanup completed!"
