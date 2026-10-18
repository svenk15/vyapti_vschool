# M01–M08 human walkthrough

Allow 30–45 minutes. Use `http://127.0.0.1:3400`. Run `pnpm demo:seed` only if the documented fictional fixtures are missing; repeated runs are guarded and non-destructive.

Credential values stay in ignored private files:

- Administrator, Principal and Teacher: `artifacts/people-02/private-demo.json`
- Parent: `artifacts/guardians-01/private-demo.json`
- Student: `artifacts/students-portal/private-demo.json`
- Exact Communication recipient/reviewer scenario: `artifacts/communication-01/private-demo.json`
- Exact Learning scenario: `artifacts/learning-01/private-demo.json`
- Exact assessment/report scenario: `artifacts/assessment-publications-01/private-demo.json`
- Exact Coordination scenario: `artifacts/coordination-01/private-demo.json`

The primary fictional context is **VSchool People … / MAIN**, **Demo Section A**, **Mathematics Demo**, dated **18 October 2026**. Module-specific credential files retain narrow purpose grants and may use another clearly fictional school; this avoids broadening the primary personas merely for review.

Automated checks already verified persistence, isolation, replay, stale versions and negative authority. Your task is to judge clarity, correctness of visible outcomes and usability.

## 1. School Administrator — 8–10 minutes

1. Sign in with the Administrator entry from the People credential file and choose **School administration**.
   - Expect the Today page and grouped navigation: Today, Teaching & academics, People & access, Communication & work, optional Services, and School management.
   - Compare [desktop](screenshots/candidate-administrator-desktop.png) or [mobile](screenshots/candidate-administrator-mobile.png).
2. Open **Academics**, then **Classes**.
   - Expect the open synthetic year, Grade 8 / Demo Section A, Mathematics Demo and the assigned Teacher.
   - Compare [Classes](screenshots/m02-classes-desktop.png).
3. Open **Students**, choose the fictional Demo Student and inspect enrollment plus separate Parent and Student access panels.
   - Expect exact scoped access; no credential/token values are displayed.
   - Compare [registration](screenshots/m03-registration-desktop.png) and [mobile access](screenshots/m03-student-access-mobile.png).
4. Open **Timetable**, then **Attendance**.
   - Expect a published schedule and explicit Submitted/Scheduled/Awaiting states. OPEN must not be labelled absent.
   - Compare [timetable](screenshots/m04-timetable-desktop.png).
5. If using the Communication fixture, open **Communication** and inspect the proposal list.
   - Expect title/revision, audience/recipient count, and publication/read status to be visually separate; approval alone must not claim publication.
   - Compare [author](screenshots/m05-author-desktop.png).

Result: [ ] PASS  [ ] ISSUE  [ ] NOT TESTED

Notes:

## 2. Teacher — 6–8 minutes

1. Sign out, sign in with the Teacher entry and choose **Teaching**.
   - Expect seven dated sessions and one submitted register; other sessions have explicit actions.
   - Compare [desktop](screenshots/candidate-teacher-desktop.png) or [mobile](screenshots/candidate-teacher-mobile.png).
2. Open **My classes**.
   - Expect only the currently assigned class and no Administrator controls.
   - Compare [mobile class](screenshots/m02-teacher-classes-mobile.png).
3. Open one scheduled register, mark every pupil, review totals, then use Back once.
   - Expect marks retained in the active flow and focus moved to the stage heading.
   - Do not submit if you want to preserve the shared demo state.
4. Open **Assignments** and inspect the published assignment/feedback scenario.
   - Expect exact class ownership and no access to another Teacher’s work.
   - Compare [assignment](screenshots/m06-teacher-assignment-desktop.png).

Result: [ ] PASS  [ ] ISSUE  [ ] NOT TESTED

Notes:

## 3. Parent/Guardian — 5–7 minutes

