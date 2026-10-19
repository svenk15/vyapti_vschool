# Navigation map

Navigation visibility is a presentation projection. Every linked page and API independently rechecks current identity, tenant/branch scope, capability, module release, entitlement, activation and resource rules applicable to that operation.

## Administrator

Source: `components/workspace-navigation.ts`, filtered by `lib/server/admin-navigation.ts` and rendered by `components/admin-portal-frame.tsx`.

1. **Today** — `/admin`.
2. **People** — Students, Staff profiles, Staff access, Admissions.
3. **Teaching** — Classes & subjects, Teacher assignments, Timetable, Assessments, Cover coordination.
4. **Attendance** — Registers, Corrections, Explanations when the corresponding authorized routes are available.
5. **Communication** — Notices, Calendar & events.
6. **My work** — hidden until an authorized destination exists.
7. **Reports** — Attendance report.
8. **School administration** — School setup, School details, Modules, Branding & appearance, Imports, Activity.
9. **Additional services** — hidden until an authorized destination exists.

Today is direct. Other populated groups are collapsible. People and School administration begin deliberate major sections. The server filters every destination from live capability and module availability; empty groups do not render.

## Teacher

Source: `components/workspace-navigation.ts`, availability resolved in `app/teacher/layout.tsx` and rendered by `components/teacher-portal-frame.tsx`.

1. **My day** — `/teacher/today`.
2. **Teaching** — My classes, My timetable, Attendance history.
3. **Learning** — Assignments, Assessment marks.
4. **My work** — Cover requests, Meetings, Specialist support.
5. **Account** — My account.

Groups are visible section headings rather than disclosures, so daily destinations stay one click away. Each section after My day has an explicit major-section break. Unavailable destinations are omitted.

## Student

Source: `components/workspace-navigation.ts`, purpose filtered by `components/student-portal-frame.tsx`.

1. **My day** — `/student`.
2. **Learning** — My classes, Assignments, Results.
3. **School life** — My timetable, School calendar, Attendance, Notices.
4. **Personal** — My profile, My account.

The selected Student/school context is preserved in applicable links. The mobile bottom bar keeps My day, authorized Work and Messages, Account, and More; More opens the same canonical drawer. Purpose checks control optional destinations and every route reauthorizes the selected Student relationship.

## Parent / Guardian

Source: `components/workspace-navigation.ts`, purpose filtered by `components/family-portal-frame.tsx`.

1. **Family** — Home, My children.
2. **Learning** — Assignments, Results.
3. **School day** — Attendance, Child's timetable, School calendar.
4. **Communication** — Notices, Concerns, Meetings.
5. **Account** — My account.

Child-specific links preserve the authorized selected-child query. My account is deliberately account-wide and does not carry a child identifier. The bottom bar keeps child-specific Home, Attendance, Timetable and authorized Messages plus More. Switching a child performs a route navigation and all protected data reloads through the existing server context.

## Principal

Source: `components/principal-navigation.ts`, availability resolved in `app/leadership/layout.tsx` and rendered by `components/principal-portal-frame.tsx`.

1. **My day** — `/leadership`.
2. **Attendance** — Register coverage, Pupil attendance, Explanations, Correction requests.
3. **Teaching & staff** — Timetable & cover, Staff availability, Staff requests, Learning, Assessments.
4. **Communication** — Notice coverage, Notice reviews, Family concerns, Meetings.
5. **My work** — My decisions, Follow-ups, Handover.
6. **Reports & insights** — Reports, Decision history, Evidence assistant.
7. **School operations** — Financial exceptions, Facilities incidents, Restricted support.
8. **Account & access** — optional acting access and My account.

My day is direct. Capability-backed areas are collapsible; empty areas are omitted. Attendance, My work, Reports & insights, School operations and Account & access begin deliberate major sections. The map provides oversight destinations only and does not add Administrator mutation authority.

## State behavior

- The most-specific route match controls `aria-current="page"`.
- The containing disclosure is revealed for active nested routes.
- Multiple groups may remain expanded during in-workspace client navigation.
- Expanded disclosure styling and selected-route styling are distinct.
- Mobile destination navigation closes the drawer; Escape and backdrop dismissal return focus.
- Account and Sign out remain separate fixed-footer controls.
