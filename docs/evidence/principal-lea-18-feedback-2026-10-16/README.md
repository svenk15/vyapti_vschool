# LEA-18 Principal feedback-turnaround evidence

Status: supported descriptive read slice engineering-verified; full LEA-18 partial; human review pending.

## Contract and source

- Approved workflow: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, workflow `LEA-18` (“Review feedback awaiting return”).
- Application route: `/leadership/learning/feedback`.
- Learning owns `feedback-turnaround.v1`; Leadership only presents the browser-safe aggregate.
- Cohort: accepted submissions within explicit branch-timezone boundaries. First publication is the earliest immutable FeedbackVersion for the exact submission at or before the server as-of instant.
- No schema or migration change. Development and test retain 64 migrations.

## Functional and security verification

- `pnpm exec tsc --noEmit`: passed after the final navigation and presentation correction.
- `pnpm check`: passed on the final slice (documentation/database-design/boundary/backend checks and 164/164 unit tests).
- `pnpm build`: passed on the final slice with `/leadership/learning/feedback` in the generated route inventory.
- `pnpm test:functional test/functional/learning-publication.test.ts`: 16/16 passed against real `vyapti_vschool_test`; the new case proves two accepted submissions, one first publication at exactly two elapsed hours, one awaiting publication, later correction not resetting the first instant, empty cohort `Not available`, class/subject filters, role revocation and exclusion of Student IDs and private text.
- `pnpm exec tsx scripts/demo-learning.ts`: passed against the designated development database and preserved/created the connected submitted, first-feedback and awaiting-feedback fictional scenarios without overwriting credentials.
- Initial full focused desktop and mobile runs passed 4/4 per project. After screenshot inspection, the final changed LEA-18 desktop and mobile reference/application states passed 2/2 per project, and the affected assignment-completion/navigation consumers passed 2/2 per project with exact single active-item assertions.
- Both projects used one worker and confirmed 64 applied test migrations.

The first retry of the mobile project failed before Playwright began because Prisma emitted an empty transient schema-engine connection error. The same unchanged source passed when retried in the host-approved local database environment. A later mobile assertion attempt failed because role lookup intentionally excludes the closed navigation drawer; the assertion was corrected to inspect the hidden navigation DOM while retaining the visible open-drawer keyboard check. No application assertion, timeout or authorization rule was weakened.

## Direct visual inspection

- `application-chromium.png` and `reference-chromium.png`: inspected at 1440×1000.
- `application-mobile.png` and `reference-mobile.png`: inspected at 390×844.
- Inspection found and corrected the fourth desktop metric wrapping to a second row, nested-route double selection, wrong top-bar label, and inconsistent narrow-card flow.
- Final application captures show one active Feedback turnaround destination, a four-card desktop row, a two-by-two mobile summary, bounded filters, explicit as-of/timezone, and readable definition/exclusion sections without horizontal overflow.
- The approved source is a workflow-review dialog rather than an exact production page. The application implements the explicitly approved descriptive aggregate and omits the workflow's subject-lead coordination stage. It is a bounded shared-shell extension, not an exact full-workflow fidelity claim.

Known deviation: the documented font portability exception remains. Native VoiceOver/NVDA was not executed.

## Remaining work

LEA-18 remains partial because subject-lead assignee authority, operational-note ownership, coordination lifecycle and verified follow-up outcome are not approved or implemented. The page deliberately exposes no dead coordination control. Human review, TEN-03 and production gates remain pending.
