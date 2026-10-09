# Attendance — Teacher design

Edition 01 · First phase 1 · UX design proposal

Record every pupil deliberately, submit once and know the outcome.

Domain owner(s): attendance. The teacher UI consumes these owners; it does not become a new shared-data owner. Resolve exact physical tables/capabilities against the current repository before coding.

## Common layout and states

Use the shared shell, typography, icons, context control, fluid Filter/Sort drawers and explicit outcomes from ../../UX_SYSTEM.md. All protected reads and commands recheck server scope. Include loading, empty, invalid input, permission loss, expired session, stale version and relevant unknown/delivery failure states. Keep institution/branch, school-local date and current assignment explicit.

## TEA-09 — Open an assigned attendance session

Phase: 1 (Attendance pilot). Reconcile the approved module scope before implementation.

Entry: `attendance/a1`. Required capability/condition: **attendance.mark + exact dated teacher assignment**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Session context** — Check subject, class, date and branch-local time.
   - Assigned session: `select`; required; choices: Mathematics · Grade 6 A · 8 Oct, 09:00, Mathematics · Grade 6 B · 8 Oct, 11:15.
2. **Open register** — Opening freezes the eligible roster, not its attendance statuses.
   - This is the intended class session.: `checkbox`; required.

### Outcome and domain invariant

The exact frozen roster opens with every pupil initially unmarked.

No default presence or absence. Reauthorize at open and submit; validate current session state and assignment.

### Failure and recovery

Empty roster, cancelled session, changed assignment and duplicate open have explicit outcomes. Never manufacture pupils or a replacement session.

### Data workflow and ownership

AttendanceSession state/roster transaction reads scoped dated enrollment, pins roster and calendar revision, writes audit/receipt without student attendance statuses.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-10 — Mark attendance and review exceptions

Phase: 1 (Attendance pilot). Reconcile the approved module scope before implementation.

Entry: `attendance/a1`. Required capability/condition: **attendance.mark for exact open session**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Mark deliberately** — Use Present, Absent, Late or Excused. Unmarked is a draft state.
   - Student in assigned class: `select`; required; choices: Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003.
   - Attendance: `select`; required; choices: Present, Absent, Late, Excused.
2. **Check the whole class** — A filtered view must not hide incomplete rows from final validation.
   - I have checked exceptions and all unmarked pupils.: `checkbox`; required.

### Outcome and domain invariant

An in-memory draft accurately represents the teacher’s intended register.

Explicit bulk action states its scope. Mark unmarked present preserves existing exceptions; replacing every status requires a separate confirmation.

### Failure and recovery

Search/filter changes never discard edits. Phase 1 reload/navigation may lose unsent input; warn clearly.

### Data workflow and ownership

UI draft keyed by exact session/roster revision. No browser durable pupil cache, database record or automatic attendance event before submit.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-11 — Submit attendance and keep the receipt

Phase: 1 (Attendance pilot). Reconcile the approved module scope before implementation.

Entry: `attendance/a1`. Required capability/condition: **attendance.mark + eligible exact assignment**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Review totals** — Every frozen roster pupil must have one supported status.
   - Every pupil has been marked and totals match the roster.: `checkbox`; required.
2. **Submit once** — Send one intent with its stable idempotency key and expected revision.
   - Submit this attendance register.: `checkbox`; required.

### Outcome and domain invariant

An acknowledged immutable submission shows scope, totals, actor, time and receipt reference.

Validate the full frozen roster atomically. Same key/payload replay returns the same outcome; changed payload with that key conflicts.

### Failure and recovery

Do not show success before server acknowledgement. On loss of response, retain the intent and use Check status.

### Data workflow and ownership

Owner transaction rechecks authorization/guards/version, writes complete attendance records + submission revision + receipt + safe audit/outbox.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-12 — Recover an uncertain submission

Phase: 1 (Attendance pilot). Reconcile the approved module scope before implementation.

Entry: `attendance/a1`. Required capability/condition: **same authorized command / receipt scope**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Check status** — An interrupted response can mean the server has already committed.
   - Recovery action: `select`; required; choices: Check existing request status, Retry the unchanged request when confirmed safe.
2. **Resolve the outcome** — A new key would be a new intent; do not create one blindly.
   - I have resolved the current request before changing the draft.: `checkbox`; required.

### Outcome and domain invariant

One logical submission is acknowledged without duplicated or overwritten attendance.

Freeze payload/key while outcome is unknown. Receipt resolution reauthorizes; a receipt key is not a bearer credential.

### Failure and recovery

