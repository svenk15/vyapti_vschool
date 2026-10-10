+# SA-20 Administrator Student management comparison — 11 October 2026

## Scope

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/flow/SA-20`.
- Measured contract: `docs/execution/VSchool_Execution_Pack/references/approved/implementation-spec/administrator/screens/SA-20-entry.md` and workflow `administrator/workflows/SA-20.md`.
- Application route: `/admin/students/[id]`, reached from the already-compared `/admin/students` directory.
- Reference and application were captured with Chromium at 1440×1000 and 390×844, light mode, reduced motion, en-GB and Asia/Kolkata.

## Result

The existing People-owned name correction now uses the approved Student record → Review correction → Confirm composition. The first step keeps the accepted People contract's separate first/last fields, the second captures the restricted reason, and the third compares current/corrected values before the existing versioned command is sent. The reference's fictional Student picker is omitted because the authorized production route already identifies one scoped Student; adding a one-option selector would be a dead control.

The workflow preserves the real stale-version recovery: a concurrent edit returns the attempted/current comparison and returns focus to the editable step. Identity-steward denial remains explicit. Existing branch admission date, Student facts, enrollment history, placement transfer and archive operations remain below the correction workflow and keep their owner boundaries.

Directory links now carry a validated internal `returnTo` value. **Back to students** restores the applied search attribute, status, sort and order. The server accepts only `/admin/students` and reconstructs only known bounded query keys, so it cannot become an external redirect.

No backend facade, DTO, authorization rule, transaction, schema, migration, seed or database row changed.

## Evidence

- [Approved entry, desktop](reference-sa-20-desktop.png)
- [Approved entry, mobile](reference-sa-20-mobile.png)
- [Approved review, desktop](reference-sa-20-review-desktop.png)
- [Approved review, mobile](reference-sa-20-review-mobile.png)
- [Application before, desktop](application-sa-20-desktop-before.png)
- [Application before, mobile](application-sa-20-mobile-before.png)
- [Application after, desktop](application-sa-20-desktop-after.png)
- [Application after, mobile](application-sa-20-mobile-after.png)
- [Application confirmation, desktop](application-sa-20-confirm-desktop.png)
- [Focused navigation/visual result](browser-verification.json)

The captures were inspected for hierarchy, step/action placement, card dimensions, field alignment, mobile reflow, the long detail-page table boundary and overflow.

## Verification

- Focused ESLint, TypeScript `--noEmit` and diff checks passed.
- Production build passed and the final browser capture used build `68l10Hot-jYtqMsUIoKW9`.
- Focused local Playwright passed desktop/mobile entry, review, confirmation, Cancel/Back, query-state restoration and overflow without saving demo data.
- Dedicated-test-database Playwright passed 2/2 desktop/mobile for a real name correction, immutable revision display and stale concurrent comparison. The first run failed only because the new short `Reason` label matched the separate admission-date reason; after changing the test locator to exact matching, the same focused run passed.
- Existing real PostgreSQL authorization, idempotency, locking, rollback and stale-version evidence remains in `docs/evidence/sa-comp-04/README.md`; persistence code did not change and was not rerun.

## Remaining deviations and gates

The accepted People contract stores first and last names separately, so production does not collapse them into the reference's single “Correct display name” input. Draft ownership/persistence/resume remains unspecified and the action stays disabled. The page intentionally retains implemented Student, Enrollment and Placement panels beneath the SA-20 correction composition; the prototype does not specify their combined long-page state.

The Administrator body-font portability issue in `TYPOGRAPHY.md`, native VoiceOver/NVDA, native 200% zoom, TEN-03 enforcement and human visual acceptance remain pending.
