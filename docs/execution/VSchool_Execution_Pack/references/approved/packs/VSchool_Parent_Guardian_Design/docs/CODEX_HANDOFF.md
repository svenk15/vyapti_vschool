<!-- TT-01 contract -->
## TT-01 integration
See [the shared timetable source of truth](timetable/README.md) and [persona mapping](TIMETABLE_INTEGRATION.md). Existing task and verification entries below are baseline unless explicitly refreshed in timetable-evidence.json.

# Codex handoff for vyapti_vschool

Treat this pack as a proposed product/UX contract. Do not replace the app with the HTML, import fictional state as production logic, or mark repository tasks complete from design coverage.

## Reconcile first

Read AGENTS.md, current Bible, execution index, relevant ADRs, owner DESIGN/TASKS/CURRENT_STATE and schema registry. Map PAR references to existing tasks and use cases. Preserve newer approved decisions, tenant guard protocol, trust-mode behavior and TEN-03 release gates. The design sources are Operator 03.9, School Administrator 01 and Teacher 01; they do not establish current code status.

Append accepted product decisions to the Bible. Complete the owning module’s physical LLD before critical code: actual tables/columns/joins/indexes/constraints, request/response contracts, authorization, transaction/version/replay, audit exclusions and recovery. Then align TASKS. Update CURRENT_STATE with source/evidence/checkpoints; keep the execution index as navigation/dependencies rather than duplicated truth.

## First demoable slices

1. FAMILY-UX-01: verified relationship/purpose read model, invitation and public school entry. Demo valid, expired, wrong-account, revoked and missing-link states. Reuse IAM infrastructure; email alone is not relationship verification.
2. FAMILY-UX-02: shared parent shell, child/school context, My children and capability-driven navigation. Demo different branches/institutions and a sibling without fee/signer authority. Deep links enforce the same policy.
3. FAMILY-UX-03: child-specific submitted session attendance plus explanation/query and stable request receipt. No parent attendance mutation. Prove same-intent replay and lost-response status lookup.
4. FAMILY-UX-04: permitted notices/acknowledgements, child conversation reply and safe school-request status/withdrawal. Show real delivery states; no unrestricted directory or co-guardian sharing.
5. FAMILY-UX-05: composed-screen review across desktop/mobile/themes, semantic errors, focus and receipts. A polished component gallery is insufficient if page composition is clumsy.

These are proposed slice IDs, not replacements for existing tasks. Continue with released dependencies in order: Learning/Documents/Consent → published Assessment results → independently designed Finance/Payments → each enabled school service → evaluated Assistant. Later visual designs do not make their domain/provider work automatically ready.

## Build rules

Reuse the same theme tokens, buttons, tables, form controls, Filter/Sort drawers, shell and dialogs. Keep parent-specific compositions as reusable components. Server-derived scope governs every read/write/download/delivery. No arbitrary client-supplied child/branch grant, wildcard Parent role, household access shortcut, parent correction, draft grade disclosure or client-confirmed payment.

Keep Next.js at the adapter boundary; use framework-independent application/domain code and ports. Payment provider, document storage, email and analytics have explicit adapters. Do not move clinical/custody evidence into general requests or logs to speed up development.

Extend the existing single `pnpm demo:seed` command incrementally with deterministic fictional records as each slice is implemented; include already-built feature gaps. Preserve existing records and credentials, scope to approved local development/demo environments, and use the file-only email sink. Do not add teardown complexity now. Payment demos use a clearly isolated sandbox/provider simulator, never real charges.

Run targeted unit, real-PostgreSQL and E2E checks for affected risks; then required module gates. Start or reuse one known demo server and record its source/build, route, fictional credential file reference and a short walkthrough. Do not copy real credentials into docs. Human review remains PENDING until performed; do not fabricate acceptance or bypass an explicit dependency gate.

## Every checkpoint

Record which PAR journey is now implemented, actual schema/API changes, visual comparison evidence, tests, demo URL and remaining limitations. Another agent should be able to resume without guessing. Preserve unrelated work. The per-area TASKS files cover all 52 proposed journeys.
