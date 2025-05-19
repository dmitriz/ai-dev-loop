# Test Reviewer

This document outlines the architecture for a unified test validation and feedback system. It evaluates test quality from both semantic and behavioral perspectives and integrates pull request feedback into a continuous test improvement loop.

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

**NLP Enhancements:**

- Use NLP to match test name against function behavior
- Link test back to related documentation (docstrings, README)

**Quality Analysis:**

- Rank test issues by severity (logic, clarity, coverage)

**Aggregation & Summarization:**

- Feedback summarizer: generate patchable suggestions for each test
- Aggregate comments across multiple PRs into test-centered views

---

## Open Questions

- Do we validate all tests continuously or only new PRs?
- Should feedback generation be synchronous (on commit) or batched?
- How do we allow AI to propose test rewrites while enforcing constraints?
- What is the desired granularity of feedback (per test function, per file, or per assertion)?

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
  "score": 47,  /* Range: 0-100, higher is better */
  "comments": [
    "Needs assertion for redirected route",
    "Test name overstates logic"
  ],
  "recommended_fix": "Add assertion for valid session token and redirect"
}
```
