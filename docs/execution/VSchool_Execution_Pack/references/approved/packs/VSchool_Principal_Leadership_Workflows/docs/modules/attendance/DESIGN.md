# Attendance oversight — DESIGN

Owner: Attendance + Coordination. Product proposal, not implementation evidence. Reconcile actual Bible, permission registry, source-owner LLD and schema first.

## LEA-08 — Inspect register submission coverage
**Delivery:** phase 1 · First release
**Trigger:** Principal wants to know whether expected registers have been received.
**Actors:** Principal; Attendance owner
**Preconditions:** Existing exact-session attendance contract and leadership read capability.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open Attendance oversight for a date/cutoff. | Show scheduled, due by cutoff, received and awaiting counts. |
| 2 | Principal | Open Awaiting submission. | Rows are exact eligible sessions, not absent pupils. |
| 3 | Principal | Inspect a session. | Show scheduled teacher, class, time, current status and last update. |
| 4 | System | Re-read before exposing any action. | A now-submitted session is no longer presented as missing. |

**Inputs and validation**

- **Date/cutoff:** School-local date with explicit server as-of.
- **Filters:** Class, session status and responsible teacher within permitted branch; no default selections.
- **Sort:** Due time or class; stable ID tie-breaker.

**Outcome:** Exact list of due but unsubmitted registers.
**Authorization:** Read-only principal oversight does not grant attendance.mark or attendance.correct.
**Data read:** Session schedule/state; frozen roster only if detailed grant; authoritative submission/revision receipt.
**Data written:** None.

**Alternate and failure paths**

- No registers due: show No registers due yet, not 100%.
- Cancelled or future-not-due session: excluded from due denominator with explicit reason.

**Demo acceptance:** Received + awaiting = due for the same cutoff; each register counted once.


## LEA-09 — Create an accountable missing-register follow-up
**Delivery:** phase 2 · First release · Explicit scope extension
**Trigger:** A due session is still awaiting submission.
**Actors:** Principal; operational coordinator; responsible teacher
**Preconditions:** Fresh missing-session evidence, internal follow-up capability and eligible assignee.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open missing session and choose Follow up. | Preview teacher, class, due state and any existing active follow-up. |
| 2 | Principal | Choose coordinator, due time and brief note. | Assignee must be eligible; this does not reassign teaching authority. |
| 3 | Principal | Review and confirm. | System rechecks source; inserts one follow-up or returns an existing one. |
| 4 | System | Return reference and assignment/delivery state separately. | Assigned does not mean the recipient read a message. |
| 5 | Coordinator | Follow the school’s operational process. | Only an eligible teacher submits attendance through the Attendance owner. |

**Inputs and validation**

- **Assignee:** Eligible staff in same permitted school; no general account lookup.
- **Due time:** Explicit time, timezone and school working policy.
- **Note:** Max proposed 500 characters; no pupil/health detail.
- **Source:** Exact session ID/revision; server verified.

**Outcome:** One scoped, assigned follow-up with due time and evidence rule.
**Authorization:** Assigning a follow-up grants no attendance marking, correction or new student data access.
**Data read:** Session status/version; active staff eligibility; existing open follow-up.
**Data written:** Coordination follow-up, intent receipt and minimal audit; optional approved delivery event.

**Alternate and failure paths**

- Teacher submitted before confirmation: do not create obsolete work; show current receipt.
- Existing open follow-up: open it or explicitly request authorized reassignment.
- Network uncertainty: check same intent before retry.

**Demo acceptance:** Duplicate click makes one follow-up; session submission remains untouched.


## LEA-10 — Follow up multiple missing registers safely
**Delivery:** phase 2 · Later · Explicit scope extension
**Trigger:** Several due sessions need action.
**Actors:** Principal; Coordination owner
**Preconditions:** All selected rows reauthorized; bulk capability explicitly enabled; single-item workflow proven.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Select explicit visible sessions. | Selection count and scope remain visible across filters. |
| 2 | System | Build a server-side review preview. | Identify already resolved, duplicate, ineligible and eligible rows. |
| 3 | Principal | Confirm recipients, common due time and per-item effects. | No hidden select-all across unreviewed pages. |
| 4 | System | Process independent owner commands. | Per-session succeeded/skipped/failed results and references returned. |
| 5 | Principal | Retry only known failures. | Uncertain items use status lookup; successful items are not resent. |

