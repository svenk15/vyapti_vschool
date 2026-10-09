# VSchool Principal & School Leadership — workflow catalogue

Edition 01 · Product proposal · 46 workflows across 12 areas.

Read PRODUCT_CHARTER.md, METRIC_DICTIONARY.md and FIRST_RELEASE.md first. All flows use server-derived scope, shared UX and explicit owner contracts.

# Access & leadership context

## LEA-01 — Enter the correct leadership workspace
**Delivery:** phase 1 · First release
**Trigger:** Principal signs in or holds more than one role.
**Actors:** Principal; Access service
**Preconditions:** Active account, leadership assignment and at least one explicit branch grant; required foundations released.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Use school-branded sign-in. | Existing trust and authentication policy applies. |
| 2 | System | Resolve permitted roles and branches from the current account. | Leadership appears only with a grant; no student/finance access inferred. |
| 3 | Principal | Choose Leadership and a permitted branch. | Header shows institution, branch, role and school-local date. |
| 4 | System | Load only enabled and authorized navigation. | A complete attendance-only experience is possible. |

**Inputs and validation**

- **Workspace:** Only server-returned roles.
- **Branch:** Only currently granted branches; never inferred from institution ownership.

**Outcome:** Correct branch-scoped leadership home.
**Authorization:** Principal role is not a wildcard. Protected reads and mutations reauthorize independently.
**Data read:** UserAccount; active role/grant; organization/school state; released/entitled/branch-enabled modules.
**Data written:** Existing session/context selection only; no role creation.

**Alternate and failure paths**

- No leadership grant: show permitted workspace choices, not a broken dashboard.
- Session expiry: clear protected content and return through sign-in.

**Demo acceptance:** Unrelated branch, school-slug forgery and revoked role cannot open the workspace.


## LEA-02 — Switch branches without losing context
**Delivery:** phase 1 · First release
**Trigger:** Leader oversees multiple explicitly granted branches.
**Actors:** Principal or institution leader
**Preconditions:** Destination branch grant exists; any pending command has been reconciled.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open the branch selector. | Each allowed option names institution and branch. |
| 2 | System | Check unsaved work or unresolved commands. | Save/discard prompt for editable draft; unresolved decision must be checked first. |
| 3 | Principal | Confirm destination. | Server re-resolves module and object permissions. |
| 4 | System | Clear prior branch filters and data. | New branch context reloads; a deep link from the previous branch is not silently reused. |

**Inputs and validation**

- **Destination:** A returned branch reference, not an arbitrary UUID.
- **Unfinished work:** Remain, save draft if supported, or discard explicitly.

**Outcome:** New branch view with consistent scope and capabilities.
**Authorization:** Cross-branch aggregate authority is separate from branch switching.
**Data read:** Current branch grants; module availability; pending command references.
**Data written:** Existing context-selection/session state only.

**Alternate and failure paths**

- Destination grant revoked while chooser is open: remain in old authorized context.
- Different timezone: date is recalculated in destination school timezone.

**Demo acceptance:** A stale selection is rejected; no old branch record flashes or leaks.


## LEA-03 — Work under a temporary leadership delegation
**Delivery:** phase 2 · Later · Explicit scope extension
**Trigger:** Approved acting principal or deputy covers a defined period.
**Actors:** Delegator; acting leader; Access owner
**Preconditions:** School-approved delegation policy, eligible delegate and bounded grant management authority.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Delegator | Choose eligible colleague, branch, allowed actions and effective window. | Preview excludes authorities the delegator cannot delegate. |
| 2 | Authorized approver | Confirm purpose and expiry. | Access owner records a dated delegation. |
| 3 | Acting leader | Enter delegated workspace. | Visible Acting role, scope and expiry; no misleading permanent title. |
| 4 | System | Recheck expiry on every protected action. | Expired or revoked authority stops new decisions. |

**Inputs and validation**

- **Delegate:** Active eligible school staff identity.
- **Scope:** Specific actions/branch; no wildcard.
- **Window:** Starts before ends; maximum determined by approved policy.
- **Reason:** Bounded non-sensitive note.

**Outcome:** Time-limited delegated authority with clear accountability.
**Authorization:** Grant issuance and delegated operation are different capabilities; originator identity remains visible.
**Data read:** Access grant/delegation rules; active staff assignment.
**Data written:** Delegation through Access owner, safe audit, approved recipient notification if enabled.

**Alternate and failure paths**

- Self-delegation or privilege expansion: deny.
- Pending work outlives delegation: route to currently authorized owner.

**Demo acceptance:** Delegate cannot approve outside scope or after expiry; existing receipts remain attributable.


## LEA-04 — Handle access changes during a leadership action
**Delivery:** phase 1 · First release
**Trigger:** Role, branch permission or module availability changes while a page is open.
**Actors:** Leader; Access and source owner
**Preconditions:** All protected operations and receipt lookups use current server authorization.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Leader | Open an item from the current screen. | The owner checks live scope before returning its contents. |
| 2 | System | Detect revoked/expired access. | Sensitive content is removed; generic unavailable state is shown. |
| 3 | Leader | Use school support or another permitted context. | No client-side override is offered. |
| 4 | System | Reauthorize any saved status reference later. | Receipt identity is not itself access permission. |

**Inputs and validation**

- **Recovery destination:** Only a currently permitted context or school contact.

**Outcome:** No unauthorized read or write following permission loss.
**Authorization:** Apply to reads, downloads, exports, retries and exact replay, not only navigation.
**Data read:** Current grants/module policy; owner command status under access policy.
**Data written:** Only safe audit of denial; no protected record mutation.

**Alternate and failure paths**

- Outcome of a previous command is unknown: keep a non-sensitive reference, not the hidden item details.
- Disabled module does not erase owner records or obligations.

**Demo acceptance:** A command checked after revocation is denied; denied page does not disclose private details.

# Daily & weekly review

## LEA-05 — Review my school today
**Delivery:** phase 1 · First release
**Trigger:** Start of day or return to the workspace.
**Actors:** Principal
**Preconditions:** Branch-scoped source projections are authorized; school date/time and data freshness known.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | System | Show branch, school-local date and last successful refresh. | No ambiguous institution-wide totals. |
| 2 | Principal | Review a short prioritized list. | Registers due, uncovered sessions and assigned decisions appear only when those modules exist. |
| 3 | Principal | Open one item. | Filters, cutoff, source records and permitted action carry through. |
| 4 | System | Refresh after a source change. | Resolved items update without pretending every related follow-up is closed. |

**Inputs and validation**

