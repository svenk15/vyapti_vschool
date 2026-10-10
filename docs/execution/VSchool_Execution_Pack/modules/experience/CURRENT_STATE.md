# Experience implementation state

EX-00 through EX-09 are VERIFIED with human review PENDING. The prerequisite BE-01 configuration correction is also VERIFIED. EX-10 is the next eligible slice. EX-10–EX-15 remain NOT_STARTED; the queue is a scheduling projection until their live evidence is recorded.

Authoritative implementation evidence belongs to the live repository module CURRENT_STATE files after EX-00. queue.json starts with no evidence; it is a scheduling projection. Do not copy historical snapshot test counts into a new VERIFIED claim.

Per completed task record: id; implementation status; human review; source SHA; changed files; tests executed/results; migrations (none unless approved design); seed scenarios; demo URL/start command; manual checks; defects; partial workflow coverage; next eligible task. Use NOT_STARTED / IN_PROGRESS / VERIFIED / BLOCKED for implementation. Keep design readiness separate.

## EX-00 — 9 October 2026

Live branch `work/stu-01-after-per02-wip` at baseline HEAD `61f619e58093925bb20433e839f6ac375654b659` has no modified tracked files. Untracked execution/reference material and `readiness-review.diff` were preserved. The 255 source-reference files and live counterparts are byte-identical; Prisma schema hash/model count and the 31-migration head match the pack manifest. Six approved HTML paths and hashes are pinned in `docs/execution/ROUTE_REFERENCE_MAP.md`; `docs/execution/CONTRACT_DIFF.md` records existing, partial and missing owner operations.

Executed for this documentation/tooling slice: `pnpm check:docs` passed after the checker was taught to exclude only the immutable historical source-reference subtree; `pnpm check:boundaries` passed; `git diff --check` passed. `pnpm exec prisma migrate status` reported 31 migrations and an up-to-date development schema; it was a read-only status check. No migration, seed, database write or product behavior change occurred. The local development server returned ready=true and `/sign-in` returned 200 at `http://127.0.0.1:3400`.

Confirmed follow-up deltas at this historical checkpoint were BE-01 portable Students configuration and BE-02 capability-aware navigation memoization; both are now closed by later evidence below. The existing-Person exact-name selection conflict is isolated to EX-08. Browser operator/parent/student/principal identity and teacher-wide history remain unavailable owner gaps. TEN-03 and DS-02 release gates remain open. Human review is PENDING.

## EX-01 — 9 October 2026

EX-01 is VERIFIED with human review PENDING. The durable [visual baseline](../../../../evidence/ex-01/README.md) records 24 screenshots and hashes against executable baseline `61f619e58093925bb20433e839f6ac375654b659` and execution-pack integration commit `ca9e683`. Approved static references were newly rendered at desktop and representative mobile sizes; existing actual route captures were pinned from exact-baseline evidence, and live Playwright added the teacher unavailable and permission-filtered states.

The comparison freezes the enhanced navigation target for EX-02: forest desktop sidebar, grouped authorized destinations, consistent icons and selection/focus state, compact context, reachable identity footer, separate sign-out, and a mobile drawer with focus containment and return. Current real page bodies, owner DTOs and server authorization remain authoritative. Prototype timetable/count data and unavailable operator/parent/student/principal identities are explicitly excluded.

No application source, schema, migration, seed or database row changed. `pnpm check:docs` and `git diff --check` passed for the evidence checkpoint. The installed in-app browser launcher referenced a missing browser-service module, so repository Playwright produced the new captures and the images were inspected directly. This limitation is recorded rather than treated as passed browser-control evidence. EX-02 is next; DS-02 native assistive-technology and TEN-03 production security gates remain open.

## EX-02 — 9 October 2026

EX-02 is VERIFIED with human review PENDING. The [shared navigation evidence](../../../../evidence/ex-02/README.md) records the implementation, focused screenshots and manual demo. Administrator and teacher routes now use one 248px theme-aware dark desktop sidebar and the same accessible mobile drawer. Grouped server-filtered links, compact branch context, distinct account identity and sign-out, scrolling navigation with a pinned footer, initial mobile focus, Tab/Shift+Tab containment, Escape/close recovery and trigger-focus return are implemented. Teacher navigation exposes only My teaching day.

