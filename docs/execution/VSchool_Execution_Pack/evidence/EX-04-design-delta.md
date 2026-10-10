# EX-04 design delta — real school sign-in and account entry

## Intended demo outcome

An administrator or teacher recognizes the generic or published school entry, signs in with the school-issued account, and reaches only the workspace permitted by current server authorization. Invalid credentials, unavailable teaching capability, generic recovery, and invalid/expired invitation states remain safe and actionable.

## Workflow and reference mapping

- Approved references: School Administrator `#/sign-in` and Teacher `#/sign-in` in the pinned approved HTML files.
- Production routes: `/sign-in`, `/sign-in/[school]`, `/account`, `/activate`, `/invite`, `/forgot-password`, `/reset-password`.
- Covered workflow subsets: SA-01–SA-03 and TEA-01–TEA-04. SA-02 and TEA-02 reuse the verified global activation/recovery contract. Branch choice/session-management portions of the other workflows remain partial and are recorded in the workflow matrix.

## Contract decision

No new business operation or transport contract is required. `AccessLogin` continues through NextAuth credentials and `/account`; `accountGateway.getHome`, `contextGateway.getContexts`, and `moduleGateway.canUseAtScope` determine the current authorized landing presentation. Published branding remains a public recognition read and never grants access. Activation, invitation and reset tokens retain their existing fragment/one-time handling and Access owner transactions.

The presentation change uses `AuthLayout`, the published-brand `LoginPreview`, shared form/button/alert primitives, and `TeacherPortalFrame`. A teacher receives the teaching shell only when the live home capability and Attendance module/capability check both succeed. A TEACHER role without usable Attendance remains on the safe account state with no teaching navigation.

## Persistence and security

No schema, migration, write sequence, lock, idempotency scope or seed changed. Existing reads and commands retain the Access-owned tables `vs_access_user_account`, `vs_access_school_membership`, `vs_access_role_grant`, `vs_access_account_activation`, `vs_access_invite`, and `vs_access_password_reset_token`, plus current Organization/School context. Passwords and fragment tokens are cleared after failed terminal submissions; email remains available for correction. Credential rejection and recovery initiation remain non-enumerating. Server-side account, membership, branch, capability, module and resource checks remain active.

## Focused verification

- Generic and published-brand entry at desktop/mobile.
- Administrator landing, teacher permitted/unavailable account state, sign-out, membership suspension and token-version revocation.
- Generic wrong/unknown/locked/disabled credential feedback and password clearing.
- Same-origin/CSRF and request-size rejection through unchanged adapters.
- Generic unknown-account recovery response with retained email and focused feedback.
- Invalid/expired invitation clears fragment/password material and focuses recovery guidance.
- Existing successful password reset invalidates the old session and existing invite acceptance activates only its scoped membership.

No database or application interface change was needed, so the existing Access DESIGN sequence diagrams and transaction contracts remain authoritative.
