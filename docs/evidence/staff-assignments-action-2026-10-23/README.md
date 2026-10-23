# Staff Profile assignments action — 23 October 2026

Human visual acceptance remains **PENDING**.

## Result

The reference-less **Review eligibility** action has been removed from the Staff Profile Teaching assignments section. The approved **View assignments** action remains and now matches the frozen Staff reference: 12px/550 text, 18px line height, 15px icon, 8px icon gap, 36px desktop target and 44px mobile target. The mobile heading and action share the approved single-row composition.

The guarded `/admin/teachers/{employeeId}/eligibility` compatibility route and its Academics owner behavior remain intact. No authorization, eligibility, assignment, persistence, recovery, schema, migration or fixture changed.

## Provenance and evidence

- Frozen reference: `docs/execution/STAFF_REVIEW/references/approved-20261022/mock/index.html#/profile/1`
- Baseline commit: `b29e72e20acb9432474f1b0067c5ff9b2ccc2238`
- Production build ID: `zgZmqrWP0cWKYHiSueDde`
- Demo: `http://127.0.0.1:3400`
- [Profile desktop](profile-desktop.png)
- [Profile mobile](profile-mobile.png)
- [Assignments drawer desktop](assignments-desktop.png)
- [Assignments drawer mobile](assignments-mobile.png)
- [Computed measurements](verification.json)

## Verification

- Focused Chromium eligibility compatibility-route test: 1 passed with one worker. It retains exact-key lost-response recovery and dated eligibility persistence while asserting that Staff Profile no longer presents Review eligibility.
- Focused current-build visual check: desktop 1440×1000 and mobile 390×844 passed. View assignments opened the correct drawer; typography, icon size, target size and root overflow were measured.
- Changed-file ESLint passed.
- Clean 4 GiB production build passed after removing stale generated `.next` output. Build ID: `zgZmqrWP0cWKYHiSueDde`.
- Demo health returned `ready: true`.

Human visual acceptance, native accessibility, TEN-03 and production readiness remain pending.
