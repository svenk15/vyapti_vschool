+# SA-30 Administrator attendance reporting comparison — 11 October 2026

## Scope and authority

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/flow/SA-30`.
- Measured contract: `docs/execution/VSchool_Execution_Pack/references/approved/implementation-spec/administrator/screens/SA-30-entry.md` and workflow `administrator/workflows/SA-30.md`.
- Production route: `/admin/reports/attendance`.
- The approved HTML was served unchanged at `http://127.0.0.1:3471`. The application was exercised at `http://127.0.0.1:3400` with the documented Phase 1 release manifest.

## Result

The report entry now uses the approved three-step Report scope → Review export → Confirm composition. Desktop uses the measured 760px form and 352px guidance column; mobile reflows those regions without horizontal overflow. Heading, stepper, field grouping, card spacing, action placement, guidance copy and disabled draft action follow the approved workflow. The result state preserves the real scoped Reporting projection, server filters, totals, session rows and authorized CSV generation.

The export action now requires the approved review acknowledgement. Continue remains disabled until it is checked, confirmation shows the selected dates, and CSV generation still reauthorizes on the server. Browser Back/Forward preserves the URL-scoped report state. Invalid chronological ranges retain the selected dates and render the existing recovery alert.

No backend facade, DTO, authorization rule, query, schema, migration, database row or seed changed.

## Evidence

- [Approved entry, desktop](reference-sa-30-desktop.png)
- [Approved entry, mobile](reference-sa-30-mobile.png)
- [Approved review step, desktop](reference-sa-30-review-desktop.png)
- [Application before, desktop](application-sa-30-desktop-before.png)
- [Application before, mobile](application-sa-30-mobile-before.png)
- [Application after, desktop](application-sa-30-desktop-after.png)
- [Application after, mobile](application-sa-30-mobile-after.png)
- [Application confirmation and real report, desktop](application-sa-30-review-desktop-after.png)
- [Focused browser result](browser-verification.json)

The final screenshots were visually inspected for hierarchy, alignment, field/control proportions, action placement, responsive reflow and overflow. The entry structure now matches the reference. Real branch/account labels intentionally replace prototype names.

## Verification

- Focused ESLint: passed for the report page, export component, adjusted browser journey and demo verification script.
- TypeScript `--noEmit`: passed.
- Production `pnpm build`: passed for the final source; build ID `PfwVWTuFp7Lh9VzGQPLco`.
- Focused Playwright against the real local application: passed entry desktop/mobile, review acknowledgement gate, confirmation, CSV download, Back/Forward URL state, invalid-range recovery and mobile overflow.
- Existing owner evidence remains in `docs/evidence/ex-12/README.md`: real PostgreSQL scope, repeatable-read totals, denominator semantics, safe export, permission recheck and rollback. It was not rerun because this slice changed presentation and browser orchestration only.

## Remaining deviations and gates

Only the implemented **Session completeness** view is offered. The approved prototype also names Student attendance and Class summary, but the live Reporting contract has no bounded per-student or grouped-class projection for those views. They remain implementation gaps and were not simulated by sorting or aggregating the currently loaded page. Draft persistence/resume is also unspecified and remains visibly disabled.

The Administrator body font remains the implementation-pack portability issue documented in `TYPOGRAPHY.md`; no unapproved font was bundled. Native VoiceOver/NVDA, native 200% zoom, TEN-03 enforcement and human visual acceptance remain pending.
