# Administrator Staff & access reference checkpoint

Date: 11 October 2026. Human review remains **PENDING**.

## Reference and implemented routes

The visual authority is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html`, states `#/flow/SA-13` through `#/flow/SA-17`, interpreted with the embedded Administrator implementation specifications.

| Workflow | Application route | Functional/security status | Reference comparison | Known deviation |
|---|---|---|---|---|
| SA-13 Create a staff profile | `/admin/teachers/create` | VERIFIED through the existing scoped People create command | Desktop and 390×844 entry states inspected | Durable draft/resume is not implemented. |
| SA-14 Grant staff sign-in access | `/admin/users/grant` | VERIFIED through the existing Employee-bound Access invitation command | Desktop, mobile, and success receipt inspected | Durable draft/resume is not implemented. |
| SA-15 Review invitation or resend | `/admin/users` delivery-failure section | Existing safe replacement-token recovery is VERIFIED | Reference captured; dedicated composition remains PARTIAL | The accepted command has no administrator-supplied reason/audit-reason contract, so the exact two-step reference cannot be implemented safely yet. Existing resend still revokes the old token and reports delivery honestly. |
| SA-16 Verify identity and teacher eligibility | `/admin/teachers` | Existing verified binding and current Teacher enable/disable operations are VERIFIED | Reference captured; dedicated composition remains PARTIAL | The approved card requires dated eligibility and affected-assignment conflict handling. The current Academics Teacher contract has current enabled state without `eligibleFrom`/`eligibleUntil`; this needs an owner LLD/schema/API decision before implementation. |
| SA-17 Change or revoke staff access | `/admin/users/change` | VERIFIED for current branch suspension and reinstatement with server last-admin/version guards | Desktop and mobile entry states inspected | Teacher-role removal is available only when another accepted branch role remains; durable draft/resume is not implemented. |

## Implemented composition

- SA-13 now follows the approved Staff details → Employment → Confirm composition and produces a real receipt linked to the newly created Employee.
- SA-14 uses an authorized active Employee selector, explicit non-sensitive verification reference, one fixed branch role, confirmation, and a real pending-access receipt. Unknown outcomes retain the same request key and payload.
- SA-17 stages target/change selection, reason and impact confirmation, then invokes the existing scoped membership command. The browser never supplies authority; current account, branch, roles, status, optimistic version and last-administrator coverage remain server checks.
- Existing Staff profile and Staff access pages link to the dedicated compositions without removing their established management operations.

No schema, migration, portable business rule or authorization boundary changed in this checkpoint.

## Verification

- `pnpm test:e2e test/e2e/staff-reference-workflows.spec.ts --project=chromium`: 1/1 passed through real APIs and `vyapti_vschool_test` after the production build. It creates a scoped Person/Employee, grants verified access, accepts the local-sink invitation, proves the AccountPersonBinding, then suspends and reinstates the exact membership.
- `pnpm test:e2e test/e2e/staff-reference-workflows.spec.ts --project=mobile`: 1/1 passed at 390×844 through the same persisted journey.
- An earlier command mistakenly included an extra `--`, which caused Playwright to begin the broad suite. It was stopped after one unrelated test passed and a second was interrupted; it is not reported as verification.
- The focused source lint, TypeScript and documentation checks are recorded with the checkpoint commit.

Reference and application captures in this directory are new evidence. Desktop comparison used 1440×1000. Mobile comparison used 390×844. The screenshots were inspected for shell width, heading/step hierarchy, form grid, card geometry, action placement, select sizing, receipt composition and responsive stacking. Authorized navigation contains fewer destinations than the fictional reference, as required by module and permission filtering.

Production provider review, TEN-03, native VoiceOver/NVDA and human visual acceptance remain separate gates.