- **Date:** Defaults to school today; historical dates explicit.
- **Priority:** Operational deadline/severity rule, never a pupil or teacher risk score.

**Outcome:** One clear next action grounded in evidence.
**Authorization:** Home projection inherits each source capability; aggregated cards do not create drill-down authority.
**Data read:** Authorized session/decision/follow-up projections and as-of metadata.
**Data written:** None.

**Alternate and failure paths**

- No items: show No action required for this scope, plus data cutoff.
- Missing module: omit its widget; do not show zero or an upsell.

**Demo acceptance:** Every number has a definition and opens the same scoped record set.


## LEA-06 — Recognize stale, incomplete or unavailable information
**Delivery:** phase 1 · First release
**Trigger:** An owner service cannot refresh or some records are not yet submitted.
**Actors:** Principal; source projection
**Preconditions:** Freshness and completeness are available as separate metadata.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | System | Label source cutoff and current refresh outcome. | Last known data is visibly stale; unavailable is not zero. |
| 2 | Principal | Inspect what is missing. | Show source/type/count only within authority. |
| 3 | Principal | Retry or open a safe source view. | Retry uses current scope; input/filter state is retained. |
| 4 | System | Reconcile after recovery. | New cutoff/version is visible; pending decisions need fresh evidence. |

**Inputs and validation**

- **Cutoff:** Server-generated instant with school timezone.
- **Completeness:** Due/received/unknown counts, never a vague confidence score.

**Outcome:** Leader can judge whether information supports a decision.
**Authorization:** Do not expose withheld cases through error counts or hidden-widget totals.
**Data read:** Owner projection watermark; source availability; exact metric definition.
**Data written:** None apart from bounded refresh telemetry.

**Alternate and failure paths**

- Partial source failure: show available sections with explicit gaps.
- Stale evidence for mutation: block and re-review before decision.

**Demo acceptance:** Unavailable source does not appear as 0; approval cannot consume stale expected version.


## LEA-07 — Run the weekly leadership review
**Delivery:** phase 2 · Later · Explicit scope extension
**Trigger:** Scheduled school review meeting.
**Actors:** Principal; authorized coordinators
**Preconditions:** Approved meeting purpose and source access; follow-up coordination enabled for actions.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Choose period and permitted scope. | Brief shows coverage, outstanding actions and relevant published changes. |
| 2 | Group | Inspect a concern and agree an action. | Owner, due time, source reference and completion evidence are explicit. |
| 3 | Principal | Confirm action list. | Each action is routed to its owning team; recipients are previewed. |
| 4 | Principal | Review carried-over actions next week. | Reassignment and verified outcomes remain traceable. |

**Inputs and validation**

- **Period:** Explicit start/end and school timezone.
- **Action owner:** Current eligible staff identity.
- **Due time:** School-local input converted to an instant.
- **Completion evidence:** Source-state condition or permitted attachment reference.

**Outcome:** Actionable review brief and owned follow-ups.
**Authorization:** A meeting participant does not gain the principal’s source privileges.
**Data read:** Approved report snapshots and follow-up history.
**Data written:** Internal follow-up records and approved meeting action references only.

**Alternate and failure paths**

- No reliable comparison period: omit trend claim.
- Action falls outside participants’ authority: hand off instead of exposing private records.

**Demo acceptance:** Next review distinguishes open, overdue, evidence-ready and verified closed actions.

# Attendance oversight

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

# Academic oversight

## LEA-16 — Review timetable conflicts and uncovered classes
**Delivery:** phase 3 · Later
**Trigger:** A class is uncovered or a published schedule changes.
**Actors:** Principal; authorized Academics + Learning + Assessments owner
**Preconditions:** Published recurring timetable and coverage owner; manual attendance sessions alone are insufficient.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open affected period and branch. | List published uncovered/conflicting occurrences with evidence. |
| 2 | Principal | Inspect the exact occurrence. | Show current assignment and impact without private staff absence reasons. |
| 3 | Principal | Route to timetable coordinator or open delegated cover action. | Eligible staff and conflict checks come from the owner. |
| 4 | System / owner | Confirm owner result. | Publication/version refreshes; related attendance remains separate. |

**Inputs and validation**

- **Period:** School dates and times.
- **Occurrence:** Exact published version.
- **Proposed action:** Owner-defined cover/change request.

**Outcome:** Resolved cover arrangement or a traceable coordination request.
**Authorization:** No general timetable-edit or attendance-mark authority from a principal role.
**Data read:** Published occurrences; dated teacher eligibility and assignment; conflict projection.
**Data written:** Owner-specific cover request/decision only.

**Alternate and failure paths**

- Concurrent timetable edit requires refreshed review.
- No eligible cover: show unresolved status and escalation, not an invented allocation.

**Demo acceptance:** Assigned substitute cannot clash with another occurrence; cancelled sessions remain traceable.


## LEA-17 — Review assignment completion with the right denominator
**Delivery:** phase 3 · Later
**Trigger:** Leader reviews work completion for a class or subject.
**Actors:** Principal; authorized Academics + Learning + Assessments owner
**Preconditions:** Learning oversight grant and published assignment audience/extension rules.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Choose class, subject and period. | Show expected learner-assignment pairs due by cutoff. |
| 2 | Principal | Open submitted, awaiting or excused group. | Latest accepted attempt per pair counts once; private drafts remain private. |
| 3 | Principal | Inspect permitted evidence and context. | Extensions and missing audience data are explicit. |
| 4 | System / owner | Create a scoped teaching follow-up if justified. | Action names class/task, owner and evidence goal; no bulk student penalty. |

**Inputs and validation**

- **Period/cutoff:** Explicit school time.
- **Population:** Published assignment audience as of documented snapshot.
- **Follow-up:** Optional, distinct from grade/discipline.

**Outcome:** Accurate completion review and an authorized educational next step.
**Authorization:** Default leadership oversight does not expose private drafts or all student response content.
**Data read:** Published assignment recipients; accepted attempts; extensions/excused policy.
**Data written:** Optional internal coordination action.

**Alternate and failure paths**

- Unavailable submission data is not non-completion.
- A second attempt does not count as a second pupil.

**Demo acceptance:** Extended/not-yet-due and excused pairs follow the documented denominator policy.


