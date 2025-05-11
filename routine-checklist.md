<<<<<<< HEAD
<!-- filepath: /home/z/repos/ai-dev-loop/routine-checklist.md -->
# PR Finalization Checklist

## Notes

- Follow this checklist in the given order to minimize context switching between local and GitHub environments.
- Don't overthink the perfect fix—prioritize shipping safely.
- If stuck in reviewer feedback, consider scheduling a time-boxed review sprint.

## Goal

=======
# Routine Checklist for Pull Request Finalization

## Goal
>>>>>>> dad079e (Create routine-checklist.md)
Finish and merge the feature branch safely and quickly, ensuring everything is clean and functional.

## Checklist

<<<<<<< HEAD
### Local Environment Steps

- [ ] Run all tests locally to ensure they pass.
- [ ] If tests fail, fix them (ask Copilot for help if needed).
- [ ] Push changes to the feature branch.

### GitHub Steps

- [ ] Go to GitHub pull request page.
- [ ] Review all comments (resolved and unresolved).
- [ ] Quickly accept changes using "Commit suggestion" button where applicable.
- [ ] Identify other changes requiring local work.

### Back to Local Environment

- [ ] Pull latest changes from the feature branch.
- [ ] Merge main branch into feature branch if needed.
- [ ] Run tests again to confirm everything passes.
- [ ] Push final changes.

### Finalize on GitHub

- [ ] Confirm all CI checks pass.
- [ ] Merge pull request to main.
- [ ] Delete feature branch after merge.
=======
- [ ] All tests pass locally
- [ ] Review all unresolved comments
- [ ] Respond or resolve each pull request comment
- [ ] Rebase or merge main into feature branch (if needed)
- [ ] Manual test completed for critical paths
- [ ] Confirm CI checks pass
- [ ] Confirm no debug code remains
- [ ] Final commit message is clean
- [ ] Pull request title is descriptive
- [ ] Merge pull request to main
- [ ] Delete feature branch after merge

## Notes
- Don’t overthink the perfect fix—prioritize shipping safely.
- If stuck in reviewer feedback, consider scheduling a time-boxed review sprint.
>>>>>>> dad079e (Create routine-checklist.md)