BE-02 is closed: request-local navigation eligibility memoization keys both module and capability, with a unit test proving same-module `student.read` and `student.manage` results stay independent. Page and API authorization remain active. No owner contract, table, migration, transaction or seed changed. Root TypeScript excludes only the immutable historical source-reference tree after EX-00 made it present under `docs/`.

Verification: `pnpm check` passed all repository gates and 105 unit tests. The dedicated-PostgreSQL administrator Playwright suite passed 12/12 across desktop/mobile. The focused mobile teacher attendance journey initially exposed duplicate close-button accessible names; after the label correction it passed 1/1, including authorization, frozen-roster persistence, recovery, correction and cancellation. Both runs built the production application and observed all 31 migrations applied. Four final live screenshots were inspected. The local server at `http://127.0.0.1:3400` is healthy. EX-03 is next; native accessibility and TEN-03 gates remain open.

## BE-01 — 9 October 2026

BE-01 is VERIFIED. Students and Imports portable composition factories now require explicit database URL, cursor secret, release manifest and optional clock. They no longer read process environment values or substitute empty/default secrets. The Next hosting layer owns environment parsing and injects validated configuration into module-scoped services, preserving the existing connection-pool lifetime. Invalid or missing secrets and invalid release identifiers fail through the existing `UNAVAILABLE` contract without logging configuration values.

All known Students and Imports factory call sites now pass explicit deterministic configuration. Focused unit tests passed 14/14, including proof that ambient environment values cannot override injected configuration and that missing database URL or invalid secrets/manifests fail closed. Real-PostgreSQL Students/Imports functional tests passed 20/20 with all 31 migrations already applied. The full repository check passed 111 unit tests plus lint, typecheck, documentation, database-design, boundary and backend extraction gates. No schema, migration, seed or database-row change occurred. The live demo remained healthy at `http://127.0.0.1:3400`.

The factory audit found the same environment-fallback pattern in academics, attendance, people, reporting and tenancy composition. Those owners are recorded as later focused corrections when their factories are touched; BE-01 did not broaden into a wholesale composition rewrite. Detailed evidence is in `docs/execution/VSchool_Execution_Pack/evidence/BE-01.md`. Human review remains PENDING.

## EX-03 — 10 October 2026

EX-03 is VERIFIED with human review PENDING. Shared controlled ListToolbar, FilterDrawer, SortDrawer and CommandFeedback compositions now implement the UI LLD: Enter commits bounded search text, Clear commits an empty search, attribute selection leaves the search input alone, filter/sort drawers keep a separate draft until Apply, Cancel/Escape discard it, multi-select attributes remain expanded, and unknown command feedback keeps the exact request key available for status/retry actions. The gallery uses fictional rows only.

The real Students directory consumes the shared toolbar and filter drawer through its existing authorized server listing. Search and the supported single status filter are validated by the Students owner, persisted in safe URL query fields, restore through Back/Forward and clear the cursor when changed. The screen intentionally exposes no Sort control because Students has no server sort contract. Its semantic table uses a compact right-aligned named View action and remains horizontally contained on mobile.

Focused Playwright against real `vyapti_vschool_test` PostgreSQL passed all current affected journeys. A combined 26/26 desktop/mobile run passed after resolving a search-landmark naming ambiguity. Added attribute-focus and Back/Forward cases then produced one test-setup failure per viewport because programmatic `selectOption` does not focus a control; after focusing it like a keyboard user, the final gallery rerun passed 10/10. The final real Students rerun passed 2/2 after the inspected table-density correction; the unchanged starter and transfer journeys had passed 14/14 in the preceding current-source build. Every run built the production app and confirmed all 31 migrations applied. `pnpm demo:seed` completed idempotently against `vyapti_vschool` and preserved private credentials.

No owner API, write behavior, schema, migration, transaction or persisted record contract changed. Desktop/mobile gallery, open drawer and populated Students screenshots were inspected; no document overflow was observed. Detailed evidence and manual steps are in `docs/evidence/ex-03/README.md`. Native VoiceOver/NVDA, native 200% zoom, TEN-03 and owner visual acceptance remain open gates.

## Workflow coverage matrix — 10 October 2026