## LEA-18 — Review feedback awaiting return
**Delivery:** phase 3 · Later
**Trigger:** Accepted learner work has not received returned feedback within school policy.
**Actors:** Principal; authorized Academics + Learning + Assessments owner
**Preconditions:** Learning oversight and an approved turnaround definition; teacher draft privacy preserved.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Select period and subject. | Show accepted attempts awaiting student-facing feedback. |
| 2 | Principal | Inspect elapsed time and source policy. | Calendar/working-day basis and cutoff are visible. |
| 3 | Principal | Coordinate with the subject lead. | No private draft comments or automatic staff performance verdict. |
| 4 | System / owner | Track returned publication. | Fresh evidence supports follow-up verification. |

**Inputs and validation**

- **Turnaround rule:** Versioned school policy; no hidden hardcoded deadline.
- **Assignee:** Eligible subject coordinator.
- **Note:** Operational, not evaluative personal data.

**Outcome:** Clear feedback backlog with owned follow-up.
**Authorization:** Feedback oversight is separate from permission to read full learner work.
**Data read:** Accepted attempt timestamp; returned feedback publication timestamps/state.
**Data written:** Optional coordination record; no teacher feedback edits.

**Alternate and failure paths**

- Returned then withdrawn feedback is shown under owner policy, not counted as permanently delivered.
- Incomplete timestamps block unsupported average.

**Demo acceptance:** Teacher Save private draft does not clear Awaiting return.


## LEA-19 — Coordinate an evidence-based learning concern
**Delivery:** phase 3 · Later · Explicit scope extension
**Trigger:** A teacher or authorized academic review identifies a learning concern.
**Actors:** Principal; authorized Academics + Learning + Assessments owner
**Preconditions:** Approved learning-support purpose; school process and authorized coordinator.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Review permitted task/assessment evidence. | Describe observable facts, not a diagnosis or predictive score. |
| 2 | Principal | Choose an educational follow-up. | Owner, review date and intended improvement are explicit. |
| 3 | Principal | Include family/student only through authorized channels. | Relationship and communication purposes rechecked. |
| 4 | System / owner | Review progress against agreed evidence. | Close or revise the support action; private specialist records remain separate. |

**Inputs and validation**

- **Concern:** Factual, bounded description.
- **Evidence:** Permitted published/returned source references.
- **Review date:** Explicit; no indefinite unresolved action.

**Outcome:** Human-owned learning support with a review checkpoint.
**Authorization:** No automatic mental-health inference, grading change or disciplinary action.
**Data read:** Authorized learning evidence and minimal student/class context.
**Data written:** Restricted educational follow-up only; separate specialist referral if needed.

**Alternate and failure paths**

- Sensitive care concern routes to the specialist workspace.
- No access to evidence: assign authorized reviewer without exposing it.

**Demo acceptance:** General school dashboards never reveal confidential support narrative.


## LEA-20 — Check assessment and report readiness
**Delivery:** phase 4 · Later
**Trigger:** School approaches a report publication milestone.
**Actors:** Principal; authorized Academics + Learning + Assessments owner
**Preconditions:** Assessment readiness projection and explicit branch oversight grant.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Choose assessment cycle. | Show configured requirements and source cutoff. |
| 2 | Principal | Inspect missing marks, unresolved outcomes or pending moderation. | Different readiness blockers remain distinct. |
| 3 | Principal | Assign coordination to the responsible owner. | No fabricated marks or implicit publication rights. |
| 4 | System / owner | Recheck owner evidence. | Ready means prerequisites satisfied, not Published. |

**Inputs and validation**

- **Cycle:** Exact scheme/version.
- **Readiness rule:** Owner-defined; optional assessments labelled.
- **Coordinator:** Eligible assessment lead.

**Outcome:** An explainable readiness checklist and remaining blockers.
**Authorization:** Leadership read does not imply mark entry, moderation approval or publication.
**Data read:** Assessment scheme; outcome completeness; moderation state; publication prerequisites.
**Data written:** Coordination actions only unless separately delegated.

**Alternate and failure paths**

- Absent, Exempt and Not entered cannot collapse into numeric zero.
- Revised scheme invalidates stale readiness snapshot.

**Demo acceptance:** 100% readiness cannot be displayed while a mandatory outcome is unresolved.


## LEA-21 — Perform an explicitly delegated moderation decision
**Delivery:** phase 4 · Later
**Trigger:** Assessment owner assigns a moderation item to the principal.
**Actors:** Principal; authorized Academics + Learning + Assessments owner
**Preconditions:** Distinct moderation grant; conflict-of-interest rule and current evidence version.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open assigned moderation item. | View only permitted mark/rubric evidence and recorded checks. |
| 2 | Principal | Declare conflict or request missing information. | No self-approval of own prohibited work. |
| 3 | Principal | Review approve/reject/return consequences. | Reason and impact preview use the owner contract. |
| 4 | System / owner | Confirm through Assessment owner. | Versioned decision receipt; result publication remains separate. |

**Inputs and validation**

- **Decision:** Only currently allowed transitions.
- **Reason:** Required where policy mandates; returned items need actionable explanation.
- **Evidence version:** Server rechecked.

**Outcome:** One attributable moderation decision.
**Authorization:** Moderation and result publication are separate grants.
**Data read:** Assigned assessment decision and permitted evidence.
**Data written:** Assessment-owned moderation command, receipt and audit.

**Alternate and failure paths**

- Changed marks or assignment after preview: conflict, re-review.
- Unknown response: status check before a new intent.

**Demo acceptance:** Decision inbox cannot bypass the assessment owner’s guards.


## LEA-22 — Authorize or hand off report publication
**Delivery:** phase 4 · Later
**Trigger:** Reports are approved and ready for release.
**Actors:** Principal; authorized Academics + Learning + Assessments owner
**Preconditions:** Explicit publication delegation, audience and required separation of duties.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Inspect exact approved report version and audience. | Show release date, affected population and unresolved blockers. |
| 2 | Principal | Preview permitted publication effects. | No default all-branch or all-family audience. |
| 3 | Principal | Publish only if explicitly authorized; otherwise hand off. | Fresh prerequisites and conflict rules rechecked. |
| 4 | System / owner | Inspect owner publication receipt and delivery status. | Published is distinct from every recipient having received/read it. |

**Inputs and validation**

- **Version:** Exact immutable approved publication.
- **Audience:** Purpose-authorized student/guardian recipients.
- **Release time:** Explicit timezone and owner scheduling policy.

**Outcome:** Owner-confirmed publication or a pending handoff.
**Authorization:** Principal role alone cannot publish or access all guardian recipients.
**Data read:** Report readiness; approved version; authorized publication audience.
**Data written:** Assessment publication command and approved communication handoff.

**Alternate and failure paths**

- Duplicate publish returns same result.
- Post-publication correction uses new revision/withdrawal policy, not silent overwrite.

