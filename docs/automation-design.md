# Automation Design

This document defines the foundational rules, principles, and instructions derived from architectural sessions with the author. It governs how automation systems are reasoned about, designed, validated, and evolved. All future tooling, prompts, containers, CI pipelines, and agent interfaces must align with these principles.

---

## Table of Contents

- Working Philosophy
- Language and Terminology
- Approved Structures
- Prohibited Practices
- Instruction Protocol
- Behavioral Checkpoints
- Copilot/AIAgent Mediation
- Backlog Management Rules
- Naming Conventions

---

## Working Philosophy

- No solution before defining the problem.
- No code unless context is fully explained.
- No superficial responses. Every idea must be grounded in purpose.
- Everything must be inspectable and auditable.
- Automation should cut manual effort, not repackage complexity.
- Repetition is anti-pattern. Write once, link/reference later.
- All agent behavior must be constrained to deterministic boundaries.
- Execution is less important than comprehension.

---

## Language and Terminology

- **Behavior Drift**: A misalignment between the intent of a test and what the test actually does.
- **AI Prompt Mediation**: Sending instructions to AI via markdown-controlled prompt files.
- **Semantic Quality Check**: Evaluating code/tests based on intent and behavioral purpose.
- **Agent Sandbox**: A scoped environment where AI operates without external side effects.
- **Validator Loop**: Pipeline where AI outputs are reviewed and enforced.
- **Guideline-Driven Development**: Automation is governed by markdown rules, not code alone.

---

## Approved Structures

- Markdown-based control: All AI logic and rules expressed via `.md` files.
- Prompt isolation: Prompts must be placed in clear locations (`/ai-prompts`, `/input`, etc.).
- No hierarchy without semantics: Folder structures must reflect architectural roles.
- Metadata: All AI-generated files must be timestamped, sourced, and tagged.

---

## Prohibited Practices

- No use of environment variables for secrets—use container-internal paths.
- No meaningless test fixtures or wrapper duplication.
- No numeric ticket IDs (e.g. `B001`) for backlog tracking.
- No tables in core documentation—use ordered or unordered semantic lists.
- No implicit logic—every flow must be explicit and inspectable.
- No unsandboxed AI execution.
- No direct LLM interactions without traceable `.md` source.

---

## Instruction Protocol

- All design begins with problem statement.
- Responses must provide architectural reason before showing implementation.
- Every prompt, test, automation script must be driven by corresponding `.md` guideline.
- Output must be reviewed before used in production paths.

---

## Behavioral Checkpoints

- Test code must assert outcomes, not implementation.
- Function/test names must reflect verified behavioral intent.
- Avoid trivial, redundant, or logic-mirroring assertions.
- Coverage is only relevant when tied to logical path exploration.

---

## Copilot/AIAgent Mediation

- Prompt files stored in `/ai-prompts/*.md`
- Output files stored in `/ai-output/*.md` or `/ai-output/*.json`
- File watchers may observe file mutations for traceability.
- Each AI invocation should include:
  - Source prompt
  - Response
  - Review status

---

## Backlog Management Rules

- Group backlog by domain (not ID).
- Describe each entry with a clear problem title and architectural purpose.
- Use statuses like `planned`, `building`, `deferred`, `shipped`
- Store backlog in version-controlled markdown, not ticket systems.

---

## Naming Conventions

- kebab-case filenames only
- Prompts: `prompt-<area>.md`
- Output: `output-<artifact>.json`
- Scripts: `run-<action>.py`
- Folder structure must express meaning, not arbitrary nesting

---
