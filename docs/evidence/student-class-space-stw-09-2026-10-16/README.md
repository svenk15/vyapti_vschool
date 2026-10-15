# STW-09 Student class-space evidence — 16 October 2026

Status: current-class implementation slice VERIFIED; complete STW-09 PARTIAL; human review PENDING.

## Contract and source

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Student_Design/VSchool_Student_Review.html#/flow/STW-09`.
- Application routes: `/student/classes` and `/student/classes/[offeringId]`.
- Verified working tree was based on `cf06336`; the focused checkpoint commit containing this record is the executable source reported at handover.
- Database state: no schema or migration change. Development and test retain 62 applied migrations.
- Seed state: no new fixture was required. The focused PostgreSQL/browser fixture uses Environmental science. The existing development seed already owns the current Enrollment/Placement, Mathematics Demo Offering, dated TeacherAssignment and one published assignment; a private live probe confirmed the new class route and filtered published-work link. Existing credentials and manually created records were not changed.

The current slice reads only active CourseOfferings for the exact Student's current dated Enrollment and SectionPlacement. Every read rechecks the live account/token, accepted exact Student access, `learning.assignment.read_self`, tenant/branch scope and Student/Academics/Staff/Homework release, entitlement and activation. A candidate offering must occur in that freshly authorized result. The DTO contains only class, subject, offering and effective Teacher facts. It excludes rosters, classmates' marks, guardian contacts and private Teacher notes.

The class detail reaches published work through the existing separately authorized Learning subject query and reaches the Student timetable through its existing guarded route. Ended enrollment/placement or revoked access returns no class data. Files and permitted resource downloads remain absent because no approved Files owner, scanning or short-lived scoped-link contract exists.

## Verification

| Check | Result |
|---|---|
| `pnpm typecheck` | PASS |
| Focused ESLint for changed source/tests | PASS |
| `pnpm test:functional test/functional/learning-publication.test.ts` | PASS — 14/14 on real `vyapti_vschool_test` PostgreSQL, including current class facts, cross-Student denial and live access revocation |
| `VSCHOOL_E2E=1 pnpm build` | PASS |
| Focused Playwright Chromium, one worker | PASS — 1/1 |
| Focused Playwright mobile, one worker | PASS — 1/1 |
| Documentation, boundary, backend and database-design checks | PASS — 30 tasks/links/design/dependencies, portable boundaries, backend TypeScript and 96 table contracts |
| Final normal production build | PASS — build ID `9f46d95D5aBwDEkBT6GSa` |

The browser journey signs in the exact fictional Student, opens the current class directory, focuses and opens Environmental science, follows **View published work**, verifies the server-side subject query and published assignment, then runs the unchanged submission/feedback journey. It finally ends the dated placement after establishing the Student session and proves that the protected class route redirects to the existing fail-closed workspace-unavailable state. The repeated final browser runs were required because the first visual inspection found the class actions inheriting a full-width list composition, and the first ended-placement test signed in only after the context had correctly ceased to exist. The code changed for the action composition; the failure expectation changed to the established unavailable behavior without weakening product assertions.

## Direct visual comparison

Reference and application were served independently and inspected at 1440×1000 and 390×844, device scale factor 1, `en-GB`, `Asia/Kolkata`, reduced motion:

- [Reference directory — desktop](reference-directory-chromium.png)
- [Application directory — desktop](application-directory-chromium.png)
- [Reference detail — desktop](reference-detail-chromium.png)
- [Application detail — desktop](application-detail-chromium.png)
- [Reference directory — mobile](reference-directory-mobile.png)
- [Application directory — mobile](application-directory-mobile.png)
- [Reference detail — mobile](reference-detail-mobile.png)
- [Application detail — mobile](application-detail-mobile.png)
- [Ended-placement unavailable state — desktop](application-ended-chromium.png)
- [Ended-placement unavailable state — mobile](application-ended-mobile.png)

The shared Student shell, content width, title hierarchy, context surface, cards, spacing, actions and responsive bottom navigation use the approved design tokens. The final application has no observed horizontal overflow in either captured viewport. Keyboard focus on **Open class** is exercised by Playwright.

Visual status is **DIRECT_PARTIAL**. The approved STW-09 state is a generic two-stage design walkthrough with reviewer input and guidance cards; production renders an operational real-data directory/detail and does not ship prototype review controls. The supported user outcome and permission boundary are present. The reference's permitted-resource step cannot be rendered as functional until its owner contract exists. The known body-font portability exception, native VoiceOver/NVDA checks and actual browser 200% zoom remain unperformed.

## Manual review

Human acceptance remains PENDING. Use the Student persona in ignored `artifacts/students-portal/private-demo.json`:

1. Sign in and choose **My classes**. Expect only the Student's current **Mathematics Demo** class and current Teacher.
2. Choose **Open class**. Expect class facts and no roster, classmates' marks, guardian contacts or Teacher notes.
3. Choose **View published work**. Expect Assignments filtered by Mathematics Demo with one fictional published assignment.
4. Return and choose **Open timetable**. Expect the existing exact Student published timetable.
5. Revoke this Student's Learning purpose through the existing authorized Administrator flow, then refresh. Expect class access to fail closed rather than retain protected data.

Production release remains blocked by TEN-03 and the established release gates. This evidence does not imply human acceptance or Files/resource support.
