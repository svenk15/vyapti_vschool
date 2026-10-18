# M01–M08 review-gap closure

Date: 18 October 2026 (Asia/Kolkata)

This bounded checkpoint closes four evidence gaps against the existing M01–M08 candidate. It changes no application code, owner contract, authorization rule, schema, migration or approved visual system. Human acceptance remains **PENDING**.

## 1. Coordination source provenance

The two resolved requests are separate scenarios:

| Scenario | Displayed source | Matching resolution evidence | Capture |
|---|---|---|---|
| Missing-register follow-up | `Scheduled` | “The scheduled source remains correctly configured and requires no Attendance change.” The immutable history states that the scheduled register remains authoritative. | [desktop](screenshots/missing-register-resolved-scheduled-desktop.png), [mobile](screenshots/missing-register-resolved-scheduled-mobile.png) |
| Session setup review | `Cancelled` | “Attendance cancellation revision 1 resolved the duplicate session.” | [desktop](screenshots/session-setup-resolved-cancelled-desktop.png), [mobile](screenshots/session-setup-resolved-cancelled-mobile.png) |

The previously packaged `coordination-resolved` image selected the cancelled session-setup review. That was an evidence-selection defect. The missing-register product state and its corrected resolution wording are consistent; no new product defect was found.

## 2. Exact Student “Your work” state

The existing `Submitted habitats review` fixture was opened at its real Student work route with `work=1`. The capture shows the original **Your work** composition, accepted receipt, published guidance and submitted response: [submitted/feedback desktop](screenshots/student-original-your-work-submitted-desktop.png).

The page contains none of the draft-only controls or instructions:

- no “Write your response” editor;
- no “Save draft” action;
- no “Review submission” action;
- no “Submit assignment” action.

This verifies the requested page itself. Assignment-details evidence was not used as a substitute.

## 3. Connected Teacher → Student → Parent Learning scenario

One new immutable assignment was used for the focused walkthrough:

- title: **Connected learning review · 18 Oct 2026**;
- deadline: **5 Nov 2026, 15:30 (Asia/Kolkata)** (`2026-11-05T10:00:00.000Z`);
- Teacher credentials: ignored `artifacts/people-02/private-demo.json`;
- Student credentials: ignored `artifacts/students-portal/private-demo.json`;
- Parent credentials: ignored `artifacts/guardians-01/private-demo.json`.

The three sessions used separate authorized accounts. The Teacher published the assignment to the frozen audience, the selected Student saved a fresh private draft and submitted it, and the Teacher saved private feedback before publishing version 1. The Student then reloaded the exact **Your work** route and saw the immutable response plus published guidance. The selected Parent saw the same title and deadline through the frozen Parent binding, but neither the Student response nor Teacher feedback.

Evidence:

- Parent list and exact title/deadline: [desktop](screenshots/parent-shared-assignment-desktop.png)
- Parent read-only detail: [desktop](screenshots/parent-shared-assignment-detail-desktop.png)
- Student accepted submission: [desktop](screenshots/student-your-work-submitted-desktop.png)
- Teacher published feedback: [desktop](screenshots/teacher-published-feedback-desktop.png)
- Student submitted response and feedback: [desktop](screenshots/student-your-work-feedback-desktop.png), [mobile](screenshots/student-your-work-feedback-mobile.png)
- Persisted IDs, audience bindings and immutable versions: [connected-learning-scenario.json](connected-learning-scenario.json)

Two older immutable records named `Local habitats field notes` remain in the development database. One remains visible to this family under its existing frozen audience. They were not deleted, renamed or rebound. The newly exercised scenario uses a distinct title so reviewers can identify the exact Teacher, Student and Parent journey without rewriting history or broadening access.

## 4. Reference classification

Placeholder and workflow-explorer captures are **shared-pattern reviews**, not proof of exact page-level visual identity. The application captures in this directory prove the requested current states and interactions. They are not labelled as exact reference matches where the approved pack has no exact production state.

## Focused verification

- Running candidate: `http://127.0.0.1:3400`, health `ready: true`.
- Candidate HEAD at capture start: `79e8602ff6bcf34c7101abd12de4387d88042e67`.
- Served build ID remained `6HsxC8NaJEOapzYcQQBcg`; no rebuild was performed because application code did not change.
- Browser walkthrough used Chromium at 1440×1000 and 390×844. The exact Student state assertions checked that all four draft-only UI elements were absent after submission/feedback.
- Local persistence evidence confirms one accepted attempt and one published feedback version for the designated assignment. Writes occurred only through the existing UI/API owner flows; the database queries used for the manifest were read-only.
- The Coordination captures were reused from the already focused, current candidate journey because the application state was unchanged.

No product defect was found in these four gaps. The confirmed issues were evidence selection and insufficiently precise labelling. Existing font portability, native accessibility, 200% browser zoom, TEN-03, production-policy and human-acceptance gates remain open.