1. Sign out and sign in with the Parent entry. It should redirect directly to **Family** without offering staff workspaces.
   - Expect only authorized child contexts; switching child must replace all scoped content.
   - Compare [desktop](screenshots/candidate-parent-desktop.png) or [mobile](screenshots/candidate-parent-mobile.png).
2. Open **Attendance** for the selected child.
   - Expect submitted factual marks and an awaiting-submission label for an open register; no inferred absence.
3. With the Communication Parent fixture, open **Messages**, read the published notice and inspect acknowledgement state.
   - Expect the exact immutable version and explicit acknowledgement.
   - Compare [message](screenshots/m05-parent-message-desktop.png).
4. Open **Learning**.
   - Expect **Local habitats field notes** for the connected learner and assignment instructions only. Private Student draft, submitted response and Teacher feedback must remain absent.
   - Compare [Learning](screenshots/m06-family-learning-desktop.png).
5. With the assessment Parent fixture, open **Results** and download the available synthetic report; inspect the withdrawn item.
   - Expect authorized private download only for the current child and no download action after withdrawal.
   - Compare [report](screenshots/m07-family-report-mobile.png) and [withdrawn](screenshots/m07-withdrawn-desktop.png).

Result: [ ] PASS  [ ] ISSUE  [ ] NOT TESTED

Notes:

## 4. Student — 5–7 minutes

1. Sign out and sign in with the Student entry. It should redirect directly to **Student**.
   - Expect only accepted Student contexts; switching must replace the ribbon and scoped content.
   - Compare [desktop](screenshots/candidate-student-desktop.png) or [mobile](screenshots/candidate-student-mobile.png).
2. Open **Attendance** and **Timetable**.
   - Expect own factual records and own published lessons only.
3. Open **Work**, then the accepted assignment.
   - Expect the feedback-available state to offer **Read feedback** without draft-submission instructions. The immutable response and published feedback remain Student-only.
   - Compare [feedback](screenshots/m06-student-feedback-mobile.png).
4. Open **Messages** using the Communication Student fixture.
   - Expect the same published notice version only when `communication.notice.read_self` is currently granted.
5. Open **Results** using the assessment Student fixture.
   - Expect only the Student’s own safe report download.

Result: [ ] PASS  [ ] ISSUE  [ ] NOT TESTED

Notes:

## 5. Principal — 7–10 minutes

1. Sign out, sign in with the People Administrator account and choose **Principal leadership**.
   - Expect branch-scoped summaries without pupil marks or private Student work.
   - Compare [desktop](screenshots/candidate-principal-desktop.png) or [mobile](screenshots/candidate-principal-mobile.png).
2. Open **Attendance**.
   - Expect received, due, awaiting and not-yet-due counts to remain distinct.
   - Compare [coverage](screenshots/m04-principal-coverage-mobile.png).
3. With the Communication reviewer fixture, open **Notice reviews**.
   - Expect only the assigned exact proposal revision and separate approve/return/reject stages.
   - Compare [reviewer](screenshots/m05-reviewer-mobile.png).
4. Open **Learning** and **Assessments**.
   - Expect aggregates and publication status without private Student response text.
   - Compare [report publication](screenshots/m07-publication-desktop.png).
5. With the Coordination fixture, open **Assigned follow-ups**, inspect the awaiting item and its verified history.
   - Expect source facts, separate proposer/verifier identity and append-only history. Assignment must not grant Attendance mutation rights.
   - Compare [awaiting](screenshots/m08-awaiting-desktop.png) and [verified](screenshots/m08-verified-mobile.png).

Result: [ ] PASS  [ ] ISSUE  [ ] NOT TESTED

Notes:

## Final review record

Overall: [ ] PASS  [ ] ISSUE  [ ] NOT TESTED

Issue references:

Native VoiceOver/NVDA, actual 200% browser zoom, TEN-03 restricted-role/RLS proof and production provider/storage/retention checks were not performed by this walkthrough and remain separate release gates.
