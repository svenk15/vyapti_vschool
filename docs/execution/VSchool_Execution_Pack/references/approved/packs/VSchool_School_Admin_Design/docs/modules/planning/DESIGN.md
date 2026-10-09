<!-- TT-01 contract -->
## TT-01 supersedes the timetable outline
For SA-41, SA-42, follow [Shared timetable workflows](../../timetable/WORKFLOWS.md), [physical LLD](../../timetable/LLD.md), [one task queue](../../timetable/TASKS.md) and [checkpoint](../../timetable/CURRENT_STATE.md). The timetable-specific outline below is retained as historical context; do not implement it as an independent queue. Other module workflows remain current. First release is a weekly cycle; two-week cycle remains future scope.

# Timetable & learning — School Administrator design

Edition 01 · Owner mapping: academics, learning · UX proposal; human review pending.

Publish conflict-free plans and follow up on learning activity.

## Scope and shared rules

Use PRODUCT_SCOPE, UX_SYSTEM, ARCHITECTURE_HANDOFF and SCREEN_CONTRACTS as shared contracts. Capabilities named for later modules are proposed. The prototype uses synthetic memory state; the repository implementation must use actual owner use cases.

## Physical implementation readiness

Before coding, reconcile actual `vs_` tables, columns, foreign keys, indexes, scoped joins, guard order, token/delivery semantics, RLS status, migrations and tests in the owning repository LLD. This pack specifies UX and conceptual owner workflows; it does not invent completed physical schemas.

<a id="sa-41"></a>
## SA-41 — Build and publish a timetable

**Phase:** 3 · **Authority:** timetable.manage

**Entry:** the Timetable & learning workspace or its linked record. Prototype: `#/flow/SA-41`.

**Prerequisites:** SA-11, room / recurrence design.

### Step 1 — Draft schedule

Keep draft separate from the published timetable.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Cycle (`week`) | select | Yes | Weekly cycle, Two-week cycle |
| Class (`section`) | select | Yes | Grade 6 · A, Grade 6 · B, Grade 7 · A |
| Effective from (`from`) | date | Yes | No prefilled user content |

### Step 2 — Resolve conflicts

Validate teacher, room and calendar conflicts.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Conflict review reference (`resolution`) | textarea | Yes | No prefilled user content |

### Step 3 — Publish revision

Preview generated session changes before confirmation.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| I have reviewed the published revision and future session impact. (`publish`) | checkbox | Yes | No prefilled user content |

### Confirm and outcome

A published timetable version drives idempotent future session generation.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Existing open/submitted attendance stays pinned; recurring plan is not the Phase 1 manual-session contract.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Clash races and repeated generation cannot produce double sessions.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Academics owns TimetableVersion/slots, room and teacher constraints; Attendance consumes versioned generation commands.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-42"></a>
## SA-42 — Arrange cover or a timetable exception

**Phase:** 3 · **Authority:** timetable.cover.manage

**Entry:** the Timetable & learning workspace or its linked record. Prototype: `#/flow/SA-42`.

**Prerequisites:** SA-41.

### Step 1 — Affected session

Choose a dated exception, not a permanent identity reassignment.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Class (`section`) | select | Yes | Grade 6 · A, Grade 6 · B, Grade 7 · A |
| Date (`date`) | date | Yes | No prefilled user content |
| Cover teacher (`teacher`) | select | Yes | Ananya Rao, Rohan Das |

### Step 2 — Review access and notice

The cover teacher receives only the required dated scope.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Reason (`reason`) | textarea | Yes | No prefilled user content |
| Eligibility and clashes have been reviewed. (`cover`) | checkbox | Yes | No prefilled user content |

### Confirm and outcome

The supported substitution is visible to the affected staff.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Never use shared logins; do not replace historical assignment attribution.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Unavailable cover or an already opened session invokes the defined review path.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Academics owns Substitution with effective period; Attendance assignment-resolution contract and Communication notification request.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-43"></a>
## SA-43 — Review learning readiness and follow-up

**Phase:** 3 · **Authority:** learning.overview; content authority delegated

**Entry:** the Timetable & learning workspace or its linked record. Prototype: `#/flow/SA-43`.

**Prerequisites:** learning module LLD.

### Step 1 — Choose the class

Show completion and workload within explicit school authority.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Class (`section`) | select | Yes | Grade 6 · A, Grade 6 · B, Grade 7 · A |
| View (`view`) | select | Yes | Upcoming assignments, Unpublished feedback, Student follow-up |

### Step 2 — Coordinate support

Teachers remain authors of lesson content and feedback.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Responsible teacher (`owner`) | select | Yes | Ananya Rao, Rohan Das |
| Requested follow-up (`request`) | textarea | Yes | No prefilled user content |

### Confirm and outcome

An authorized follow-up points to the owning learning record.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Do not reveal draft feedback to guardians or auto-score missing work as zero.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Revoked enrollment or assignment restricts content; attachments remain private and scanned.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Learning read projection of Assignment/SubmissionRevision/Feedback; follow-up command does not publish teacher drafts.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.
