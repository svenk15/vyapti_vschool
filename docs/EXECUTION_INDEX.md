# Phase 1 execution index — v4.6

## Approved experience overlay — revision 2 (9 October 2026)

The current implementation overlay is EX-00–EX-15 in [the execution pack](execution/VSchool_Execution_Pack/modules/experience/TASKS.md). It reuses the Phase 1 owner slices below and does not change their historical verification or human-review evidence. [CONTRACT_DIFF](execution/CONTRACT_DIFF.md) is authoritative for existing, partial and missing operations; [ROUTE_REFERENCE_MAP](execution/ROUTE_REFERENCE_MAP.md) pins the six approved visual references.

Execution begins with EX-00 reconciliation, then EX-01 visual capture and EX-02 shared navigation. Subsequent EX tasks consume only currently implemented owner operations. Pending human review does not block an otherwise verified EX dependency. TEN-03 restricted-role/RLS proof and DS-02 native accessibility remain production-release gates and are not absorbed into this visual queue.

This index defines the complete currently authorized Phase 1 task scope (30 tasks in dependency order). Module CURRENT_STATE owns implementation evidence and human review. Human review PENDING or NOT_REQUESTED does not block dependent implementation; only failed automated prerequisites, unresolved technical/security decisions, or unavailable required access can block work. Record human review truthfully and keep release gates outstanding until their evidence exists. New tenancy, branding and shared UX are first-release foundations. Later product modules remain design-gated and out of scope.

| Task | Module | Demo outcome | Dependencies |
|---|---|---|---|
| FND-01 | [platform](modules/platform/TASKS.md) | Run and checkpoint the fresh local foundation | none |
| DS-01 | [design-system](modules/design-system/TASKS.md) | Review and adopt the shared UI foundation | FND-01 |
| BRD-01 | [branding](modules/branding/TASKS.md) | Review reusable brand palettes and school login previews | FND-01, DS-01 |
| IAM-01 | [access](modules/access/TASKS.md) | Provision a school and sign in as its administrator | FND-01, DS-01 |
| IAM-02 | [access](modules/access/TASKS.md) | Manage school settings and staff access | IAM-01 |
| IAM-03 | [access](modules/access/TASKS.md) | Activate and recover staff accounts safely | IAM-02 |
| TEN-01 | [tenancy](modules/tenancy/TASKS.md) | Provision institutions/branches and switch authorized context | IAM-02 |
| TEN-02 | [tenancy](modules/tenancy/TASKS.md) | Persist and enforce module entitlements and activation | TEN-01 |
| BRD-02 | [branding](modules/branding/TASKS.md) | Publish authorized school branding and connect real sign-in | TEN-02, IAM-03, BRD-01 |
| ACA-01 | [academics](modules/academics/TASKS.md) | Configure academic year, terms, grades and sections | IAM-02, TEN-02 |
| ACA-02 | [academics](modules/academics/TASKS.md) | Publish calendar and open or close the year | ACA-01 |
| PER-01 | [people](modules/people/TASKS.md) | Create and inspect staff profiles | IAM-02 |
| IAM-04 | [access](modules/access/TASKS.md) | Preserve operator access while adding trust-mode email invitations and account-wide recovery | IAM-02, IAM-03, TEN-02 |
| PER-02 | [people](modules/people/TASKS.md) | Enable teaching eligibility and verified account binding | PER-01, IAM-03, ACA-01 |
| ACA-03 | [academics](modules/academics/TASKS.md) | Create offerings and assign teachers | ACA-02, PER-02 |
| STU-01 | [students](modules/students/TASKS.md) | Register and inspect students | PER-01, ACA-01 |
| STU-02 | [students](modules/students/TASKS.md) | Enroll students into a dated section | STU-01, ACA-02 |
| IMP-01 | [imports](modules/imports/TASKS.md) | Upload and preview a roster without changing students | STU-02 |
| IMP-02 | [imports](modules/imports/TASKS.md) | Confirm and process complete student rows | IMP-01 |
| IMP-03 | [imports](modules/imports/TASKS.md) | Resume, cancel and explain partial imports | IMP-02 |
| ATT-01 | [attendance](modules/attendance/TASKS.md) | Schedule sessions and show each teacher their day | ACA-03, STU-02 |
| STU-03 | [students](modules/students/TASKS.md) | Transfer or archive with historical protection | STU-02, ATT-01 |
| ATT-02 | [attendance](modules/attendance/TASKS.md) | Open the exact roster and submit attendance | ATT-01 |
| ATT-03 | [attendance](modules/attendance/TASKS.md) | Review and correct submitted attendance | ATT-02 |
| ATT-04 | [attendance](modules/attendance/TASKS.md) | Cancel sessions and recover failed submissions | ATT-03, STU-03 |
| RPT-01 | [reporting](modules/reporting/TASKS.md) | Review school attendance with explainable totals | ATT-03 |
| RPT-02 | [reporting](modules/reporting/TASKS.md) | Export a scoped report and review audit history | RPT-01, ATT-04 |
| TEN-03 | [tenancy](modules/tenancy/TASKS.md) | Prove tenant isolation and configuration recovery | TEN-02, ATT-04 |
| DS-02 | [design-system](modules/design-system/TASKS.md) | Validate production screen recipes and accessibility | DS-01, ATT-02, BRD-02 |
| FND-02 | [platform](modules/platform/TASKS.md) | Prepare and verify the complete Phase 1 demo | RPT-02, IMP-03, IAM-03, ATT-04, TEN-03, BRD-02, DS-02 |

Use `pnpm next-task` for a read-only suggestion based on implementation status only; failed human feedback is prioritized for defect resolution. Human acceptance does not control task eligibility under the current owner policy. Accessibility and other explicit technical release gates remain mandatory for release readiness. Later phases are out of scope.

## PHASE 1 DEMO READY sequencing decision — 6 October 2026

The immediate milestone is a complete local **PHASE 1 DEMO READY** checkpoint, not production release. TEN-03 remains IN_PROGRESS; its remaining non-forgeable context proof, RLS enforcement, restricted-role cross-tenant policy proof, provider review and scale profile are deferred until after the owner’s consolidated product demo/review. TEN-03 still blocks production release and onboarding any real client data. Preserve the applied migrations/data and partial TEN-03 checkpoint. Application authorization and tenant/branch scoping remain required for every protected operation.

For demo sequencing only, skip the unfinished TEN-03 remainder and select FND-02 when these implementation prerequisites are VERIFIED: RPT-02, IMP-03, IAM-03, ATT-04 and BRD-02. The complete TEN-03 dependency list in the task row remains the release gate. DS-02 shared UX implementation and rendered demo review are included in FND-02 verification; native VoiceOver/NVDA and other unperformed accessibility criteria remain release gates. Never record human review as passed without owner feedback.

| Task | Deferred for demo milestone | Demo dependencies |
|---|---|---|
| TEN-03 | yes — remaining security enforcement only | — |
| FND-02 | no | RPT-02, IMP-03, IAM-03, ATT-04, BRD-02 |

Owner reaffirmed 6 October 2026: continue every eligible Phase 1 implementation without per-task approval. Human PENDING/NOT_REQUESTED, including historical IAM-03 and ATT-04 acceptance gates, never blocks implementation. Keep their review states truthful. Implementation-VERIFIED prerequisites, technical/security gates and explicit release evidence remain mandatory; do not mark a task VERIFIED around failed or skipped checks. PER-02's former IAM-03 human-PASSED prerequisite is superseded; IAM-03 implementation must still be VERIFIED.
