# SA-COMP-03 verification

Workflow SA-15 is implementation VERIFIED at `cc30b6d3c85d162b3a63db59655258cf50e70286`; human review is PENDING. The established IAM-04 owner implementation already provided sanitized failure projection and authorized replacement-token behavior. This closure adds the missing browser proof through the real `/admin/users` action. No production code, schema, migration or seed changed.

Evidence:

- The existing real PostgreSQL `staff-invitations` suite passed 3/3 in the latest broad 108/108 functional run. It proves the failed invite is visible through the branch projection, resend creates a distinct token hash and revokes the prior invite, only the replacement can be accepted, and inviter authority is checked again.
- The first combined IAM-04 browser run passed six existing desktop/mobile cases; the new journey failed because its locator stopped at the section-header wrapper. The product behavior was present. After selecting the owning card, `pnpm test:e2e test/e2e/iam04.spec.ts --grep 'real recovery action'` passed 2/2 across desktop and 390px mobile.
- The journey uses the deterministic local-only `@mail-fail.vschool.example` sink path. It verifies the allowlisted message, visible failure row, real resend action, two database invitations, old revocation, distinct hashes, replacement failure state and no page-level horizontal overflow. It sends no network message and does not expose either token.

Rendered inspection:

- [Desktop invitation recovery](invitation-recovery-chromium.png)
- [Mobile invitation recovery](invitation-recovery-mobile.png)

The desktop card hierarchy cleanly separates issuance, delivery recovery and staff membership. Mobile stacks the recovery action and keeps the wide directory in its established internal scroll region. Full-page capture visually repeats fixed navigation chrome; the tested viewport itself has no page-level overflow.

Manual review remains PENDING. Sign in as the synthetic administrator, open `/admin/users`, invite a unique fictional `@mail-fail.vschool.example` address, and expect the sanitized failure card. Select **Resend invitation** and expect the deterministic safe failure again. Production-provider review remains an outstanding release gate.

Demo: http://127.0.0.1:3444 with the local-only development sink enabled. Health reported ready and `/sign-in/vschool-demo-69a6f7fe` returned 200. Private credentials remain in ignored `artifacts/people-02/private-demo.json`.
