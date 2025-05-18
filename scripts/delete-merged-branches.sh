#!/usr/bin/env bash
set -euo pipefail

# Step 1: Ensure on main branch
git checkout main

# Step 2: Fetch latest from remote and update local refs
git fetch --all --prune

# Step 3: Get merged branches (excluding main and HEAD)
echo "Checking for all merged branches..."
# Check both local and remote merged branches
merged_local=$(git branch --merged main | grep -vE '^\*|main|HEAD' | sed 's/^[[:space:]]*//')
merged_remote=$(git branch -r --merged main | grep -v 'origin/main' | sed 's/origin\///' | sed 's/^[[:space:]]*//')

# Combine local and remote merged branches
merged_branches=$(echo -e "$merged_local\n$merged_remote" | sort | uniq)

if [ -z "$merged_branches" ]; then
  echo "No merged branches to delete."
  exit 0
fi

echo "Merged branches to delete:"
echo "$merged_branches"

echo "Are you sure you want to delete these merged branches? (y/n)"
read -r answer
if [[ "$answer" != "y" ]]; then
  echo "Operation cancelled."
  exit 0
fi

# Step 4: Delete local merged branches
while IFS= read -r branch; do
  # Skip potential empty lines, though the check on line 19 should prevent $merged_branches from being empty.
  if [ -z "$branch" ]; then continue; fi
  if git show-ref --verify --quiet refs/heads/"$branch"; then
    echo "Deleting local branch: $branch"
    git branch -d "$branch" || echo "Failed to delete local branch $branch"
  fi
done <<< "$merged_branches"

# Step 5: Delete remote merged branches
while IFS= read -r branch; do
  # Skip potential empty lines
  if [ -z "$branch" ]; then continue; fi
  if git show-ref --verify --quiet refs/remotes/origin/"$branch"; then
    echo "Deleting remote branch: $branch"
    git push origin --delete "$branch" || echo "Failed to delete remote branch $branch"
  fi
done <<< "$merged_branches"

echo "All merged branches (except main) deleted locally and remotely."
echo "Operation completed successfully."
