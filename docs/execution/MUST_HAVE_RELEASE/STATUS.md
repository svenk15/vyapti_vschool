# Must-have release status

Status date: 18 October 2026 (Asia/Kolkata). Catalogue counts remain those in the [workspace audit](../workspace-audit/README.md) until an owning catalogue row gains new evidence.

| Journey | Functional/security | Visual | Human acceptance | Production readiness | Exact remaining gap | Executable source / evidence |
|---|---|---|---|---|---|---|
| M01 | VERIFIED_CURRENT_SOURCE | VERIFIED_EXISTING_COMPARISONS | PENDING | BLOCKED_RELEASE_GATES | Native accessibility, TEN-03 and human review remain. The audit's Parent/Student “no option” finding was an inspection false negative: personal workspaces redirect directly and are not staff selector options. | App source `d6c9120` within current HEAD; build `jCObsKqoFwjNr2pibKzUn`; [`M01 evidence`](../../evidence/must-have-m01-2026-10-18/README.md) |
| M02 | VERIFIED_CURRENT_SOURCE | VERIFIED_CURRENT_REGRESSION | PENDING | BLOCKED_RELEASE_GATES | Native accessibility, font portability, TEN-03 and human review remain. The must-have journey deliberately composes existing separate Academics and People commands; broader catalogue rows retain their own status. | App source `d6c9120` within current HEAD; build `jCObsKqoFwjNr2pibKzUn`; [`M02 evidence`](../../evidence/must-have-m02-2026-10-18/README.md) |
| M03 | RECONCILE_EXISTING | RECONCILE_EXISTING | PENDING | BLOCKED_RELEASE_GATES | Run one current registration→placement→family/Student access journey and CSV alternative smoke. | SA-18/19/23/24 and Guardians/Student access evidence |
| M04 | RECONCILE_EXISTING | RECONCILE_EXISTING | PENDING | BLOCKED_RELEASE_GATES | Reconcile current timetable→register→read→correction journey and manual-conflict fixture. | TT-01–TT-05, EX-10–EX-12, LEA-08/16 evidence |
| M05 | RECONCILE_EXISTING | RECONCILE_EXISTING | PENDING | BLOCKED_RELEASE_GATES | Run current Parent/Student acknowledgement and Principal coverage journey. | COM-01/F10 evidence |
| M06 | RECONCILE_EXISTING | RECONCILE_EXISTING | PENDING | BLOCKED_RELEASE_GATES | Run current draft→submission→feedback across Teacher/Student/Parent/Principal. | LEA-01–04 and LEA-17/18 evidence |
| M07 | RECONCILE_EXISTING | RECONCILE_EXISTING | PENDING | BLOCKED_RELEASE_GATES | Prove current real local scan, recipient downloads and withdrawal in one connected run. | F11-B–F11-E and DOC-02A evidence |
| M08 | RECONCILE_EXISTING | RECONCILE_EXISTING | PENDING | BLOCKED_RELEASE_GATES | Run current missing-register source action and independent verification end to end. | LEA-08–11/15 evidence |

No row is production-ready. “Must-have subset complete” will not promote a broader catalogue workflow whose documented operations remain partial.
