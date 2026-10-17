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

## COORD-05 / F08-B — Learning academic evidence adapter

Dependencies: F04 engineering-complete; F08-A engineering-complete; D10 and D04 approved for synthetic-only implementation on 17 October 2026.

- [x] Register only `LEARNING_RECIPIENT` / `LEARNING_SUPPORT_REVIEW` with typed named-status inspection.
- [x] Add the forward conditional source-integrity migration and exact CHECK extensions.
- [x] Require current exact status-read plus policy-manager grants for an eligible assignee.
- [x] Verify latest immutable Learning policy-event evidence without reading response or feedback content.
- [x] Add contextual Principal creation and source-aware Coordination work/verification screens.
- [x] Verify PostgreSQL isolation, revocation, stale evidence, replay and independent closure.
- [x] Extend synthetic seed, browser comparison and F08/LEA-19 evidence without inferring human acceptance.

Engineering status: F08-B and LEA-19 ENGINEERING_COMPLETE; human review PENDING. Superseded next action: F08-C is complete below.

## COORD-06 / F08-C — Learning feedback follow-up adapter

Dependencies: F04 and F08-B engineering-complete; D10/D04 approved for synthetic-only implementation on 17 October 2026.

- [x] Register only `LEARNING_FEEDBACK_SUBMISSION` + `LEARNING_FEEDBACK_FOLLOW_UP` and fail closed for every other pair.
- [x] Require exact class/subject `FEEDBACK_FOLLOW_UP` plus `coordination.work` for assignment and work visibility.
- [x] Verify the earliest immutable `LEARNING_FEEDBACK_PUBLICATION`; reject private drafts, foreign submissions and stale/unsupported evidence.
- [x] Extend source-integrity and exact pairing constraints by forward migration without rewriting prior migrations.
- [x] Verify exact replay, independent closure, revocation, tenant/branch isolation and the routed desktop/mobile journey.

Engineering status: ENGINEERING_COMPLETE. Human review PENDING.

## COORD-04 / F04 — typed owner sources, handover and safe history

Dependencies: F03 engineering-complete; D04 approved for synthetic-only implementation on 17 October 2026.

- [x] Define an explicit typed source/assignee-policy registry with duplicate, foreign and unsupported-pair denial.
- [x] Move Attendance inspection, evidence and current assignee policy behind its registered owner adapter without changing existing behavior.
- [x] Add the bounded, recoverable handover contract and preserve per-request assignment history.
- [x] Add the current-purpose 90-day safe event projection without exposing notes, tokens or restricted source contents.
- [x] Verify PostgreSQL replay/concurrency/revocation and focused Principal desktop/mobile journeys.
- [x] Extend synthetic seed/evidence and update F04 plus affected workflow accounting.
- [x] Add the separately designated immutable WF-42 finding/escalation record with exact replay, no request mutation and protected text visibility.

Engineering status: ENGINEERING_COMPLETE for F04 and LEA-42 in the approved synthetic-only scope. Safe search/source opening and the separate immutable review-finding record are implemented. Human review remains PENDING.

## COORD-02 — LEA-10 bounded bulk Attendance follow-ups

Dependencies: COORD-01 engineering verification; approved LEA-10 contract dated 17 October 2026.

- [x] Persist reviewed batch intent and explicit 1–50 source items with a forward migration and registry entries.
- [x] Implement preview, submit/resume and protected receipt through the Coordination facade.
- [x] Reuse the guarded single-request command with stable derived item keys and independent transactions.
- [x] Add explicit selection, staged review, partial result and recovery UI.
- [x] Verify mixed outcomes, concurrency, interruption, revocation, forged scope, ineligible assignment, replay and redaction in real PostgreSQL.
- [x] Verify desktop/mobile selection, filter/context clearing, final-only mutation, lost response and focus behavior.
- [x] Extend duplicate-safe synthetic demo data and update LEA-10 evidence and matrix.

## COORD-03 / F03 — typed decision facade and Coordination verification adapter

Dependencies: F00 engineering-complete; D03 approved for synthetic-only implementation on 17 October 2026; COORD-01 verification lifecycle complete.

- [x] Define the narrow typed owner registry without a generic decision table or cross-owner mutation.
- [x] Project only currently authorized `AWAITING_VERIFICATION` Coordination items and owner-defined actions.
- [x] Route verify/return and exact retry through the existing guarded Coordination commands.
- [x] Add the production Principal inbox/detail composition and safe unavailable/empty/stale/unknown states.
- [x] Verify PostgreSQL authority, replay/revocation/concurrency and focused desktop/mobile journeys.
- [x] Extend synthetic seed/evidence and update F03 status without claiming all LEA-27–31 workflows complete.

## COORD-05 / LEA-31 protected decision recovery

- [x] Add owner-specific status lookup using the existing Coordination receipt and exact command hash.
- [x] Recheck live branch capability, proposer separation and source access before returning status or receipt.
- [x] Distinguish `UNKNOWN`, owner `CHANGED` and `FOUND` without writing or interpreting absence as failure.
- [x] Prove exact retry has one receipt and one verified event; changed payload conflicts.
- [x] Prove revocation denies receipt disclosure and restoration recovers the original result.

Engineering status: LEA-31 ENGINEERING_COMPLETE for the registered Coordination owner; human review PENDING.

Human review, production retention, TEN-03, font portability and native accessibility remain PENDING.
