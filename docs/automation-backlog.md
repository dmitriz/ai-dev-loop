# Automation Backlog

A living log of current problems, deferred design challenges, proposed systems, and upcoming architecture for AI-assisted automation tooling.

This is not a roadmap or ticket tracker. It records open questions, architectural gaps, and implementation priorities for internal logic.

---

## Copilot Chat History Extraction

### Problem
AI-generated solutions often repeat previously answered problems. Copilot offers no structured memory or summary system. The lack of historical awareness leads to prompt duplication and wasted cycles.

### Proposed Solution
Build a local tool that extracts `.db` chat history from Copilot, dumps it into Markdown, and indexes it.

### Status
Accepted. Phase 1 will extract and store `.md` files from the local Copilot SQLite database.

---

## Semantic Test Quality Checker

### Problem
Copilot and similar tools generate tests that:
- Repeat implementation logic
- Use irrelevant or trivial assertions
- Mismatch test name and actual behavior

### Proposed Solution
Checker pipeline with prompt templates and AI evaluation to:
- Detect behavior drift
- Enforce docstring/code alignment
- Score test meaningfulness

### Status
Design in progress

---

## Agent Sandbox Enforcement

### Problem
AI agents often operate without boundaries, risking scope violations or file system leakage.

### Proposed Solution
Use Docker containers with:
- Internal-only secrets
- Write access only to `/workspace`
- Mounted readonly source directories

### Status
Deferred until viable agent platform is selected

---

## Prompt-Driven AI Control Interface

### Problem
Inconsistency in AI tool usage and interaction format—prompts embedded in chat, inline code, or comments.

### Proposed Solution
Standardize prompt architecture:
- Markdown-controlled `.md` files
- Input stored in `/ai-prompts`
- Output stored in `/ai-output`

### Status
Standard documented in `automation-design.md`. Implementation in progress.

---

## Cross-Repo Discovery Engine

### Problem
Distributed markdowns, design files, and notes across many repositories make knowledge retrieval difficult.

### Proposed Solution
Build a discovery engine that:
- Clones target repos
- Indexes semantic content
- Supports full-text + embedding search

### Status
Planned

---

## PR Feedback Extraction & Prioritization

### Problem
Reviewer feedback on PRs is often buried in GitHub comments and lacks priority or actionable structure.

### Proposed Solution
Script or extension that:
- Extracts PR comment threads
- Ranks by type (e.g., logic error, naming, style)
- Writes feedback summary into repo for AI to act on

### Status
Backlog

---

## Fixture Elimination from Pytest

### Problem
Pytest fixtures frequently obscure logic, hide shared state, and duplicate setup behavior unnecessarily.

### Decision
Avoid fixtures unless teardown is essential or setup logic must be reused deeply. Prefer explicit setup logic.

### Status
Resolved. Best practice updated in `automation-design.md`.

---

## Rejected: Environment Variables for Secrets

### Problem
ENV vars are not secure: leak to subprocesses, stored in memory, visible in logs.

### Decision
Use internal container directories for secrets. Do not expose via environment or mounted host paths.

### Status
Resolved. See `automation-design.md`.

---