**Demo acceptance:** Stale or unapproved report cannot be published.

# Staff coordination

## LEA-23 — Review staffing availability without private reasons
**Delivery:** phase 3 · Later
**Trigger:** Principal checks whether the school day can be covered.
**Actors:** Principal; authorized People + Timetable + Requests owner
**Preconditions:** People/timetable availability projection; purpose-specific leadership grant.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Choose date and branch. | Show available/unavailable and relevant assignment coverage. |
| 2 | Principal | Open an uncovered occurrence. | No medical, payroll or private leave narrative. |
| 3 | Principal | Coordinate with eligible staff owner. | Availability is advisory until assignment conflict checks pass. |
| 4 | System / owner | Recheck published cover result. | Operational gap is resolved by owner evidence. |

**Inputs and validation**

- **Date:** School-local date.
- **Availability detail:** Minimum needed for cover.
- **Action:** Coverage coordination, not staff-performance scoring.

**Outcome:** Operational staffing view.
**Authorization:** Availability oversight is not full HR-record access.
**Data read:** People safe availability projection; dated teaching assignments.
**Data written:** Optional cover request only.

**Alternate and failure paths**

- Missing availability data shown Unknown.
- A staff member working another branch is not presumed free.

**Demo acceptance:** Private leave reason cannot appear in a list, export or notification.


## LEA-24 — Approve temporary cover when delegated
**Delivery:** phase 3 · Later
**Trigger:** Timetable coordinator proposes substitute coverage.
**Actors:** Principal; authorized People + Timetable + Requests owner
**Preconditions:** Delegated cover approval; verified teacher eligibility and time overlap checks.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Review proposed teacher, occurrence and effective period. | See alternatives and impact allowed by owner. |
| 2 | Principal | Check current eligibility and conflicts. | No assumption that any staff account can teach. |
| 3 | Principal | Approve, return or reject with reason. | Current source versions and separation rules checked. |
| 4 | System / owner | Confirm published dated assignment. | Teacher access derives from that assignment, not principal notification. |

**Inputs and validation**

- **Occurrence/version:** Exact class/time.
- **Substitute:** Eligible active teacher.
- **Decision/reason:** Owner policy.

**Outcome:** Valid time-bounded cover assignment or explicit rejection.
**Authorization:** Approver cannot create teacher identity or bypass eligibility.
**Data read:** Occurrence; verified teacher identity/eligibility; dated assignment overlap.
**Data written:** Timetable owner command and audit.

**Alternate and failure paths**

- Teacher becomes ineligible before commit: deny.
- Teacher/date overlap: reject rather than double-book.

**Demo acceptance:** Expired cover grants no continued marking authority.


## LEA-25 — Decide an assigned staff request
**Delivery:** phase 6 · Later
**Trigger:** A leave/resource/staff request reaches an authorized approver.
**Actors:** Principal; authorized People + Timetable + Requests owner
**Preconditions:** Request type is released; principal explicitly assigned and permitted.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open assigned request. | Minimal purpose-specific detail and policy are shown. |
| 2 | Principal | Inspect operational impact and conflicts. | Sensitive attachments require separate access. |
| 3 | Principal | Choose an allowed decision or request information. | Review reason and consequence. |
| 4 | System / owner | Commit through the request owner. | Receipt shows decision; downstream roster/payroll actions keep their own state. |

**Inputs and validation**

- **Request type:** Existing allowed owner category.
- **Decision:** Per-type transition allowlist.
- **Reason:** Required for refusal/return when policy says so.

**Outcome:** Attributed staff-request decision.
**Authorization:** No blanket HR, salary or medical authority.
**Data read:** Assigned request; policy/version; permitted operational impact.
**Data written:** People/service request decision only.

**Alternate and failure paths**

- Principal is requester or has a prohibited conflict: route to independent approver.
- Approval does not automatically update payroll or timetable.

**Demo acceptance:** Same inbox cannot approve a type the principal is not delegated for.


## LEA-26 — Hand over open work when leadership changes
**Delivery:** phase 2 · Later · Explicit scope extension
**Trigger:** Principal/delegate leaves, delegation expires or responsibilities change.
**Actors:** Principal; authorized People + Timetable + Requests owner
**Preconditions:** Authorized handover coordinator; recipient grants verified independently.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | List transferable open work in permitted scope. | Separate operational actions from confidential cases and source-owner decisions. |
| 2 | Principal | Preview new eligible owners and retained evidence. | No access grant is bundled into reassignment. |
| 3 | Principal | Confirm reassignment by item. | Per-item version/eligibility and outcomes recorded. |
| 4 | System / owner | Retire old delegation through Access owner. | No orphaned live actions; inaccessible cases routed to specialist steward. |

**Inputs and validation**

- **Items:** Explicit bounded selection.
- **New owner:** Eligible for each purpose.
- **Effective time/reason:** Recorded in handover evidence.

**Outcome:** Traceable ownership transfer and access expiry.
**Authorization:** Reassignment cannot transfer private source access by implication.
**Data read:** Current open work, delegation expiry, current eligible assignees.
**Data written:** Versioned ownership events; separate Access delegation revoke.

**Alternate and failure paths**

- New owner lacks authority: item fails/awaits qualified owner.
- Unknown transfer result: reconcile, do not duplicate.

**Demo acceptance:** Old owner cannot act after revocation; new owner cannot read unrelated confidential material.

# Decisions & approvals

## LEA-27 — Work from a purpose-scoped decision inbox
**Delivery:** phase 2 · Second release
**Trigger:** Principal has requests awaiting their decision.
**Actors:** Principal; authorized Each owning module owner
**Preconditions:** Source modules expose an authorized assigned-decision projection.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open My decisions. | Group by decision type, due time and action readiness. |
| 2 | Principal | Filter or sort using shared controls. | Counts reflect accessible items and current scope. |
| 3 | Principal | Open an item. | Owner-specific evidence, allowed actions and impact load fresh. |
| 4 | System / owner | Return to inbox. | Decided, awaiting information and unavailable items update distinctly. |

**Inputs and validation**

- **Filters:** Type, state, due period; no selected defaults.
- **Search:** Request reference or permitted subject.
- **Sort:** Due time or submitted time.

**Outcome:** One navigational inbox, with owner-specific decisions.
**Authorization:** Inbox read grant never authorizes decisions across every source module.
**Data read:** Authorized decision references and safe status projection only.
**Data written:** None.

**Alternate and failure paths**

- Source module disabled: no blind approve button.
- Stale list row: re-read source, do not trust cached action state.

**Demo acceptance:** Opening a decision calls its owner policy; unseen types cannot be acted upon.


