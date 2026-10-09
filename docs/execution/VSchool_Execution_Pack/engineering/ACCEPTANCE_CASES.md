# Acceptance cases — executable test specifications

Every case names the invariant and observable outcome. Use existing Vitest and guarded real-PostgreSQL/Playwright harness. Extend tests, do not copy a parallel suite. A test that only duplicates implementation constants adds little evidence. Unit fixtures use deterministic clock/IDs; no real student data.

## Domain / application (Vitest; existing JUnit XML reporter)
| ID | Setup / action | Expected |
|---|---|---|
| U01 | Enrollment startsOn=2026-10-09,lastDay=2026-10-09 | One-day valid interval [2026-10-09,2026-10-10), not zero duration |
| U02 | Enrollment invalid 2026-02-30 | VALIDATION before repository call |
| U03 | Transfer reason4 characters, version0 | VALIDATION; no port invocation |
| U04 | Attendance duplicate student UUIDs with different case | VALIDATION after normalization |
| U05 | LATE without minutes, 0,481, non-integer | VALIDATION; PRESENT with lateMinutes also rejected |
| U06 | Attendance201 entries | VALIDATION; do not silently truncate |
| U07 | Open/submit extra unknown property | Reject as current strict input contract |
| U08 | No identity or malformed token version/identifier | Reject before protected repository call |
| U09 | Search/filter apply then Cancel | Applied query unchanged; no fetch with abandoned draft |
| U10 | Unknown submission response | Same intent/key retained; no success or new-key resend |
| U11 | Navigation same module/different permission | Only individually allowed link appears |
| U12 | Portable composition injected release/config | Same result regardless of unrelated host environment |

## PostgreSQL functional
Use two organizations, two branches in one organization, an admin, two different assigned teachers, one revoked membership and one disabled module. Names/IDs are synthetic. Allocate fixtures through existing guard-aware helpers; keep test database safety.

| ID | Action | Persisted/visible assertion |
|---|---|---|
| P01 | Register valid pupil | Person+Student plus required safe evidence commit; 1 Student, correct organization/school |
| P02 | Inject evidence writer failure during registration | Entire command rolls back, including newly created Person; no success receipt |
| P03 | Replay same actor/scope/key and normalized payload | Same student semantic outcome; no duplicate entity/evidence |
| P04 | Same key different admission/name | IDEMPOTENCY_CONFLICT; no second student |
| P05 | Race two keys same branch admission number | At most one commits; unique constraint/guard retains integrity |
| P06 | Existing person belongs to another organization | Not found/denied with no foreign identity leakage |
| P07 | Enrollment references a foreign branch section | Rejected; scoped FKs and app guard both exercised |
| P08 | Transfer at interval boundary | History closes/opens as owner contract, no overlap; invalid endpoints rejected |
| P09 | Transfer with frozen open/submitted roster impact | ROSTER_IN_USE; original placement/history unchanged |
| P10 | Parallel stale transfer versions | At most one intended update; loser safe conflict, no lost history |
| P11 | Open assigned attendance | Stable pinned roster and server revision; empty/too-large roster rejected |
| P12 | Submit omitted or extra roster member | No partial AttendanceRecord writes or submit receipt |
| P13 | Valid full submit | Session SUBMITTED, correct version, records, revision and tenant evidence all present |
| P14 | Concurrent submit same key | One semantic submission; replay safe; no duplicated revision |
| P15 | Correct stale submitted version | STALE_VERSION; submitted values/history untouched |
| P16 | Correction valid reason/change | New CORRECT revision with before/after; original SUBMIT remains |
| P17 | Revoke assignment/member after UI loaded | Next protected operation denied; no receipt-based permission bypass |
| P18 | Another teacher queries command status | Does not obtain original actor's result |
| P19 | Switch branch and reuse cursor/receipt | Cross-scope cursor rejected; wrong-branch receipt/resource not disclosed |
| P20 | Remove license or branch activation | Both direct protected queries and commands reject; menu hiding alone insufficient |
| P21 | Import processed source row retried | Reuses owner mapping/outcome; no duplicate Student/Enrollment |
| P22 | Import row owner write fails | Row/owner atomic semantics preserved; job partial counts honest |
| P23 | Report has pending/cancelled/future sessions | Denominator and totals follow owner definition, not paginated length |
| P24 | Tighten account trust policy after reset issued | Consume rechecks account-wide policy and safely refuses |

P24 belongs to Access; rerun when touching recovery/trust behavior, not every CSS task. TEN-03 restricted-role denial and pool-reuse cases are additional release tests; these application tests do not prove RLS.

## Browser journeys
B01 branded sign-in→admin branch; B02 teacher entry→own session; B03 staff create/invite/revoke; B04 year/section/offering assignment; B05 student register/enroll/transfer; B06 mixed import preview/confirm/recovery; B07 attendance open/mark/submit/lost-response recovery; B08 admin correction/report/export; B09 branch-switch stale response; B10 disabled module direct URL; B11 filters/sort/search keyboard+Cancel; B12 mobile nav/open/close/focus/sign-out.

Use existing API-backed seeds and real PostgreSQL. Assert visible outcome AND persisted result for critical mutations. Do not substitute mocked Playwright responses as the only evidence of authorization. Use request interception only for controlled latency/lost-response presentation, then inspect actual receipt/state.

## Visual acceptance independent of functionality
At1440x1000 and390x844 compare each adopted actual page to the approved reference state. Assert no horizontal document overflow, unclipped actions, aligned field labels/errors, full-width table toolbar, narrow action cell and separated sidebar profile/sign-out. Review screenshots; green Playwright assertions alone do not prove pleasing layout. Nav-only step must not change main body geometry. Native accessibility sessions remain pending until actually performed.

## Test selection
Each task lists which of U/P/B applies based on changed behavior. Pure CSS needs visual/browser evidence, not P01–P24. Guard/schema/transaction change always needs its negative/race/integrity cases immediately. Run the full required suites once on integrated release candidate and after changes that invalidate their evidence. Never broaden scope merely to generate a large test count.
