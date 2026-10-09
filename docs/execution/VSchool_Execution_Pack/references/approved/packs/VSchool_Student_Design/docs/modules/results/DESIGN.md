# Results & reports — DESIGN
Design status: DESIGNED_FOR_UX_REVIEW. Production implementation: NOT_ASSESSED. Human acceptance: PENDING.
Owner: Assessments + Documents. Earliest proposed phase: 4.

## Purpose and screens
Published, authorized results without private moderation.
Use the shared UX_SYSTEM.md. Reference boards (desktop/mobile): Results, Report. Every workflow also has a guided review under flow/STW-xx. Specialist walkthroughs are proposals, not fully connected downstream implementations.

## Domain and low-level boundary
Entities/tables to reconcile: PublishedReport; ReportItem; scale; authorized document asset.
Application ports: ReadPublishedReport / DownloadPublishedReport / QueryResult.
Repository workflow: Join current student access to published report and its exact scale/outcome version. Download repeats publication/file guard. Query inserts owned request; no grade update.
Prerequisite: Assessment moderation/publication/revocation; scale/zero/exempt representation; export authorization.

## Permission and transport
Authenticate server principal; derive current verified student enrollment. Check released module, institution entitlement, branch enablement, capability and object/audience scope on every read, command, status and download. Route/form identifiers are references only. Do not rely on client visibility or caller-settable tenant GUCs. HTTP DTOs cannot contain private teacher/guardian/peer data.

Use domain values for IDs, versions, publication state and school time. Commands validate before mutation, follow shared lock order, commit evidence atomically and return typed outcomes. Exact replay must reauthorize reads and return the same owner result. Do not hold DB locks over external provider I/O. Query DTOs are bounded/paginated.

## Shared failure states
Loading, legitimate empty state, recoverable request failure, session expiry, revoked access, version conflict and module unavailable. For mutating journeys, distinguish definitive rejection from transport uncertainty and preserve the intent. Full-page errors should not silently clear unsaved work. Every confirm/dialog action is keyboard accessible and has a safe cancellation path.

## STW-33 — View my published report
Phase: 4. Reconcile with owner release/dependency gates.

**Intent:** Read official released results.
1. **Choose published report** — List permitted academic year/term versions.
2. **Read outcomes** — Show subject, score/outcome, scale and teacher comments released to students.
3. **Outcome:** Own published report view.

**Permission/invariant:** No unreleased marks, moderation, peer ranks or misleading zero for Exempt.
**Failure/recovery:** Publication withdrawal and access change reauthorize on every open.
**Persistence/data:** AssessmentReport publication + student results + scale version.
**Join/write contract:** Join current student access to published report and its exact scale/outcome version. Download repeats publication/file guard. Query inserts owned request; no grade update.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-34 — Download a published report
Phase: 4. Reconcile with owner release/dependency gates.

**Intent:** Keep an authorized report copy.
1. **Review document** — Show school, term, version and issued date.
2. **Download** — Reauthorize at file request; expire download link.
3. **Outcome:** Exact released report version.

**Permission/invariant:** A UI link is not file authorization; never export another student.
**Failure/recovery:** Unavailable/expired document offers recheck, not permanent public URL.
**Persistence/data:** Document render reference + publication version + authorized asset.
**Join/write contract:** Join current student access to published report and its exact scale/outcome version. Download repeats publication/file guard. Query inserts owned request; no grade update.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-35 — Ask about a result
Phase: 4. Reconcile with owner release/dependency gates.

**Intent:** Request clarification within school policy.
1. **Choose outcome** — Carry term, subject and report version.
2. **Send query** — Explain issue; route to authorized assessment owner.
3. **Outcome:** Query reference with school response state.

**Permission/invariant:** Student cannot edit a grade or reopen moderation.
**Failure/recovery:** If formal review window closed, show policy and school-help path.
**Persistence/data:** Owned request + report item version + owner decision.
**Join/write contract:** Join current student access to published report and its exact scale/outcome version. Download repeats publication/file guard. Query inserts owned request; no grade update.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.
