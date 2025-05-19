# Agent Control

This document defines the architecture for file-based AI agent invocation, where all prompts and completions are stored and processed via structured `.md` or `.json` files. It replaces inline chat input with inspectable, auditable automation triggers.

---

## Approved Scope

- All agent prompts must be stored in `.md` files before execution
- All outputs must be saved in a deterministic format (Markdown/JSON)
- Agents must operate within scoped inputs and outputs
- No direct system calls or uncontrolled interaction
- File-based interaction ensures reproducibility and audit

---

## Confirmed Design

- **Input**: `ai-prompts/*.md`
- **Output**: `/ai-output/*.json` or `.md` (Note: Markdown outputs intended for automated processing should follow a consistent, predefined structure to ensure deterministic interpretation)
- Prompts must contain:
  - Instruction
  - Context (file paths, summaries of prior related agent outputs or key documents)
  - Source (user or agent)
- Output must include:
  - Raw completion
  - Timestamp
  - Post-processed (optional) summary
  - Review status (e.g., pending, approved, rejected; optional or required based on workflow)
  - Context (file paths, summaries of prior related agent outputs or key documents)
  - Source (user or agent)
- Output must include:
  - Raw completion
- File watcher: auto-run agent on prompt file creation
  - (Ensures triggered agents adhere to the approved scope and interaction limits)
  - Post-processed (optional) summary
  - Review status (e.g., pending, approved, rejected; optional or required based on workflow)

---

## Proposed Features

- File watcher: auto-run agent on prompt file creation
- Prompt type registry (test, doc, plan, refactor, etc.)
- CLI agent runner: `run-agent prompt-name.md`
- Replay logs to compare agent responses over time

---

## Output Example

```json
{
  "prompt_file": "ai-prompts/test-login.md",
  "timestamp": "2024-05-20T18:14:00Z",
  "raw_completion": "To test login...",
  "summary": "Generated test with redirect and session checks",
  "review_status": "pending"
}
