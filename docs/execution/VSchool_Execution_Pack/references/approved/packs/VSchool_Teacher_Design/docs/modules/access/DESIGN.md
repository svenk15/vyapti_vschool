# Account & access — Teacher design

Edition 01 · First phase 1 · UX design proposal

Enter the right school workspace and keep your account secure.

Domain owner(s): access, tenancy. The teacher UI consumes these owners; it does not become a new shared-data owner. Resolve exact physical tables/capabilities against the current repository before coding.

## Common layout and states

Use the shared shell, typography, icons, context control, fluid Filter/Sort drawers and explicit outcomes from ../../UX_SYSTEM.md. All protected reads and commands recheck server scope. Include loading, empty, invalid input, permission loss, expired session, stale version and relevant unknown/delivery failure states. Keep institution/branch, school-local date and current assignment explicit.

## TEA-01 — Sign in to the school workspace

Phase: 1 (Attendance pilot). Reconcile the approved module scope before implementation.

Entry: `sign-in`. Required capability/condition: **active account + branch membership**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **School entry** — Published school branding helps recognition; it does not grant access.
   - Email address: `email`; required.
   - Password: `password`; required.
2. **Authorized workspace** — Skip branch selection when only one branch is permitted.
   - Branch: `select`; required; choices: Whitefield, Indiranagar.

### Outcome and domain invariant

My Teaching Day opens in the authorized branch.

Resolve permissions server-side. A Teacher role alone does not establish employee identity, dated eligibility or class assignment.

### Failure and recovery

Generic credential rejection; revoked/suspended access exposes no roster. Safe return URLs only.

### Data workflow and ownership

Access reads global UserAccount, branch SchoolMembership/RoleGrant and institution/branch state; creates verified session/context.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-02 — Activate or recover a teacher account

Phase: 1 (Attendance pilot). Reconcile the approved module scope before implementation.

Entry: `flow/TEA-02`. Required capability/condition: **Access activation/recovery policy**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Account help** — Use the verified channel allowed by the institution and account-wide policy.
   - Account email: `email`; required.
   - I need to: `select`; required; choices: Activate invited account, Reset password.
2. **Next steps** — The public response does not disclose whether the account exists.
   - I will use the school’s verified recovery instructions.: `checkbox`; required.

### Outcome and domain invariant

A generic acknowledgement explains the permitted next step.

Existing operator-issued and email-issued paths coexist. A stricter active institution can prevent an account-wide email reset at issue and consumption.

### Failure and recovery

Expired/revoked/consumed/failed-delivery tokens fail safely. Resend and compromised-inbox recovery use their documented owner workflows.

### Data workflow and ownership

Access owns token hashes, policy evaluation, single-use consume, session invalidation and sanitized delivery evidence. No secrets in drafts or audit.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-03 — Switch branch or leave the workspace

Phase: 1 (Attendance pilot). Reconcile the approved module scope before implementation.

Entry: `account`. Required capability/condition: **active target-branch grant / own session**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Destination** — Only authorized branches appear.
   - Destination: `select`; required; choices: Whitefield, Indiranagar, Sign out.
2. **Unsaved work** — An unsubmitted attendance draft is held in memory only in Phase 1.
   - I have reviewed unsaved work before leaving.: `checkbox`; required.

### Outcome and domain invariant

Context switches after authorization, or the current session ends.

Warn before discarding input; clear old-branch protected state/caches. A saved or submitted record belongs to its original branch.

### Failure and recovery

Permission lost during switch shows a safe destination. Unknown submission must be resolved before the draft is discarded.

### Data workflow and ownership

Access resolves target scope or revokes session. Business commands and request receipts remain owner-scoped.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-04 — Review my account and sessions

Phase: 1 (Attendance pilot). Reconcile the approved module scope before implementation.

Entry: `account`. Required capability/condition: **self.read; self-service session actions must match existing Access contract**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **My account** — Review only your own safe account and branch memberships.
   - View: `select`; required; choices: Account details, Authorized branches, Session information.
2. **Account action** — Role, employee identity and permissions are changed by their authorized owner.
   - Next action: `select`; required; choices: Use password recovery, Contact school administrator, Sign out of this session.

### Outcome and domain invariant

The teacher understands their identity, access and permitted account actions.

No self-service role escalation, arbitrary branch addition or global identity editing. Listing/revoking other own sessions is an extension unless the repository already supports it.

### Failure and recovery

A stale or expired session returns to school sign-in; never disclose token material.

### Data workflow and ownership

Access self DTO from UserAccount/session/membership; no salary, guardian grant or administrator-only record joins.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.
