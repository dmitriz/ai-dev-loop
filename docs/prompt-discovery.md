# Prompt Discovery

This document defines the architecture for extracting, organizing, and reusing AI prompt/completion interactions from various systems (Copilot, GPT, Gemini, etc.). It enables long-term discoverability and structured memory of AI-generated results.

---

## Approved Scope

- Extract AI prompts and completions from:
  - Copilot SQLite DB
  - GPT chat exports
  - Gemini sessions
  - Perplexity and others
- Store extracted entries in structured, version-controlled Markdown or JSON
- Allow prompt lookup, topic filtering, and future summarization
- Maintain file-based architecture (no database dependency)

---

## Confirmed Design Principles

- Each prompt–completion entry stored as a file (e.g., `.md`, `.json`)
- Entries tagged with:
  - Timestamp
  - Source (copilot, gpt, etc.)
  - Tags
  - Linked repo or file path (optional)
- Output lives in flat folder structure, easily grep/searchable

---

## Proposed Ideas

- Embedding and vector-based semantic search
- Tag clustering or topic classification
- Conversation threading (multi-turn prompt sets)
- Link prompts to test cases, doc references, or code locations
- CLI interface for search and preview

---

## Output Format (Example)

```markdown
# Prompt
How do I write a test that validates login flow?

# Completion
You should assert the redirect, session, and user context...

# Source
copilot

# Timestamp
2024-05-20T15:42:00Z

# Tags
login, testing, authentication
