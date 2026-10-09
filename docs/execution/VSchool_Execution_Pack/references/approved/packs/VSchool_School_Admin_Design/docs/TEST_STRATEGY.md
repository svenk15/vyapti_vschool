<!-- TT-01 contract -->
## TT-01 integration
See [the shared timetable source of truth](timetable/README.md) and [persona mapping](TIMETABLE_INTEGRATION.md). Existing task and verification entries below are baseline unless explicitly refreshed in timetable-evidence.json.

# Verification strategy

Use the real repository’s TypeScript unit runner, real PostgreSQL functional suite and Playwright setup. Do not add JUnit or HBase to this Next.js/PostgreSQL project. Tests should target meaningful behavior, not duplicate the implementation.

## Per slice

1. Domain/use-case tests: allowed/denied transitions, dated boundaries, duplicate request, version conflict, essential arithmetic and invariants.
2. Real PostgreSQL tests: actual migrations, scoped uniqueness/composite references, concurrency, guard order, rollback, audit/outbox/receipt atomicity and restricted runtime role where enforced. Use at least two institutions and two branches.
3. Focused Playwright: the complete authorized journey and one important recovery/denial path; verify persisted outcome, not just a toast.
4. Visual review: actual shared components at 1440px and 390px; also 360px, long names, populated and empty states, selected drawers, forms/errors, and 200% zoom. Compare complete pages against this pack’s composition.
5. Synthetic seed: extend the existing idempotent demo command for every implemented slice. Never overwrite real credentials or unrelated test records. Seed teardown remains deferred, as requested.
6. Record commit/build, commands, results, server URL and a 3–5 step demo. Human review is PENDING until the user reviews that build; continue independently eligible tasks under existing authorization.

## High-risk cases by journey family

| Family | Must prove |
|---|---|
| Entry/context | Branded URL grants nothing; safe return route; revoked branch unavailable; A→B pooled connection carries no stale tenant data; sign-out invalidates session |
| Global identity/recovery | Stricter active institution blocks permissive email reset at issue and consume; mode changes invalidate affected tokens; failed delivery cannot activate |
| Staff/access | Out-of-band binding; no email auto-merge; pending replacement is not last-admin protection; teaching eligibility/date checked |
| Student/enrollment | Exact identity lookup; duplicate admission race; no overlap; unsupported history rewrite rejected; current authorized minimal roster |
| CSV | File/schema/body bounds independently enforced; no audit raw rows/bytes/hashes; preview has no writes; stale preview; partial rows; lease/replay/resume |
| Attendance | No implicit absence; teacher overlap checks; frozen roster; complete submission; correction reason/revision; lost response resolves one receipt |
| Reports | Reconcile source counts; excused excluded; unavailable denominator; repeated pupil across sessions explained; CSV scope matches filter; access rechecked |
| Guardians | Email is not relationship evidence; other child denied; sibling grants independent; custody/purpose restrictions; queued delivery suppression after revocation |
| Communications | Audience preview; consent/purpose/quiet hours; provider unknown vs failed; duplicate protection; sanitized reason; acknowledgement separate |
| Finance/results | Immutable posted/published snapshots; concurrent approval/version checks; exact currency; authenticated duplicate callback; unknown refund outcome |
| Specialist services | School-admin denied salary/clinical/case data by default; explicit delegated scope; emergency expiry/audit and independent review |

## Scale and query evidence

Preserve the Bible target: **5,000 pupils per branch × 20 branches; attendance submit p95 < 1 second excluding client network**. This is 100,000 pupils across the institution, not 100,000 per branch. Document session history depth, class sizes, concurrency, report/import mix, hardware and warm/cold conditions; pupil count alone is not a full load profile. Profile offering/date overlap and teacher/date lookup under the intended runtime role. Keep EXPLAIN (ANALYZE, BUFFERS) and guard-contention evidence tied to the tested schema/build.

## Batch-level gate

Run the repository’s full check and production build once at a coherent milestone, then full critical E2E once before the release candidate. Re-run changed focused checks after a small fix, recording which full results precede it. Do not repeatedly run every suite after copy or spacing edits. Tenant isolation, authentication, financial integrity and protected mutation checks are never waived to improve velocity.

## Current artifact evidence

`qa-evidence.json` records Node model/controller/template checks only, including every workflow step render. Vector boards were rendered with Inkscape and selected desktop/mobile examples visually inspected. Browser E2E, CSS-in-browser screenshots, 200% native zoom, VoiceOver/NVDA and human design acceptance are **NOT_RUN / PENDING**. Native Figma publication is **NOT_DONE**. No production acceptance is claimed.

<!-- EDITION02 -->
## Edition 02 — integrated prototype and implementation evidence
Run `node source/verify.cjs` for preserved controller/template coverage, and `node source/browser-check.cjs` for the connected Chromium review (requires Playwright and a Chromium executable; environment overrides documented in source/README.md). The browser run checks all 22 homes, all 63 journey entries and key details at desktop/mobile, plus the complete family lifecycle, branch isolation and keyboard dialog behavior. Its report records exactly what ran. This is not proof of real authentication, email delivery, database isolation or native screen-reader behavior.

Actual implementation adds real PostgreSQL scope/FK/date/duplicate/atomicity and accept/revoke/policy-race tests, exact-roster attendance queries and current authorization on downloads. Native accessibility and human UX approval remain pending until performed. No conformance claim follows from prototype checks.

<!-- EDITION03 -->
## Edition 03 communication evidence
See [Communication TEST_STRATEGY](modules/communication/TEST_STRATEGY.md). `communication-browser-evidence.json` records the new connected browser cases. `browser-evidence.json` retains the current whole-administrator route and family regression scope; `qa-evidence.json` covers Node/template checks. Offline UI evidence does not prove real SQL isolation, provider delivery, real authentication, native assistive technology or production release readiness.
