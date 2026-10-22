# Administrator → Staff production implementation matrix

Frozen design authority: commit `ad78b1c95102ed33ecaa938f9a4b29e2c854d0e7`, executable prototype hash `67ca61b0204bac68c7bc7602e02b3c638305b448d377e79be4bbff9cce474a01`.

| Slice | Production route/component | Owner boundary | Focused evidence | Status |
| --- | --- | --- | --- | --- |
| STF-01A | `/admin/teachers`; `PeopleWorkspaceScreen` | People directory query and scoped Prisma adapter | `docs/evidence/staff-stf-01a-2026-10-22/` | ENGINEERING_COMPLETE; human PENDING |
| STF-03A | `/admin/teachers/[employeeId]` | People profile composition over independently authorized Academics/Access ports | `docs/evidence/staff-stf-03a-2026-10-22/` | ENGINEERING_COMPLETE; human PENDING |
| STF-04A | Staff create/manage recovery surfaces | People receipts, CAS and protected status/replay | `docs/evidence/staff-stf-04ab-2026-10-22/` | ENGINEERING_COMPLETE; human PENDING |
| STF-04B | Employee-context Access surfaces | Access receipts and protected status/replay | `docs/evidence/staff-stf-04ab-2026-10-22/` | ENGINEERING_COMPLETE; human PENDING |
| STF-05 | `/admin/teachers/[employeeId]/eligibility` from Staff Profile | Academics dated eligibility and impact contract | `docs/evidence/staff-stf-05-2026-10-22/` | ENGINEERING_COMPLETE; human PENDING |
| STF-06 | Staff Profile invitation panel | Access invitation lifecycle/reasoned resend | Pending | NEXT after STF-03A/04B |
| STF-01B | Directory Teaching/Access filters and sorts | Versioned Academics and Access read projections | Pending owner read contracts | NOT AUTHORIZED in this batch |

PD-STF-01, PD-STF-02 and PD-STF-03 remain unapproved. STF-08/rejoining remains deferred. No row above grants those capabilities.
