# Restricted support current state

Last updated: 19 October 2026.

Status: **F14 / LEA-37 / LEA-38 ENGINEERING_COMPLETE / HUMAN_REVIEW_PENDING**.

D16 is approved for synthetic-only implementation. The narrow LLD now fixes Support ownership, use of the existing `health` availability gate, explicit resource/purpose grants, a Students-owned pupil-context port, protected narrative separation, versioned school procedure and minimal urgent handoff semantics. No production policy, break-glass rule, emergency number, provider or retention period has been invented.

Implemented outcome: the Support owner now provides exact Student-scoped referral grants, separately designated specialists and policy stewards, a status-only sender projection, protected specialist narrative, immutable procedure versions and minimal restricted handoff receipts. The Principal, Teacher specialist and Administrator steward routes use the existing production shells. Sender replay/status reads reauthorize before disclosure, and losing the specialist grant immediately removes the protected narrative.

Persistence: forward migration `20261019030000_support_restricted_owner` adds five `vs_support_*` tables; `20261019031000_support_path_a_contract_comments` adds the canonical Path A metadata without changing schema or rows. Both were applied to both designated databases, which now contain 105 migrations. The table registry classifies the tables as BRANCH Path A tables whose RLS closure remains at TEN-03. No database was reset and no applied migration was edited.

Verification on the worktree based on `154427c`: unit 3/3; focused real-PostgreSQL 3/3; Playwright 2/2 Chromium and 2/2 mobile with one worker; Prisma validation/generation, TypeScript and focused lint passed. The current-source 4 GiB E2E build passed. `pnpm demo:seed` integration is non-destructive; the focused Support seed was also run twice without duplicates. Direct comparison and captures are recorded in `docs/evidence/principal-lea-37-38-support-2026-10-19/`.

Limitations: D16 remains synthetic-only. The application does not claim diagnosis, treatment, emergency monitoring or assistance. Real school policy/contact configuration, retention/disclosure review, TEN-03, font portability, native accessibility, actual 200% browser zoom, provider/release review and human acceptance remain pending.

Next action: preserve this checkpoint and continue the next independently eligible Principal foundation.