## LEA-28 — Request information before deciding
**Delivery:** phase 2 · Later
**Trigger:** Evidence is incomplete or ambiguous.
**Actors:** Principal; authorized Each owning module owner
**Preconditions:** Current decision assignment and a permitted communication channel.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Identify the missing information. | Choose targeted fields/questions; no unnecessary personal data. |
| 2 | Principal | Preview recipient and question. | Only authorized originator/team sees the request. |
| 3 | Principal | Confirm request for information. | Owner records Waiting for information and response expectation. |
| 4 | System / owner | Review response later. | Decision evidence version changes; prior review must be refreshed. |

**Inputs and validation**

- **Question:** Bounded actionable text.
- **Recipient:** Owner-approved requester/contact.
- **Response date:** Policy-defined, not an invented statutory deadline.

**Outcome:** An explicit pending-information state.
**Authorization:** Asking for information does not expand recipient or case permissions.
**Data read:** Decision version; current originator/participant grant.
**Data written:** Source-owner information request and approved message.

**Alternate and failure paths**

- Reply delivery fails: remains visible; no implied receipt.
- Request already resolved/reassigned: stale transition rejected.

**Demo acceptance:** Waiting for information is not Rejected or Approved.


## LEA-29 — Approve, reject or return an assigned item
**Delivery:** phase 2 · Later
**Trigger:** A complete item is ready for a delegated decision.
**Actors:** Principal; authorized Each owning module owner
**Preconditions:** Owner exposes current valid actions and consequence preview.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Review source facts and policy. | See subject, version, scope and relevant history. |
| 2 | Principal | Select decision and enter reason. | Reason requirements vary by source type. |
| 3 | Principal | Review the consequences and confirm. | One explicit command with stable intent and expected version. |
| 4 | System / owner | Read decision receipt. | Actor, time, outcome, source revision and downstream pending effects are distinct. |

**Inputs and validation**

- **Decision:** Source-defined allowed enum.
- **Reason:** Required where meaningful; no generic mandatory filler for every approval.
- **Intent/version:** Opaque server/adapter contract.

**Outcome:** One owner-confirmed decision.
**Authorization:** No generic approval table may become authority over all modules.
**Data read:** Owner decision item and policy/version.
**Data written:** Only the owning module changes business state; receipt/audit atomically recorded.

**Alternate and failure paths**

- Concurrent decision wins first: show current result; no overwrite.
- Transport timeout: Check decision status before retry.

**Demo acceptance:** Approved but payment/delivery pending cannot display Completed.


## LEA-30 — Recuse and route a conflict of interest
**Delivery:** phase 2 · Later
**Trigger:** Principal is the requester, subject or otherwise prohibited decision maker.
**Actors:** Principal; authorized Each owning module owner
**Preconditions:** Source-owner separation-of-duty policy and independent eligible escalation role.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Detect or declare a conflict. | Decision controls are unavailable where policy prohibits self-approval. |
| 2 | Principal | Choose permitted independent route. | Recipient is eligible and not selected from a public directory. |
| 3 | Principal | Record minimal recusal reason. | Confidential allegation details stay restricted. |
| 4 | System / owner | Track reassignment status. | Original principal does not gain continuing case access from routing it. |

**Inputs and validation**

- **Conflict category:** Owner allowlist plus bounded optional note.
- **Recipient:** Policy-defined independent role/person.

**Outcome:** Independent authorized decision ownership.
**Authorization:** No self-delegation trick or role switch to bypass separation of duties.
**Data read:** Assignment and conflict rules; eligible independent roles.
**Data written:** Source-owner recusal/reassignment event.

**Alternate and failure paths**

- No eligible approver: retain pending state and route to designated steward.
- Complaint is about principal: confidential route avoids sending narrative back to subject.

**Demo acceptance:** Requester cannot approve own prohibited item through alternate workspace.


## LEA-31 — Recover an uncertain or outdated decision
**Delivery:** phase 2 · Second release
**Trigger:** A decision response is lost or evidence changes mid-review.
**Actors:** Principal; authorized Each owning module owner
**Preconditions:** Stable intent, expected version and authorized status use case exist.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Keep intent and show Confirmation pending. | Do not offer another different decision while unresolved. |
| 2 | Principal | Check status under current authorization. | Accepted receipt, still pending or verified not-found returned. |
| 3 | Principal | If evidence changed, reopen review. | Display new permitted state and require fresh confirmation. |
| 4 | System / owner | Resolve the original operation. | No duplicate downstream effect and no false failure label. |

**Inputs and validation**

- **Reference:** Original opaque intent key.
- **New decision:** Only after original status is known and current policy permits.

**Outcome:** Known, attributable outcome.
**Authorization:** Retry/replay/status endpoints apply the same current owner guard.
**Data read:** Command receipt plus current owner version.
**Data written:** Exact replay only; no new effect on duplicate.

**Alternate and failure paths**

- Stale replica absence is not proof of failure.
- Permission revoked: safe support reference only, no protected receipt body.

**Demo acceptance:** Lost response followed by status check returns one original decision.

# Communication & family escalations

## LEA-32 — Prepare a targeted school notice
**Delivery:** phase 2 · Later
**Trigger:** Leadership needs to communicate a school update.
**Actors:** Principal; authorized Communication + Requests owner
**Preconditions:** Draft/publish grants separate; recipient-purpose model active.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Choose purpose and allowed audience. | Preview branch/class/role and recipient count without exposing unnecessary contacts. |
| 2 | Principal | Write notice and permitted attachments. | Required acknowledgement is optional and distinct from consent. |
| 3 | Principal | Preview content, timing and audience. | School timezone, channels and changed recipient scope visible. |
| 4 | System / owner | Save draft or submit for approval/publish if granted. | No send until explicit authorized confirmation. |

**Inputs and validation**

- **Audience:** Explicit authorized groups; no default all-institution.
- **Title/body:** Bounded content; plain, action-oriented language.
- **Acknowledgement:** Explicit toggle with explanation.
- **Schedule:** Optional owner-supported future release.

**Outcome:** Prepared notice or owner-confirmed publication.
**Authorization:** Broadcast authority is separate from reading private family conversations.
**Data read:** Allowed audience rules; current recipient purposes; attachment scan state.
**Data written:** Communication draft/approval/publication via owner.

**Alternate and failure paths**

- Audience changes before send: regenerate preview.
- Not authorized to publish: draft/approval handoff, not hidden direct send.

**Demo acceptance:** No message is sent merely by selecting audience or saving a draft.


