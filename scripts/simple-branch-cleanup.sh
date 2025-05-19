#!/bin/bash
# Simple script to delete all merged branches
set -x  # Enable debugging to see what commands are being executed

cd /home/z/repos/ai-dev-loop || exit 1

echo "Current directory: $(pwd)"
echo "Current branch: $(git branch --show-current)"

# Make sure we have the latest information
git fetch --all --prune

# Get the default branch (usually main)
default_branch=$(git remote show origin | grep "HEAD branch" | cut -d ":" -f 2 | xargs)
echo "Default branch: $default_branch"

# Switch to the default branch
git checkout "$default_branch"

# Delete local merged branches
echo "Deleting local merged branches..."
git branch --merged "$default_branch" | grep -v "^\*" | grep -v "$default_branch" | xargs -r git branch -d

# List remote merged branches
echo "Remote merged branches:"
git branch -r --merged origin/"$default_branch" | grep -v "origin/$default_branch" | grep -v "origin/HEAD" | sed 's/origin\///'

# Confirm deletion of remote branches
echo "Delete remote merged branches? (y/n)"
read -r answer
if [[ "$answer" == "y" ]]; then
  git branch -r --merged origin/"$default_branch" | grep -v "origin/$default_branch" | grep -v "origin/HEAD" | sed 's/origin\///' | xargs -I{} git push origin --delete {}
  echo "Remote merged branches deleted."
else
  echo "Remote branch deletion skipped."
fi

echo "Branch cleanup completed!"
