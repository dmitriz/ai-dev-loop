# Extraction Architecture

This document defines the architecture of a modular, cross-source extractor system for AI interaction data and related content. It serves as the planning foundation for future implementations of prompt/completion history extraction, indexing, and memory augmentation workflows.

---

## Problem Statement

AI systems produce massive volumes of ephemeral content—prompts, completions, file mutations, chat history, feedback loops—none of which are reliably stored, structured, or discoverable.

This leads to:
- Redundant AI usage
- Forgotten solutions
- Missed semantic patterns
- No persistent agent memory

---

## Objective

Design a generic, modular extraction system that:
- Extracts interaction history from Copilot, GPT, Gemini, and others
- Stores the extracted data in structured markdown or JSON
- Prepares for future summarization, vectorization, and search
- Is format-agnostic, source-modular, and reproducible

---

## Conceptual Components

### Source Modules

Modular extractors, each responsible for one data origin:

- `copilot-extractor`: Reads from VSCode SQLite history
- `gpt-export-reader`: Ingests JSON/HTML/GPT exports
- `gemini-session-dumper`: Pulls from Android/iOS export formats
- `perplexity-exporter`: Structured log parser (TBD)

Each returns a common schema:
```json
{
  "timestamp": "YYYY-MM-DDTHH:mm:ssZ", // Example: ISO 8601 format
  "source": "...",
  "prompt": "...",
  "completion": "...",
  "tags": ["example-tag-1", "example-tag-2"], // e.g., ["search-enhancement", "llm-interaction"]
  "path": "...",
  "linked_repo": "..."
}
