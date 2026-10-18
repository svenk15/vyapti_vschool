# Must-have journeys

This file is the bounded execution contract. Owner detail stays in the linked module designs and current-state records.

## M01 — Workspace access and trustworthy personas

- **Catalogue slices:** SA-01; TEA-01/03; STW-01–04; PAR-01–04/08; LEA-01.
- **People/routes:** Administrator `/admin`, Teacher `/teacher/today`, Student `/student`, Parent `/family`, Principal `/leadership`; shared `/sign-in`, `/choose-workspace`, recovery and sign-out.
- **Owners/dependencies:** [Access](../../modules/access/DESIGN.md), [Guardians](../../modules/guardians/DESIGN.md), [Students](../../modules/students/DESIGN.md), Tenancy; exact accepted account-to-Person and child/Student links, live branch/module state and current purposes are authority.
- **Outcome:** each fictional persona signs in and reaches only its intended current contexts; Parent child and Student context switching never creates staff authority.
- **Failure/recovery:** wrong-account invite, revoked link, foreign identifier, disabled module, expired session and recovery remain fail-closed. Sign-out ends the current session.
- **Persistence/contracts:** Access owns accounts/sessions; Guardians owns child access; Students owns Student portal access. No email match is an identity relationship.
- **Verification/seed:** focused Guardian/Student PostgreSQL tests, current-source five-persona browser smoke and the idempotent `demo-guardians`/`demo-student-portal` seed steps within `pnpm demo:seed`.

## M02 — School setup to an operational class

- **Catalogue slices:** SA-04/06/09–11/13–17; TEA-05/07/08.
- **People/routes:** Administrator `/admin/setup`, `/admin/school`, `/admin/academics`, `/admin/classes`, `/admin/teachers`, `/admin/users`; Teacher `/teacher/classes`.
- **Owners/dependencies:** [Tenancy](../../modules/tenancy/DESIGN.md), [Academics](../../modules/academics/DESIGN.md), [People](../../modules/people/DESIGN.md), Access. School Administrator plus each operation's live module/capability and exact Employee/Teacher eligibility.
- **Outcome:** persist an academic year/calendar, grade/section/subject, offering and dated Teacher assignment through the existing separate commands, then observe the authorized class as Teacher.
- **Failure/recovery:** invalid dates, duplicate codes, ineligible Teachers, unavailable scope and partial-step failures are explicit; saved steps survive reload.
- **Persistence/contracts:** each owner commits its own command, version, audit and receipt. No new cross-owner atomic command is implied.
- **Verification/seed:** existing Academics/People PostgreSQL evidence plus a current-source cross-persona browser journey and the academic/people demo seeds.

## M03 — Student registration to family access

- **Catalogue slices:** SA-18/19/23/24/32–34; STW-01–04; PAR-01–04/08.
- **People/routes:** `/admin/students/register`, Student detail/placement, `/admin/imports`, Student/Guardian access cards, `/student`, `/family`.
- **Owners/dependencies:** [Students](../../modules/students/DESIGN.md), [Imports](../../modules/imports/DESIGN.md), [Guardians](../../modules/guardians/DESIGN.md), Access. Exact Person/admission resolution and designated access managers remain authoritative.
- **Outcome:** register and place one Student, provision exact Student and Parent access, activate and enter both workspaces; CSV preview/confirm is the alternative registration path.
- **Failure/recovery:** duplicate identity/admission, row validation, partial import, delivery failure, resend, wrong-account acceptance, exact replay and per-child revocation are visible and non-destructive.
- **Persistence/contracts:** registration/placement/access commands remain distinct. Mail delivery is post-commit and cannot roll back Student creation.
- **Verification/seed:** existing Student/Import/Guardian PostgreSQL and browser evidence plus a current connected smoke; fictional seed records only.

## M04 — Timetable to Attendance and oversight

- **Catalogue slices:** SA-25–30/41/42; TEA-09–14/22/23; STW-07/25; PAR-10/11/18; LEA-08/16.
- **People/routes:** Administrator timetable and Attendance routes; Teacher `/teacher/timetable`, `/teacher/today` and assigned session; Student/Parent timetable and Attendance; Principal Attendance/timetable.
- **Owners/dependencies:** [Academics/Timetable](../../modules/academics/DESIGN.md), [Attendance](../../modules/attendance/DESIGN.md) and Students. Published revision, trusted occurrence link, current assignment, frozen roster and live purpose checks govern access.
- **Outcome:** publish/reconcile, submit one assigned register, read factual history/coverage and perform one guarded Administrator correction.
- **Failure/recovery:** manual collision, unknown submit outcome, stale version, revoked/cross-Teacher access and cancellation remain explicit; OPEN never means absent.
- **Persistence/contracts:** Timetable publication is immutable; Attendance exclusively owns sessions, submissions, corrections and history.
- **Verification/seed:** existing TT-01–TT-05 and Attendance PostgreSQL/e2e evidence plus connected current-source smoke and dated synthetic sessions.