**Inputs and validation**

- **Selection:** Explicit bounded ID list; proposed max 25.
- **Assignee rule:** Per-session validated coordinator or approved routing.
- **Reason/due:** Previewed before confirmation.

**Outcome:** Honest per-item outcomes with no duplicate follow-ups.
**Authorization:** Bulk authority cannot exceed single-item authority. No bulk attendance marking/correction.
**Data read:** Same records as single follow-up plus versioned preview.
**Data written:** One coordination command receipt per session, plus non-sensitive batch summary.

**Alternate and failure paths**

- Permission/source changes after preview: that item is denied/skipped without rollback of unrelated successes.
- Filter change does not silently change confirmed payload.

**Demo acceptance:** 3 selected with 1 resolved and 1 denied yields 1 new, 1 skipped, 1 denied; no false batch-success label.


## LEA-11 — Verify, close or reopen a follow-up
**Delivery:** phase 2 · First release · Explicit scope extension
**Trigger:** Assignee reports completion or underlying session changes.
**Actors:** Assignee; principal/verifier; Coordination and Attendance owners
**Preconditions:** Current follow-up scope; explicit close/reopen capability; fresh evidence read.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Assignee | Mark Evidence ready with a permitted source reference. | This is a completion claim, not closure. |
| 2 | Principal | Open Verify resolution. | Re-read the exact Attendance receipt and follow-up version. |
| 3 | Principal | Confirm closure only if evidence rule is satisfied. | System records verifier, source version and closed time. |
| 4 | Principal | Reopen with a reason if later authorized evidence invalidates closure. | History remains; active assignee/due time chosen again. |

**Inputs and validation**

- **Evidence:** Exact source receipt/revision or approved evidence type.
- **Closure note:** Optional bounded operational note.
- **Reopen reason:** Required; does not edit prior closure event.

**Outcome:** Verified closure or explicit continued work.
**Authorization:** No closure from a broad role alone; no privilege escalation through evidence links.
**Data read:** Follow-up lifecycle/version; fresh owner evidence and current access.
**Data written:** Versioned closure/reopen event and audit; no Attendance mutation.

**Alternate and failure paths**

- Source still missing: cannot verify closure merely from assignee text.
- Stale follow-up version: show new owner/status before deciding.
- Source inaccessible: block verification and route to authorized verifier.

**Demo acceptance:** Teacher submission changes source to received; follow-up closes only under documented verification rule.


## LEA-12 — Review factual pupil attendance patterns
**Delivery:** phase 2 · Later
**Trigger:** School policy calls for a review of recorded absence patterns.
**Actors:** Principal or attendance lead; authorized student support coordinator
**Preconditions:** Explicit pupil-level attendance purpose; defined date window and outcome rules.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Choose recorded period and approved review criterion. | Show source coverage before any pattern list. |
| 2 | System | Group factual submitted outcomes by permitted pupil. | Count sessions/dates explicitly; no speculative risk label. |
| 3 | Principal | Open the record evidence. | Separate late, absent, excused and unsubmitted sessions. |
| 4 | Principal | Route a support follow-up if warranted. | Guardian contact/relationship and care information require their own grants. |

**Inputs and validation**

- **Window:** Bounded school dates.
- **Criterion:** Approved rule with version; no secret default scoring.
- **Follow-up purpose:** Attendance support; no inferred medical/family reason.

**Outcome:** Evidence-based human review and authorized next action.
**Authorization:** Attendance purpose is not health, safeguarding or unrestricted family access.
**Data read:** Submitted session outcomes; frozen roster; scoped student summary; rule version.
**Data written:** Only an approved coordination/support request if confirmed.

**Alternate and failure paths**

- Incomplete registers: disclose missing coverage; do not manufacture absence.
- Restriction on pupil detail: show authorized aggregate or deny; do not expose identity in export.

**Demo acceptance:** Same pupil with multiple absent sessions is counted as one pupil only when metric explicitly says unique pupils.


