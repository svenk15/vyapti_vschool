# UX-11 Staff directory presentation checkpoint

Date: 19 October 2026 (Asia/Kolkata)

## Scope and provenance

- Base source: `7f655c1`.
- Executable product source: the focused commit containing this record.
- Production build ID: `Wxv6cwqzH2nCCzA8xnW_N` (`NODE_OPTIONS=--max-old-space-size=4096 pnpm build`).
- Application route: `/admin/teachers`.
- Exact approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/staff`.
- Screen contract: `docs/execution/VSchool_Execution_Pack/references/approved/implementation-spec/administrator/screens/module-staff.md`.
- Schema and migrations: unchanged. This is a presentation-only slice over existing People, Access and Academics contracts.

## Direct comparison

The unmodified approved HTML and the current application were captured at matching CSS viewports. The four captures were directly inspected rather than treated as assertion-only evidence.

| State | Desktop 1440×1000 | Mobile 390×844 |
|---|---|---|
| Approved reference | [reference-desktop.png](reference-desktop.png) | [reference-mobile.png](reference-mobile.png) |
| Current application | [application-desktop.png](application-desktop.png) | [application-mobile.png](application-mobile.png) |
| Manage dialog | [application-manage-desktop.png](application-manage-desktop.png) | [application-manage-mobile.png](application-manage-mobile.png) |

The corrected application now uses a directory-first page, a dedicated **Add staff** action, compact search and rows, one **Manage** action per person, and a bounded accessible management dialog. Mobile rows become labelled cards. Visual inspection found and corrected a first-pass mobile defect that constrained staff names to the desktop first-column width.

## Supported-scope differences

- **Staff access** remains a secondary page action because `/admin/users` is an independently protected, implemented destination.
- The table presents actual Staff category, Employment, Access and Teaching states. It does not copy fictional reference responsibility data.
- The current People query supports server-backed name/staff-number search and signed cursor pagination. It has no approved server filter or sort fields, so this slice does not add client-only filtering or sorting. That query-contract gap remains within the wider UX-11 directory family.
- The live permission-filtered sidebar retains all authorized destinations and may therefore contain more entries than the static workflow reference.
- Prototype-only review controls are intentionally absent.

## Verification

- Focused ESLint for the Staff screen and browser journey: passed.
- `pnpm typecheck`: passed.
- Focused real-PostgreSQL Playwright journey: Chromium 1/1 and Mobile Chromium 1/1, run sequentially with one worker. It covers server-backed setup, duplicate/invalid failures, category change, teaching enablement, verified account binding conflict/success, employment end, responsive layout and root overflow.
- Production build with the repository's established 4 GiB Node heap: passed; build ID `Wxv6cwqzH2nCCzA8xnW_N`.
- Current-source capture checks: mobile menu focus return and root overflow passed at both viewports.
- `git diff --check`: passed before documentation finalization and is rerun at checkpoint.

An initial Playwright command used the repository wrapper's separator incorrectly and began the broad suite. It was stopped after one unrelated passing test and is not counted as verification. The corrected focused invocations above are the recorded evidence.

Human visual acceptance remains **PENDING**. Native VoiceOver/NVDA, actual-browser 200% zoom, TEN-03 and production release gates remain pending.
