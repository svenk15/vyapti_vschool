<!-- TT-01 contract -->
## TT-01 integration
See [the shared timetable source of truth](timetable/README.md) and [persona mapping](TIMETABLE_INTEGRATION.md). Existing task and verification entries below are baseline unless explicitly refreshed in timetable-evidence.json.

# Teacher workflow implementation index

All entries are **design proposals**, not current repository task status. Read each module’s DESIGN before TASKS and code. Actual implementation is NOT_ASSESSED. Current evidence remains in the repository.

| Ref | Demoable journey | Phase | Owning area | Next gate |
|---|---|---|---|---|
| TEA-01 | Sign in to the school workspace | 1 | access | Reconcile design and repository |
| TEA-02 | Activate or recover a teacher account | 1 | access | Reconcile design and repository |
| TEA-03 | Switch branch or leave the workspace | 1 | access | Reconcile design and repository |
| TEA-04 | Review my account and sessions | 1 | access | Reconcile design and repository |
| TEA-05 | Plan my teaching day | 1 | today | Reconcile design and repository |
| TEA-06 | Resolve a missing or changed assignment | 1 | today | Reconcile design and repository |
| TEA-07 | Review my assigned classes | 1 | classes | Reconcile design and repository |
| TEA-08 | Review a minimal class roster | 1 | classes | Reconcile design and repository |
| TEA-09 | Open an assigned attendance session | 1 | attendance | Reconcile design and repository |
| TEA-10 | Mark attendance and review exceptions | 1 | attendance | Reconcile design and repository |
| TEA-11 | Submit attendance and keep the receipt | 1 | attendance | Reconcile design and repository |
| TEA-12 | Recover an uncertain submission | 1 | attendance | Reconcile design and repository |
| TEA-13 | Handle a stale register or lost permission | 1 | attendance | Reconcile design and repository |
| TEA-14 | Review history and hand off a correction | 1 | attendance | Reconcile design and repository |
| TEA-15 | Use offline-assisted attendance | 2 | attendance | Reconcile design and repository |
| TEA-16 | Request an attendance correction | 2 | attendance | Scope extension; reconcile first |
| TEA-17 | Read school notices and acknowledge | 2 | communication | Reconcile design and repository |
| TEA-18 | Prepare a class message | 2 | communication | Reconcile design and repository |
| TEA-19 | Reply in a permitted family conversation | 2 | communication | Reconcile design and repository |
| TEA-20 | Arrange a family meeting | 2 | communication | Scope extension; reconcile first |
| TEA-21 | Review permitted absence context | 2 | communication | Reconcile design and repository |
| TEA-22 | Review my published timetable | 3 | planning | Reconcile design and repository |
| TEA-23 | Accept and perform a cover assignment | 3 | planning | Reconcile design and repository |
| TEA-24 | Hand over a lesson or request a schedule change | 3 | planning | Scope extension; reconcile first |
| TEA-25 | Plan a lesson | 3 | learning | Reconcile design and repository |
| TEA-26 | Add and reuse teaching resources | 3 | learning | Reconcile design and repository |
| TEA-27 | Create and publish an assignment | 3 | learning | Reconcile design and repository |
| TEA-28 | Review submissions and late work | 3 | learning | Reconcile design and repository |
| TEA-29 | Draft feedback and return work | 3 | learning | Reconcile design and repository |
| TEA-30 | Allow resubmission or revise a deadline | 3 | learning | Reconcile design and repository |
| TEA-31 | Review learning progress and plan support | 3 | learning | Reconcile design and repository |
| TEA-32 | Prepare an assessment within an approved scheme | 4 | assessments | Reconcile design and repository |
| TEA-33 | Enter and validate marks | 4 | assessments | Reconcile design and repository |
| TEA-34 | Submit marks for moderation | 4 | assessments | Reconcile design and repository |
| TEA-35 | Review result publication and correct an error | 4 | assessments | Reconcile design and repository |
| TEA-36 | Refer a student concern safely | 6 | wellbeing | Reconcile design and repository |
| TEA-37 | Request leave and arrange a handoff | 6 | self-service | Reconcile design and repository |
| TEA-38 | Review my staff record and request a correction | 6 | self-service | Reconcile design and repository |
| TEA-39 | Borrow, reserve or renew a resource | 6 | resources | Reconcile design and repository |
| TEA-40 | Request materials or book a teaching space | 6 | resources | Reconcile design and repository |
| TEA-41 | Carry out an assigned school duty | 6 | duties | Scope extension; reconcile first |
| TEA-42 | Use a teaching draft with source evidence | 7 | assistant | Reconcile design and repository |

Suggested order: Phase 1 access/context → day/classes → register/receipt → recovery/history → integrated UX; then phase-specific module dependencies. Future physical LLD, grants and release gates precede implementation.