## LEA-13 — Review an absence explanation
**Delivery:** phase 2 · Later
**Trigger:** Guardian submits an explanation requiring school disposition.
**Actors:** Principal only if delegated; attendance office; guardian
**Preconditions:** Verified guardian-origin request and an explicit school-review capability.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Reviewer | Open assigned request. | See exact child/session/date and minimum explanation permitted for purpose. |
| 2 | Reviewer | Check related attendance and prior disposition. | Explanation status is separate from attendance outcome. |
| 3 | Reviewer | Record allowed disposition or ask for clarification. | Response communicates school review, not an automatic correction. |
| 4 | Authorized Attendance owner | If required, perform separate correction workflow. | Correction receipt is linked without impersonating teacher or guardian. |

**Inputs and validation**

- **Disposition:** Owner-allowed values only.
- **Clarification:** Bounded question; recipient is current authorized originator.
- **Correction reason:** Separate owner command and permission.

**Outcome:** Explained school decision with traceable handoff.
**Authorization:** Principal status alone does not grant family/care detail or correction authority.
**Data read:** Owned family request; current guardian purpose; exact attendance record/version.
**Data written:** Request disposition and permitted message; correction is separate.

**Alternate and failure paths**

- Restricted relationship changes: recheck before reply.
- Principal not delegated: view only permitted routing state, not explanation body.

**Demo acceptance:** Approving an explanation does not mutate an attendance mark.


## LEA-14 — Review an attendance correction request
**Delivery:** phase 2 · Later
**Trigger:** Teacher, student or parent flags a potential record error.
**Actors:** Delegated attendance reviewer; principal as coordinator
**Preconditions:** Correction capability separately granted to actual decision maker; source version available.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Inspect minimal request and route to authorized reviewer. | No edit action appears without correction grant. |
| 2 | Reviewer | Compare original mark and allowed evidence. | Source revision, reason and current conflict checks are visible. |
| 3 | Reviewer | Review and confirm correction through Attendance owner. | Expected-version command appends correction evidence. |
| 4 | System | Update permitted report/read projections. | History retains original and corrected outcome; notifications follow owner policy. |

**Inputs and validation**

- **Record:** Exact student/session reference.
- **New outcome:** Attendance policy allowlist; no bulk default.
- **Reason:** Required bounded reason, evidence reference if policy requires.

**Outcome:** Authorized corrected revision or reasoned rejection.
**Authorization:** Coordination does not confer correction permission; no principal mark-all shortcut.
**Data read:** Current attendance revision; request; authorized evidence.
**Data written:** Owner correction command plus audit/receipt, if explicitly permitted.

**Alternate and failure paths**

- Submitted record changed during review: re-read before correction.
- Insufficient evidence: request clarification or reject, preserving history.

**Demo acceptance:** Concurrent correction does not overwrite a newer revision.


## LEA-15 — Resolve an incorrect or duplicate scheduled session
**Delivery:** phase 1 · Later
**Trigger:** Coverage appears wrong because the underlying session setup is wrong.
**Actors:** Principal; authorized Academic/Attendance administrator
**Preconditions:** Source session read grant; administrative lifecycle command owned elsewhere.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open suspected session and related evidence. | See timing, offering and current roster/submission state. |
| 2 | Principal | Send setup review to the authorized administrator. | Do not delete the row from a leadership dashboard. |
| 3 | Administrator | Apply allowed correction/cancellation under owner rules. | Submitted sessions and referenced evidence receive extra protection. |
| 4 | System | Refresh coverage with explicit exclusion/revision. | Historical totals disclose the applicable as-of policy. |

**Inputs and validation**

- **Concern:** Wrong time, offering, duplication or other bounded reason.
- **Reference:** Exact sessions; never name-only matching.

**Outcome:** Correct source setup or an explained rejection.
**Authorization:** Principal can inspect/route only within separate capabilities.
**Data read:** Session/offering/schedule revisions and receipts.
**Data written:** Request only from leadership; source change through owning administrator.

**Alternate and failure paths**

- Already submitted: cannot casually cancel/delete to improve coverage.
- Related reports changed: surface revision rather than silently alter prior exported snapshot.

**Demo acceptance:** Removing a dashboard exception cannot erase a submitted attendance record.
