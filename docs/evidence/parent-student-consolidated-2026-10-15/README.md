# Parent/Student consolidated delivery checkpoint

Date: 15 October 2026. Human review: **PENDING**.

## Source and runtime

- Repository HEAD before this documentation checkpoint: `4afcec91e72ff7cd8772c6638f40b5f5bef04f64`.
- Running application build: `df1fa621efbd70fed8fcc0db07482e45636b6cc6`, the latest application-code commit. The two later commits (`af58e8d`, `4afcec9`) change decision documents only.
- Demo: `http://127.0.0.1:3400`; `/api/health` returned `ready: true` after replacing an unresponsive project-owned server with the preserved verified build.
- Development schema: Prisma reported **52 migrations** and **Database schema is up to date**. No migration was applied or changed during consolidation.
- Seed: `pnpm demo:seed`. Its latest recorded current-feature run is repeat-safe for Parent, Student, Timetable and Communication fixtures and preserves existing credentials and user-created rows. Unrelated optional TEN-02/ACA-01/Branding refresh conflicts remain honestly recorded; no seed was rerun solely for this handover.

Private local credential files:

- Administrator: `artifacts/people-02/private-demo.json`
- Parent foundation/two-child context: `artifacts/guardians-01/private-demo.json`
- Parent notice journey: `artifacts/communication-01/private-demo.json`
- Student/two-school context: `artifacts/students-portal/private-demo.json`

## Demonstrable journeys

| Persona | User journey | Required school-side counterpart | Status/evidence |
|---|---|---|---|
| Administrator → Parent | Find/register a Student, open the exact registration receipt, authorize Parent purposes, issue/resend an invitation, inspect state and remove that exact child access | `student.manage` plus designated `family.access.manage`; registration stays committed if invitation delivery fails | Engineering complete: [integration checkpoint](../parent-student-integration-2026-10-14/README.md) and [Parent foundation](../parent-guardian-foundation-2026-10-13/README.md) |
| Parent | Accept as the intended new/existing account, sign in, select only authorized children, read summary/Attendance/published Timetable, switch child without stale content, open Account and sign out | Exact accepted child link and independently granted read purposes | Engineering complete for PAR-01–04, 06–08, 10 and 50; PAR-18 remains partial only for non-Timetable Calendar/Events |
| Administrator → Parent notice | Publish immutable text notice to a Section; inspect frozen audience and acknowledgement aggregate | Current `communication.publish`, explicit `CommunicationPublisherGrant`, enabled Communication module | Engineering complete: [COM-01 / PAR-14](../communication-par-14-2026-10-15/README.md) |
| Parent notice | Reach Messages through normal navigation, read exact current version and acknowledge it explicitly | Exact live `communication.notice.read` purpose and frozen Parent recipient binding | Engineering complete for PAR-14 |
| Administrator → Student | Authorize exact Student access, issue/resend setup and revoke one exact portal link independently | Designated `student.access.manage`; no staff/Guardian role substitution | Engineering complete: [Student workspace](../student-workspace-2026-10-14/README.md) |
| Student | Activate/sign in, switch between two independently authorized school contexts, read own Profile, published Timetable and factual Attendance, then sign out | Exact account→Person→Student binding, active Enrollment/Placement and three independent self-read purposes | Engineering complete for STW-01–05, 07 and 25; [integration checkpoint](../parent-student-integration-2026-10-14/README.md) |
| Student day | See current class and deterministic next published lesson, or an honest no-more-classes/unavailable state | Existing guarded Timetable self projection | Verified bounded slice; STW-06 remains partial pending Learning: [next-class evidence](../student-next-class-stw-06-2026-10-15/README.md) |
| Teacher → Student → Teacher work | Publish immutable text work, save/resume one private draft, confirm an on-time immutable submission, retain the receipt and let only the authoring current Teacher read accepted content | Exact frozen Learning recipient, live Student self purpose and current Teacher offering assignment | Engineering complete for STW-13, text-only STW-15 and STW-16: [LEA-03 evidence](../learning-text-submission-lea-03-2026-10-15/README.md) |

No Student notice screen or Attendance explanation request is represented as delivered. Their authority/lifecycle decisions remain open.

## Verification provenance

