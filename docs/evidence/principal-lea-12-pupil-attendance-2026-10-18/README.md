# LEA-12 factual pupil Attendance review

Status: **ENGINEERING_COMPLETE** for approved D07 synthetic-only scope. Visual status: **DIRECT_COMPARISON_COMPLETE_WITH_DEVIATIONS**. Human review: **PENDING**. Production enablement: **BLOCKED** by existing release gates.

Implementation commit: `b4e2b0fba27449faa5e38feb728445a78d6efdf8`. Approved source: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, workflow `LEA-12`. Production entry: `/leadership/attendance/pupils`.

## Verified contract

- A current explicit grant names exactly one branch, account and Student. Principal role, aggregate Attendance reads, Coordination assignment and another pupil grant do not imply access.
- The server enforces an inclusive 1–90 branch-local date window and 1–90 absent-session threshold.
- The projection reads latest effective marks from SUBMITTED frozen rosters. Two absent sessions on one date produce two sessions, one distinct date and one unique pupil.
- OPEN and due SCHEDULED coverage uses historical placement/frozen roster semantics and remains visibly separate from absence.
- The final support action creates one immutable Attendance snapshot and routes it through the typed `ATTENDANCE_PUPIL_PATTERN` owner adapter. The assignee independently needs the same named-pupil grant and current Coordination work authority.
- Exact snapshot retry returns the original result. Revoking the named grant prevents protected Coordination source/receipt disclosure. Coordination gains no mark, correction, health, safeguarding or family-contact authority.

## Verification

- `pnpm check` — passed: lint (one unused test variable was subsequently removed), type generation/check, docs, 152 database contracts, boundaries/backend and 223/223 unit tests.
- `pnpm test:functional test/functional/attendance-pupil-review.test.ts` — 1/1 passed against real `vyapti_vschool_test`; 94 migrations, none pending.
- `VSCHOOL_E2E_BUILT=1 NODE_OPTIONS=--max-old-space-size=4096 pnpm test:e2e test/e2e/principal-pupil-attendance.spec.ts --project=chromium --workers=1` — 2/2 passed.
- Equivalent mobile command — 2/2 passed. The test additionally asserts the 390 CSS-pixel viewport and computed card-table composition.
- `VSCHOOL_E2E=1 NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed; build `2b2tYiuJKORt1jochoH1F`.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed; build `YRNo7gD26XhtwB9sfz7T1`.
- Development and test databases contain the two forward LEA-12 migrations and 94 total migrations. Neither database was reset and no applied migration was edited.

The first Playwright invocation accidentally used the default 2 GiB heap and failed during webpack before any browser test ran. It was not repeated after the required 4 GiB invocation was established. An initial responsive rerun also served the intentionally separate stale `.next-e2e` artifact; a dedicated E2E build corrected the provenance before final desktop/mobile evidence.

## Visual comparison

The reference is a workflow explorer rather than a complete production screen. Its stage order and facts map to the routed report → staged support operation → durable receipt. The application preserves the common Principal shell, current school context, explicit criterion, factual source rows, separate missing coverage and one primary action. Mobile inspection found a compressed horizontal table; the final implementation uses labeled cards and a full-width support action.

| State | Desktop | Mobile |
|---|---|---|
| Approved explorer | `reference-chromium.png` | `reference-mobile.png` |
| Factual review | `application-review-chromium.png` | `application-review-mobile.png` |
| Consequence review | `application-confirm-chromium.png` | `application-confirm-mobile.png` |
| Owner-confirmed receipt | `application-receipt-chromium.png` | `application-receipt-mobile.png` |

Known deviations remain the explorer-dialog versus routed production composition and the established font portability exception. Native VoiceOver/NVDA and actual browser 200% zoom were not performed.
