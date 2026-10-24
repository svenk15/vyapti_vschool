# Attendance follow-up gap closure

Reference: `b4bbb0d028e06484f5ff00777231b1972de6d7f8`. Source comparison and matched local rendered comparison are complete; human visual acceptance remains pending.

| Gap | Implemented correction |
| --- | --- |
| Register detail hierarchy | Compact date/time/Teacher metadata, heading status, current roster count chips beside search, History beside roster heading. |
| Report sorting | Due registers available in UI and complete-result export ordering; ascending and descending unit coverage. |
| Extra export step | Direct authorized CSV download; duplicate-click lock and visible errors; existing audit and server permission preserved. |
| Missing-register drilldown | Owner-returned end time, status, Teacher, View and Done footer. Denied refresh clears protected results. |
| Request view controls | Authorized Awaiting/All counts, compact pale-selected controls. Failed counts are unavailable, not invented zeros. |
| Request review | Separate Decline/Review correction entry; required reason and consequence confirmation retained. Explanation current mark is returned only after reviewer authorization. |
| Drawer footers | Flexible body/form structure and bottom-anchored footer rules, including narrow viewport spacing. |
| Calendar controls | Centered single-month navigation; compact Period label/range/chevron; no duplicate Today action inside popup. |

All eight corrections were checked against the final reference source before packaging. Existing theme tokens, authorization, scope, command versions and exact-key recovery remain intact. No migrations are included.

## Executed checks

- 297 unit tests across 69 files passed.
- TypeScript, changed-file ESLint, backend compilation and architecture boundaries passed.
- Production build passed: `Ww_5TTJ4DSqwILVcnyPLo`.
- Patch applicability against the supplied clean baseline is checked during packaging.

## Local follow-up

The merged source passed focused real-PostgreSQL and authenticated Chromium/mobile execution. Direct comparisons were inspected at 1440×1000, 900×1000, 390×844 and 360×800; four existing themes were captured. A mobile drawer maximum-width integration defect was corrected and the affected connected mobile journey rerun. Actual 200% zoom, native screen readers, human acceptance and production gates remain pending. See `local-verified/README.md`.
