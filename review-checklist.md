# Pull Request Review Checklist

## Purpose

Checklist for reviewing and finalizing pull requests: ensure tests pass, comments are addressed, and PR is clean before merge.

---

## 1. Initial Testing

- [ ] Run local test suite: `npm test` or equivalent
- [ ] If tests fail:
  - [ ] Use Copilot for assistance in fixing failing tests
  - [ ] Re-run tests to confirm success

---

## 2. Push Changes

- [ ] Push all committed changes to remote feature branch: `git push`

---

## 3. Address Comments

- [ ] Open corresponding PR on GitHub
- [ ] Review all **open comments**
- [ ] For each comment:
  - [ ] If a direct commit suggestion is available and valid, click **"Commit suggestion"**
  - [ ] Otherwise, **skip** non-essential feedback

---

## 4. Return to Local Environment

- [ ] Pull latest from feature branch: `git pull origin <feature-branch>`
- [ ] Merge or rebase `main` if needed
- [ ] Resolve any conflicts

---

## 5. Final Local Confirmation

- [ ] Re-run tests to confirm passing
- [ ] Make final Copilot-assisted fixes
- [ ] Commit and push changes

---

## 6. Merge and Cleanup

- [ ] On GitHub, click **"Merge pull request"**
- [ ] Delete the feature branch both **remotely and locally**
