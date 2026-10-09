# Experience implementation state

EX-00 through EX-02 are VERIFIED with human review PENDING. The prerequisite BE-01 configuration correction is also VERIFIED. EX-03 is the next eligible slice. EX-03–EX-15 remain NOT_STARTED; the queue is a scheduling projection until their live evidence is recorded.

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