## LEA-33 — Approve or return a proposed communication
**Delivery:** phase 2 · Later
**Trigger:** A staff-authored notice is awaiting delegated review.
**Actors:** Principal; authorized Communication + Requests owner
**Preconditions:** Assigned reviewer, permitted content/audience and publication policy.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open the exact draft revision. | Show intended audience, author, channels and schedule. |
| 2 | Principal | Review accuracy, clarity and required permissions. | Flag confidential content in broad communication. |
| 3 | Principal | Approve or return with actionable changes. | Versioned owner command; author may need to resubmit changed content. |
| 4 | System / owner | Inspect actual release state. | Approval is separate from scheduled publication and delivery. |

**Inputs and validation**

- **Decision:** Approve/return/reject per policy.
- **Reason:** Required for return; bounded and actionable.
- **Revision:** Exact reviewed content/audience version.

**Outcome:** Approved version or clear revision request.
**Authorization:** Only current delegated publishing/approval authority can act.
**Data read:** Notice draft version, audience preview and approval rule.
**Data written:** Communication approval state/receipt; publication follows owner contract.

**Alternate and failure paths**

- Author edits during approval: conflict, re-review.
- Self-approval prohibited by school rule: independent reviewer.

**Demo acceptance:** Approval of version 2 cannot publish unseen version 3.


## LEA-34 — Follow up delivery or acknowledgement gaps
**Delivery:** phase 2 · Later
**Trigger:** Important published notice has incomplete delivery or requested acknowledgement.
**Actors:** Principal; authorized Communication + Requests owner
**Preconditions:** Purpose-scoped delivery/acknowledgement projection; manual resend policy.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open notice coverage. | Separate eligible audience, accepted sends, failed deliveries and explicit acknowledgements. |
| 2 | Principal | Inspect permitted failed/unacknowledged group. | Unread, unacknowledged and failed delivery are not synonyms. |
| 3 | Principal | Preview a targeted reminder/resend. | Current recipient grants and deduplication rechecked. |
| 4 | System / owner | Record per-recipient outcomes. | No repeated send to already excluded or successfully handled recipients. |

**Inputs and validation**

- **Notice/version:** Exact publication.
- **Reminder audience:** Explicit purpose-filtered subset.
- **Message:** Bounded context; no private case details.

**Outcome:** Honest delivery/acknowledgement follow-up.
**Authorization:** No visibility into another guardian’s private relationship restrictions.
**Data read:** Published recipient snapshot plus current grants; delivery attempts; explicit acknowledgements.
**Data written:** Approved manual reminder/send intent and safe outcomes.

**Alternate and failure paths**

- No acknowledgement requirement: do not manufacture an engagement deficit.
- Revoked guardian purpose: stop future contact under that purpose.

**Demo acceptance:** Delivery accepted does not increment acknowledgement count.


## LEA-35 — Handle an escalated family concern or complaint
**Delivery:** phase 2 · Later
**Trigger:** A school request reaches the principal under escalation policy.
**Actors:** Principal; authorized Communication + Requests owner
**Preconditions:** Explicit case purpose and independent route for conflicts.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open only assigned, permitted case evidence. | See concern, timeline, desired outcome and authorized participants. |
| 2 | Principal | Acknowledge receipt through approved channel. | Do not promise a decision or confidentiality the school cannot guarantee. |
| 3 | Principal | Assign investigation/review to eligible owner. | Need-to-know access, action dates and participant boundaries set. |
| 4 | System / owner | Review owner finding and communicate permitted outcome. | Appeal/reopen route follows school policy; restricted notes stay private. |

**Inputs and validation**

- **Category/urgency:** Factual school-defined classification.
- **Owner/review date:** Eligible person and explicit checkpoint.
- **Outcome message:** Student/family-safe version, separate from internal notes.

**Outcome:** Owned, trackable resolution process.
**Authorization:** Leadership hierarchy does not grant all case content.
**Data read:** Assigned request/case; permitted timeline and relationship-purpose participant grants.
**Data written:** Case-owner coordination and public outcome events; controlled communication.

**Alternate and failure paths**

- Complaint concerns principal: route independently without revealing narrative to implicated user.
- Another guardian lacks purpose: not added automatically.
- Urgent safety issue: invoke designated school protocol, not ordinary queue promises.

**Demo acceptance:** General home, search, export and audit omit restricted complaint narrative.


## LEA-36 — Run a family or staff meeting with follow-up actions
**Delivery:** phase 3 · Later · Explicit scope extension
**Trigger:** A permitted discussion needs coordination.
**Actors:** Principal; authorized Communication + Requests owner
**Preconditions:** Meeting scheduling scope approved; participant permissions and availability policy.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Define purpose and permitted participants. | No unrestricted contact search or hidden addition of guardians. |
| 2 | Principal | Propose/confirm a time and agenda. | Acceptance state distinct from invitation delivery. |
| 3 | Principal | Record agreed non-sensitive actions. | Each action has owner, due date and permitted evidence. |
| 4 | System / owner | Share authorized summary and review progress. | Private notes stay separate; closure uses actual results. |

**Inputs and validation**

- **Participants:** Current purpose-authorized identities.
- **Time:** Explicit timezone and availability.
- **Agenda/actions:** Bounded and visible only to intended participants.

**Outcome:** Confirmed meeting and accountable next steps.
**Authorization:** Meeting membership does not transfer access to full student/HR/case records.
**Data read:** Permitted participant references; meeting state; source action references.
**Data written:** Meeting owner and coordination records only.

**Alternate and failure paths**

- Declined invitation does not mean meeting occurred.
- A participant loses access: remove future visibility and recheck sharing.

**Demo acceptance:** Sharing the summary excludes private staff/case notes.

# Restricted student support

## LEA-37 — Refer a concern to an authorized specialist
**Delivery:** phase 6 · Later
**Trigger:** A factual observation requires specialist support.
**Actors:** Principal; authorized Specialist support owner owner
**Preconditions:** School-defined referral channel and purpose grant; designated specialist service enabled.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Read allowed referral context. | Do not search for a broad student health/case history. |
| 2 | Principal | Record minimum factual concern. | Show who will receive it and the limits of this channel. |
| 3 | Principal | Route to designated specialist. | Receipt confirms referral, not diagnosis, intervention or accepted treatment. |
| 4 | System / owner | Track permitted handoff status only. | Case narrative and specialist notes remain restricted. |

**Inputs and validation**

- **Concern:** Observed facts, no automated diagnosis.
- **Recipient:** Designated specialist route.
- **Urgency:** School-defined routing, not automated medical triage.

