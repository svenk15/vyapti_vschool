<!-- TT-01 contract -->
## TT-01 integration
See [the shared timetable source of truth](timetable/README.md) and [persona mapping](TIMETABLE_INTEGRATION.md). Existing task and verification entries below are baseline unless explicitly refreshed in timetable-evidence.json.

# Proposed student implementation index
No current task state was read from the live development repository. This index allocates design work; merge with existing tasks and check actual gates before coding. STW IDs identify proposed student slices, avoiding existing STU-* task names.

## Foundation and first vertical slice
| Order | Slice | Demonstrable result |
|---|---|---|
| F01 | Verify StudentAccountLink/enrollment policy + server context projection | Own permitted contexts; unrelated/revoked student denied |
| F02 | Integrate shared shell, tokens and responsive navigation | School-branded student entry with enabled navigation and separate sign-out |
| 1 | STW-10/11/12 | Open published assigned work and authorized resource |
| 2 | STW-13/14 | Save private draft; upload/check file; no premature submission |
| 3 | STW-15/16/17 | Review, commit receipt, reconcile lost response and enforce deadline |
| 4 | STW-22/18/19 | Teacher returns permitted feedback; student revises or explicitly withdraws |
| 5 | STW-25/26/36/37 | Own attendance query → school review status without direct correction |

F01/F02 are small proposed precursor slices, not replacements for existing Access/Students/Design-system tasks. STW-14 is required before attachments are enabled in STW-15; text-only STW-15 may proceed after STW-13. Group adjacent IDs into one reviewable implementation batch only when owner contracts are settled. Do not implement future owners speculatively.

## Workflow dependency map
| ID | Area | Phase | Proposed direct dependencies | Scope |
|---|---|---|---|---|
| STW-01 | access | 2 | F01/F02 | Owner-aligned |
| STW-02 | access | 2 | STW-01 | Owner-aligned |
| STW-03 | access | 2 | STW-01 | Owner-aligned |
| STW-04 | access | 2 | STW-01, STW-02 | Owner-aligned |
| STW-05 | access | 2 | STW-01 | Owner-aligned |
| STW-06 | day | 3 | STW-04, STW-10 | Owner-aligned |
| STW-07 | day | 3 | STW-04 | Owner-aligned |
| STW-08 | day | 3 | STW-07 | Owner-aligned |
| STW-09 | day | 3 | STW-07, STW-10 | Owner-aligned |
| STW-10 | assignments | 3 | STW-04 | Owner-aligned |
| STW-11 | assignments | 3 | STW-10 | Owner-aligned |
| STW-12 | assignments | 3 | STW-11 | Owner-aligned |
| STW-13 | assignments | 3 | STW-11 | Owner-aligned |
| STW-14 | assignments | 3 | STW-13 | Owner-aligned |
| STW-15 | assignments | 3 | STW-13 | Owner-aligned |
| STW-16 | assignments | 3 | STW-15 | Owner-aligned |
| STW-17 | assignments | 3 | STW-15 | Owner-aligned |
| STW-18 | assignments | 3 | STW-15, STW-22 | Owner-aligned |
| STW-19 | assignments | 3 | STW-15 | Owner-aligned |
| STW-20 | assignments | 3 | STW-11, STW-36 | Extension |
| STW-21 | assignments | 3 | STW-13, STW-16 | Extension |
| STW-22 | feedback | 3 | STW-15 | Owner-aligned |
| STW-23 | feedback | 3 | STW-22 | Owner-aligned |
| STW-24 | feedback | 3 | STW-22, STW-29 | Owner-aligned |
| STW-25 | attendance | 2 | STW-04 | Owner-aligned |
| STW-26 | attendance | 2 | STW-25, STW-36 | Extension |
| STW-27 | communication | 2 | STW-04 | Owner-aligned |
| STW-28 | communication | 2 | STW-27 | Owner-aligned |
| STW-29 | communication | 2 | STW-04 | Owner-aligned |
| STW-30 | communication | 2 | STW-29 | Owner-aligned |
| STW-31 | calendar | 3 | STW-07 | Owner-aligned |
| STW-32 | calendar | 3 | STW-31 | Extension |
| STW-33 | results | 4 | STW-04 | Owner-aligned |
| STW-34 | results | 4 | STW-33 | Owner-aligned |
| STW-35 | results | 4 | STW-33, STW-36 | Owner-aligned |
| STW-36 | requests | 2 | STW-04 | Owner-aligned |
| STW-37 | requests | 2 | STW-36 | Owner-aligned |
| STW-38 | requests | 2 | STW-36 | Owner-aligned |
| STW-39 | services | 6 | STW-04 | Owner-aligned |
| STW-40 | services | 6 | STW-39 | Owner-aligned |
| STW-41 | services | 6 | STW-31 | Extension |
| STW-42 | services | 6 | STW-04 | Owner-aligned |
| STW-43 | services | 6 | STW-36 | Extension |
| STW-44 | account | 2 | STW-01 | Owner-aligned |
| STW-45 | account | 2 | STW-44 | Owner-aligned |
| STW-46 | account | 2 | STW-36 | Owner-aligned |
| STW-47 | assistant | 7 | STW-12 | Owner-aligned |

## Recommended delivery batches
A. School identity and shared shell; B. Assignment read/draft/files; C. Submission/recovery; D. Teacher feedback/revision; E. Attendance/messages/requests; F. Calendar/results when owners release; G. Individual services; H. reviewed AI.

Architecture, authorization and meaningful evidence stay on the critical path. Visual review may be batched by related screens, but scope isolation, file safety and submission correctness cannot be deferred to a final cosmetic review.
