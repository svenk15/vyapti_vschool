# VSchool execution pack — engineering revision 2, 9 October 2026

Start with `CODEX_START_PROMPT.md`. This pack is an implementation overlay for the existing vyapti_vschool repository, not a replacement starter or authorization to reset it.

## Your three steps
1. Extract this ZIP. Place the `VSchool_Execution_Pack` folder at `docs/execution/VSchool_Execution_Pack` in the working repository. No existing files need replacing.
2. Open Codex in that repository and paste the full contents of `CODEX_START_PROMPT.md`.
3. Let Codex execute the first ready task, then continue through the Foundation & Existing Workflows batch. Review the running demo and evidence when convenient.

The first batch delivers the approved appearance on existing real workflows: sign-in, school administration, staff, academics, students, imports, attendance, reporting and teacher entry. It preserves the implemented backend. It does not pretend all future prototype workflows already have production owners.

## Read order
Read engineering/READ_FIRST.md and the extended CODEX_START_PROMPT.md first. Revision 2 adds the exact owner interfaces, API wiring, transaction algorithms, known contract mismatches and 51 per-table specifications.

1. BASELINE_AND_DECISIONS.md — observed code, scope and authority.
2. architecture/HLD.md and architecture/UI_LLD.md — components, boundaries and data flow.
3. modules/experience/TASKS.md — concrete initial tickets, files, tests and demos.
4. modules/experience/DESIGN.md and database/EXISTING_SCHEMA.prisma — persisted data and joins.
5. WORKFLOW_INDEX.csv and workflow-tasks/ — a card for every catalogued role workflow.
6. MODULE_ROADMAP.md — the next owner modules and their design gates.
7. TEST_AND_DEMO_RUNBOOK.md — evidence without repetitive full-suite runs.

## Sources of truth
Bible = product/module/release policy. Module DESIGN.md = technical contract. Module TASKS.md = work/dependencies. Module CURRENT_STATE.md = evidence, review and next checkpoint. The existing repository versions remain canonical. Reconcile this overlay into them task by task; do not create competing truth or rewrite the complete Bible. Queue.json is a scheduling projection and must agree with the module state. Workflow cards are a coverage inventory, not evidence of implementation.

This package was designed against the shared 8 October snapshot, HEAD 61f619e58093925bb20433e839f6ac375654b659. The local VSCode checkout may be newer. EX-00 checks the difference before changes. No tests of the production application were executed in preparing this pack. Source inspection is evidence of code presence only.
