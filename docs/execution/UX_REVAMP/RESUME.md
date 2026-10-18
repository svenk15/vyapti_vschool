# UX revamp resume record

Updated: 18 October 2026 (Asia/Kolkata)

- Completed tasks: UX-01 baseline/inventory, UX-02 semantic presentation foundation, and UX-03 authorized tenant theme persistence.
- Starting HEAD: `a2ed44ca15913d2441188e9ad5f3914d46ce1914`; UX-01 checkpoint: `b13260877e622b59f1035fd648ea7c15f7cf7517`.
- Latest verified isolated build ID: `T3DqzOo_E2m5evJmzBHGd` with the repository 4 GiB build configuration.
- UX-03 implementation source: `fc5d1d459ab7579d85462ebb59c8caeddff77b2f`.
- Schema/migrations: forward migration `20261019073000_access_tenant_theme_configuration` is applied to development and test; both have 118 migrations. Organization stores concrete `theme_id`; School stores nullable `theme_override`. Existing Branding publication history/constraints remain unchanged.
- Verification: UX-02 presentation evidence remains in [UX-02](../../evidence/ux-revamp-02-2026-10-18/README.md). UX-03 unit, real-PostgreSQL, authorization, replay, rollback, database-design and boundary evidence is in [UX-03](../../evidence/ux-revamp-03-2026-10-18/README.md).
- Dirty exclusions: pre-existing modified screenshots under `docs/evidence`, local `.puku-cli/`, `=`, untracked historical evidence/reference material, `docs/execution/workspace-audit.zip`, and `readiness-review.diff` are unrelated and must not be staged.
- Exact next action: implement UX-04 with one reusable ThemePicker in institution/branch creation and existing authorized appearance settings. Preserve form draft values during preview, persist only through UX-03 owner commands, and verify cancel, save, stale and keyboard/mobile flows.
- Compatibility: portal configuration accepts only `forest`, `amethyst`, `porcelain`, and `linen`. Historical Branding revision `indigo`/`clay` compatibility remains public-publication read behavior until the publication owner receives a separate forward migration; it is not accepted by the new tenant theme writes.
- Gates: human visual acceptance, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03, and production release remain pending.
