# Insights – Part 13

## Agent Collaboration Patterns
- Agents should be able to observe and critique one another's outputs, creating a feedback loop.
- Emergent governance: Agents form temporary hierarchies where more accurate or senior agents supervise others.
- Critical agents are essential: not all agents should be action-takers—some should specialize in fault detection or assumptions-checking.

## Task Cycler Design Principles
- Enforce rhythm: consistent cycles prevent fatigue and decision overload.
- Automate friction points: break start/stop detection, delay enforcement, and session logging should be automatic.
- Session-awareness: The system should recognize the user's current mode (work, break, idle) without needing prompts.

## Scaling AI Utility
- Infinite parallelization: Once agent orchestration works, multiple projects can run concurrently.
- Discovery agents: Constantly scan for new tools, APIs, and models to recommend upgrades.
- Aggregation agents: Condense learning from multiple agents and surface only net useful insights.

## Managing Feedback Overload
- Need for prioritization layer: not all AI-generated insights deserve equal attention.
- Cluster by theme: Group similar insights before evaluating value.
- Build a “feedback inbox”: a queue of low-cost ideas for occasional review.

## Productivity Infrastructure Design
- Single entry point (`npm start`) hides complexity—important for flow.
- State context handling is key: even a simple tool needs to track active sessions, delays, and previous task status.
- Self-correcting tools: if user stops mid-task, tool should record partial progress and offer resume.

## Decision Flow Simplification
- Reduce branching logic in daily decisions (what to do next, when to take breaks).
- Use labels and priority scores to automate decisions about task importance.
- Favor automation defaults: where manual intervention is optional, not required.

## Interaction Design with AI Agents
- Ideal experience: the user feels like giving direction, not writing full instructions.
- Auto-contextual prompts: agents should infer state from file trees, past tasks, and issue labels.
- Multi-agent chat simulations: test how agents converse and resolve ambiguity before giving the user outputs.

## Meta-Productivity Ideas
- Use AI to summarize other AI outputs, reducing cognitive load.
- Let agents compete: compare outputs and pick the best.
- Train reward signals: user feedback (accept, edit, discard) helps rank agent strategies over time.

## Idea Retention & Archiving
- “Insights” is a better name than “ideas”: avoids implying things are speculative.
- Use one flat archive (like this) for low-effort future retrieval.
- Consider converting recurring insights into principle-based documentation (e.g., README-level wisdom files).

# End of insights-part-13
