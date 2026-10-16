# Coordination current state

## 16 October 2026 — COORD-01 verified Attendance foundation

Coordination now owns persisted Attendance follow-up requests for LEA-09, LEA-11 and LEA-15. The implemented slice provides branch-scoped designation grants, create and atomic initial assignment, queues and details, reassign/due changes, start, exact Attendance-owned evidence submission, independent verify/return, withdraw and reopen. Current membership, module availability, source authority and assignment eligibility are rechecked on protected operations. Notes stay out of platform audit payloads.

Schema migration `20261016140000_coordination_foundation` is applied in the development and dedicated test databases. It adds the four registered `vs_coordination_*` tables, scoped foreign keys and indexes, an active-request partial unique index, optimistic versions and exact actor/command/key receipts. This is a forward migration; no prior migration was changed. TEN-03 enforcement remains a production gate for these tenant tables.

Verified implementation source: `7568ed9` (Coordination feature commits through the route-lint correction), with this status/evidence update changing documentation only. Focused evidence: Coordination unit 3/3; real-PostgreSQL functional 7/7; Playwright desktop 2/2 and mobile 2/2 with one worker; isolated and normal production builds; typecheck and applicable boundary/database/documentation checks. The browser journey verifies create/assign with committed-response recovery, start, no-change submission, independent verify, reopen, authorized Attendance cancellation, exact cancellation-revision submission and independent closure. The PostgreSQL suite additionally covers active uniqueness under concurrency, stale versions, foreign scope/forged IDs, designation denial, reassignment visibility removal, capability revocation, receipt protection after revocation, self-verification denial, withdrawn immutability, cross-register evidence rejection and rollback on invalid evidence.

`pnpm demo:seed` preserves existing identities and prepares unassigned open, assigned in-progress, awaiting-verification, returned, resolved and withdrawn fictional examples. Private identifiers remain in ignored `artifacts/coordination-01/private-demo.json`; primary credentials remain in ignored `artifacts/people-02/private-demo.json`.

Visual comparison directly inspected the unchanged approved LEA-09, LEA-11 and LEA-15 workflow-dialog states against the real routed compositions at 1440×1000 and 390×844. The application follows the same staged outcomes and shared Principal patterns; its persistent shell, queue/detail pages and real receipts are documented design extensions rather than pixel-identical modal parity. Human review is PENDING. Font portability and native accessibility were not newly verified.

Production remains blocked: `VSCHOOL_COORDINATION_MODE` defaults to disabled and only `synthetic` is supported until operational-note retention and backup-deletion policy is approved. TEN-03, provider, restore/load and accessibility release gates remain open.

Next action: owner review of the three Coordination journeys, then select the next independently approved Principal slice. Do not broaden Coordination beyond the approved Attendance scope without a new owner contract.
