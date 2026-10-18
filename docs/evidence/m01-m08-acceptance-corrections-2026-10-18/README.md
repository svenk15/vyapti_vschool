# M01–M08 bounded acceptance corrections

Date: 18 October 2026 (Asia/Kolkata)

This checkpoint corrects the presentation and acceptance-fixture findings reported after the integrated M01–M08 review. It does not add a product capability, change an owner command, broaden a grant, or alter database schema/migrations.

## Candidate and scope

- Baseline HEAD inspected before the corrections: `93bfce31d7ba3527218c250edd7ff3b83534ab4a`.
- Executable application build: `.next/BUILD_ID` `6HsxC8NaJEOapzYcQQBcg`, served at `http://127.0.0.1:3400`.
- The final focused Git commit is recorded in the packaged `REVIEW_HANDOVER.md`; this evidence directory is part of that checkpoint.
- Database migration state stayed at 117 applied migrations in development and test. No migration was created or changed.

## Corrections

1. Administrator navigation now groups existing guarded destinations under Today, Teaching & academics, People & access, Communication & work, Services, and School management. Routes and visibility predicates are unchanged.
2. Communication table cells use the shared stacked-metadata recipe so title/revision, audience/count, and publication/read metadata remain separate at desktop and mobile widths.
3. Student registration uses school-office wording. Exact Person ID or admission-number reference inputs render only for their selected modes; the exact identity-resolution contract is unchanged.
4. Principal dashboard explanations are concise user-facing copy. An absent optional summary says no additional dashboard summaries are available and does not claim that an entire module is disabled.
5. Student assignment guidance distinguishes draft, submitted, and feedback-available states. The captured feedback state does not show draft submission instructions.
6. Shared `.stack` spacing separates Parent Learning and Student home cards. Published notice status uses the same badge structure at both viewports.
7. Mobile Parent/Student content reserves the fixed-nav and safe-area space. The focused final Student control ended at CSS pixel `773.4`; the fixed navigation began at `781`, so the focus ring remained visible. Root widths matched their 390px viewports.
8. The connected presentation seed now binds Learning purposes to the exact documented Parent and Student accounts. Immutable assignment audience is republished when that exact binding is absent; old assignments and history remain untouched.
9. The obsolete combined Attendance browser journey now follows the current Teacher entry, staged correction, reset-before-cancel rule and non-disclosing unauthorized audit response.
10. Coordination evidence now describes its displayed `Scheduled` source as scheduled. The application was correct: the resolved request retained the current scheduled source, while the test's resolution prose incorrectly said submitted.

## Verification

- `pnpm check` passed before the final seed/test-only adjustments: lint, generated route types/TypeScript, documentation, DB design (204 contracts), boundaries/backend checks, and 257 unit tests across 58 files.
- `pnpm exec tsc --noEmit --pretty false` passed after the final seed changes.
- Normal production build passed with `NODE_OPTIONS=--max-old-space-size=4096`; build ID `6HsxC8NaJEOapzYcQQBcg`.
- Focused Playwright, one worker: Attendance 1/1; Communication 4/4; Student registration 3/3; Learning publication 1/1; Coordination provenance 1/1.
- `pnpm demo:seed` completed against the guarded local development database. The exact connected Learning seed and five-persona validator also completed after the account-binding correction.
- Screenshots in `screenshots/` were captured at 1440×1000 and 390×844 and inspected directly. `browser-metrics.json` records route, dimensions, font, overflow and fixed-navigation/focus measurements.

One accidental command used `pnpm test:e2e -- <path>`. The wrapper forwarded `--` and began the full 318-test inventory; it was stopped after three passes and one interruption. No result from that run is claimed. All focused results above used the repository's corrected argument form.

## Evidence map

- `references/`: copied approved reference captures where exact screens exist. Their source paths are listed in [REFERENCE_SOURCES.md](REFERENCE_SOURCES.md).
- `screenshots/`: current application captures for Administrator navigation, Communication, registration, Principal home, Parent Learning, Student home, and Student feedback state.
- `source-state/`: current Coordination source/closure captures used for the Scheduled/submitted investigation.
- [DEFECT_LOG.md](DEFECT_LOG.md): confirmed defects and investigated non-defects.
- [WALKTHROUGH.md](WALKTHROUGH.md): connected Administrator → Teacher → Parent → Student → independent reviewer walkthrough.

## Remaining gates

Human acceptance remains pending. The existing font-portability exception, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03 restricted-role/RLS proof, provider/policy gates and production readiness remain open. Synthetic fixtures do not authorize real pupil data.
