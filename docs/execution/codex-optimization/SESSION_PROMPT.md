# Reusable execution prompt

Fill the bracketed fields. Use one bounded objective, not the entire backlog.

```text
Continue vyapti_vschool under the repository AGENTS.md.

Task: [existing workflow/task ID and one concrete outcome]
Owner: [module]
Reference: [approved screen/file/state or exact LLD section]
Acceptance: [3–5 observable conditions, including relevant negative cases]
Stop boundary: [verified slice / named small batch / requested visual checkpoint]

Load the selected module CURRENT_STATE, task acceptance/dependencies and
relevant DESIGN/ADR sections. Check live HEAD and local changes against the
latest handover. Expand to other documents only when this task needs them.
Do not restart verified work or reopen settled decisions without new evidence.

Implement the smallest complete slice using existing architecture. Preserve
tenant authorization, identity, transaction, migration and release contracts.
Use focused tests during iteration and all required gates before VERIFIED.
Verify wrapper arguments and test selection; do not duplicate unchanged checks
or builds. Keep detailed logs in artifacts, not in the conversation.

For UI, open the approved reference and actual screen, compare matching states,
fix fidelity gaps and provide before/after evidence. Functional tests alone
do not establish visual acceptance.

Update only the affected canonical docs and evidence. Checkpoint intended work,
preserve unrelated files and leave an exact next action if blocked. Do not
invent business rules or claim skipped checks passed.

Finish with outcome, source commit, checks/evidence, demo, remaining deviations
and next action. Keep human acceptance and production readiness separate.
```

## Filled next task for the current project

Task: Administrator Students directory visual-fidelity checkpoint (use the existing task ID; create a linked corrective ID only if none exists).

Owner: Students plus the relevant shared design-system/shell owner.

Reference: Locate the exact Students screen within the approved Administrator HTML under docs/execution/VSchool_Execution_Pack/references/approved/packs/. Report the path and state once. Use the original page body with enhanced sidebar, not the rejected full redesign.

Acceptance:
1. Capture reference and implementation with matching content/state and desktop/mobile viewports.
2. Correct shell, typography, toolbar, table/actions and drawer differences without changing business authority or replacing real data.
3. Search, filter apply/cancel, focus restoration and Back/Forward behave as the approved reference requires.
4. Relevant checks pass; report any remaining visual deviations with images.
5. Running demo serves the documented current source.

Stop boundary: one complete visual checkpoint for user acceptance before broad rollout. Preserve the reported 29 engineering-verified workflows; do not reopen SA-07 or expand to later-phase features.
