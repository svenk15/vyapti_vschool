# UX-03 tenant theme persistence

Engineering implementation is VERIFIED at `fc5d1d459ab7579d85462ebb59c8caeddff77b2f`; human review is PENDING. This slice adds Access-owned, versioned authenticated-portal theme configuration. It does not add the picker UI or change server-rendered workspace/public branding; those are UX-04 and UX-05.

## Contract and migration

- `vs_access_organization.theme_id varchar(20) NOT NULL DEFAULT 'forest'` stores the concrete institution selection and backfills existing institutions to Forest.
- `vs_access_school.theme_override varchar(20) NULL` stores an explicit branch override; `NULL` retains inheritance and literal `forest` is distinct.
- Both columns reject values outside `forest`, `amethyst`, `porcelain`, and `linen`. Primary/scoped keys serve reads; no value index was added.
- Forward migration `20261019073000_access_tenant_theme_configuration` is applied to both local `vyapti_vschool` and `vyapti_vschool_test`. Applied migration history was not edited.
- Access owns these tenant rows and writes them. Branding continues to own immutable draft/publication and public sign-in projection; a portal update cannot publish public branding.

## Authorization and evidence

Institution reads/updates require a current active Institution Administrator grant. Branch editable reads/updates require a current active School Administrator membership, the existing `branding.manage` authority. Effective branch reads accept a current authorized Access workspace membership. Parent/Student owner-authorized rendering composition remains UX-05 work; browser scope alone is not accepted.

Writes use existing lock order, expected configuration version, stable command key, protected receipt replay and one transaction for the tenant row plus configuration change, tenant receipt and outbox. Evidence records actor, scope, previous/new named selection and version without CSS or arbitrary style values. Revoked identity cannot disclose an earlier receipt. Invalid legacy reads fall back to Forest with a process-bounded non-sensitive diagnostic; invalid writes fail before persistence.

## Verification

- `pnpm exec vitest run --config vitest.config.ts test/unit/access-appearance.test.ts` — 2 passed.
- `pnpm test:functional test/functional/institution-context.test.ts` — 10 passed against real PostgreSQL. Covered default/backfill, inheritance, explicit Forest, institution changes, clearing, optional creation values, constraints, stale version, exact replay, changed-payload conflict, cross-tenant denial, rollback and receipt reauthorization.
- `pnpm check:db-design` — passed with 204 registered table contracts.
- `pnpm check:backend` and `pnpm check:boundaries` — passed.
- `pnpm lint`, `pnpm typecheck`, `pnpm check:docs`, and `git diff --check` — passed for the implementation checkpoint; focused ESLint/backend/docs were rerun after the final test/evidence adjustment.
- The first functional wrapper attempt used `--`, causing an unrelated functional file to start. It was interrupted after that file passed; no full-suite result is claimed. The corrected filename-only invocation ran the intended Access spec.

No visual comparison is applicable to this persistence-only slice. UX-04 must provide picker interaction evidence, and UX-05 must provide first-paint/context/publication evidence. TEN-03, native accessibility, human acceptance and production release remain pending.
