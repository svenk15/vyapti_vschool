# Principal leadership current state

## 16 October 2026 — LDR-01 verified checkpoint

Implementation is VERIFIED; human review is PENDING.

The distinct branch-scoped `PRINCIPAL` role has only `leadership.read` and `self.read`. A verified operator can provision it through the existing versioned, replay-safe branch-membership command; ordinary staff management cannot create or alter Principal-bearing memberships. Workspace choices come from live server-returned branch/role facts, `/leadership` independently reauthorizes access, and revoked scope is denied immediately. Shared Principal home, context switch and self-account routes show an honest unavailable state until owner projections are released.

Schema: forward migration `20261016000100_principal_branch_role` changes only the existing RoleGrant CHECK to include `PRINCIPAL`; it is applied to both `vyapti_vschool` and `vyapti_vschool_test` with all 63 migrations retained and no reset. `pnpm demo:seed` invokes the guarded incremental Principal seed and writes credentials only to ignored mode-0600 `artifacts/leadership-01/private-demo.json`.

Verification: focused unit 10/10, real PostgreSQL Access 8/8, and desktop/mobile Principal Playwright 4/4 passed. `pnpm build` and the isolated E2E build passed. The repository checkpoint passed lint, type generation, docs, database design (96 contracts), boundaries, portable-backend compilation and 164 unit tests; the database registry mismatch found on the first checkpoint was corrected before the database and remaining gates were rerun. Reference and application captures were directly inspected at 1440×1000 and 390×844. The approved HTML is a workflow explorer, while the production home is the authorized application shell and deliberately contains no unreleased metrics or prototype review controls. See [evidence](../../evidence/principal-ldr-01-2026-10-16/README.md).

Remaining gates: human review, native VoiceOver/NVDA, font portability, TEN-03 and production controls remain pending. LEA-02, LEA-04 and LEA-46 are only partial; LDR-01 does not complete later owner actions or preferences/support.

Next action: LDR-02, the Attendance-owned bounded due-register projection for LEA-05/06/08, after recording its exact query/metric contract. It must preserve current Attendance authorization and may not infer missing counts.

## 16 October 2026 — LDR-02 verified checkpoint

Implementation is VERIFIED; human review is PENDING.

The Attendance-owned `register-coverage.v1` query now gives a current Principal an exact branch/date snapshot under `attendance.read_leadership`. `SESSION_END_NO_GRACE` makes a non-cancelled session due only after its scheduled end. Received plus awaiting reconciles to due; future and cancelled sessions remain separate; missing registers are never described as pupil absence. The stable bounded awaiting list contains only class, subject, schedule, due time, current dated expected Teacher and state. It excludes rosters, pupil marks, explanations, revisions and exports.

No schema or migration changed. The development and test databases retain all 63 migrations. `pnpm demo:seed` now verifies the existing connected fictional Principal fixture has received, awaiting and not-due states without changing manually created records, and writes no new credentials outside the existing ignored mode-0600 file.

Verification: focused Access unit 10/10, real PostgreSQL Attendance 12/12 and desktop/mobile Principal Playwright 4/4 passed. `pnpm check` passed lint, type generation/checking, documentation, 96 database contracts, boundaries, portable-backend compilation and 164/164 unit tests; isolated E2E and normal production builds passed. The functional suite proves metric arithmetic, early/future/cancelled handling, stable pagination, current teacher resolution, sensitive-field exclusion, cross-scope denial, revocation and module disablement. The focused browser journey proves populated and no-due states, navigation and mobile composition. Its first visual capture exposed stacked metrics and an unstyled table; the shared composition was corrected and the focused journey passed again. Final reference/application captures were directly inspected at 1440×1000 and 390×844. The approved source is a fictional workflow dialog; the application uses the production Principal shell and real seeded counts, with the same three-metric hierarchy and explanatory meaning. See [evidence](../../evidence/principal-ldr-02-2026-10-16/README.md).

Remaining gates: LDR-03 exact session evidence is still absent, so LEA-08 remains partial. LEA-06 remains partial because unavailable data is fail-closed but a retained last-known stale snapshot is not implemented. Human review, exact font portability, native VoiceOver/NVDA, TEN-03 and production controls remain pending.

Next action: LDR-03, a read-only exact-session evidence projection with independently rechecked Principal authority and no roster, marks or explanation disclosure.

## 16 October 2026 — LDR-03 verified checkpoint

Implementation is VERIFIED; human review is PENDING.

An awaiting coverage row now opens a dedicated, read-only Principal source-evidence page. Attendance independently reauthorizes the exact branch-scoped session and returns only its scheduled class/subject/time, current dated expected Teacher, lifecycle state/version, server observation time and trustworthy owner update time. Reload always re-reads the source: a session submitted after the list snapshot becomes `RECEIVED` and explicitly says it is no longer awaiting. Rosters, pupil marks, explanations, correction history, actors, exports and mutation controls remain absent. The date-qualified return path, keyboard entry and mobile composition are verified.

Schema: forward migration `20261016130000_attendance_session_state_update` adds nullable `state_updated_at` to `vs_attendance_session`. It is applied to `vyapti_vschool` and `vyapti_vschool_test`; both retain all 64 migrations without reset. Existing lifecycle timestamps and trustworthy schedule command receipts are backfilled. Unknown legacy scheduled evidence remains null. Attendance schedule/open/submit/correct/cancel and Timetable reconciliation/cancellation now update freshness atomically in their existing transactions. No index or authorization scope changed.