If status check fails, remain Unknown. If not committed and still authorized, retry unchanged intent.

### Data workflow and ownership

Read owner command receipt/current session using institution, branch, account and resource scope; no new business writes during status lookup.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-13 — Handle a stale register or lost permission

Phase: 1 (Attendance pilot). Reconcile the approved module scope before implementation.

Entry: `flow/TEA-13`. Required capability/condition: **current assignment and session state**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Understand the change** — Explain a revision conflict separately from revoked access.
   - Change: `select`; required; choices: Session revision changed, Session cancelled, Assignment or membership revoked.
2. **Safe next action** — Protected input can be retained only while the teacher remains authorized.
   - Action: `select`; required; choices: Reload and review current authorized record, Return to My Teaching Day.

### Outcome and domain invariant

The teacher resolves a valid conflict or leaves an unavailable record without silent overwrite.

409 requires explicit review; 401/403 clears protected draft data. Never silently replay an old roster against a new one.

### Failure and recovery

A submitted record stays read-only; an unavailable record does not leak the new teacher or pupils.

### Data workflow and ownership

Application rechecks live guards and returns safe errors. New reads query owner state under current scope; no automatic mutation.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-14 — Review history and hand off a correction

Phase: 1 (Attendance pilot). Reconcile the approved module scope before implementation.

Entry: `history`. Required capability/condition: **attendance.read_class within authorized assignment scope**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Locate the session** — Use class, date and subject to find the exact submitted register.
   - Assigned class: `select`; required; choices: Grade 6 · A · Mathematics, Grade 6 · B · Mathematics, Grade 7 · A · Science.
   - Session date: `date`; required.
2. **Correction handoff** — Teachers cannot directly alter submitted attendance in Phase 1.
   - Session / submission reference: `text`; required.
   - Next action: `select`; required; choices: View receipt and revision history, Contact authorized school administrator.

### Outcome and domain invariant

The teacher understands the recorded result and the administrator’s correction route.

No attendance.correct from the Teacher role. Show original submission and permitted correction history with safe reasons.

### Failure and recovery

If the current assignment no longer authorizes the record, deny rather than revealing historical rosters.

### Data workflow and ownership

Read Session → frozen roster → effective records/revisions plus scoped receipt. Phase 1 support handoff creates no correction or hidden request record.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-15 — Use offline-assisted attendance

Phase: 2 (Family connection). Reconcile the approved module scope before implementation.

Entry: `flow/TEA-15`. Required capability/condition: **attendance.mark + approved offline capability**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Prepare an authorized session** — Offline access needs a separately approved privacy and device design.
   - Assigned session: `select`; required; choices: Mathematics · Grade 6 A · 8 Oct, 09:00, Mathematics · Grade 6 B · 8 Oct, 11:15.
   - This device meets the school’s approved offline policy.: `checkbox`; required.
2. **Reconnect and reconcile** — Queued does not mean submitted.
   - Sync action: `select`; required; choices: Review pending intent, Resolve server conflict, Check acknowledged receipt.

### Outcome and domain invariant

An authorized queued intent is reconciled explicitly and then acknowledged.

Phase 1 remains online-first. Any later durable queue needs expiry, minimization, device protection and reauthorization before replay.

### Failure and recovery

Permission revocation, lost device, changed roster, expired queue and competing submission must not silently sync.

### Data workflow and ownership

Proposed offline intent metadata + protected local payload; owner submission/receipt unchanged. Storage/security design required before coding.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-16 — Request an attendance correction

Phase: 2 (Family connection). Explicit scope extension; approval/reconciliation required.

Entry: `flow/TEA-16`. Required capability/condition: **attendance.correction.request (proposed)**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Identify the exact record** — A request is not a correction.
   - Submission reference: `text`; required.
   - Student in assigned class: `select`; required; choices: Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003.
   - Requested status: `select`; required; choices: Present, Absent, Late, Excused.
2. **Explain** — Use a minimal reason for authorized review.
   - Reason: `textarea`; required.
   - Send this request to the authorized attendance reviewer.: `checkbox`; required.

### Outcome and domain invariant

A proposed request has Pending review / Accepted / Declined states and a linked outcome.

New extension requiring scope approval. Only the administrator’s attendance.correct command changes the register.

### Failure and recovery

Duplicates, withdrawal, permission loss and already-corrected records are handled with traceable decisions.

### Data workflow and ownership

Proposed CorrectionRequest references session/record/revision; Attendance correction owner records accepted effect and audit. No direct teacher record writes.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.
