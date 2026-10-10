# SA-COMP-09 — non-binding capability interest

SA-08 now records an immutable School Administrator expression of interest for Attendance, Family portal, Fees & payments or Transport. It is visible in current-branch history and to a currently authorized institution reviewer. Submission changes no entitlement, release, activation, purchase or payment state.

The Tenancy facade validates the exact catalog choice, normalized 5–1000 character need and UUID idempotency key. PostgreSQL reauthorizes active account, institution, branch and `SCHOOL_ADMIN` membership under the existing verified branch context and account → Organization → School lock order. CapabilityInterest, a minimal receipt containing only its ID, and a free-text-free outbox envelope commit atomically. Same-key/same-input replay returns the original; changed input conflicts. Forward migration `20261010012000_capability_interest` is applied to `vyapti_vschool` and `vyapti_vschool_test`; its BRANCH Path A policy contract is registered for TEN-03.

Verification on 10 October 2026:

- `pnpm lint`, `pnpm typecheck`, `pnpm check:db-design` (53 contracts), `pnpm check:backend`: passed.
- `pnpm test:functional test/functional/tenancy-modules.test.ts`: 11/11 passed against real `vyapti_vschool_test`, including replay conflict, institution review, revoked membership denial, safe outbox and unchanged entitlement/activation counts. The first focused run found an invalid last-admin test setup; application enforcement correctly rejected it, the fixture was corrected, and the unchanged implementation passed.
- `pnpm test:e2e test/e2e/tenancy.spec.ts --grep "module configuration"`: 2/2 desktop/mobile passed through the real API. Screenshots `artifacts/sa-08-chromium.png` and `artifacts/sa-08-mobile.png` were inspected for hierarchy, containment and status copy.
- Production build was exercised by the Playwright runner and passed before the focused browser journey; final standalone `pnpm build` also passed. `pnpm check` passed 120/120 unit tests and every static/architecture/documentation gate. Guarded `pnpm demo:seed` replayed successfully without replacing credentials or manual records.

Tested implementation commit: `72aaa1a`. The current local production server is healthy at `http://127.0.0.1:3400`; `/sign-in` returned HTTP 200. Credentials stay in ignored `artifacts/people-02/private-demo.json`; the seed's stable interest key stays in ignored `artifacts/tenancy-02/private-interest.json`.

Human review: PENDING. TEN-03 RLS and native accessibility release gates remain outstanding.
