# Assistant Roles

This document outlines all assistant roles involved in the Reviewer Interaction Assistant system.  
Each role is focused, clearly bounded, and independently composable for modular development.

---

## 1. Orchestrator Agent

**Purpose:**  
Manages the entire review response workflow. Delegates tasks to other agents and maintains process state.

**Key Responsibilities:**
- Trigger comment retrieval
- Pass data to classifier, expert, or interaction agent
- Monitor resolution status across feedback items

**Boundaries:**  
Does not interpret or judge review comments directly.

---

## 2. Interaction Agent

**Purpose:**  
Engages directly with reviewers. Posts follow-up questions or requests for more specific, committable suggestions.

**Key Responsibilities:**
- Respond to vague feedback
- Ask for diffs, clarification, or priority
- Maintain respectful, concise tone

**Boundaries:**  
Does not apply changes or evaluate their safety.

---

## 3. Domain Expert Agent

**Purpose:**  
Understands project context. Makes safe, high-confidence decisions on whether suggestions should be accepted, rejected, or deferred.

**Key Responsibilities:**
- Evaluate risk of applying suggestions
- Decide which comments require action
- Inform what to ignore or escalate

**Boundaries:**  
Only operates with full access to project goals and constraints.

---

## 4. Task Classifier

**Purpose:**  
Categorizes reviewer comments by type, effort, and risk. Enables batching and prioritization.

**Key Responsibilities:**
- Assign metadata to each comment
  - Type (style, logic, docs, structure)
  - Risk (safe, uncertain, risky)
  - Effort (trivial, moderate, high)
- Identify batchable comments

**Boundaries:**  
Does not suggest or apply fixes.

---

## 5. Data Agent

**Purpose:**  
Pulls all relevant review data from APIs. Prepares structured input for processing by other agents.

**Key Responsibilities:**
- Extract review comments, suggestions, threads
- Normalize structure for classification
- Track comment metadata (file, author, timestamp)

**Boundaries:**  
Does not interpret or act on data.

---

## 6. Researcher Agent (Optional)

**Purpose:**  
Investigates unclear terms, external references, or deeper rationale behind feedback.

**Key Responsibilities:**
- Search external docs, specs, and standards
- Provide supporting info to the Domain Expert
- Summarize findings into usable insights

**Boundaries:**  
Does not communicate directly with reviewers or alter code.

---

Each agent plays a well-defined role within the review response process.  
This separation supports modular development, delegation, and reliable scaling of the system.
