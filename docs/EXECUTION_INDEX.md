# Phase 1 execution index — v4.4

Index only; module CURRENT_STATE owns status. No run is active. New tenancy, branding and shared UX are first-release foundations. Later product modules remain design-gated.

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
| FND-02 | [platform](modules/platform/TASKS.md) | Demonstrate and release the complete pilot | RPT-02, IMP-03, IAM-03, ATT-04, TEN-03, BRD-02, DS-02 |

Use pnpm next-task for a read-only suggestion. Explicit user pause and failed review take priority. A single 24-hour timebox does not guarantee all 29 tasks complete.
