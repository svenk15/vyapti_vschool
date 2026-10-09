<!-- TT-01 contract -->
## TT-01 integration
See [the shared timetable source of truth](timetable/README.md) and [persona mapping](TIMETABLE_INTEGRATION.md). Existing task and verification entries below are baseline unless explicitly refreshed in timetable-evidence.json.

# Student Workspace — Edition 01
Design proposal · 8 October 2026 · 47 workflows across 12 areas.

The workspace answers three questions: **What do I have today? What should I complete next? What feedback can help me improve?** It is a student-facing composition over owner modules, not another owner of academic, attendance or financial records.

## Shared baseline
Inherit Operator 03.9, School Administrator 01, Teacher 01 and Parent & Guardian 01. Keep the same semantic tokens, navigation, icon language, spacing, tables, dialogs, search, filter and sort components. Use a calm, respectful tone without infantilizing older learners. Default navigation shows enabled tasks; absence of a module does not leave dead navigation, empty widgets or upsell prompts.

These are UX specifications and candidate technical contracts. Current repository implementation and physical schema have not been assessed in this pack. No task is marked implemented or accepted. The current Bible and newer approved ADRs take precedence when reconciled.

## Release mapping
| Phase | Student contribution | Required owner contracts |
|---|---|---|
| 2, proposed persona extension | School-issued access, enrollment context, self attendance, notices, authorized conversations, owned requests/account | Access trust policy; student account binding; active enrollment; attendance read projection; student-audience communication |
| 3 | My day/timetable/classes; published assignments; private drafts; checked attachments; submissions/receipts; returned feedback; calendar | Published schedule; Learning and file pipeline; versioned attempts and teacher review integration |
| 4 | Published reports, authorized downloads and result questions | Assessment publication, scale and authorized document generation |
| 5 | No default student finance workflow | Financial authority belongs to explicit payer roles, not inferred from student status |
| 6 | Independently enabled library, activity, transport and support journeys | Each service's allocation, consent, approval and visibility policy |
| 7 | Source-linked learning help | Approved retrieval/provider/privacy and assessment-use policy; no autonomous school actions |

Phase numbers preserve the supplied persona-pack blueprint, not a claim that these modules are already released. Student account availability in Phase 2 is a proposed extension requiring allocation in the real execution index. A full assignment workspace starts only when Phase 3 Learning owners are ready.

Scope extensions: extension request (STW-20), persistent/offline assistance design (STW-21), student attendance query (STW-26), event interest (STW-32), activity participation (STW-41), wellbeing support (STW-43). Designs do not automatically approve them. The prototype uses in-memory draft handling only.

## Personas and access
The primary user is a school-authorized student who can use an individual account. Account eligibility and assisted access depend on school policy. Do not infer consent or capability from an age threshold invented by this pack. Younger learners may continue through the guardian experience; that is a different principal, not a student impersonation toggle.

Global UserAccount → verified institution-local StudentAccountLink → active Enrollment → permitted offering/audience/action. A role name, matching email, account activation, browser-supplied admission number, or family relationship alone is insufficient. An account may have its own contexts at more than one institution; every context has its own student ID, branch, year and grants.

A guardian may read a published/returned artifact only through a separate purpose grant. Guardian access does not imply draft access, student submission, consent signing, payment or unrestricted sibling access.

## Experience boundaries
- Student sees own assigned work, never a class roster or peer marks.
- Teacher-only annotations, draft feedback and moderation stay out of DTOs, not merely hidden in CSS.
- Save draft, upload complete, submission received, returned feedback, published mark and approved request are distinct.
- No default student finance, admission administration, guardian linking, pickup authorization or self-edited attendance.
- Library, activities, transport and care are independent capabilities. No live vehicle tracking or continuously monitored support service is implied.
- No streaks, public rankings, fabricated learning scores or pressure-oriented countdowns.
- Branding changes approved tokens and published assets. It cannot change authorization or inject CSS/script.

## Core review journey
My day → assignment instructions → write response → save private draft → check file → review submission → receipt → returned feedback → permitted revised attempt. Include late/closed, lost response, changed policy, permission withdrawal and shared-device states in the same design.

## Prototype boundary
The standalone HTML is a synthetic browser application. It keeps fictional data in tab memory, makes no network requests, uploads no file contents and connects to no real identity, teacher, messaging, school, database or AI service. Refresh resets the fixture. Review controls simulate states and are not production UI.

Core routes are connected. All 47 workflows also have a guided two-step design review; those walkthrough receipts are explicitly not school actions. Downstream specialist workflows remain proposals until their owner LLD and policy decisions are approved.