**Outcome:** Restricted referral with an accountable recipient.
**Authorization:** Referral capability does not grant case-read or health-record access.
**Data read:** Minimal student identity/purpose context; authorized referral route.
**Data written:** Specialist referral and safe status evidence.

**Alternate and failure paths**

- Specialist channel unavailable: school-approved contact route shown.
- Principal lacks case access after referral: status-only projection if permitted.

**Demo acceptance:** No detailed health/support narrative appears in school-wide dashboard or analytics.


## LEA-38 — Follow the school’s urgent safety escalation procedure
**Delivery:** phase 6 · Later · Explicit scope extension
**Trigger:** An urgent safety concern is raised through an approved channel.
**Actors:** Principal; authorized Specialist support owner owner
**Preconditions:** Approved school procedure, authorized emergency roles and actual contact configuration.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Show the school’s urgent-contact instruction. | Ordinary software queue is not represented as continuously monitored. |
| 2 | Principal | Contact the designated responsible person through the approved process. | No autonomous notification to all staff or guardians. |
| 3 | Principal | Record minimum permitted handoff evidence after appropriate action. | Access remains need-to-know. |
| 4 | System / owner | Review restricted incident follow-up under owner policy. | Emergency access, if supported, is explicit, time-limited and independently reviewed. |

**Inputs and validation**

- **Handoff reference:** Minimum safe information.
- **Emergency access:** Not a default principal capability; reason/expiry/review required where designed.

**Outcome:** Human-led authorized safety handoff.
**Authorization:** No default break-glass, diagnosis or confidential case visibility.
**Data read:** Approved procedure/contact configuration and explicit emergency-role rules.
**Data written:** Restricted handoff/event only under incident owner.

**Alternate and failure paths**

- No configured procedure: show school contact gap, do not invent emergency policy.
- Complaint implicates a leader: use designated independent channel.

**Demo acceptance:** The portal never claims it has provided emergency assistance merely because a form was saved.

# Reports & accountability

## LEA-39 — Drill into a metric and export permitted evidence
**Delivery:** phase 1 · Later · Explicit scope extension
**Trigger:** Leader needs to explain a number or share an authorized report.
**Actors:** Principal; authorized Reporting + source owners owner
**Preconditions:** Versioned metric definition, bounded query and distinct export permission.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open a metric. | Carry filters, cutoff, denominator and scope into the evidence list. |
| 2 | Principal | Inspect records and exceptions. | Explain what was excluded and what is unavailable. |
| 3 | Principal | Preview export fields and scope. | Minimize personal data; rows are not broadened beyond the reviewed query. |
| 4 | System / owner | Generate and download via authorized route. | Report records definition/version/as-of; link expires and access is rechecked. |

**Inputs and validation**

- **Metric/period:** Exact definition/version and cutoff.
- **Columns:** Allowlisted for purpose.
- **Export format:** Owner-supported CSV/PDF; safe spreadsheet-cell handling.

**Outcome:** Explainable report and controlled evidence export.
**Authorization:** Aggregate access does not imply pupil-level rows or unrestricted bulk export.
**Data read:** Authorized metric projection/source records, snapshot metadata.
**Data written:** Report job/download audit; no source-record mutation.

**Alternate and failure paths**

- Large export: bounded asynchronous job with explicit readiness, reauthorization and expiry if supported.
- Suppressed small groups must not be reconstructible via totals or overlapping filter exports.

**Demo acceptance:** Report total agrees with the same scoped evidence snapshot.


## LEA-40 — Compare branches responsibly
**Delivery:** phase 2 · Later
**Trigger:** Institution leader has explicit cross-branch analytics authority.
**Actors:** Principal; authorized Reporting + source owners owner
**Preconditions:** Comparable definitions, time basis, granted branch set and suppression rules.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Select authorized branches and period. | No implicit all-institution scope. |
| 2 | Principal | Review comparability. | Show module availability, calendar, coverage and definition differences. |
| 3 | Principal | Compare like-for-like metrics. | Display counts/denominators; no misleading simple average of percentages. |
| 4 | System / owner | Open a branch only where detailed authority exists. | A summary grant does not create full operational access. |

**Inputs and validation**

- **Branch set:** Explicit allowed set.
- **Metric:** Compatible definition version.
- **Comparison window:** Normalized school-day/period policy, visibly documented.

**Outcome:** Qualified comparison with limitations visible.
**Authorization:** Cross-branch analytics, branch detail and pupil evidence are separate capabilities.
**Data read:** Authorized aggregate snapshots and definition metadata.
**Data written:** None, unless an explicitly authorized report export is requested.

**Alternate and failure paths**

- Different calendars or missing data: show Not comparable rather than rank.
- Partial branch grant loss: recompute safely without revealing withheld totals.

**Demo acceptance:** Weighted total uses underlying counts; unavailable branch is never treated as zero.


## LEA-41 — Prepare a leadership review brief
**Delivery:** phase 2 · Later
**Trigger:** Leader needs an evidence-backed meeting or management summary.
**Actors:** Principal; authorized Reporting + source owners owner
**Preconditions:** Approved audience and access-filtered report sources.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Choose period, purpose and audience. | Only permitted source sections included. |
| 2 | Principal | Review key changes and unresolved actions. | Every claim links to a source/cutoff; distinguish fact from interpretation. |
| 3 | Principal | Edit and approve the narrative. | Exclude confidential cases and unsupported causal claims. |
| 4 | System / owner | Export or share only through authorized action. | Audience preview and delivery/receipt remain explicit. |

**Inputs and validation**

- **Audience:** Approved role/person set.
- **Narrative:** Human reviewed; no student/teacher labels unsupported by evidence.
- **Source versions:** Retained in report metadata.

**Outcome:** Reviewable brief with evidence and next actions.
**Authorization:** Brief generation and external sharing are separate grants.
**Data read:** Source metric snapshots; action status; publication-safe narrative.
**Data written:** Report draft/version; approved sharing command only on explicit confirmation.

**Alternate and failure paths**

- Missing baseline: no invented trend.
- A restricted source cannot be exposed through an apparently harmless summary.

**Demo acceptance:** Reviewer can trace each number to the same permitted snapshot.


## LEA-42 — Review decision and follow-up history
**Delivery:** phase 2 · Later
**Trigger:** Leader audits why an action was taken or a case remains open.
**Actors:** Principal; authorized Reporting + source owners owner
**Preconditions:** Purpose-specific audit/event-read grant.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Search by reference, actor or bounded date. | Only visible scopes and safe event metadata returned. |
| 2 | Principal | Open event sequence. | Show intent, owner result, version and who acted. |
| 3 | Principal | Inspect linked source only with current permission. | Audit reference does not bypass access. |
| 4 | System / owner | Record a review finding or escalation if needed. | Prior audit events remain append-only. |

