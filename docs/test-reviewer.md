# Test Reviewer

This file defines the architecture for a unified test validation and feedback system. It evaluates the quality of tests from both semantic and behavioral perspectives and includes logic to process PR feedback and reviewer comments as part of a test improvement loop.

---

## Approved Scope

- Identify **behavior drift** between test name, docstring, and actual logic
- Detect **trivial assertions** or irrelevant conditions
- Reject tests that leak implementation logic or repeat source behavior
- Structure reviewer feedback from PR comments and AI-generated messages
- Route all evaluation output into structured `.md` or `.json` files

---

## Confirmed Features

- Markdown prompt templates to query AI for test evaluation
- JSON output for scoring, tagging, issue flags
- Optional file watchers to auto-run on test file updates
- Feedback merging: combine AI feedback and GitHub comments

---

## Proposed Ideas

- Use NLP to match test name against function behavior
- Rank test issues by severity (logic, clarity, coverage)
- Link test back to related documentation (docstrings, README)
- Feedback summarizer: generate patchable suggestions for each test
- Aggregate comments across multiple PRs into test-centered views

---

## Open Questions

- Do we validate all tests continuously or only new PRs?
- Should feedback generation be synchronous (on commit) or batched?
- How do we allow AI to propose test rewrites while enforcing constraints?

---

## Output Schema (Draft)

```json
{
  "test_file": "test_auth.py",
  "test_name": "test_login_success",
  "issues": [
    "Behavior drift: test claims login success but never asserts session",
    "Only checks string match, not redirect"
  ],
  "score": 47,
  "comments": [
    "Needs assertion for redirected route",
    "Test name overstates logic"
  ],
  "recommended_fix": "Add assertion for valid session token and redirect"
}
