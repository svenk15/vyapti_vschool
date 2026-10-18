# UX revamp current state

Updated: 18 October 2026 (Asia/Kolkata)

| Task | Engineering | Visual comparison | Human acceptance | Production |
|---|---|---|---|---|
| UX-01 | VERIFIED | NOT_APPLICABLE | PENDING | BLOCKED_BY_RELEASE_GATES |
| UX-02 | VERIFIED | AUTOMATED_INSPECTION_COMPLETE | PENDING | BLOCKED_BY_RELEASE_GATES |
| UX-03 | VERIFIED | NOT_APPLICABLE_PERSISTENCE_SLICE | PENDING | BLOCKED_BY_RELEASE_GATES |
| UX-04–UX-08 | NOT_STARTED | NOT_STARTED | PENDING | BLOCKED_BY_RELEASE_GATES |

## Baseline

- Repository HEAD at start: `a2ed44ca15913d2441188e9ad5f3914d46ce1914` on `work/stu-01-after-per02-wip`.
- Existing build ID observed: `6HsxC8NaJEOapzYcQQBcg`; it predates this UX revamp and is recorded only as baseline provenance.
- Source contains 203 actual `page.tsx` routes. [SCREEN_MAP.md](SCREEN_MAP.md) inventories them from the working tree.
- Existing Branding already owns immutable draft/publication, exact branch/institution scope, public projection, authorization, audit/receipt, and branch-published-over-institution-published resolution. It currently supports legacy `forest/indigo/clay` palettes. UX-03 must reconcile this without a parallel store or migration rewrite.
- Existing protected shells resolve published palette server-side for Administrator, Teacher, and Principal. Student/Parent have separate frame compositions that UX-07 must migrate without changing destinations or authority.
- The working tree already contains unrelated modified historical evidence and local untracked material. They are excluded from UX commits.

## Verification

UX-01 documentation validation passed with `pnpm check:docs`: 30 indexed tasks, valid links, design coverage, statuses, and acyclic dependencies. The inventory contains all 203 current `app/**/page.tsx` routes plus the actual shared-shell owners. No application tests, builds, migrations, or browser captures were required for this documentation-only slice. Existing business evidence remains historical evidence for its tested source and is not relabelled as UX revamp verification.

UX-02 adds the four exact semantic token sets, official locally served Inter 4.1 assets, validated theme identifiers, legacy read projection, shared SVG menu/close/empty icons, and revised shared control/table/form geometry. Unit theme validation, backend boundary checks, type checking, real-PostgreSQL branding publication/concurrency/revocation tests, and the 4 GiB production build passed. Focused Playwright passed separately at 1440×1000 and 390×844 for all four themes with computed Inter, keyboard/negative states, and root-overflow checks. The first mobile run exposed shared form-grid overflow; the final source fixes it with zero-width-minimum grid tracks and a bounded table scroll region. Captures were visually inspected for hierarchy, token application, responsive stacking, contained table scrolling, and consistent states. See [UX-02 evidence](../../evidence/ux-revamp-02-2026-10-18/README.md).

UX-03 adds one concrete Access-owned institution theme and one nullable branch override with allowed-value constraints and forward-only migration. Institution and branch creation accept validated optional selections. Framework-independent use cases expose effective/editable reads plus versioned institution/branch updates; current institution/branch appearance authority, lock order, replay protection and atomic tenant evidence are preserved. Both designated local databases have all 118 migrations. Focused unit 2/2 and real-PostgreSQL Access 10/10 passed with defaults, inheritance, explicit Forest, clearing, stale/replay/isolation, rollback and revoked-receipt coverage. See [UX-03 evidence](../../evidence/ux-revamp-03-2026-10-18/README.md).

## Open release gates

Human visual acceptance, native VoiceOver/NVDA, actual-browser 200% zoom evidence, TEN-03 restricted-role/RLS proof, provider/deployment configuration, real-client data authorization, and production release remain pending.

## Next action

Implement UX-04: add the reusable accessible ThemePicker to supported institution/branch creation and existing authorized appearance settings, with local preview/cancel, version conflict, failure retention and focused browser evidence. UX-03's owner commands are the only persistence path.
