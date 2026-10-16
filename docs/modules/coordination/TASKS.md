# Coordination tasks

## COORD-01 — Attendance follow-up foundation

Dependencies: verified Principal Attendance source read; existing Attendance correction/cancellation owners; explicit product decisions dated 16 October 2026.

- [x] Add the four forward-only branch-scoped tables and TEN-03 registry entries.
- [x] Implement pure validation and lifecycle transitions.
- [x] Implement operator-designated capability grants and live eligibility checks.
- [x] Implement create/list/detail with active uniqueness and exact replay.
- [x] Implement assign/reassign/due update with immutable history.
- [x] Implement start and resolution submission through the Attendance evidence port.
- [x] Implement independent verify/return plus manager withdraw/reopen.
- [x] Add Principal and assigned-administrator queues and staged flows.
- [x] Add incremental synthetic fixtures without changing existing credentials.
- [x] Verify unit, real PostgreSQL, desktop/mobile and repository gates.
- [x] Update LEA-09, LEA-11 and LEA-15 accounting without inferring human acceptance.

Human review, production retention, TEN-03, font portability and native accessibility remain PENDING.

## COORD-02 — LEA-10 bounded bulk Attendance follow-ups

Dependencies: COORD-01 engineering verification; approved LEA-10 contract dated 17 October 2026.

- [x] Persist reviewed batch intent and explicit 1–50 source items with a forward migration and registry entries.
- [x] Implement preview, submit/resume and protected receipt through the Coordination facade.
- [x] Reuse the guarded single-request command with stable derived item keys and independent transactions.
- [x] Add explicit selection, staged review, partial result and recovery UI.
- [x] Verify mixed outcomes, concurrency, interruption, revocation, forged scope, ineligible assignment, replay and redaction in real PostgreSQL.
- [x] Verify desktop/mobile selection, filter/context clearing, final-only mutation, lost response and focus behavior.
- [x] Extend duplicate-safe synthetic demo data and update LEA-10 evidence and matrix.

Human review, production retention, TEN-03, font portability and native accessibility remain PENDING.
