# Workspace navigation correction map

Recorded before the presentation-only navigation edit on 19 October 2026. Every destination retains its existing route, live visibility check and independent page/API authorization. Grouping does not grant access.

## Administrator

| Existing item | Existing group | Target group |
|---|---|---|
| Today | Daily work | Direct |
| Attendance | Daily work | Direct |
| Students | Daily work | Direct |
| Calendar & events | Daily work | Communication |
| Reports | Daily work | Reports |
| Academics | Teaching & academics | Teaching |
| Classes and teachers | Teaching & academics | Teaching |
| Assessments | Teaching & academics | Teaching |
| Timetable | Teaching & academics | Teaching |
| Cover coordination | Teaching & academics | Teaching |
| Staff & access | People & access | Staff |
| Staff profiles | People & access | Staff |
| Staff availability | People & access (runtime) | Staff |
| Communication | Communication & work | Communication |
| My requests | Communication & work (runtime) | My work |
| Assigned follow-ups | Communication & work (runtime) | My work |
| School setup | School management | School settings |
| School settings | School management | School settings |
| Branch module access | School management | School settings |
| Sign-in branding | School management | School settings |
| Branch activity | School management | School settings |
| Admissions | School management | School operations |
| Imports | School management | School operations |
| Facilities incidents | Services (runtime) | School operations |
| Financial exceptions | Services (runtime) | School operations |
| Support procedure | School management (runtime) | School operations |

## Teacher

| Existing item | Existing group | Target group |
|---|---|---|
| My teaching day | Teaching | Direct `My day` |
| My classes | Teaching | Teaching |
| My timetable | Teaching | Teaching |
| Attendance history | Teaching | Teaching |
| Assignments | Teaching | Learning |
| Assessment marks | Teaching | Learning |
| Cover requests | Teaching | My work |
| Meetings | Teaching | My work |
| Specialist support | Teaching | My work |
| My account | Personal | Account |

## Student

| Existing item | Existing group | Target group |
|---|---|---|
| My day | My school day | Direct |
| My classes | My school day | Learning |
| Assignments | My school day | Learning |
| Results | My school day | Learning |
| My timetable | My school day | School life |
| School calendar | My school day | School life |
| Attendance | My school day | School life |
| Messages | My school day | School life (`Notices` label retained as the target concept; route remains unchanged) |
| My profile | My school day | Personal |
| My account | Personal | Personal |

## Parent / guardian

| Existing item | Existing group | Target group |
|---|---|---|
| Home | Family | Direct |
| My children | Family | Direct |
| Learning | Family | Learning |
| Results | Family | Learning |
| Attendance | Family | School day |
| Child's timetable | Family | School day |
| School calendar | Family | School day |
| Messages | Family | Communication |
| Concerns | Family | Communication |
| Meetings | Family | Communication |
| My account | Personal | Account |

The mobile shortcut order is fixed as Home, Attendance, Timetable when authorized, Messages when authorized, then More. A missing Messages permission no longer causes Timetable to occupy the Messages slot.

## Principal

The operational groups already match the approved target: My day, Attendance, Teaching & staff, Communication, My work, and Reports & insights. `Conditional areas` becomes `School operations`; `Utilities` becomes `Account & access`. Financial exceptions, Facilities incidents, Restricted support, acting-access delegation and Account keep their existing conditions and routes.

## Interaction contract

Administrator and Principal operational groups may use disclosure controls because their catalogues are long. Teacher, Student and Parent use static muted group labels without nested disclosure. Deep links continue to select the most specific route. Mobile drawers retain focus containment, Escape closure and focus return; the independently scrolling navigation remains above the account/sign-out footer.
