# Principal leadership tasks

## LDR-01 — explicit Principal branch workspace

Dependencies: current Access/Tenancy/session/context foundations and shared portal shell.

Acceptance criteria:

1. A verified operator can add an exact branch `PRINCIPAL` grant with existing version, replay, audit, and transaction rules.
2. School administrators, teachers, parents, and students do not acquire Principal authority; school staff management cannot create or alter a Principal grant.
3. Sign-in and workspace choice expose only live server-returned role/branch combinations.
4. `/leadership` independently reauthorizes the Principal grant and denies forged, foreign, suspended, and revoked scope.
5. The shell shows institution, branch, Principal role, mobile navigation, account controls, and honest unavailable owner states without fabricated metrics.
6. Development and test databases retain all earlier migrations and accept the forward role-constraint migration.
7. Unit, real PostgreSQL, desktop/mobile Playwright, build, boundary, and database-design gates pass for the verified source.

Human visual/product acceptance is recorded separately.

## Next slices

- LDR-02: bounded due-register coverage projection for LEA-05/06/08.
- LDR-03: exact session evidence and freshness.
- LDR-04–06: accountable follow-up lifecycle after Coordination owner design.
- LDR-07: scoped history/export only with a separately established export grant.

## LDR-02 — Attendance due-register coverage

Dependencies: verified LDR-01, current Attendance sessions/dated assignments, and released/licensed/activated Attendance with its existing dependencies.

Acceptance criteria:

1. `attendance.read_leadership` is granted only by the explicit Principal role and is narrower than administrator school-wide Attendance read.
2. A current branch/date query returns one `REPEATABLE READ` snapshot with server as-of, timezone, `register-coverage.v1`, and `SESSION_END_NO_GRACE` disclosed.
3. Counts satisfy `received + awaiting = due`; cancelled and not-due sessions remain separate, early submission remains not due, and no missing register becomes pupil absence.
4. The exact awaiting list contains bounded pages with class, subject, scheduled time, due time, current dated expected teacher and status only. Class/status/Teacher filters apply to the full scoped result before pagination; due/class sort uses a stable ID tie-breaker and a query-bound cursor.
5. Foreign branch/institution, revoked Principal, future date, disabled/unlicensed/unreleased module and other roles fail without counts or sensitive detail.
6. Home and Attendance oversight show populated, no-due, unavailable and mobile states through the shared Principal shell; there are no dead LDR-03 actions.
7. Focused unit, real PostgreSQL, desktop/mobile Playwright, plan, build and required repository gates pass. URL-backed filters/sort preserve Back/Forward state and shared drawers preserve draft/Cancel/Apply/focus behavior; direct reference comparison and human review remain separately recorded.

## LDR-03 — Exact Attendance session evidence and freshness

Dependencies: verified LDR-02 and the current Attendance session owner.

Acceptance criteria:

1. A Principal can open one exact awaiting row and see current scheduled context, expected teacher, lifecycle state/version, last trustworthy source update when available, and server observation time only.
2. Every open/reload reauthorizes and re-reads current Attendance state; a newly submitted row displays received/no longer awaiting without exposing roster, marks, explanations, correction history or actors.
3. Foreign scope, revoked Principal, disabled/unlicensed/unreleased Attendance and other roles fail without source detail.
4. Attendance lifecycle writes maintain source freshness in their existing transaction; the forward migration preserves history, backfills only trustworthy evidence and leaves unknown legacy schedule freshness null.
5. The detail preserves a date-qualified return path, mobile composition and keyboard focus, and is directly compared with the approved “Inspect the evidence” state.
6. Focused real PostgreSQL, desktop/mobile Playwright, schema/design checks, build and required repository gates pass. LEA-08 filters/sort, human review, font portability, native accessibility and TEN-03 remain separate.

## LEA-02 — Branch context isolation over owner data

Dependencies: verified LDR-01 context switching and an independently authorized owner projection in two explicit Principal branches.

Acceptance criteria:

1. The selector contains only live server-returned branch destinations and the server rejects a stale or revoked destination.
2. Confirmation uses the staged exit flow and reauthorizes the destination; it does not treat a browser school ID or acknowledgement as authority.
3. The destination loads through a fresh document and independent Leadership/owner reads, with prior route filters and branch data cleared.
4. Distinct Attendance records from the old branch never render in the destination, and manually reusing an old session ID fails the destination's scoped owner query.
5. Desktop/mobile Playwright covers both real branches, query clearing, deep-link denial and the exact approved LEA-02 contract; screenshots are directly inspected.
6. No draft lifecycle, schema, migration, permission or owner write is added. Human review, native accessibility, font portability and TEN-03 remain separate.

## LEA-04 — Live access changes during protected owner work

Dependencies: verified LDR-01 Principal reauthorization and LDR-03 Attendance source reauthorization.

Acceptance criteria:

1. An open exact source page rechecks current Attendance availability and removes the prior class/Teacher data when the module becomes unavailable.
2. Module deactivation does not delete the Attendance record; reactivation permits a fresh authorized read of the same source.
3. Removing the Principal role while the source is open removes all Leadership content and routes only to another currently authorized workspace.
4. Reusing the old Leadership URL repeats server authorization and cannot restore the hidden source or offer a client override.
5. Desktop/mobile captures are compared directly with the approved LEA-04 state and focused one-worker journeys pass.
6. A committed Principal snapshot whose response is lost keeps its exact payload/key; removing Principal authority denies replay without disclosing the receipt, and restoring authority recovers the original result without a duplicate write.

