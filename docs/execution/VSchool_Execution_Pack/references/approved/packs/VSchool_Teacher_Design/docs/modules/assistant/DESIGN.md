# Teaching assistant — Teacher design

Edition 01 · First phase 7 · UX design proposal

Use evidence-based drafts and retain human responsibility for every action.

Domain owner(s): assistant. The teacher UI consumes these owners; it does not become a new shared-data owner. Resolve exact physical tables/capabilities against the current repository before coding.

## Common layout and states

Use the shared shell, typography, icons, context control, fluid Filter/Sort drawers and explicit outcomes from ../../UX_SYSTEM.md. All protected reads and commands recheck server scope. Include loading, empty, invalid input, permission loss, expired session, stale version and relevant unknown/delivery failure states. Keep institution/branch, school-local date and current assignment explicit.

## TEA-42 — Use a teaching draft with source evidence

Phase: 7 (Reviewed assistant). Reconcile the approved module scope before implementation.

Entry: `assistant`. Required capability/condition: **assistant.use + each source capability**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Choose an allowed task** — Use authorized curriculum/resources and minimal permitted learner data.
   - Task: `select`; required; choices: Draft a lesson outline, Draft feedback from reviewed work, Explain my class attendance summary.
   - Request: `textarea`; required.
2. **Review evidence** — Sources, as-of time and uncertainty remain visible.
   - I have checked the sources and factual claims.: `checkbox`; required.
3. **Human action** — Open the normal workflow to edit and publish anything.
   - Next step: `select`; required; choices: Keep private draft, Open the normal lesson/feedback form.

### Outcome and domain invariant

A reviewed draft supports the teacher without independently changing school records.

No autonomous attendance marking, grading, discipline, diagnosis or guardian messaging. No unrestricted student SQL or sensitive-case retrieval.

### Failure and recovery

Missing evidence, prompt injection, stale content and provider failure cause abstention or an explicit safe fallback.

### Data workflow and ownership

AssistantSession/EvidenceReference/ActionProposal; permission-filtered owner read contracts, deterministic calculations and normal publication use cases.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.
