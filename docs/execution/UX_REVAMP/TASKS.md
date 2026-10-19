# UX revamp task sequence

Status values separate engineering, visual comparison, human acceptance, and production release. A completed code/test checkpoint never implies the latter three.

| Task | Outcome | Dependencies | Required evidence | State |
|---|---|---|---|---|
| UX-01 | Baseline, authority record, actual route/component inventory, source/build provenance | Current repository | Documentation validation and focused diff | VERIFIED |
| UX-02 | Four-preset semantic tokens, verified self-hosted Inter, consistent existing SVG icons, migrated shared primitives/gallery | UX-01 | Unit/style checks; gallery at desktop/mobile and four themes; computed font provenance | VERIFIED |
| UX-03 | Versioned institution theme and nullable branch override in existing appearance owner; forward migration; authorization/audit/isolation | UX-02; Branding/Access LLD delta | Real PostgreSQL defaults/backfill/inheritance/stale/replay/isolation tests; DB gates | VERIFIED |
| UX-04 | Reusable ThemePicker in supported institution/branch creation and authorized appearance settings | UX-03 | Focused unit/browser flows for selection, preview/cancel/save/conflict | VERIFIED |
| UX-05 | Server theme resolution for protected/public contexts and safe context switching/cache identity | UX-03–04 | First-paint/hydration/publication/context-switch browser tests and security negatives | VERIFIED |
| UX-06 | Shared shell plus Administrator M01–M08 priority screens using production recipes | UX-02, UX-05 | Matched reference/application desktop/mobile/intermediate captures; keyboard and representative interactions | VERIFIED |
| UX-07 | Teacher, Student, Parent/Guardian and Principal M01–M08 compositions | UX-06 | Cross-workspace matched captures, navigation/focus/context tests | VERIFIED |
| UX-08 | Four-theme route coverage, idempotent synthetic fixtures, contrast and integrated checkpoint | UX-01–07 | Required route/theme matrix, PostgreSQL/security checks, focused E2E, 4 GiB build; actual-browser 200% remains a release gate because Playwright provides viewport/device-scale emulation, not browser zoom | VERIFIED |
| UX-09 | Finite presentation inventory and shared production page recipes | UX-01–08 | Extended screen map, recipe/component contract and documentation validation | VERIFIED |
| UX-10 | Remaining workspace dashboards migrated to the dashboard recipe | UX-09 | Effective-theme desktop/mobile captures; focused navigation, context and state checks | VERIFIED |
| UX-11 | Searchable directories and filter/sort/Manage surfaces | UX-10 | Representative recipe verification followed by route-family migration | NOT_STARTED |
| UX-12 | Record details, histories and return navigation | UX-11 | Representative detail/history states and affected route-family evidence | NOT_STARTED |
| UX-13 | Staged forms, confirmation, receipts and recovery | UX-12 | Retained state, validation, stale/unknown/revoked and receipt evidence | NOT_STARTED |
| UX-14 | Timetable, Attendance and assessment entry | UX-13 | Specialized desktop/mobile, keyboard and owner-regression evidence | NOT_STARTED |
| UX-15 | Settings, theme selection and public entry gaps | UX-14 | Institution creation, publication compatibility and real sign-in evidence | NOT_STARTED |
| UX-16 | Integrated M01–M08 presentation regression | UX-09–15 | Five-workspace route/state matrix, focused functional regressions and final 4 GiB build | NOT_STARTED |

## Common acceptance

- Preserve workflow behavior, URLs, live authorization, tenant/branch scope, release/entitlement/activation guards, immutable evidence, exact-key recovery, and database history.
- Use one shared presentation implementation with role-specific authorized navigation configuration. Existing Parent/Student bottom navigation remains governed by its route permissions.
- Verify equivalent reference/application states where an exact production reference exists; label explorer/pattern comparisons accurately.
- Run one build at a time and one browser worker, with desktop/mobile sequential. Reuse unchanged business evidence with source provenance.
- Update this directory and owning module state after each slice; focused commits exclude unrelated historical evidence changes.
