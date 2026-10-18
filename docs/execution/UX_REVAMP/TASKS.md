# UX revamp task sequence

Status values separate engineering, visual comparison, human acceptance, and production release. A completed code/test checkpoint never implies the latter three.

| Task | Outcome | Dependencies | Required evidence | State |
|---|---|---|---|---|
| UX-01 | Baseline, authority record, actual route/component inventory, source/build provenance | Current repository | Documentation validation and focused diff | VERIFIED |
| UX-02 | Four-preset semantic tokens, verified self-hosted Inter, consistent existing SVG icons, migrated shared primitives/gallery | UX-01 | Unit/style checks; gallery at desktop/mobile and four themes; computed font provenance | VERIFIED |
| UX-03 | Versioned institution theme and nullable branch override in existing appearance owner; forward migration; authorization/audit/isolation | UX-02; Branding/Access LLD delta | Real PostgreSQL defaults/backfill/inheritance/stale/replay/isolation tests; DB gates | VERIFIED |
| UX-04 | Reusable ThemePicker in supported institution/branch creation and authorized appearance settings | UX-03 | Focused unit/browser flows for selection, preview/cancel/save/conflict | VERIFIED |
| UX-05 | Server theme resolution for protected/public contexts and safe context switching/cache identity | UX-03–04 | First-paint/hydration/publication/context-switch browser tests and security negatives | VERIFIED |
| UX-06 | Shared shell plus Administrator M01–M08 priority screens using production recipes | UX-02, UX-05 | Matched reference/application desktop/mobile/intermediate captures; keyboard and representative interactions | NOT_STARTED |
| UX-07 | Teacher, Student, Parent/Guardian and Principal M01–M08 compositions | UX-06 | Cross-workspace matched captures, navigation/focus/context tests | NOT_STARTED |
| UX-08 | Four-theme route coverage, idempotent synthetic fixtures, contrast and integrated checkpoint | UX-01–07 | Required route/theme matrix, PostgreSQL/security checks, focused E2E, 4 GiB build, one real 200% journey where possible | NOT_STARTED |

## Common acceptance

- Preserve workflow behavior, URLs, live authorization, tenant/branch scope, release/entitlement/activation guards, immutable evidence, exact-key recovery, and database history.
- Use one shared presentation implementation with role-specific authorized navigation configuration. Existing Parent/Student bottom navigation remains governed by its route permissions.
- Verify equivalent reference/application states where an exact production reference exists; label explorer/pattern comparisons accurately.
- Run one build at a time and one browser worker, with desktop/mobile sequential. Reuse unchanged business evidence with source provenance.
- Update this directory and owning module state after each slice; focused commits exclude unrelated historical evidence changes.