The canonical [workflow implementation matrix](../../../WORKFLOW_IMPLEMENTATION_MATRIX.md) inventories all 268 approved catalog workflows. After EX-09 evidence it conservatively records 18 implemented-and-verified workflows, 13 existing operations awaiting approved-page alignment, 12 partial workflows and 225 later-workspace/phase workflows outside the current release. The matrix maps every workflow to its approved reference, actor/scope, current route/application/persistence support, target task, dependencies and evidence. It does not authorize parent, student, principal or browser-operator identities. The initial inventory checkpoint was `838e186`; later task checkpoints update classifications only with current-source evidence.

## EX-04 — 10 October 2026

EX-04 is VERIFIED with human review PENDING at implementation source `9d1178209d29d6dcdc3a71461890d3b6af3e97fb`. Generic and published-brand sign-in now use the approved field/help hierarchy and shared form controls. Recoverable failure keeps email while password, invitation and reset secrets are cleared. Recovery and invitation results receive keyboard focus. The account entry uses the teaching shell only after live account, branch, capability and Attendance availability checks; a role-only teacher fixture correctly remains in the permission-filtered account state.

No owner API, authorization rule, schema, migration, transaction, lock, idempotency or seed changed. Focused real-PostgreSQL Playwright covers generic/branded entry, admin and teacher outcomes, generic rejection/recovery, invalid invitation, successful invitation/recovery, CSRF, revocation and membership suspension. After correcting one test assumption about an unentitled teacher, all 24 affected desktop/mobile cases pass. `pnpm check` passes all gates and 111/111 unit tests; both Playwright runs built production and confirmed all 31 migrations current. Screenshots were inspected at desktop/mobile. Detailed evidence is in `docs/evidence/ex-04/README.md`; EX-05 is next.

## EX-05 — 10 October 2026

EX-05 is VERIFIED with human review PENDING at implementation source `486f5d9ed90c3f985d2ca53f78cb0350f5e47a6b`. The real administrator overview continues to use the current branch date and Reporting-owner totals. School setup now separates school-information and staff-access work areas. School settings keeps Refresh in the page action area, constrains the form, separates campuses and renders the existing branch timezone read-only. The approved SA-06 invariant is also enforced in the locked Access repository: every forged timezone change returns `TIMEZONE_IN_USE` before writes or evidence. The obsolete Access-to-Attendance timezone query dependency was removed.

The branding workspace now uses one constrained identity editor, explicit publication status, one primary publish action, separate immutable revision history, focused success/error feedback, private preview and collapsed advanced host controls. Draft, sanitized-logo, preview, publish, republish, public identity and cross-tenant behavior retain their existing owner contracts. No table or migration changed.

Verification: `pnpm check` passed all repository gates and 111/111 unit tests. Focused real-PostgreSQL Access management passed 7/7. Playwright passed 6/6 affected administrator/branding journeys across desktop and mobile, and the final branding-only capture rerun passed 2/2. All 31 test migrations were current. The root `pnpm build` passed with build ID `MMrxiLdHnnKBzy-N3V_AQ`. Desktop/mobile screenshots were inspected for hierarchy, form width, long-name containment and overflow. The guarded `pnpm demo:seed` passed on an approved local-database run and preserved existing data; an initial sandboxed attempt could not access the development database and is not counted as a pass.

The committed production demo is healthy at `http://127.0.0.1:3400`; local browser smoke verified administrator entry, published branding, teacher entry and teacher day with zero page errors. Private credentials remain in ignored `artifacts/iam-01/private-demo.json` and `artifacts/people-02/private-demo.json`. Missing school contact fields/revision comparison and commercial module-request operations remain explicit owner gaps. TEN-03 and native accessibility remain release gates. Evidence: `docs/evidence/ex-05/README.md`. EX-06 and EX-07 are now eligible.

## EX-06 — 10 October 2026

EX-06 is VERIFIED with human review PENDING at implementation source `42dd2db48ecbe80ee908f167d00d60aeb662bcd1`. Staff access and staff profiles now use the shared page header, constrained settings form, compact directory controls, responsive data table, explicit action dialogs and shared feedback states. Membership, portal account, employee identity and teacher eligibility remain separate owner records. Contact email is labelled as contact data and never treated as identity proof; verified binding keeps its out-of-band reference requirement.

