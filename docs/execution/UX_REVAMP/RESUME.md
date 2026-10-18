# UX revamp resume record

Updated: 18 October 2026 (Asia/Kolkata)

- Completed tasks: UX-01 baseline/inventory, UX-02 semantic presentation foundation, UX-03 authorized tenant theme persistence, UX-04 authorized appearance picker/settings integration, UX-05 server-rendered authorized context resolution, UX-06 shared shell plus Administrator production compositions, and UX-07 Teacher/Student/Parent/Principal compositions.
- Starting HEAD: `a2ed44ca15913d2441188e9ad5f3914d46ce1914`; UX-01 checkpoint: `b13260877e622b59f1035fd648ea7c15f7cf7517`.
- Latest verified standard build ID: `5cGXDumc0HK_gK-1zwhBrfYCHDUS`; dedicated E2E build ID: `_v-SbfIeLnp7`. Both use the repository's known 4 GiB build configuration.
- UX-03 implementation source: `fc5d1d459ab7579d85462ebb59c8caeddff77b2f`.
- UX-04 implementation source: `1045cee4bb764b73985edaf60d0b0c038fda800a`.
- UX-05 implementation source: `1157a6c9f2cce9d6b668a2cfb28b5770423c6558`.
- UX-06 implementation source: `d536d38`. Standard build ID: `ABlDRANE3itKw2m9gh8eT`; the verified demo serves this standard build at `http://127.0.0.1:3400`.
- UX-07 implementation source: `21f3a805f5e882be29c39989b13bd0311af9779a`; isolated build ID `ac6dW5CgZ3zgI80yzsZH6`. The running standard demo still serves the UX-06 build until the UX-08 integrated checkpoint replaces it.
- Schema/migrations: forward migration `20261019073000_access_tenant_theme_configuration` is applied to development and test; both have 118 migrations. Organization stores concrete `theme_id`; School stores nullable `theme_override`. Existing Branding publication history/constraints remain unchanged.
- Verification: UX-02 presentation evidence remains in [UX-02](../../evidence/ux-revamp-02-2026-10-18/README.md). UX-03 unit, real-PostgreSQL, authorization, replay, rollback, database-design and boundary evidence is in [UX-03](../../evidence/ux-revamp-03-2026-10-18/README.md). UX-04 picker, preview/cancel, save, stale recovery, keyboard and responsive evidence is in [UX-04](../../evidence/ux-revamp-04-2026-10-18/README.md). UX-05 protected/public server resolution, context switching and owner-context evidence is in [UX-05](../../evidence/ux-revamp-05-2026-10-18/README.md). UX-06 shared shell, Administrator page composition and direct comparison evidence is in [UX-06](../../evidence/ux-revamp-06-2026-10-18/README.md). UX-07 cross-workspace presentation, context, navigation and direct inspection evidence is in [UX-07](../../evidence/ux-revamp-07-2026-10-18/README.md).
- Dirty exclusions: pre-existing modified screenshots under `docs/evidence`, local `.puku-cli/`, `=`, untracked historical evidence/reference material, `docs/execution/workspace-audit.zip`, and `readiness-review.diff` are unrelated and must not be staged.
- Exact next action: implement UX-08 four-theme route coverage and integrated demo verification, preserving all owner authorization and production gates.
- Compatibility: portal configuration accepts only `forest`, `amethyst`, `porcelain`, and `linen`. Historical Branding revision `indigo`/`clay` compatibility remains public-publication read behavior until the publication owner receives a separate forward migration; it is not accepted by the new tenant theme writes.
- Gates: human visual acceptance, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03, and production release remain pending.
