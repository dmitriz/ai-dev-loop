# Suggestions & Future Ideas

This file collects ideas, feature extensions, and implementation improvements that are not part of the current system scope but may be revisited later.

---

## Modular Architecture

- [ ] Split each assistant role into its own file/module once implementations mature
- [ ] Create CLI wrappers for each role for isolated testing and use
- [ ] Consider packaging agents into microservices with shared schema

---

## Workflow Enhancements

- [ ] Auto-tag PRs based on review feedback (e.g. `clarify-needed`, `safe-to-apply`)
- [ ] Use GitHub checklists generated from reviewer comments
- [ ] Integrate with GitHub Projects or external kanban for batching

---

## Labeling & Batching

- [ ] Define a consistent set of batching labels (e.g. `routine`, `defer`, `priority-low`)
- [ ] Create an issue in a centralized tracker repo for deferred feedback
- [ ] Experiment with GitHub Projects to unify multi-repo issue views

---

## Agent Capabilities

- [ ] Confidence estimation model for auto-applicable suggestions
- [ ] Interactive clarification prompts to reviewers (with button-based replies)
- [ ] AI-powered reviewer coaching ("Please provide a committable suggestion...")

---

## UI / Developer Experience

- [ ] Build a dashboard to view, prioritize, and batch reviewer feedback
- [ ] Show comment type, risk, and effort at a glance in PR view
- [ ] VS Code extension or plugin to triage comments from within editor

---

## Research & External Data

- [ ] Create a Researcher Agent capable of citing external docs or RFCs
- [ ] Link reviewer suggestions to documentation, best practices, or code style guides
