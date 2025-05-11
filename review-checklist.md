# PR Review and Finalization Checklist

## Purpose

Checklist for reviewing and finalizing a pull request, ensuring tests pass and all comments are addressed before merge.

---

## 1. Confirm All Tests Pass Locally

- [ ] Run local test suite: `npm test` or equivalent
- [ ] If tests fail:
  - [ ] Use Copilot to assist in fixing failing tests
  - [ ] Re-run tests to confirm success

---

## 2. Push Changes

- [ ] Push all committed changes to remote feature branch: `git push`

---

## 3. Review Pull Request on GitHub

- [ ] Open corresponding PR on GitHub
- [ ] Review all **open comments**
- [ ] For each comment:
  - [ ] If a direct commit suggestion is available and valid, click **“Commit suggestion”**
  - [ ] Otherwise, **skip** non-essential feedback

---

## 4. Return to Local Environment

- [ ] Pull the latest changes from the remote feature branch: `git pull origin <feature-branch>`
- [ ] Merge `main` into the current branch (if needed): `git merge main`
- [ ] Resolve any conflicts

---

## 5. Final Local Confirmation

- [ ] Re-run all tests to confirm everything still passes
- [ ] Make any final Copilot-assisted fixes
- [ ] Commit and push final changes

---

## 6. Merge and Cleanup

- [ ] On GitHub, click **“Merge pull request”**
- [ ] Delete the feature branch both **remotely and locally**
