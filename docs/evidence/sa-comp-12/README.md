# SA-COMP-12 / SA-18 admission-date evidence

Checkpoint date: 10 October 2026. Human review: **PENDING**.

## Implemented outcome

Manual and roster-import Student creation now require an explicit school-local branch admission date. `vs_students_student` stores the date plus verifier, verification instant and reason. Existing rows remain nullable and visibly unverified; an authorized administrator can populate or correct the date with an expected Student version, reason and idempotency key. The operation does not alter Person identity, yearly Enrollment, SectionPlacement, Attendance records or reports.

The detail screen distinguishes verified and legacy-unverified records. The registration dialog explains that branch admission differs from enrollment/transfer dates. Import schema `STUDENT_ROSTER_V1` now requires `admitted_on`; the 2 MiB upload contract is unchanged. The seed creates a new fictional `DEMO-SA18-DATE` record and versioned CSV samples while preserving earlier files and records.

## Persistence and security

Forward migration `20261010014000_student_admission_date` adds nullable `admitted_on`, `admission_date_verified_at`, `admission_date_verified_by` and `admission_date_verification_reason`, a coherent-evidence check and verifier FK. It was applied to guarded local `vyapti_vschool` and `vyapti_vschool_test`; both reported 37 migrations with none pending. No backfill, reset or migration rewrite occurred.

Every read/write retains current account, institution, branch, release, entitlement, activation and `student.manage` authorization. Mutation locking remains account → Organization → School. Correction uses Student-version CAS and atomic Platform receipt/audit/outbox evidence. TEN-03 database RLS remains deferred and incomplete.

## Verification

- Focused unit: final Students and Imports passed 10/10, covering required/real civil dates, correction version/reason and the explicit CSV field.
- Real PostgreSQL: Students passed 13/13, covering required/future dates, verified create, nullable legacy read, correction, replay, stale/cross-scope denial, safe evidence and unchanged Enrollment/Attendance counts. Imports passed 11/11 in the preceding focused combined run, including explicit date persistence and transactional registration.
- Browser: registration, correction, authorization, import preview/process/replay/cancellation passed 10/10 across Chromium desktop/mobile. The final Student screenshot rerun passed 6/6, followed by a focused top-of-page desktop/mobile capture at 2/2.
- Seed: `pnpm demo:seed` passed twice. The second run preserved the new records and `sample-roster-v2.csv` / `sample-roster-partial-v2.csv` without duplicates.
- Repository checkpoint: `pnpm check` passed lint, generated route/TypeScript types, documentation, 53-table database design, extraction boundaries, backend compile and 124/124 unit tests. The subsequent focused 10/10 unit run includes the final added constraint/correction assertions. The Playwright web-server production build passed on the final application source.

Screenshots: `admission-date-chromium.png` and `admission-date-mobile.png`. Credentials remain only in ignored `artifacts/people-02/private-demo.json`; Student IDs/keys remain in ignored `artifacts/students-03/private-demo.json`.
