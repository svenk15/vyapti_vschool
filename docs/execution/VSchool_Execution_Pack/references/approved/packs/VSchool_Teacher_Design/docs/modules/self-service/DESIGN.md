# My requests — Teacher design

Edition 01 · First phase 6 · UX design proposal

Request leave and review your own staff information without administrative authority.

Domain owner(s): people operations, access. The teacher UI consumes these owners; it does not become a new shared-data owner. Resolve exact physical tables/capabilities against the current repository before coding.

## Common layout and states

Use the shared shell, typography, icons, context control, fluid Filter/Sort drawers and explicit outcomes from ../../UX_SYSTEM.md. All protected reads and commands recheck server scope. Include loading, empty, invalid input, permission loss, expired session, stale version and relevant unknown/delivery failure states. Keep institution/branch, school-local date and current assignment explicit.

## TEA-37 — Request leave and arrange a handoff

Phase: 6 (School services). Reconcile the approved module scope before implementation.

Entry: `self-service`. Required capability/condition: **own leave.request; no approval power**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Leave request** — Only your own balances and requests are shown.
   - From date: `date`; required.
   - Until date: `date`; required.
   - Leave type: `select`; required; choices: Approved personal leave category, School-approved leave category.
2. **Teaching impact** — Requesting leave does not automatically cancel class sessions.
   - Teaching handoff reference: `textarea`; required.
   - Submit for the authorized approver.: `checkbox`; required.

### Outcome and domain invariant

The request is pending, approved, returned or declined with a clear reason.

Coverage belongs to the timetable owner; pupil and staff attendance are different domains. Sensitive leave evidence is restricted.

### Failure and recovery

Insufficient balance, overlapping request or changed approval authority blocks/returns appropriately.

### Data workflow and ownership

People operations LeaveRequest and versioned balance policy; ledger debit on approved transition; Academics cover handoff is separate.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-38 — Review my staff record and request a correction

Phase: 6 (School services). Reconcile the approved module scope before implementation.

Entry: `flow/TEA-38`. Required capability/condition: **own staff.read / correction request**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **My details** — Employment records are separate from login identity.
   - Field to review: `select`; required; choices: Work contact, Qualification record, Employment detail.
2. **Correction request** — Only the record owner can approve controlled changes.
   - Requested correction: `textarea`; required.
   - Non-sensitive evidence reference: `text`; required.

### Outcome and domain invariant

An own-record request has a traceable decision.

No view of colleagues’ personal records or payroll; bank/salary changes require a separately designed sensitive process.

### Failure and recovery

Revoked employment, disputed evidence and duplicate requests route to the authorized HR owner.

### Data workflow and ownership

Employee safe self projection and proposed StaffCorrectionRequest; approved changes use People operations owner commands.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.