**Inputs and validation**

- **Search attribute:** Reference by default; actor/date allowlisted.
- **Window:** Bounded; no all-time unrestricted dump.
- **Finding:** Separate review record.

**Outcome:** Understandable accountability trail.
**Authorization:** General audit excludes raw messages, answers, health detail, tokens and file contents.
**Data read:** Append-only safe events; command/decision references.
**Data written:** Optional review finding, never audit rewrite.

**Alternate and failure paths**

- Actor later inactive: historical attribution retained safely.
- Source unavailable/restricted: audit shows safe reference, not leaked contents.

**Demo acceptance:** Closed/reopened/reassigned history cannot be overwritten to erase responsibility.

# Financial & service oversight

## LEA-43 — Review financial exceptions under a separate grant
**Delivery:** phase 5 · Later
**Trigger:** Authorized leader reviews a finance summary or assigned approval.
**Actors:** Principal; authorized Finance / individual service owners owner
**Preconditions:** Finance module released; explicit aggregate/detail/approval grants; finance policies independently designed.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open authorized finance summary. | Show exact currency, cutoff, reconciliation state and definition. |
| 2 | Principal | Inspect permitted exception or assigned decision. | No default pupil debtor list from principal role. |
| 3 | Principal | Hand off or decide within explicit limit/separation rules. | Adjustment, concession and refund commands remain finance-owned. |
| 4 | System / owner | Confirm actual financial outcome. | Approval, initiated payment/refund and reconciled settlement remain distinct. |

**Inputs and validation**

- **Period/currency:** Explicit; no combining unlike currencies.
- **Decision limit:** Finance policy, not UI-only.
- **Reason/evidence:** Owner-required and minimized.

**Outcome:** Authorized financial oversight or bounded decision.
**Authorization:** No automatic refunds, fee editing, payroll access or financial hardship disclosure.
**Data read:** Finance safe projections, assigned approval and ledger/reconciliation evidence.
**Data written:** Finance owner decision only if explicitly delegated.

**Alternate and failure paths**

- Unreconciled data is labelled; no false collection total.
- Requester/self-approver conflict routes independently.

**Demo acceptance:** A principal cannot approve a refund merely because it appears in an inbox.


## LEA-44 — Coordinate a school service interruption
**Delivery:** phase 6 · Later
**Trigger:** Transport, library, facilities or another enabled service reports an operational issue.
**Actors:** Principal; authorized Finance / individual service owners owner
**Preconditions:** Specific service released, operational oversight grant and current incident owner.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open the affected service notice. | See scope, published impact and safe last update. |
| 2 | Principal | Coordinate with responsible service team. | Assign an action without inheriting specialist permissions. |
| 3 | Principal | Approve a targeted communication only if delegated. | Audience and facts verified by source owner. |
| 4 | System / owner | Verify restoration using owner evidence. | Resolution, communication delivery and pending follow-ups remain separate. |

**Inputs and validation**

- **Service/scope:** Exact branch and affected period.
- **Owner/due:** Eligible service coordinator.
- **Update:** Published facts; no speculative arrival time or live tracking promise.

**Outcome:** Owned service response and verified update.
**Authorization:** Operational service summary does not expose passenger addresses, driver private data or full case records.
**Data read:** Service incident/status projection and current assignee.
**Data written:** Service-owner coordination action and approved notice.

**Alternate and failure paths**

- No telemetry: do not invent live vehicle location.
- Restricted safety/health content routes separately.

**Demo acceptance:** Restored service does not automatically mark all recipients informed.

# Reviewed leadership assistance

## LEA-45 — Review a source-linked leadership draft
**Delivery:** phase 7 · Later
**Trigger:** Leader asks for a summary of permitted school evidence.
**Actors:** Principal; authorized AI application + source owners owner
**Preconditions:** Approved AI provider/data policy, source access and evaluation gates.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Choose a bounded question and scope. | Preview permitted sources and source cutoff. |
| 2 | Principal | Generate an advisory draft. | Citations link to authorized source versions; gaps stated explicitly. |
| 3 | Principal | Review and edit every proposed conclusion/action. | No opaque pupil risk score, staff ranking or sensitive inference. |
| 4 | System / owner | Choose a separate authorized action if useful. | AI never publishes, approves, changes attendance or sends a message autonomously. |

**Inputs and validation**

- **Question:** Bounded; no secrets or unnecessary personal detail.
- **Sources:** Permission-filtered at retrieval and open time.
- **Action:** Explicit human-owned command with normal guards.

**Outcome:** Human-reviewed, evidence-linked assistance.
**Authorization:** Principal role does not widen AI retrieval; output is not a new authority source.
**Data read:** Minimized permitted published/operational sources and provenance.
**Data written:** Approved draft/evaluation metadata; no consequential automatic write.

**Alternate and failure paths**

- Missing/contradictory evidence: say uncertain, do not invent a policy or causal explanation.
- Untrusted source text cannot alter permissions or tool instructions.

**Demo acceptance:** A model-generated suggested approval cannot call the owner approval command.

# Account & preferences

## LEA-46 — Manage sessions, preferences and school support
**Delivery:** phase 1 · First release
**Trigger:** Leader signs out, checks session security or changes personal preferences.
**Actors:** Principal; authorized Access + Preferences owner
**Preconditions:** Existing Access/session policy and own-account identity.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open My account. | Show own sessions and allowed preferences. |
| 2 | Principal | Change an approved preference or revoke a session. | Identity/contact changes follow existing verification, not a direct profile write. |
| 3 | Principal | Confirm sensitive action if policy requires. | Server acknowledges revocation before claiming success. |
| 4 | System / owner | Sign out from the separate session action. | Clear protected context and local drafts under documented policy. |

**Inputs and validation**

- **Preferences:** Own allowed keys; required security notices labelled.
- **Session:** Own session reference only.
- **Support:** School-approved contact route.

**Outcome:** Controlled personal account state.
**Authorization:** Own-account management grants no staff-user administration.
**Data read:** Own sessions/preferences and safe support configuration.
**Data written:** Access owner revocation/preference/verified-change workflow.

**Alternate and failure paths**

- Unsaved draft: save/discard before leaving; unknown command: preserve safe reference and reconcile.
- Failed revoke cannot say session ended.

**Demo acceptance:** Sign out is visually separate from name/role and protects shared-device data.