No owner facade, authorization policy, transaction, table, migration or seed contract changed. The selected People and Access PostgreSQL suites passed 16/16 with all 31 migrations current. Final Staff Profiles Playwright passed 2/2 desktop/mobile; final Staff Access Playwright passed 4/4 desktop/mobile, while the preceding combined Access/invitation/recovery run passed 10/10. `pnpm check` passed all repository gates and 111/111 unit tests. Desktop/mobile captures were inspected; wide staff directories remain contained in their horizontal table viewport.

Invitation provider review remains FND-02, failed-delivery/resend remains conservatively partial in the workflow matrix, and TEN-03/native accessibility remain release gates. Evidence: `docs/evidence/ex-06/README.md`. EX-07 is next.

## EX-07 — 10 October 2026

EX-07 is VERIFIED with human review PENDING at implementation source `61ffda2a8e51571b93e19780a4c85dcea75b8d4a`. Academic setup now separates year/terms, immutable calendar review, class catalogs and date evaluation. Classes and teachers separates offering creation from a responsive assignment directory with eligible-teacher and inclusive-date controls. The portable Academics composition factory now requires the database URL, release manifest and clock from the Next hosting layer; ambient environment fallbacks were removed.

No owner operation, table or migration changed. Existing release, entitlement, branch activation, capability, scoped read, mutation lock, version, idempotency and Attendance impact checks remain active. `pnpm check` passed all repository gates and 113/113 unit tests. The focused Academics PostgreSQL suite passed 8/8 with all 31 migrations current. Final Academic setup and Classes Playwright runs each passed 2/2 desktop/mobile; they cover persistence, invalid dates, duplicates, overlap, year switching and stale assignment rejection. Desktop/mobile captures were inspected. `pnpm demo:seed` passed idempotently and preserved existing credentials/data.

Catalog retirement/dependency counts remain a partial owner workflow. Recurring timetable/substitution, TEN-03 and native accessibility remain open gates. Evidence: `docs/evidence/ex-07/README.md`. EX-08 is next.

## EX-08 — 10 October 2026

EX-08 is VERIFIED with human review PENDING at implementation source `b1286a2e1a478401350e848f96651ee853291d3c`. The Students route now treats the directory as the primary workspace, places registration in a focused page action and dialog, keeps exact existing-Person selection separate from ordinary student search, and composes stable identity, dated placement history, enrollment, transfer and archive through the shared production page recipes. Unsupported profile editing, guardian linking, promotion and external transfer remain explicit gaps.

The BE-04 audit confirmed that a generic list/detail query has no assignment resource with which to constrain a teacher. Those school-wide endpoints now require `student.manage`. The teacher's `student.read` capability remains available only through the Attendance-owned assigned-session roster flow after Attendance verifies the current teacher assignment and session. No schema, migration, lock order, version, receipt or owner transaction changed.

`pnpm check` passed all repository gates and 113/113 unit tests. The focused Students PostgreSQL suite passed 9/9 with all 31 migrations current. Student registration/enrollment/transfer Playwright passed 6/6 desktop/mobile, and the final BE-04 registration/teacher-denial rerun passed 4/4. Screenshots were inspected at desktop/mobile. The guarded `pnpm demo:seed` passed and preserved deterministic data and private credentials. Evidence: `docs/evidence/ex-08/README.md`. EX-09 is next. TEN-03, native accessibility and richer student lifecycle operations remain open gates.

## EX-09 — 10 October 2026

EX-09 is VERIFIED with human review PENDING at implementation source `624d5b0b795229c85d85ac7c13d7a19441ec9bf1`. Roster import now presents file selection, immutable server preview and explicit confirmation, and bounded processing/recovery as three clear stages. It displays exact preview and result counts, requires explicit handling of invalid rows, restores durable state after reload, permits cancellation of pending rows and retains the safe error export. Existing upload limits, authorization, owner transactions, replay receipts, retention and cross-scope denial remain unchanged.

`pnpm check` passed all repository gates and 113/113 unit tests. The focused Imports PostgreSQL suite passed 11/11 with all 31 migrations current. The mixed-validity and multi-batch-cancellation Playwright journeys passed 4/4 across desktop/mobile. Four captures were inspected for hierarchy, action placement and overflow. `pnpm demo:seed` passed and preserved both fictional CSV fixtures and private credentials. No schema or migration changed. Evidence: `docs/evidence/ex-09/README.md`. EX-10 is next. TEN-03, production provider/retention policy and native accessibility remain open gates.
