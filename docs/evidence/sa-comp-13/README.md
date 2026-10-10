# SA-COMP-13 / SA-14 verified Employee access evidence

Checkpoint date: 10 October 2026. Human review: **PENDING**.

## Implemented outcome

The Staff access page now leads with the approved Employee-anchored grant. An administrator selects an exact active, currently employed branch Employee, enters a fictional/example account email and a non-sensitive independent verification reference, selects Teacher and/or School administrator, confirms the scope, and issues access. Access atomically creates or rechecks the Person binding and creates the pending branch membership, fixed roles, invitation, safe evidence and durable command receipt. Email alone never establishes identity.

`HYBRID` and `EMAIL` institutions use the development mail sink after the database commit. A sanitized failed-delivery state remains visible and the existing authorized resend revokes the old token before replacement. `OPERATOR_CLI` uses the same Employee verification and atomic pending grant but creates no invitation and sends no email; the result explicitly requires the existing verified-operator activation. Same-key/same-input replay returns the stored path/state without another send; a changed input conflicts.

## Ownership, data and security

Access owns the transaction and every Access write. People publishes one framework-free enlisted port that returns only the exact active Employee/Person fact for organization, branch, Employee ID and school date. The transaction retains the existing advisory guard and account → Organization → School lock order, verified transaction context and current `SCHOOL_ADMIN` authorization. Existing unique account, binding, membership and receipt constraints close races. No schema, migration or dependency changed.

The verification reference is stored only in the restricted `PERSON_BINDING_VERIFIED` security event. Platform audit, outbox, command receipt, HTTP feedback and logs exclude it and the account email. Cross-branch, ended/future Employee, disabled/mismatched account, existing membership, mismatched binding, permission loss and replay conflict paths fail without partial grant rows.

## Verification

- Focused portable unit file: 12/12 passed, including explicit confirmation/reference validation, no redelivery on replay and OPERATOR_CLI no-email selection. The final repository checkpoint passed all 128 unit tests.
- Real PostgreSQL broad checkpoint: 120/120 passed across 17 files before the operator branch was added. The exact final-source SA-14 file then passed 6/6, proving atomic binding/membership/role/invite/evidence, scoped Employee denial, duplicate rollback, restricted-reference redaction, failed delivery persistence, same-key replay and the verified OPERATOR_CLI grant with no invite/send.
- Integrated Playwright baseline: 90/96 passed; the six failures were desktop/mobile duplicates of three test-locator assumptions introduced by the new adjacent primary action and success `status` role. Trace state showed the application mutation and persistence succeeded. The assertions were corrected without changing product behavior.
- Final focused production-build Playwright: 14/14 passed across Chromium desktop/mobile after the all-mode UI change, including operator pending access, legacy invitation acceptance/recovery, exact Employee selection, keyboard focus, pending persistence/reload, binding readback, delivery failure and resend. A subsequent exact SA-14 screenshot run passed 2/2 before the operator branch and remains valid for the unchanged email-mode composition.
- Production build completed in both Playwright runs. Final repository/static checks and seed evidence are recorded at the task checkpoint.
- `pnpm demo:seed` passed twice against guarded `vyapti_vschool`; the second run preserved all records and private credentials. It added only missing private suggested SA-14 values for the existing fictional unlinked support Employee.

Visual evidence: `employee-access-ready-chromium.png`, `employee-access-ready-mobile.png`, `employee-access-chromium.png` and `employee-access-mobile.png`. The populated form, successful pending row, narrow viewport composition and honest no-eligible-employee state were reviewed. Human visual acceptance remains pending.

Demo data is prepared by `pnpm demo:seed`. Credentials and suggested synthetic SA-14 values remain only in ignored `artifacts/people-02/private-demo.json`; secrets are not printed or committed.
