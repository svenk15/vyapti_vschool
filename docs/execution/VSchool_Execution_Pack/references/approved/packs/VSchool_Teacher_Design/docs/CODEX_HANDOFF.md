<!-- TT-01 contract -->
## TT-01 integration
See [the shared timetable source of truth](timetable/README.md) and [persona mapping](TIMETABLE_INTEGRATION.md). Existing task and verification entries below are baseline unless explicitly refreshed in timetable-evidence.json.

# Codex implementation handoff

Use this pack as a reviewed design input to the existing vyapti_vschool repository. Do not replace the app with this HTML prototype.

## First pass

1. Read repository AGENTS.md, Bible, execution index and current states. Identify the actual shared component library, role/permission registry, route conventions, school-theme tokens and migrations. Preserve current work and source history.
2. Reconcile the design pack’s phases and proposed capabilities. The pack does not mark any existing task complete, unblock an acceptance gate or change TEN-03 decisions. Map each TEA reference to the existing owning-module task; avoid duplicate IAM/ACA/PER/STU/ATT implementations.
3. Update the relevant owning DESIGN.md before critical-path code. Specify actual tables/columns/joins/constraints/indexes, DTOs, authorization, transaction and concurrency rules. Then align TASKS.md; record progress/evidence only in CURRENT_STATE.md. Append accepted product decisions to the Bible rather than rewriting unrelated modules.

## Implement in demoable slices

- TEACH-UX-01: shared Teacher shell, public school entry and current account/branch. Demo authorized and denied branches, identity placement and separate Sign out.
- TEACH-UX-02: My teaching day, date selection, missing assignment and assigned class/roster. Demo real current server scope and responsive hierarchy.
- TEACH-UX-03: exact session attendance from open through explicit marking, full-roster review, atomic submission, receipt and read-only history. Keep correction with administrator.
- TEACH-UX-04: network uncertainty, same-intent retry, conflict and revocation recovery. Demo each outcome against actual backend behavior.
- TEACH-UX-05: cross-page visual integration review: spacing, navigation icons, toolbar alignment, mobile, keyboard/focus, client themes and error states. Compare composed screens with references; a component showroom alone is insufficient.
- Later slices: communication after verified family grants; learning/timetable before assessments; each Phase 6 service separately; assistant after its authorization/evaluation contract. The per-area task files list every proposed journey.

These are proposed design-slice IDs. Map them into the existing execution index; do not silently renumber current tasks.

## Development rules

Reuse and improve the shared components. Keep Next.js in adapters and domain/application use cases portable. Obtain all current permissions server-side. No runtime owner-role shortcut, global student lookup, implicit guardian access or wildcard Teacher capability. No direct teacher correction or result publication from a new UI button.

Keep the existing incremental `pnpm demo:seed` approach: add fictional, deterministic, idempotent demo records with each implemented feature and backfill missing examples for already-built features. Preserve existing test data/credentials, scope the command to approved local demo environments and use a file-only email sink. Do not add teardown complexity in this slice. Record which journeys the seed supports.

Run targeted unit/real-PostgreSQL/E2E checks for each changed risk, then the project’s required module gate. Preserve exact build/source/test evidence. Start or reuse one known demo server; provide the URL, fictional credential file reference and a short walkthrough. Never put credentials in public logs or this design pack.

Continue independently through eligible tasks under the user’s existing authorization. Record review as PENDING until actual review evidence exists. Do not fabricate acceptance, bypass explicit dependency/security gates or claim a production release from a demo.

## Final report for each slice

State what changed, which teacher journey is now live, the exact verification evidence, remaining limits and the working demo entry. Update CURRENT_STATE so another agent can resume from the completed checkpoint. Keep unrelated work untouched.
