# Student support — Teacher design

Edition 01 · First phase 6 · UX design proposal

Refer concerns through a restricted, accountable route.

Domain owner(s): health, safeguarding. The teacher UI consumes these owners; it does not become a new shared-data owner. Resolve exact physical tables/capabilities against the current repository before coding.

## Common layout and states

Use the shared shell, typography, icons, context control, fluid Filter/Sort drawers and explicit outcomes from ../../UX_SYSTEM.md. All protected reads and commands recheck server scope. Include loading, empty, invalid input, permission loss, expired session, stale version and relevant unknown/delivery failure states. Keep institution/branch, school-local date and current assignment explicit.

## TEA-36 — Refer a student concern safely

Phase: 6 (School services). Reconcile the approved module scope before implementation.

Entry: `wellbeing`. Required capability/condition: **restricted referral.create; assigned pupil context**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Minimal referral** — Use the school’s approved reporting protocol. Do not include clinical detail in shared notes.
   - Student in assigned class: `select`; required; choices: Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003.
   - Urgency: `select`; required; choices: Routine specialist review, Urgent: follow school emergency procedure.
2. **Restricted handoff** — Only the authorized specialist receives sensitive details through the approved channel.
   - Team: `select`; required; choices: School health lead, Safeguarding lead.
   - Restricted handoff reference: `text`; required.

### Outcome and domain invariant

A minimal referral is handed to an authorized specialist with accountable status.

Teacher role gives no full clinical, custody or safeguarding case access. No automatic parent notification for a sensitive concern.

### Failure and recovery

Unavailable recipient or urgent danger uses the approved human escalation protocol; do not leave an urgent case in a generic queue.

### Data workflow and ownership

Restricted referral metadata and purpose grant; specialist case remains owned by Health/Safeguarding. General audit carries only safe references.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.
