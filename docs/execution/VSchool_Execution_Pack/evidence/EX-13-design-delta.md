# EX-13 design delta — coherent local demo fixtures

Date: 10 October 2026

- **Target:** one guarded `pnpm demo:seed` run prepares the implemented administrator and teacher journeys using the existing feature-owned provisioners and `artifacts/people-02/private-demo.json` personas.
- **Ownership:** Access provisions identities and credentials; People owns employees/teacher eligibility; Academics owns calendar/offering/assignment; Students owns enrollment; Attendance owns sessions/rosters/records; Branding owns publication. The orchestrator performs no business-table write.
- **Fresh-seed calendar:** only a newly created synthetic calendar may add a school-level teaching exception for the seed run's school-local date when it falls outside the Monday–Friday demo week. Existing calendars and revisions remain unchanged.
- **Connected date:** Attendance records the best existing non-future date whose seed-owned session IDs still resolve to the synthetic offering and assigned teacher. The date and session IDs are non-secret fixture metadata; credentials remain private and ignored.
- **Idempotency:** existing command keys, credentials, records and manual outcomes are reused. Existing submissions/cancellations are never rewritten. Repeated runs may fill missing seed-owned IDs but do not reset, delete or replace rows.
- **Failure behavior:** the local database guard runs before child processes. A failed provisioner stops the chain and reports its stage while preserving prior data. Sandbox connection denial is not reported as a product failure.
- **Verification:** run `pnpm demo:seed` twice against guarded `vyapti_vschool`; verify the same personas and connected date/session IDs; use a focused real-browser administrator-to-teacher-to-report journey. No schema or migration change.

Resolved decision: teacher-day queries correctly reject future dates, so the walkthrough uses a recorded current/historical teaching date. A fresh synthetic school receives a seed-owned current-day calendar exception when needed before any sessions exist. Production calendars are never changed for demo convenience.
