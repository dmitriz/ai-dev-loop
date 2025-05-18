#!/usr/bin/env bash
set -euo pipefail

# ─── Enter repo root ─────────────────────────────────────────────────────────────
cd "$(git rev-parse --show-toplevel)" || { echo "Failed to locate repo root"; exit 1; }

# ─── Beginning of Task ───────────────────────────────────────────────────────────
current_branch=$(git rev-parse --abbrev-ref HEAD)

if [[ "$current_branch" == "main" ]]; then
  git pull origin main && \
  git checkout -b cleanup/merged-branches-"$(date +%Y%m%d)" || exit 1
else
  git add . && \
  git commit -m "WIP: saving progress before branch cleanup" || echo "No changes to commit"
fi

# ─── Ensure up-to-date main ───────────────────────────────────────────────────────
git checkout main && \
git pull origin main

# ─── Identify & Delete Merged Branches ────────────────────────────────────────────
merged=$(git branch --merged main | grep -Ev '(^\*|\b(main|develop|release)\b)' | sed 's/^[[:space:]]*//')

if [[ -z "$merged" ]]; then
  echo "✔ No merged branches to delete."
else
  echo "Deleting merged branches:"
  printf '%s
' "$merged"
  while IFS= read -r branch; do
    git branch -d "$branch" && \
    git push origin --delete "$branch" && \
    echo "✔ Deleted $branch"
  done <<< "$merged"
fi

# ─── End of Task ─────────────────────────────────────────────────────────────────
npm test || { echo "❌ Tests failed – aborting."; exit 1; }

echo "✅ Cleanup complete!"
