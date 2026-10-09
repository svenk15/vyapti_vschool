<!-- TT-01 contract -->
## TT-01 integration
See [the shared timetable source of truth](timetable/README.md) and [persona mapping](TIMETABLE_INTEGRATION.md). Existing task and verification entries below are baseline unless explicitly refreshed in timetable-evidence.json.

# Verification and implementation strategy
The delivered design has two test layers: synthetic model assertions and real Chromium/Playwright checks of the standalone HTML. They do not exercise the real Next.js app, PostgreSQL, object store, scanner, authentication, mail or a live teacher workspace.

## Included evidence
- qa-model.json: bounded input, student scope, guardian denial, draft conflict, clean file rules, submit replay, changed intent, deadline/extension, revision/withdrawal race rules, publication boundaries and request/acknowledgement invariants.
- qa-browser.json: real browser interactions at desktop and 360px mobile; all 47 guided workflows; dialog keyboard containment/return; search/filter/sort; connected submission and failure branches.
- reference/capture-evidence.json: 80 desktop/mobile references and document-overflow check. Review toolbar hidden for references; fixed mobile footer is placed at the end of long-page exports to keep reference content unobscured.
- These browser checks use fictional in-memory fixtures. No production E2E or accessibility-conformance claim.

## TypeScript unit strategy for production
Use the repository's existing TypeScript runner. No JUnit/HBase introduction into a Next.js/PostgreSQL system. Test domain state transitions, capability decisions, deadline boundaries, exact intent replays, changed payload, unpublished information and value limits. Test policy using a fixed clock. Keep transport/UI tests separate from domain rules.

## Real PostgreSQL functional tests
Use dedicated disposable database/schema and actual migrations. Connect as the intended restricted runtime role once TEN-03 is implemented. Prove own/cross-student/cross-branch/cross-institution scope, forged inserts/WITH CHECK, account-link revocation, pooled reuse, composite FK rejection and read-only routes. Separate migrations role credentials.

Use concurrent transactions/barriers to test two draft saves, duplicate/distinct submissions, policy change during review, teacher-review vs withdrawal, changed scan verdict, and access revoke vs status/read. Verify exactly one accepted attempt/receipt/audit for an intent. Force rollback between writes to prove no partial snapshot. Re-run status after an intentionally lost response.

## File/provider contracts
Use fake adapters for most tests and dedicated integration evidence for actual storage/scanner callback auth. Test misleading MIME headers, oversized/zero bytes, count limit, duplicate file, malicious filename, quarantine, scan failure, callback forgery/replay, tenant mismatch, expired upload and immutable object-version retention. No real school documents in tests.

## Product E2E
School creates verified student identity → published assignment → student saves/uploads/reviews/submits → teacher reviews and returns student-facing feedback → student sees only released data → allowed revision creates attempt 2. Guardian view is independently authorized and cannot invoke submit-as-student.

Cover exact session attendance, query without correction, notice acknowledgement without consent, permitted messages with delivery failure, own requests, published reports, disabled modules and school switch. Include reload/back navigation, account expiry, policy revocation, keyboard, 360px/390px, long labels and 200% native zoom.

## Performance
Use existing baseline 5,000 pupils/branch × 20 branches (100,000 total), realistic assignments/attempts per learner and concurrent usage profile. Record hardware/runtime roles, row counts, query plans, latency distributions and lock waits. Define student-list/draft/submit/upload SLOs before claiming them. Existing attendance p95 <1s excluding client network remains its own owner gate.

## Accessibility and human review
Native VoiceOver/NVDA, touch usability and native zoom are pending. Check labels, headings, table associations, status announcements, file controls, focus after conflicts, drawers, mobile menu and ambiguous submission recovery. No user is asked to approve unseen evidence; prepare a running demo with a short checklist when a review gate is reached.
