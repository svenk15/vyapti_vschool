# Verification, completion and release

## Test strategy
Use the repository's TypeScript unit runner, real PostgreSQL functional harness and Playwright. Do not add JUnit or HBase: they are not the current stack. Use existing package scripts and inspect their argument convention before invoking focused files.

| Risk | Required evidence |
|---|---|
| Domain lifecycle/metrics | Allowed/forbidden transitions, exact denominator arithmetic, unknown vs zero, date boundaries, decimal rounding where configured |
| Tenant and branch scope | Positive authorized scenario plus foreign institution, foreign branch and forged resource; deny without revealing existence |
| Identity and purpose | Role alone insufficient; assignment not source authority; revoked/expired live denial; wrong guardian/self Student; account-wide self-approval check |
| Transactions | Real PostgreSQL two-connection concurrency, scoped unique conflict, audit rollback, CAS stale, same-key replay, changed-payload conflict |
| Bulk | Partial success, interruption between command commit and item receipt, resume, no duplicate, per-item authority change |
| Source owner | Exact revision linkage; owner event genuinely occurred; central inbox cannot write foreign state |
| Confidentiality | DTO/query tests exclude private notes/answers/contacts; logs/audit redaction; hidden case not inferable through totals or search |
| Documents | Byte-level allowlist, quotas, real scanner verdict, unavailable scanner fail-closed, revoked purpose and unsafe asset block download |
| External delivery | Development sink labelled; provider acceptance/delivery/read/ack distinguished; unknown outcome not blind retry |
| UX | Real end-to-end normal entry, counterpart action, persistence/reload, validation, keyboard/focus and desktop/mobile states |
| Visual | Measured recipe geometry, direct screenshots and overlays, registered font difference; no overflow alone insufficient |

## Functional examples
- LEA10: three selected sources: creates one, returns existing for one, denies one safely; counts reconcile to3. Interruption after source commit resumes original key with no extra request.
- LEA24: two coordinators propose overlapping substitute assignments. Only permitted conflict-free activation can commit; an open/submitted register remains unchanged.
- LEA17: frozen recipients with submitted, awaiting, extended future and excused states; due=submitted+awaiting within same cutoff/cohort. No current-class rewrite of history.
- LEA33: author changes audience after approval preview. Publication of changed digest fails and requires reapproval.
- LEA40:10/12 weighted source ratio, not mean of50% and90%; incompatible periods shown separately. Revoked branch no residual total leak.
- LEA35/37: subject of complaint and generic Principal role cannot enumerate restricted case; authorized referrer sees only allowed handoff status.
- LEA45: an injected source says to disclose another branch. Retrieval ignores it, citations stay authorized and no command tools exist.

## Seed strategy
pnpm demo:seed remains one entry point. Add per-owner repeat-safe synthetic scenarios, not a second seed framework. Never overwrite manual data, credential values, immutable submissions/publications or history. Use dedicated revocation/negative fixtures so primary demo personas survive. Date-sensitive scenarios derive branch-local dates at seed time without moving historical records. Keep stable future/historical dates explicitly documented when immutable publication prevents rolling them. Store private identifiers only in existing ignored mode0600 files. Optional seed failures stay visible, not described as full success.

## Evidence per checkpoint
Evidence README: exact scope and workflow IDs; source commit; build ID; applied migrations in development AND test separately; commands and results; retained evidence provenance; screen map and differences; normal-navigation walkthrough; human status; next task. Save no passwords/tokens, raw protected text or real children screenshots. Build may precede documentation/test-only commits; explain relationship rather than calling built HEAD identical indiscriminately.

## Status fields
Use functional, visual, human and deployment independently. Functional may be NOT_STARTED/IN_PROGRESS/SUPPORTED_PARTIAL/ENGINEERING_COMPLETE. Visual may be NOT_COMPARED/COMPARED_WITH_DEVIATIONS/MATCHES_APPROVED_PRODUCTION_SPEC. Human PENDING/PASSED_WITH_SCOPE/DEFECTS_REPORTED. Deployment SYNTHETIC_ONLY/PROVIDER_PENDING/SECURITY_GATE_PENDING/RELEASE_APPROVED. Never count a seed-backed mock as owner completion.

## Production gates retained
TEN-03 restricted runtime role and verified database context/RLS proof; actual owner credentials are not acceptable production posture. Real provider/scanner security review; school-approved retention and backup deletion/restore testing; published school policy/contact and finance limits; capacity/load proof against documented profile; native VoiceOver/NVDA and real200% browser zoom; legal font portability and human acceptance. These gates do not automatically prohibit synthetic engineering, but must remain enforceable.

## Completion rule
G99 passes only if every declared workflow acceptance is demonstrated or explicitly left partial/blocked with exact missing contract/provider. User scope may intentionally exclude later modules, but exclusions must be approved and remain visible; they are not completion of all46. No task may quietly downgrade requirements to make the count green.
