#!/usr/bin/env bash
# A script to safely delete merged branches
set -euo pipefail

echo "=== Branch Cleanup Script ==="
echo "Switching to main branch..."
git checkout main

echo "Updating from remote..."
git pull origin main

echo "Fetching latest branch information..."
git fetch --all --prune

echo "Finding merged local branches..."
merged_branches=$(git branch --merged main | grep -vE '^\*|main|HEAD' | sed 's/^[[:space:]]*//')

if [ -z "$merged_branches" ]; then
  echo "No merged local branches to delete."
else
  echo "The following local branches will be deleted:"
  echo "$merged_branches"
  
  # Automatically respond 'y' to git branch -d
  echo "$merged_branches" | xargs -r git branch -d
  echo "Local merged branches have been deleted."
fi

echo "Checking for merged remote branches..."
merged_remote=$(git branch -r --merged main | grep -v 'origin/main' | sed 's/origin\///' | sed 's/^[[:space:]]*//')

if [ -z "$merged_remote" ]; then
  echo "No merged remote branches to delete."
else
  echo "The following remote branches can be deleted:"
  echo "$merged_remote"
  echo "To delete these remote branches, you can use: git push origin --delete BRANCH_NAME"
  
  # Uncomment the following lines if you want to automatically delete remote branches
  # echo "Deleting remote branches..."
  # for branch in $merged_remote; do
  #   git push origin --delete "$branch"
  # done
  # echo "Remote merged branches have been deleted."
fi

echo "Branch cleanup completed!"