Engineering status: VERIFIED through the Attendance read and Reporting snapshot write boundaries. Human review PENDING.

## LEA-16 — Published timetable exception oversight

- [x] Reauthorize exact Principal scope and all four owner-module availability gates on every read.
- [x] Project the current effective immutable publication and durable reconciliation outcome counts without staff-performance inference.
- [x] List only unresolved current-publication occurrences with stable server pagination, exact class/subject/time/current assignment, and a separately guarded Attendance evidence link where available.
- [x] Verify real PostgreSQL scope, pagination, mixed outcomes, retry clearing, role/branch denial, and unchanged Timetable reconciliation behavior.
- [x] Verify production route, navigation, evidence drill-down, keyboard focus, responsive composition, and direct desktop/mobile reference comparison.
- [ ] Add general uncovered-class/Teacher-absence facts and delegated cover/change action only after their approved owner and authority lifecycle exist.

Engineering status: supported read slice VERIFIED; full LEA-16 PARTIAL. Human review PENDING.

## LEA-46 — Own account and session security

- [x] Reuse the Access-owned global own-session directory without accepting an account identifier or widening Principal permissions.
- [x] Preserve staged selection and confirmation; revoke only on the final action and keep current-browser sign-out separate.
- [x] Verify another own session is removed after reload while the current session remains authorized.
- [x] Verify current-browser sign-out invalidates that session and a protected Principal account route returns through sign-in.
- [x] Compare the approved reference with production desktop/mobile session and confirmation states, including focus and viewport containment.
- [ ] Add preferences only after the approved key/value, validation, portability and persistence contract exists.
- [ ] Add school support only after an authorized source/configuration owner and safe presentation contract exists.

Engineering status: supported session-security slice VERIFIED; full LEA-46 PARTIAL. Human review PENDING.

## LEA-17 — Assignment completion with the right denominator

- [x] Expose navigation only when the current Principal has the Learning owner capability and module chain.
- [x] Present the owner-supplied period, class and subject filters, server cutoff and exact denominator definition.
- [x] Render submitted, awaiting and not-yet-due facts without private drafts, response content or learner identities.
- [x] Verify desktop/mobile composition, keyboard focus, URL filter state and direct approved-reference comparison.
- [ ] Complete extension/excused groups, permitted evidence and teaching follow-up after their owner contracts exist.

Engineering status: supported read slice VERIFIED at `2e03897`; full LEA-17 PARTIAL. Human review PENDING.

## LEA-34 — Notice delivery and acknowledgement coverage

- [x] Grant only the exact Principal read capability; retain separate publisher authority.
- [x] Return one bounded repeatable-read owner snapshot with timezone, cutoff and `notice-coverage.v1`.
- [x] Keep eligible audience, first portal read and explicit acknowledgement separate for every current immutable version.
- [x] Exclude recipient identities, notice bodies, contact details, relationship restrictions and all reminder/resend controls.
- [x] Verify Principal scope, cross-branch/role/revocation/module denial and aggregate consistency in real PostgreSQL.
- [x] Verify populated desktop/mobile states, unavailable rendering and direct LEA-34 workflow-reference comparison. The approved pack has no exact production page composition, so the application is recorded as a bounded design extension rather than exact visual fidelity.

Engineering status: supported read slice VERIFIED; full LEA-34 PARTIAL. The reminder/resend portion remains blocked on its owner command, channel outcomes and deduplication contract. Human review remains separate.

## LEA-18 — Feedback turnaround

- [x] Reuse the exact branch Principal Learning read capability and owner projection boundary.
- [x] Present accepted, first-published, awaiting and median elapsed-clock facts with explicit interval/cutoff metadata.
- [x] Exclude private Learning content, identities, rankings, targets and overdue labels.
- [x] Complete focused PostgreSQL and desktop/mobile reference verification.
- [ ] Add coordination only after its owner and authority contract exists.

Engineering status: supported descriptive read slice VERIFIED; full LEA-18 PARTIAL. Human review PENDING.

## LEA-39 — Drill into a metric and export permitted evidence

- [x] Keep Principal report read distinct from operator-designated branch export authority.
- [x] Carry the exact Attendance coverage definition, as-of, scope and filters into the preview and direct CSV.
- [x] Show only allowlisted aggregate and already-visible awaiting-register fields, with explicit exclusions and bound recovery.
- [x] Verify desktop/mobile production/reference states and keyboard-reachable download/back actions.
- [x] Add the Assignment-completion owner export with the exact interval/class/subject filters, 50-row refusal, safe allowlist and independent live export authorization.
- [x] Add the Feedback-turnaround owner export as a one-row cohort/clock aggregate with no identities or private Learning content.
- [x] Add the Timetable-exceptions owner export with the current immutable publication, exact outcome counts, 50-row refusal and no Student/Attendance record disclosure.
- [x] Add Communication notice coverage through an exact-total bounded owner port with no recipient/body disclosure.

Engineering status: every currently supported Principal aggregate export slice VERIFIED; LEA-39 ENGINEERING_COMPLETE. Human review PENDING.
