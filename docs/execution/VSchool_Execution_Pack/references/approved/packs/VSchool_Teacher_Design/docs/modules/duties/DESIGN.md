# Assigned duties — Teacher design

Edition 01 · First phase 6 · UX design proposal

Carry out explicitly assigned school duties with minimal pupil data.

Domain owner(s): operations, transport. The teacher UI consumes these owners; it does not become a new shared-data owner. Resolve exact physical tables/capabilities against the current repository before coding.

## Common layout and states

Use the shared shell, typography, icons, context control, fluid Filter/Sort drawers and explicit outcomes from ../../UX_SYSTEM.md. All protected reads and commands recheck server scope. Include loading, empty, invalid input, permission loss, expired session, stale version and relevant unknown/delivery failure states. Keep institution/branch, school-local date and current assignment explicit.

## TEA-41 — Carry out an assigned school duty

Phase: 6 (School services). Explicit scope extension; approval/reconciliation required.

Entry: `duties`. Required capability/condition: **explicit dated duty / minimal roster grant (proposed)**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Duty scope** — An event or transport duty does not grant full student access.
   - Assignment: `select`; required; choices: Assembly supervision, Approved trip support, Pickup duty.
2. **Record accountable handoff** — Follow the approved duty-specific procedure.
   - Duty / handoff reference: `text`; required.
   - Status: `select`; required; choices: Completed assigned check, Escalated to duty lead.

### Outcome and domain invariant

The assigned duty records a minimal outcome and responsible handoff.

Proposed extension: explicit activity-specific grant, dates and authorized pickup/handoff rules must precede implementation. No unrestricted live child location.

### Failure and recovery

Wrong-child handoff, missing pickup authority or offline uncertainty uses the approved human fallback.

### Data workflow and ownership

Proposed DutyAssignment/Outcome; Transport or activity owner supplies minimal authorized manifest and records domain-specific effects.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.
