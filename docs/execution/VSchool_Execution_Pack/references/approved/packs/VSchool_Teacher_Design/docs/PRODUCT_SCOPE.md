<!-- TT-01 contract -->
## TT-01 integration
See [the shared timetable source of truth](timetable/README.md) and [persona mapping](TIMETABLE_INTEGRATION.md). Existing task and verification entries below are baseline unless explicitly refreshed in timetable-evidence.json.

# Teacher product scope

Edition 01 · UX design proposal · 8 October 2026

A teacher’s workspace answers: **What am I teaching next? What needs a deliberate action? Has that action succeeded?** It should support a lesson in progress without exposing unrelated school administration.

## Baseline and coverage

The pack inherits Operator 03.9 and School Administrator 01. It represents the teacher journeys in their current module blueprint, including specialist handoffs. It does not claim to cover every jurisdiction, pedagogy or specialist role. Physical repository schemas and implementation status were not available for this design exercise; reconcile them before coding. Preserve approved newer Bible decisions.

| Phase | Teacher experience | Boundary |
|---|---|---|
| 1 | School entry, account/context, teaching day, assigned classes, minimal roster, session attendance, receipts/history, administrator correction handoff | Online-first. No persistent attendance draft, implicit attendance or teacher correction permission |
| 2 | Notices, authorized family conversations, delegated messaging, absence context | Guardian linking is school-owned. Offline assistance, correction requests and meeting scheduling need their own approved designs |
| 3 | Published timetable, cover assignments, lesson plans, resources, assignments, submissions, feedback, learning follow-up | Manual Phase 1 sessions do not imply recurring timetable support |
| 4 | Assessment setup within policy, marks entry, moderation submission and publication review | Teacher role does not imply approval or result-publication authority |
| 5 | No default financial workflow for Teacher | Fees/payments remain in their own persona/module. A staff member with a separate financial grant uses that explicit workspace |
| 6 | Restricted referrals, own staff requests, library/materials/facility requests and assigned duties | Each service requires release, enablement and a narrow grant; it is independently deliverable |
| 7 | Evidence-based teaching drafts with review | No autonomous pupil decisions, messages, grade changes or attendance writes |

Four journeys are explicit scope extensions: TEA-16 correction request, TEA-20 family meeting request, TEA-24 schedule handoff and TEA-41 assigned operational duty. TEA-15 offline assistance has a separate device/privacy prerequisite. These are not automatically implementation-ready because a prototype exists.

## Identity and authorization

The UserAccount is global. Institution membership, branch membership, staff identity, verified teacher eligibility, dated teaching assignment and a permitted action are separate facts. A Teacher role or verified email alone does not establish a person’s teaching assignment. The same user can hold different permissions in different branches.

`visible = released AND institution-entitled AND branch-enabled AND actor-authorized`.

Resolve this on the server for every protected operation. Frontend navigation is a reflection, not the enforcement point. Attendance-only clients get a complete experience without Fees, admissions or later learning setup. Foundation dependencies can provide internal data without creating unrelated navigation. An administrator’s access is never borrowed to make a teacher screen work.

| Action | Default teacher scope | Additional condition / owner |
|---|---|---|
| See teaching day and class roster | Dated assigned offerings, current branch | Minimal DTO; recheck changed/revoked assignment |
| Open/mark/submit attendance | Eligible teacher’s exact assigned session | Open state, frozen roster, version and idempotency contract |
| Read submitted session | Current permitted teaching scope | No assumption of perpetual access after assignment ends |
| Correct submitted attendance | No default | Authorized school administrator’s correction use case |
| View full pupil/guardian/health/fees record | No default | Explicit purpose-specific grants; do not create a generic teacher Student 360 |
| Add guardian or invite family | No | School’s verified relationship workflow |
| Compose message | Proposed scoped grant | Direct send is a separate grant; approved recipient purposes checked at delivery |
| Enter marks | Assigned assessment scope | Scheme/version/maximum and exemption authority |
| Approve/publish results | No default | Distinct moderation/publication owner |
| View support case | No default | Teacher referral receipt does not confer case access |
| Own leave/resource request | Self or explicit assigned-duty scope | Approval and allocation stay with service owner |
| Change roles/modules/branding/branch timezone | No | Authorized configuration owner |

Names of future capabilities in the catalog are design labels. Bind them to the actual permission registry before implementation; never add wildcard Teacher grants.

## Family connection

The child–guardian relationship is created and verified through the School Administrator Families / Student Family links workflow. Teachers consume a minimal, purpose-specific grant for an assigned pupil. Emergency contact, pickup authority, payer, household member and portal guardian are different facts. Mailbox possession is not verified family identity. Private relationship restrictions do not appear in general notifications or teacher activity.

## Teacher navigation

Phase 1: My teaching day, My classes, Attendance history, My account. Expanded review adds Timetable & cover, Teaching & learning, Assessments, Messages & families; additional enabled tools live under a collapsible More tools group. These review controls are excluded from production navigation. School/branch context is explicit. Name and role sit at the bottom; Sign out has a separate action area.