| Evidence | Source verified | Result and applicability |
|---|---|---|
| Parent/Student integration browser + PostgreSQL | `41e2469` | Parent functional 6/6, Student functional 5/5, desktop/mobile one-worker journeys passed. Covers registration handoff/delivery failure, wrong account, principal separation, two-context switching, cross-child/scope denial, revocation and six-day Timetable. The affected code remains unchanged. |
| Student next-class unit/browser/build | `2e524c5` | Unit 2/2 and desktop/mobile one-worker journeys passed with a real published occurrence; matched images inspected. |
| Communication unit/PostgreSQL/browser/build | `df1fa62` | Unit 2/2, PostgreSQL 2/2 and desktop/mobile one-worker Administrator→Parent journey passed after 52 migrations. Covers publisher/purpose denial, frozen manifest, replay, exact-version read/ack and denial after revocation. |
| Repository gates | `df1fa62` | TypeScript, lint, backend/boundary/database-design/docs checks and production build passed. No application source changed afterward. |
| Consolidation runtime checks | preserved `df1fa62` build | Health endpoint ready; development migration status up to date at 52. |

The only shared presentation changes after the earlier combined integration were a new `mail` icon, an eligibility-filtered Administrator Communication destination, one Parent Messages destination and notice-scoped CSS/classes. The current Communication browser journey exercised the changed Administrator and Parent shells. Student and Teacher navigation implementations were not changed; their prior current-source evidence remains applicable. The appended CSS selectors are notice-scoped. No broad suite was rerun without a concrete changed surface.

## Visual comparison

The matched 1440×1000 and 390×844 Communication reference/application images were directly inspected again during consolidation. The Parent notice retains the approved hierarchy, child context, reading card and acknowledgement/back actions; real school/content values replace prototype samples. The application omits unimplemented Requests/Calendar destinations and uses the documented Inter/system font substitution.

Relevant evidence:

- Parent foundation: `docs/evidence/parent-guardian-foundation-2026-10-13/`
- Parent/Student integration: `docs/evidence/parent-student-integration-2026-10-14/`
- Student workspace: `docs/evidence/student-workspace-2026-10-14/`
- Student next class: `docs/evidence/student-next-class-stw-06-2026-10-15/`
- Communication notice: `docs/evidence/communication-par-14-2026-10-15/`

Reference-less security compositions remain labelled extensions. The approved font asset provenance, native VoiceOver/NVDA, actual browser zoom, human visual acceptance, TEN-03 and production provider/security reviews remain pending.

## Completion accounting

- Parent: 52 workflows = 12 engineering complete, 2 partial and 38 blocked on product decisions or owner design. Human review is pending for every row.
- Student: 47 workflows = 11 engineering complete, 7 partial and 29 blocked. The read-only Profile extension remains outside the 47-item catalog.
- Combined: 99 catalog workflows = 23 engineering complete, 9 partial and 67 blocked/not started. Each catalog workflow is counted once; bounded engineering tasks do not make their parent workflow complete.

## Manual walkthrough

1. Open `http://127.0.0.1:3400/login` and use the Administrator credential file. In **Students**, find a seeded Student, inspect their record, then use Parent access or Student access to review invitation/delivery state. Use the dedicated revoked fixture for removal; keep the main persona intact.
2. In **Communication**, publish or open the seeded Section notice and inspect its frozen audience/status. Sign out.
3. Sign in with `artifacts/communication-01/private-demo.json`, open **Messages**, read the notice, acknowledge it and reload. The exact-version acknowledgement remains. For the broader Parent journey, use `artifacts/guardians-01/private-demo.json`, switch children, and open **Attendance**, **Child's timetable** (the retained published lesson is in the week beginning 26 October 2026), **My account**, then sign out.
4. Sign in with `artifacts/students-portal/private-demo.json`. Switch between the two authorized school contexts and verify Profile, Timetable and Attendance all replace the previous context. The primary development persona has no remaining class on 15 October, so the home correctly shows the no-more-classes state; populated next-class behavior is preserved in focused browser evidence rather than rewriting history.
5. Return to the Administrator using the private credential file and inspect the dedicated revoked fixtures. Revoking one Parent child link or one Student context denies that protected scope on the next request while unrelated authorized contexts remain usable.

## Decisions and resume point

The consolidated decision list is [Parent/Student decisions](../../execution/PARENT_STUDENT_DECISION_LIST.md). The recommended next capability is COM-02 Student school notices after explicit approval of its Student purpose, frozen audience, transfer/revocation and withdrawal rules. Attendance explanations remain blocked until submitter eligibility, reviewer authority, visibility and protected-text retention are approved. Existing complete journeys and the running demo do not depend on either decision.
