# UX revamp resume record

Updated: 18 October 2026 (Asia/Kolkata)

- Completed tasks: UX-01 baseline/inventory, UX-02 semantic presentation foundation, UX-03 authorized tenant theme persistence, and UX-04 authorized appearance picker/settings integration.
- Starting HEAD: `a2ed44ca15913d2441188e9ad5f3914d46ce1914`; UX-01 checkpoint: `b13260877e622b59f1035fd648ea7c15f7cf7517`.
- Latest verified standard build ID: `25NBbpsTn67f5AETamINY`; dedicated E2E build ID: `HBOP0QRmwfI4njSjYp1EX`. Both use the repository's known 4 GiB build configuration.
- UX-03 implementation source: `fc5d1d459ab7579d85462ebb59c8caeddff77b2f`.
- UX-04 implementation source: `1045cee4bb764b73985edaf60d0b0c038fda800a`.
- Schema/migrations: forward migration `20261019073000_access_tenant_theme_configuration` is applied to development and test; both have 118 migrations. Organization stores concrete `theme_id`; School stores nullable `theme_override`. Existing Branding publication history/constraints remain unchanged.
- Verification: UX-02 presentation evidence remains in [UX-02](../../evidence/ux-revamp-02-2026-10-18/README.md). UX-03 unit, real-PostgreSQL, authorization, replay, rollback, database-design and boundary evidence is in [UX-03](../../evidence/ux-revamp-03-2026-10-18/README.md). UX-04 picker, preview/cancel, save, stale recovery, keyboard and responsive evidence is in [UX-04](../../evidence/ux-revamp-04-2026-10-18/README.md).
- Dirty exclusions: pre-existing modified screenshots under `docs/evidence`, local `.puku-cli/`, `=`, untracked historical evidence/reference material, `docs/execution/workspace-audit.zip`, and `readiness-review.diff` are unrelated and must not be staged.
- Exact next action: implement UX-05 server-side effective-theme resolution across protected and published public contexts. Preserve generic Forest entry and prove branch/child/Student context transitions cannot reuse stale theme or unpublished appearance.
- Compatibility: portal configuration accepts only `forest`, `amethyst`, `porcelain`, and `linen`. Historical Branding revision `indigo`/`clay` compatibility remains public-publication read behavior until the publication owner receives a separate forward migration; it is not accepted by the new tenant theme writes.
- Gates: human visual acceptance, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03, and production release remain pending.