## M05 — Notice to acknowledgement

- **Catalogue slices:** SA-35/36; STW-27/28; PAR-14; LEA-32–34.
- **People/routes:** Administrator Communication author/review/publish, Student/Parent Messages, Principal Notice coverage.
- **Owners/dependencies:** [Communication](../../modules/communication/DESIGN.md), Documents only for preserved optional attachments. AUTHOR/reviewer/publisher designations and frozen current-purpose recipients are authority.
- **Outcome:** publish a text notice, read and acknowledge its exact immutable version, and reconcile Principal coverage.
- **Failure/recovery:** non-recipient/revoked access, withdrawal, replay and unavailable content fail safely; no provider delivery claim.
- **Persistence/contracts:** Communication owns proposals, publications, recipients, reads and acknowledgements.
- **Verification/seed:** COM/F10 PostgreSQL and browser evidence with Parent and Student fictional recipients.

## M06 — Assignment to feedback

- **Catalogue slices:** TEA-27–31; STW-10/11/15/16/18; PAR-20; LEA-17/18.
- **People/routes:** Teacher `/teacher/learning`; Student `/student/assignments`; Parent `/family/learning`; Principal `/leadership/learning`.
- **Owners/dependencies:** [Learning](../../modules/learning/DESIGN.md), Academics and Student access. Current assignment, frozen audience, deadline and per-persona purpose checks are authority.
- **Outcome:** publish text work, retain a private Student draft, explicitly submit, recover one receipt, publish Teacher feedback and read permitted projections.
- **Failure/recovery:** late/unauthorized access, lost response, changed evidence and cross-Student/Teacher reads are rejected without exposing private drafts.
- **Persistence/contracts:** Learning owns assignment versions, private drafts, immutable accepted submissions and published feedback.
- **Verification/seed:** LEA-01–04 PostgreSQL/browser evidence and the incremental Learning seed.

## M07 — Assessment to published report

- **Catalogue slices:** SA-46; TEA-33/34; STW-33/34; PAR-23/24; LEA-20–22.
- **People/routes:** Administrator `/admin/assessments`, Teacher `/teacher/assessments`, Principal `/leadership/assessments`, Student/Parent Results.
- **Owners/dependencies:** [Assessments](../../modules/assessments/DESIGN.md), [Documents](../../modules/documents/DESIGN.md). Recorder, independent moderator and publisher authorities remain separate.
- **Outcome:** configure a synthetic cycle, record/moderate/publish, then serve the correct safe report to its Student/Guardian audience.
- **Failure/recovery:** changed cohort/evidence, scanner unavailable/unsafe, wrong child/scope, withdrawn publication and stale replay fail closed.
- **Persistence/contracts:** Assessments owns outcome/publication history; Documents owns private bytes, scan state and authorized streaming.
- **Verification/seed:** F11 PostgreSQL/e2e evidence, real local scanner evidence where SAFE is required and dedicated withdrawal fixtures.

## M08 — Missing register to verified resolution

- **Catalogue slices:** LEA-08–11/15 and the supported assigned-worker counterpart.
- **People/routes:** Principal `/leadership/attendance` and `/leadership/follow-ups`; assigned worker source route and Coordination queue/detail.
- **Owners/dependencies:** [Coordination](../../modules/coordination/DESIGN.md) and Attendance. Assignment never grants Attendance authority; proposer and verifier are distinct.
- **Outcome:** create/routе a follow-up from an exact missing-register source, perform the permitted Attendance action, attach exact source evidence and independently verify resolution.
- **Failure/recovery:** unauthorized source action/verification, stale source, return/reassignment and exact replay remain explicit.
- **Persistence/contracts:** Coordination owns lifecycle/history; Attendance owns every Attendance mutation and evidence lookup.
- **Verification/seed:** LEA-08–11/15 PostgreSQL/browser evidence and the existing fictional missing-register scenario.

## Visual authority

The exact workflow references remain under [`references/approved`](../VSchool_Execution_Pack/references/approved/IMPLEMENTATION_START_HERE.md). Changed screens use their selected screen specification or the accepted shared production recipe at 1440×1000 and 390×844. Functional evidence, visual comparison and human acceptance remain separate.
