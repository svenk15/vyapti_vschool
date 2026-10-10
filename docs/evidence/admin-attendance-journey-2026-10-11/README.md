# Administrator daily-attendance journey — 11 October 2026

Human visual acceptance is **PENDING**. This checkpoint does not complete TEN-03, native accessibility, or production-release gates.

## Scope and source

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html`, states `#/home`, `#/flow/SA-26`, and `#/flow/SA-27`. The prototype review bar was hidden for comparison; reference content was not edited.
- Application: `/admin` and `/admin/attendance/sessions/:id` using real authorized synthetic records.
- Milestone: sign in → Today → submitted session → correction with reason and explicit review → confirmation/history → reload persistence → Today.
- Schema/migrations: none. Existing authorization, transaction, lock, optimistic-version, receipt, audit, and replay boundaries remain authoritative.

## Measured visual specification

At 1440 × 1000 CSS pixels, the reference and application both render a 240 px sidebar, 60 px top bar, and 1,136 px content span. The reference uses a 28 px/35 px heading at weight 650, 22 px card padding, 714 px two-column form grid, and 40–41 px controls. The application attendance variant now uses a 28 px/35 px heading at weight 650, 24 px cards, a 714 px correction form, 40 px row controls, 12 px table text, 10 px table headings, and the approved compact spacing. The 2 px card-padding difference reflects the production shared card recipe and remains visible in the overlay.

Chromium's platform-font inspection on macOS reported `.SF NS` for reference and application headings. The reference navigation reports bundled custom `Nimbus Sans`; the application navigation renders the established macOS system fallback. Redistribution authority for Nimbus Sans has not been established, so this remains a declared typography deviation rather than an unlicensed asset copy. Exact computed values, bounds, font results, session ordering, overflow reports, and recovery assertions are in `measurements.json`.

## Behavior verified by the focused browser journey

- A committed correction response was deliberately lost; the UI retained and replayed the exact payload/key, returned the original result, and did not create a duplicate revision.
- A confirmed correction followed by a 503 history read stayed confirmed; `Refresh history` recovered the read without repeating the mutation.
- A forced stale-version response retained the attempted change, loaded current records, required review and confirmation, then submitted a new command against the current version.
- Reload showed persisted current values and immutable history; returning to Today preserved the same three session rows and did not increase the submitted-session count.
- A correction draft disabled cancellation. An unknown cancellation locked its reason while leaving exact-request retry usable; the local probe did not commit the destructive cancellation.
- Desktop, mobile, mobile navigation, and Chromium page-scale-factor 2.0 had no document-level horizontal overflow. The mobile 700 px register remains intentionally scrollable within its contained card.

## Captures

- Reference: `reference-today-desktop.png`, `reference-sa-26-desktop.png`, `reference-sa-27-desktop.png`, `reference-sa-27-mobile.png`.
- Application: `application-today-desktop.png`, `application-register-before-desktop.png`, `application-correction-draft-desktop.png`, `application-correction-unknown-desktop.png`, `application-saved-history-unavailable-desktop.png`, `application-correction-stale-desktop.png`, `application-register-final-desktop.png`, `application-cancellation-unknown-desktop.png`, `application-today-after-desktop.png`, `application-today-mobile-navigation.png`, `application-register-final-mobile.png`, and `application-register-200-percent.png`.
- Comparison: `reference-application-overlay.png` and `reference-application-diff.png`. These compare equal 1440 × 1000 captures without masks. They diagnose composition differences; their aggregate pixels are not treated as acceptance.

## Discrepancy record

| Reference | Earlier application | Correction | Result |
| --- | --- | --- | --- |
| 28 px/650 attendance heading | 30 px/600 shared heading | Attendance page variant uses 28 px/35 px/650 | Measured |
| Compact register without repeated visible field labels | Generic row form labels enlarged each row | Labels remain accessible but visually hidden; 40 px controls and compact table typography | Inspected desktop/mobile |
| Explicit stale/unknown guidance | Retained retry could be disabled; stale edits could be lost | Explicit command states, exact retry, current/attempt comparison, reconfirmation | Browser verified |
| Saved mutation distinct from history read | History failure could make save appear unconfirmed | Separate history alert and read-only refresh | Browser verified |
| Destructive action separated from correction | Competing commands could remain actionable | Draft/in-flight/unknown states mutually lock actions; retry remains usable | Browser verified |
| Mobile register remains within page | Table descendants propagated document overflow | Paint-contained card retains its own horizontal scroller | 390 × 844 measured |
| 40 px desktop primary action | Attendance inherited the shared 44 px action height | Attendance CTAs now measure 40 px with 8 × 14 px padding; mobile retains a 44 px target | Computed desktop/mobile bounds |
| Saved confirmation can be dismissed | Confirmation had no close action | Added a 40 px accessible close control labelled “Close correction saved message” | Focused Playwright open/close check and `application-correction-saved-dismissible.png` |

Remaining deviations: the live page represents the complete real register rather than the prototype's three-step simulated form; it therefore shows summary, all frozen students, current values, history, and cancellation together. This is required by the accepted attendance contract. Nimbus Sans is not copied into production. Native VoiceOver/NVDA evidence remains outstanding.

## Verification

- `node scripts/verify-admin-attendance-local.mjs` — passed against the development PostgreSQL-backed server; all six recovery assertions true.
- `pnpm test:functional test/functional/attendance-sessions.test.ts` — 10/10 passed against `vyapti_vschool_test`; 38 migrations present and none pending.
- `pnpm demo:seed` — passed twice before final verification; the second run preserved the submitted correction occurrence without overwriting attendance records.
- `pnpm check` — passed: lint, generated route types, TypeScript, documentation (30 tasks), 54 database contracts, boundaries, portable backend compilation, and 128/128 unit tests.
- `pnpm build` — passed with Next.js 16.3.8 using the repository's webpack production build.
- `git diff --check` — passed before checkpoint review.

The CTA/dismiss-control follow-up passed focused ESLint, TypeScript, and Playwright verification. The browser measured 40 px desktop primary/secondary CTAs, a 40 px dismiss target, and a 44 px mobile primary target. The correction response was mocked for this presentation-only check, so no attendance record or revision was written.