Verification: the focused real-PostgreSQL Attendance file passed 12/12, including fresh SCHEDULED→SUBMITTED evidence, scope/role/revocation/module denial, field exclusion and owner timestamp writes. The normal and isolated production builds passed. Focused Principal Playwright passed 2/2 Chromium and 2/2 mobile sequentially with one worker, including keyboard focus, exact route context, refresh-to-current behavior and populated/no-due states. `pnpm check` passed lint, type generation/checking, documentation, 96 database contracts, boundaries, portable-backend compilation and 164/164 unit tests. Direct inspection compared 1440×1000 and 390×844 application captures with the approved stage-2 “Inspect the evidence” dialog. The reference is a fictional review dialog; the application uses the production shell and a full read-only evidence page. See [evidence](../../evidence/principal-ldr-03-2026-10-16/README.md).

Remaining gates: LEA-08 remains PARTIAL because its approved class/status/teacher filters and stable due/class sorting are not implemented. LEA-06 still lacks a retained last-known stale snapshot. Human review, font portability, native VoiceOver/NVDA, TEN-03 and production controls remain pending.

Next action: complete the bounded LEA-08 filter/sort contract through the existing Attendance projection, without client-side page sorting or broader identity lookup.

## 16 October 2026 — LEA-08 bounded controls verified checkpoint

Implementation is VERIFIED; human review is PENDING.

The Attendance-owned coverage query now applies class, `SCHEDULED|OPEN` state and exact responsible-Teacher filters to the complete authorized branch/date result set before pagination. Due-time order uses `(ends_at,id)` and class order uses `(section_name,ends_at,id)`, in either direction. Opaque cursors bind class/status/Teacher/sort/order, so a page token cannot be reused under a different query. Available class and Teacher choices are derived from the same scoped awaiting set; ambiguous or missing dated Teacher assignments are not guessed. Counts keep the unfiltered authoritative denominator while the list separately states its matching total.

The production page uses the shared filter and sort drawers, URL-backed state, Back/Forward restoration, compact control buttons, explicit matching/no-match states and query-preserving source-detail return links. Draft drawer choices apply only on confirmation; Escape returns focus without applying. Visual inspection found and corrected a shared mobile rule that reversed the approved Cancel/Apply footer order. No Attendance write, permission, table or migration changed; both local databases retain the 64-migration LDR-03 schema.

Verification: focused lint and TypeScript passed; the real-PostgreSQL Attendance file passed 12/12 with filters, deterministic order, query-bound cursors and existing scope/revocation checks. The first post-change rerun hit an unrelated transient `STALE_VERSION` in the pre-existing ATT-02 concurrency case after LEA-08 had passed; the justified unchanged rerun passed 12/12. The E2E build passed and focused one-worker Playwright passed 2/2 Chromium plus 2/2 mobile. Filter/sort drawers, populated, filtered, sorted, detail-return and no-due states were directly inspected against the approved Attendance-oversight dialog and shared component specification. See [evidence](../../evidence/principal-lea-08-controls-2026-10-16/README.md).

Remaining gates: the approved fictional workflow dialog and production shell remain different compositions; font portability, native VoiceOver/NVDA, TEN-03, production controls and human visual acceptance remain pending. LEA-06 retained-last-known semantics and LEA-46 preferences/support still lack owner contracts.

Next action: add focused stale-response isolation evidence for LEA-02 around the real Attendance projection if the existing full-navigation context switch does not already make stale replacement impossible; do not add client-side tenant authority.

## 16 October 2026 — LEA-02 branch-context isolation verified checkpoint

Implementation is VERIFIED; human review is PENDING.

The existing staged Access switch was exercised with two explicitly granted Principal branches and distinct real Attendance records. Confirmation reauthorizes the destination, uses a full-document `location.replace('/leadership')`, clears the old coverage filters and page state, and makes the destination Leadership and Attendance reads resolve from the new authorized branch. The destination shows only its own class and Teacher. Reusing the old branch's session ID in the destination returns the safe unavailable state without leaking the old class. The full-document boundary plus existing `pageshow`/cross-tab reload guards prevents late responses from the destroyed old page from replacing destination data.

No product source, schema, migration, permission, draft lifecycle or owner write changed. Both development and test databases retain all 64 migrations. Focused Playwright passed 2/2 Chromium and 2/2 mobile sequentially with one worker. It proves the allowed destination, staged review and confirmation, destination summary, cleared `status/sort/order` query, destination-only records and prior-branch deep-link denial. The unchanged Access and Attendance real-PostgreSQL evidence from LDR-01/LEA-08 remains applicable. Direct inspection compared the approved LEA-02 workflow dialog and all West/East/denial application states at 1440×1000 and 390×844. See [evidence](../../evidence/principal-lea-02-context-2026-10-16/README.md).

Remaining gates: the approved fictional workflow dialog and production pages are different compositions; human review, exact font portability, native VoiceOver/NVDA, TEN-03 and production controls remain pending.

Next action: LEA-04, focused proof that a protected owner surface removes data and safe actions when Principal access or its required module becomes unavailable during use. It can reuse the existing live authorization contracts without adding authority.
