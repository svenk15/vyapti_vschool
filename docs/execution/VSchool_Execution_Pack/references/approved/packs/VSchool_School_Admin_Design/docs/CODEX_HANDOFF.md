<!-- TT-01 contract -->
## TT-01 integration
See [the shared timetable source of truth](timetable/README.md) and [persona mapping](TIMETABLE_INTEGRATION.md). Existing task and verification entries below are baseline unless explicitly refreshed in timetable-evidence.json.

# Codex handoff — adapt the current product

Use this after extracting the pack under the real repository’s design references, for example `docs/references/school-admin-design/`. This path is proposed; follow the repository’s established documentation structure.

1. Finish a safe checkpoint of current work. Read AGENTS.md, the current Bible, execution index and owning modules’ DESIGN/TASKS/CURRENT_STATE. Preserve unrelated edits and migration history.
2. Freeze Operator 03.9 and School Administrator 01 as review baselines. Inspect `START_HERE.html`, `WORKFLOWS.html`, the reference boards, UX_SYSTEM.md and workflow-catalog.json. Do not copy the prototype’s in-memory model, fictional roles, dates or review controls into production.
3. Produce a reconciliation table for the first batch: journey ID → existing route/component → use case/capability → tables/migrations → tests/evidence → reuse/extend/missing/blocked. Inspect existing code before creating a table or a new task ID.
4. Update the owning DESIGN.md before TASKS.md and code. Include actual physical schema, query joins, permission checks, version/receipt/guard behavior, sequence and failure/denial paths. For a UX-only change, reuse the existing verified backend contract and avoid migrations.
5. Begin with shared school shell and one complete reference slice: Today → attendance exception → session → correction receipt → report. Use actual shared design-system primitives. Preserve teacher-only marking and all existing identity/tenant gates.
6. Continue with Students/enrollment, Staff/access, Academics and Imports. Work in demoable slices from IMPLEMENTATION_INDEX.md. Later services remain proposed until their module design and phase scope are approved; do not build 63 speculative backends in one run.
7. For each implemented slice extend the existing idempotent synthetic demo seed, run focused meaningful tests, capture desktop/mobile browser screenshots and record evidence. Start/verify the demo server and leave a concise manual script. Human review remains PENDING until actual feedback. Continue independently eligible tasks under the user’s existing authorization; never fabricate acceptance.
8. At the module milestone run the documented integration/full-build/E2E gate, inspect all affected page compositions and fix alignment/overflow/wording. Do not treat passing unit tests or an isolated component gallery as visual approval.

Preserve four sources of truth: Bible shared rules, module DESIGN, ordered TASKS and actual CURRENT_STATE. This pack is a reference, not a fifth live status authority. Merge approved decisions into those four sources and link back to the frozen edition.

Do not broaden permissions, silently enable future modules, change the database prefix, waive TEN-03, copy insecure browser state to the backend, or mark production readiness because a design review succeeded.

<!-- EDITION02 -->
## Edition 02 — integrate families into the existing administrator implementation
1. Inspect the actual current repo state. Preserve existing verified modules, task IDs and phase/release gates.
2. Treat this as one whole administrator design pack. Match SA-32/33/34 and SA-37 access help to existing owner modules; do not scaffold another school-admin app or a separate identity system.
3. Read families/DESIGN.md, reconcile real vs_ schema, queries, transactions, verified identity, permissions and recovery policy; then map families/TASKS.md substeps to the active execution index.
4. Reuse shared layout/tokens/components. Connect Student → Family links and Families to the same server projection. Parent review controls in this HTML are prototypes only; real parents use the existing authenticated Parent workspace.
5. Add fictional seed data with each implemented slice through the existing guarded pnpm demo:seed. Do not overwrite unrelated test records/credentials or add teardown work.
6. Compare actual rendered desktop/mobile screens and the complete journey, not only a component gallery. Verify denial/race/failure paths against the real PostgreSQL test database and update CURRENT_STATE with source-bound evidence.

<!-- EDITION03 -->
## Edition 03 implementation prompt — Communication & Notices
Continue from the actual current source checkpoint. Read the canonical Bible/current execution index and this pack's Communication DESIGN, HLD, LLD, TASKS and CURRENT_STATE. Reconcile SA-35/36 with TEA-17/18 and PAR-09/14. Record actual upstream task and acceptance states before assigning proposed subtask IDs.

Implement one connected vertical slice at a time using the existing shared components and hexagonal owner boundaries. Start with explicit notice-purpose permission; do not infer it from attendance. Map proposed tables to actual schema, register scoped joins/indexes and settle transaction/worker/provider rules before writing a migration. Preserve tenant guards, real release gates and verified existing work.

Keep notice identity stable across corrections; immutable versions and account-specific acknowledgement evidence must survive. Use live scope checks at dispatch/read/ack; exact command receipts for unknown outcomes; true provider statuses; explicit failure recovery. No test-only actor switches, owner-credential shortcuts or fake seed identities in real auth paths. Prototype review tools must not ship as impersonation features.

Extend the existing guarded pnpm demo:seed incrementally with fictional notice recipients, attendance-only exclusions, draft/approval, scheduled, failed/unknown and versioned acknowledgement examples. Use the development email sink; do not send real messages for tests. Run focused unit/real-PostgreSQL/E2E checks for meaningful slices and a module integration gate. Record evidence and a current-source demo, keep unperformed human/native accessibility review pending, and continue only eligible work.
