# Crossrepo

This document defines the architecture for orchestrating automation across multiple repositories. It includes workflows to trigger, validate, and synchronize events like version tags, shared modules, and config propagation.

---

## Approved Scope

- Detect changes in core/shared repositories
- Trigger downstream automation (tests, rebuilds, sync)
- Validate consistency across dependent repositories
- Avoid duplicate or redundant pipelines

---

## Confirmed Use Cases

- Version tag propagation (e.g. shared `v1.2.3` tag)
- Shared module or file update triggers
- Global configuration linting or enforcement
- Coordinated PR generation in multiple repos

---

## Proposed Features

- Tag watcher with regex filter and target mapping
- Multi-repo pull request creator with patch templating
- Check consistency of `.md`, `.json`, `.yaml` across projects
- Batch-trigger GitHub Actions on dependency change

---

## Deferred Ideas

- Use monorepo-like linker for dependency graphs
- Cross-repo semantic indexing for search
- CI failure propagation from dependents to source repo

---

## Open Questions

- How do we detect indirect dependency changes?
- How are secrets managed securely across automation scopes?
- Should orchestration config be centralized or repo-local?

---

## Next Steps

1. Define tag/trigger schema (considering direct and indirect dependencies)
2. Build watcher for GitHub tag events
3. Build cross-repo patch generator
4. Decide on orchestration policy location
5. Research and define secure secret management strategy
