# Evidence index

## Catalogue and matrices

| Workspace | Approved catalogue | Current matrix |
|---|---|---|
| School Administrator | `references/approved/packs/VSchool_School_Admin_Design/workflow-catalog.json` | `docs/execution/SCHOOL_ADMIN_WORKFLOW_MATRIX.md` |
| Teacher | `references/approved/packs/VSchool_Teacher_Design/workflow-catalog.json` | `docs/execution/TEACHER_WORKFLOW_MATRIX.md` (17 milestone rows; audit supplies all 42) |
| Student | `references/approved/packs/VSchool_Student_Design/workflow-catalog.json` | `docs/execution/STUDENT_WORKFLOW_MATRIX.md` |
| Parent/Guardian | `references/approved/packs/VSchool_Parent_Guardian_Design/workflow-catalog.json` | `docs/execution/PARENT_GUARDIAN_WORKFLOW_MATRIX.md` |
| Principal | `references/approved/packs/VSchool_Principal_Leadership_Workflows/workflow-catalog.json` | `docs/execution/PRINCIPAL_WORKFLOW_MATRIX.md` |

All catalogue paths above are below `docs/execution/VSchool_Execution_Pack/`.

## Key implementation evidence

- Administrator foundation and Phase 1: `docs/evidence/ex-04/` through `ex-14/`, `admin-*/`, `sa-comp-*/`.
- Guardians/Student access: `parent-guardian-foundation-2026-10-13`, `parent-student-integration-2026-10-14`, `student-workspace-2026-10-14`.
- Teacher Attendance and shell: `teacher-attendance-milestone-2026-10-13`, `teacher-classes-2026-10-13`, `teacher-attendance-history-2026-10-13`, `teacher-visual-completion-2026-10-13`.
- Timetable/cover: `admin-tt-01-2026-10-12` through `admin-tt-05-2026-10-12`, `teacher-timetable-2026-10-13`, `principal-f07-cover-2026-10-17`.
- Learning: `learning-publication-2026-10-15`, `learning-text-submission-lea-03-2026-10-15`, `learning-feedback-lea-04-2026-10-16`, Principal LEA-17–19 evidence.
- Communication/Documents: `communication-par-14-2026-10-15`, `communication-stw-27-28-2026-10-15`, `principal-f10-*`, `principal-lea-32-attachments-2026-10-18`.
- Assessments: `principal-f11-b-assessment-planning-2026-10-18`, `principal-f11-c-assessment-marks-2026-10-18`, `principal-f11-d-assessment-moderation-2026-10-19`, `principal-lea-22-report-publication-2026-10-18`.
- Principal: row-specific evidence under `docs/evidence/principal-*`; current navigation evidence under `docs/evidence/principal-navigation-regrouping-2026-10-18/`.

`WORKFLOW_STATUS.csv` contains the row-level evidence paths and historic tested-source provenance.

## Targeted audit checks

| Check | Result |
|---|---|
| Git HEAD/status inspection | HEAD `d6c9120`; pre-existing unrelated dirty files preserved |
| Existing demo health | `http://127.0.0.1:3400/api/health` ready |
| Served build identity | `jCObsKqoFwjNr2pibKzUn`; `.next/standalone` process working directory |
| Development Prisma migration status | 117 migrations, up to date |
| Test Prisma migration status | 117 migrations, up to date |
| Workflow CSV reconciliation | 250 unique catalogue rows; workspace totals reconcile |
| Navigation browser inspection | Sequential 1440×1000 and 390×844; Administrator, Teacher and Principal captured; Student/Parent had no current chooser option |

No build, migration, seed command, application test suite or broad browser suite was run for this audit.
