# Teacher attendance milestone — 13 October 2026

## Scope and authority

The checkpoint implements the first Teacher milestone: sign in → My teaching day → assigned session → mark attendance → review and submit → reopen the submitted read-only register. Teacher correction authority was not added.

The approved source is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Teacher_Design/VSchool_Teacher_Review.html`, specifically the `today` and `attendance` states for TEA-01, TEA-05 and TEA-09–TEA-14. Supporting specifications are in that pack's `docs/` directory. The application entry is `/sign-in`; the Teacher workspace entry is `/teacher/today`.

TT-06 was inspected as a possible dependency. It is not required here: this milestone lists Attendance sessions already created through the Attendance owner. It neither exposes editable Timetable drafts nor treats an unreconciled publication occurrence as an Attendance register. Family-purpose timetable projections remain separate work.

## Implemented behavior

- A Teacher with one authorized branch lands directly on My teaching day only after live capability and module-eligibility checks. Other accounts retain the existing account landing.
- The day page presents school-local date controls, assigned-session counts, supported session states, the next actionable register, empty/error guidance and role-specific navigation.
- The register preserves unsubmitted edits within the active page, requires a complete unique roster, validates Late minutes, shows an explicit review dialog and submits only from the final confirmation action.
- A lost submit response retains the exact payload and idempotency key, checks command status and recovers one committed submission. Reload shows the immutable read-only register and return path.
- Current account, membership, branch, module, capability and dated teacher assignment remain enforced by the existing owner use cases and transactional repository guards. URL substitution does not grant another Teacher's session. Teachers have no correction control or correction API authority.
- `pnpm demo:seed` adds or preserves one current-date practice occurrence for the existing fictional Teacher without overwriting prior sessions, marks or credentials.

No schema or migration changed. Development and test databases retain the existing 46-migration history.

## Verification

Tested working tree based on `a3568b1f856744ab3e73f694fbf602abf1d58313`; final checkpoint commit is recorded in the handoff.

- `pnpm test:e2e test/e2e/teacher-attendance-milestone.spec.ts --project=chromium --workers=1` — PASS, 1/1, 36.3 s, real `vyapti_vschool_test` PostgreSQL with 46 migrations.
- `pnpm test:e2e test/e2e/teacher-attendance-milestone.spec.ts --project=mobile --workers=1` — PASS, 1/1, 33.0 s, real `vyapti_vschool_test` PostgreSQL with 46 migrations.
- Both journeys cover single-branch Teacher landing, assigned register open, roster validation, exception marks, search, explicit review, simulated lost response, receipt recovery, reload persistence, exactly one SUBMIT revision, three records and no page overflow.
- Existing Attendance PostgreSQL evidence for cross-Teacher denial, stale version, revoked authority, frozen roster, replay and rollback remains applicable because this slice did not change the backend domain/application/infrastructure implementation.
- `pnpm build` — PASS after the final application change.
- `pnpm check` — PASS: lint, generated route types/TypeScript, documentation (30 tasks), database design (63 table contracts), extraction boundaries, portable backend compilation and 142/142 unit tests.

One legacy combined Attendance browser case was not used as a passing gate: its Teacher portion reached submission successfully, then its unchanged Administrator correction selector timed out against the newer staged SA-27 composition. No result from that failed combined run is labelled passed.

## Direct visual comparison

Reference and application images were opened and inspected directly, not only checked for overflow. The application now follows the reference page width, 28–32 px heading hierarchy, date toolbar, three summary metrics, bordered session rows, emphasized actionable session, guidance cards, compact count chips, roster rows, review footer and responsive mobile stacking.

| State | Reference | Application |
|---|---|---|
| My teaching day, desktop 1440×1000 | `reference-today-desktop.png` | `application-today-desktop.png` |
| My teaching day, mobile 390×844 | `reference-today-mobile.png` | `application-today-mobile.png` |
| Open register, desktop 1440×1000 | `reference-register-desktop.png` | `application-register-desktop.png` |
| Open register, mobile 390×844 | `reference-register-mobile.png` | `application-register-mobile.png` |

The captures intentionally use real authorized data. The development database has six legitimate feature-owned sessions while the reference has three memory-only examples; this is a content-density difference. The reference-only `My classes` and `Attendance history` routes, richer Teacher profile projection and pre-freeze eligible-pupil count are not fabricated. The existing font portability deviation remains. Native VoiceOver/NVDA, human visual acceptance, TEN-03 and production release gates remain PENDING.

## Demo

- URL: `http://127.0.0.1:3400/sign-in`
- Credentials: ignored private file `artifacts/people-02/private-demo.json`
- Seed: `pnpm demo:seed`
- Start: `pnpm build && pnpm demo:start`

The seeded 01:00–01:45 practice register is OPEN with three unmarked pupils. Re-running the seed preserves its state and historical records rather than resetting it.
