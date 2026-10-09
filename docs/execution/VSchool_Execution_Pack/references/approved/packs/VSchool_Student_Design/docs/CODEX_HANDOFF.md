<!-- TT-01 contract -->
## TT-01 integration
See [the shared timetable source of truth](timetable/README.md) and [persona mapping](TIMETABLE_INTEGRATION.md). Existing task and verification entries below are baseline unless explicitly refreshed in timetable-evidence.json.

# Codex implementation handoff
Use this pack as a design specification and prototype reference, not a replacement application to paste into the repository.

1. Read actual AGENTS.md, Bible, ADRs, execution index, current schema/migrations and owner CURRENT_STATE.md files. Preserve unrelated changes and existing evidence. Record the current source checkpoint.
2. Reconcile PRODUCT_SCOPE.md and IMPLEMENTATION_INDEX.md with actual module release gates. Confirm school-issued student identity and verified account/enrollment binding. Do not infer it from guardians or email.
3. Read UX_SYSTEM.md, the relevant module DESIGN.md, DB_CONTRACT_PROPOSAL.md and SUBMISSION_LLD.md for the critical path. Map candidate tables and capability labels to existing owner models. Update LLD before code.
4. Implement a small end-to-end slice with framework-independent domain/application rules. Reuse production shared components and tokens. Keep Next.js routes thin; future Nest.js extraction must not require rewriting domain policy.
5. Add a fictional idempotent fixture for that slice to existing pnpm demo:seed. It must work for all implemented features so far without replacing existing testing records/credentials. Do not add teardown complexity now.
6. Run focused unit, real-PostgreSQL and E2E checks appropriate to changed risk, plus actual required repository gates. Use automated reference comparison and human visual review on real pages, not merely the component gallery.
7. Start a demo from tested source and update per-module CURRENT_STATE.md with task status, source, migration state, tests, routes, seed references, gaps and next eligible slice. Never equate this design's passed synthetic checks with production verification.
8. Continue eligible tasks under existing authorization; do not invent blanket permission to bypass security, acceptance or deployment gates. Do not silently broaden to finance, live tracking, AI or guardian consent implementations.

Initial vertical slice: verified StudentAccountLink + context → published assignment → private draft and trusted file reference → explicit submission/receipt → status recovery → teacher returned feedback → permitted revision. Start text-only end-to-end if the file owner is not yet ready; keep attachments unavailable until trusted scanning/retention contracts exist, not deceptively marked safe.

Match success and failure screens. Explicitly preserve unknown outcomes, signed-out/denied states, private teacher notes, disabled-module navigation and no implicit guardian submission.
