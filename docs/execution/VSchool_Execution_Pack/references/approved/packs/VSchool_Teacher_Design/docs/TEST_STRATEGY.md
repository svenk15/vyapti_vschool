<!-- TT-01 contract -->
## TT-01 integration
See [the shared timetable source of truth](timetable/README.md) and [persona mapping](TIMETABLE_INTEGRATION.md). Existing task and verification entries below are baseline unless explicitly refreshed in timetable-evidence.json.

# Verification and acceptance strategy

## Pack evidence

`node source/verify.cjs` passed 30/30 model/controller/template checks, including 130 workflow-step templates. It uses a minimal DOM adapter: this does not establish layout, focus behavior in a real browser, accessibility conformance, backend authorization or PostgreSQL behavior. `qa-evidence.json` records the exact checks. Reference boards are generated SVG/PNG designs, not browser captures.

## Unit / application tests in vyapti_vschool

Use the repository’s TypeScript test runner; JUnit/HBase do not match the currently described Next.js/PostgreSQL stack. Keep domain invariants independent of Next.js: dated eligibility and assignment, explicit unmarked states, full frozen-roster completeness, valid status enum, exact replay, stale version, grade zero/range, private versus returned feedback, and complete versus unentered marks. Test behavior, not repeated implementation details.

## Real PostgreSQL functional tests

Use the dedicated test database with forward migrations and the intended runtime role, not a bypassing owner connection. Assert persisted state, rollback and isolation. Required cases:

- Institution A → institution B and branch A → B: no unauthorized read, forged insert/update or stale pooled context. Apply current TEN-03 contract; frontend guards are insufficient.
- Revoked/expired membership, module disabled, teacher eligibility/dated assignment removed between read and command.
- Opening once freezes the intended roster; later enrollment edits do not mutate that snapshot implicitly.
- Exact full-roster atomic submission; unknown pupils, missing pupils, duplicate IDs, invalid enum and mixed scope denied.
- Two simultaneous submissions/version conflicts; exact replay returns the same receipt; changed payload under the same key denied; lost response does not duplicate records or audit.
- Submitted teacher register is read-only; authorized administrator correction is separately reasoned, versioned and audited.
- Learner-submission version changes during feedback; private draft not visible to learner; explicit returned revision visible only to authorized audience.
- Zero marks are valid, Not entered is not zero, absent/exempt is not a score; moderation freeze and publication grant remain distinct.
- Guardian relationship/purpose removed after message approval but before delivery; recipient suppression and safe failure evidence.
- Audit excludes passwords/tokens, raw student work, clinical/custody details and full message content unless a separately governed record explicitly requires it.

## Playwright on the integrated application

Test at 1440, 768, 390 and 360 widths, Chromium plus the supported production browsers. Start/reuse one known server against the isolated test database and record exact source/build. Do not stack servers to mask a hung suite.

Core acceptance: school sign-in → teacher destination; date and branch scope; open/register/explicit exceptions/bulk/review/receipt; search hides a pupil without bypassing full validation; read-only submitted register; unknown response/status lookup; conflict reconciliation; revoked assignment; safe sign out. Expanded flows are separately gated by module and capability.

Interaction quality: input-only emphasis, compact default search attribute, Enter search, retained filter multiselect, Apply/Cancel, expanded radio sort, no document overflow, icon labels, clear action alignment, no Save draft until dirty, no persistent attendance draft. Theme variants must change brand affordances while semantic status colors remain stable.

## Human review

Still PENDING: real browser layout at target widths, native 200% zoom, keyboard-only traversal, VoiceOver/Safari and NVDA/supported browser. Confirm announced radio group/pupil/status, register totals, table captions, field errors, dialog focus containment/return, branch change announcement and receipt status. Automated checks do not replace these.

## Load and operational evidence

Preserve the project target: **5,000 pupils per branch × 20 branches = 100,000 pupils total; attendance submit p95 < 1 second excluding client network**. The population number is not 100,000 per branch. Define actual concurrent teachers, roster sizes, arrival rate, dataset growth, connection limits and hardware before benchmarking. Run against the intended runtime role; include policy/query plans, error rate and lock contention. Do not claim the target from this six-pupil prototype.

Keep release security, provider review, backup/restore and accessibility evidence in the actual repository. A successful design demo does not close them. Batch broad checks at coherent module boundaries; never postpone the authorization, transaction or data-integrity checks affected by a change.
