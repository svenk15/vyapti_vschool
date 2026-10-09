# Attendance — School Administrator design

Edition 01 · Owner mapping: attendance, reporting · UX proposal; human review pending.

Schedule sessions, monitor submissions and correct with evidence.

## Scope and shared rules

Use PRODUCT_SCOPE, UX_SYSTEM, ARCHITECTURE_HANDOFF and SCREEN_CONTRACTS as shared contracts. Capabilities named for later modules are proposed. The prototype uses synthetic memory state; the repository implementation must use actual owner use cases.

## Physical implementation readiness

Before coding, reconcile actual `vs_` tables, columns, foreign keys, indexes, scoped joins, guard order, token/delivery semantics, RLS status, migrations and tests in the owning repository LLD. This pack specifies UX and conceptual owner workflows; it does not invent completed physical schemas.

<a id="sa-25"></a>
## SA-25 — Schedule attendance sessions

**Phase:** 1 · **Authority:** class.manage

**Entry:** the Attendance workspace or its linked record. Prototype: `#/flow/SA-25`.

**Prerequisites:** SA-11, SA-19.

### Step 1 — Session

Attendance belongs to a class session, not an editable daily register.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Class (`section`) | select | Yes | Grade 6 · A, Grade 6 · B, Grade 7 · A |
| Subject (`subject`) | select | Yes | Mathematics, English, Science |
| Session date (`day`) | date | Yes | No prefilled user content |

### Step 2 — Time and teacher

Use the branch time zone. The teacher needs a dated eligible assignment.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Start time (`start`) | time | Yes | No prefilled user content |
| End time (`end`) | time | Yes | No prefilled user content |
| Teacher (`teacher`) | select | Yes | Ananya Rao, Rohan Das |

### Step 3 — Review schedule

Check calendar, offering/date overlap and teacher/date clashes.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| I have reviewed the conflict check. (`clash`) | checkbox | Yes | No prefilled user content |

### Confirm and outcome

The session appears in the assigned teacher’s teaching day.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Reject overlapping scheduled sessions for the same primary teacher; roster freezes only when the session opens.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Calendar conflict or teacher change explains the exact blocked interval.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Attendance owns AttendanceSession; Academics supplies Offering, Assignment and pinned CalendarRevision. Index both overlap query shapes.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-26"></a>
## SA-26 — Monitor and inspect attendance

**Phase:** 1 · **Authority:** attendance.read_school / attendance.read_class

**Entry:** the Attendance workspace or its linked record. Prototype: `#/flow/SA-26`.

**Prerequisites:** SA-25, teacher submission implementation.

### Step 1 — Choose the scope

Completeness and attendance rate are separate metrics.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| School date (`day`) | date | Yes | No prefilled user content |
| Class (`section`) | select | Yes | Grade 6 · A, Grade 6 · B, Grade 7 · A |

### Step 2 — Open a register

Read its roster, submission state and revision history.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Session (`session`) | select | Yes | Mathematics · 09:00 · Submitted, English · 10:00 · Not submitted, Science · 11:15 · Scheduled |

### Confirm and outcome

The exact session and its submission evidence are shown.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

School admin is not granted attendance.mark by default; link to assigned teacher, never impersonate them.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Cancelled and unsubmitted sessions are distinct from absent pupils; missing denominator displays unavailable.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Read scoped Session → frozen roster → records/revisions, with current authorization and data-as-of timestamp.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-27"></a>
## SA-27 — Correct submitted attendance

**Phase:** 1 · **Authority:** attendance.correct

**Entry:** the Attendance workspace or its linked record. Prototype: `#/flow/SA-27`.

**Prerequisites:** SA-26.

### Step 1 — Select the record

Corrections preserve the original submission.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Student (`student`) | select | Yes | Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003 |
| Session (`session`) | select | Yes | Mathematics · 8 Oct · 09:00 |
| Corrected status (`status`) | select | Yes | Present, Absent, Late, Excused |

### Step 2 — Record evidence

A meaningful reason is mandatory.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Reason (`reason`) | textarea | Yes | No prefilled user content |
| I have reviewed the original and corrected status. (`correct`) | checkbox | Yes | No prefilled user content |

### Confirm and outcome

A new correction revision appears with actor, reason and time.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Only submitted attendance is correctable; compare the expected revision in the same authorized transaction.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Another editor’s correction shows a conflict and comparison; unknown result uses the same request receipt.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Attendance appends immutable record/correction revision, audit and outbox; reporting reads the effective revision without destroying the original.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-28"></a>
## SA-28 — Cancel or review a session change

**Phase:** 1 · **Authority:** class.manage

**Entry:** the Attendance workspace or its linked record. Prototype: `#/flow/SA-28`.

**Prerequisites:** SA-25.

### Step 1 — Session and reason

Show current state before offering allowed cancellation.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Session (`session`) | select | Yes | Science · 8 Oct · 11:15 · Scheduled |
| Reason (`reason`) | textarea | Yes | No prefilled user content |

### Step 2 — Review consequences

Cancellation keeps history and affects completeness transparently.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| I have reviewed the session state and report impact. (`cancel`) | checkbox | Yes | No prefilled user content |

### Confirm and outcome

A supported cancellation records its reason and preserved history.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Do not silently reschedule an open/submitted session; use the supported state transition contract.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Changed session state may block cancellation; refresh the current record before retry.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Attendance session state transition under version/guard, with audit/outbox and reporting status change.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-29"></a>
## SA-29 — Review an absence explanation

**Phase:** 2 · **Authority:** attendance.explanation.review

**Entry:** the Attendance workspace or its linked record. Prototype: `#/flow/SA-29`.

**Prerequisites:** SA-32, SA-26, SA-35.

### Step 1 — Parent request

A family explanation is not an attendance correction.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Student (`student`) | select | Yes | Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003 |
| Request (`request`) | select | Yes | 8 Oct · Medical appointment · Pending |

### Step 2 — Review disposition

A separate authorized correction is needed if attendance itself changes.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Decision (`decision`) | select | Yes | Accept explanation, Ask for more information, Reject with explanation |
| School response (`reply`) | textarea | Yes | No prefilled user content |

### Confirm and outcome

The family receives a permitted disposition; attendance changes only through correction.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Recheck guardian relationship at request/read/delivery; do not expose restricted notes.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Late submission, duplicate explanation and revoked guardian access have separate outcomes.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Guardian/request owner records case; Attendance correction facade optional; Communication delivers under current grants.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.
