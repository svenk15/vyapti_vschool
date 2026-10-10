# SA-COMP-14 — SA-07 branch branding publication delegation

Implementation checkpoint: 10 October 2026. Human review remains PENDING.

Institution administrators can grant and revoke publication for an eligible active SCHOOL_ADMIN in the current branch. The grant is Branding-owned and does not change fixed roles or other capabilities. Delegates cannot grant onward. Publish and rollback recheck the live account, membership, branch and institution/delegation authority inside the existing serializable command transaction; revocation therefore denies a stale open page before receipt disclosure or publication.

Migration `20261010015000_branding_publication_delegation` adds the scoped delegation, optimistic version, grant/revocation actors and indexes. It was applied forward-only to `vyapti_vschool` and independently by the test harness to `vyapti_vschool_test`; both report 38 migration files with none pending during the focused runs. The table is registered as BRANCH under TEN-ADR-006 Path A and remains part of the TEN-03 enforcement gate.

Verification on the implementation source before commit:

- `pnpm typecheck` passed.
- Focused ESLint passed for the changed application, server, UI and tests.
- `pnpm test:functional test/functional/branding-publication.test.ts` passed 3/3 using real PostgreSQL. It covers branch grant/revoke, replay, eligibility, onward-delegation denial, role isolation and stale-page denial.
- `pnpm test:e2e test/e2e/branding-management.spec.ts` passed 4/4 across desktop and mobile after inspecting the first failure. The product correctly rendered the revocation error; the test was corrected from the success `status` role to the danger `alert` role.
- The Playwright production build passed as part of the focused run.

Manual review: sign in as the institution administrator, open `/admin/branding`, grant an eligible school administrator under **Publication access**, and confirm the delegate can publish only this branch. Keep the delegate page open, revoke them from the administrator page, then try publishing from the stale delegate page; expect **Branding change failed** and no new public revision. Confirm the delegate sees no publication-access controls and retains only the existing draft/read operations. Human acceptance is not inferred.
