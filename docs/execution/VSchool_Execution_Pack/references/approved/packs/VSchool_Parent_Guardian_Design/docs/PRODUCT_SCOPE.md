<!-- TT-01 contract -->
## TT-01 integration
See [the shared timetable source of truth](timetable/README.md) and [persona mapping](TIMETABLE_INTEGRATION.md). Existing task and verification entries below are baseline unless explicitly refreshed in timetable-evidence.json.

# Parent & Guardian product scope

Edition 01 · 8 October 2026 · UX proposal

The parent’s questions are: **How is my child’s school day going? What needs my response? Did the school receive what I sent?** The workspace prioritizes a clear next action over large dashboards, cross-child comparisons or ambiguous success messages.

## Shared baseline and delivery phases

The recovered School Administrator 01 blueprint places guardian linking and family communication in Phase 2. This pack follows that phase map; it does not claim family access shipped in Phase 1 or supersede later approved Bible revisions. Core attendance already provides source records, but exposing them to guardians requires the Phase 2 verification and purpose-access model.

| Phase | Parent experience | Required owners |
|---|---|---|
| 1 dependency | Existing staff/student/academic and session-attendance foundations | Access, People, Students, Academics, Attendance |
| 2 family essentials | Verified access, child context, home, attendance read/explanation, notices, permitted replies, basic calendar, school requests, own account | Guardians, Access, Communication, Requests and existing record owners |
| 3 | Published homework/returned feedback, document requests, consent/forms, applications and event responses | Learning, Documents, Consent, Admissions, Events |
| 4 | Published results, authorized reports and clarifications | Assessments and Documents |
| 5 | Explicit payer access, invoice review, payment reconciliation, receipts and finance queries | Finance and Payments; separate detailed policy/provider design |
| 6 | Enabled transport, pickup, library, activities, care and service workflows | Each independent service owner |
| 7 | Source-linked school explanations with human-reviewed next actions | Assistant, permission-filtered owners |

Explicit scope extensions: meeting scheduling (PAR-16), event RSVP (PAR-19), pickup change (PAR-41), activity place request (PAR-44), meal preference (PAR-45). Their design is useful for roadmap coverage, but release approval and owning-module LLD remain prerequisites. Live vehicle tracking, autonomous AI actions and guardian submission as a child are not assumed capabilities.

## Relationship and purpose model

A global account can have independent verified links to multiple children, branches and institutions. A family/household label is not an authorization boundary. Guardian, payer, emergency contact, collector, communication recipient and consent signer are separate facts.

`visible = released AND institution-entitled AND branch-enabled AND live-actor-child-purpose-grant`.

A teacher or parent role alone is insufficient. The school verifies the relationship and allowed purposes; mailbox verification proves mailbox control only. Use actual approved identity requirements from Access/Guardians. Parents may request a review of a missing link; that request neither confirms that a child exists nor creates access.

An attendance-only client can offer complete authorized attendance access and its required request channel without activating learning, fees or services. Dependencies can provide supporting data without irrelevant navigation. Disabled modules retain records according to their owner policy; hiding a payment module cannot silently erase unsettled orders.

## Context and navigation

The selected child defines school and branch context. Do not let a parent independently switch branch while retaining another child. A context strip includes child name, class, school and branch; the switcher shows only allowed links. Clear prior-child filters, cached DTOs, form intent and document URLs. Submitted requests and pending payments remain attached to their original scope and are reauthorized on return.

Desktop: Home, My children, Attendance, Messages, Requests & forms, Calendar, My account. Later released/authorized tools extend Learning, Results, Fees & payments and More services. Mobile: a compact child context and four quick destinations (Home, Attendance, Messages, More), with absent capabilities omitted. Navigation does not grant access; deep links, downloads and command handlers enforce the same policy.

## Boundary examples

| Need | Allowed only when | No implied authority |
|---|---|---|
| Read attendance | Live attendance purpose for the child | Mark/correct attendance or see classmates |
| Explain absence | Child-purpose request grant | Excused/approved attendance outcome |
| Reply to teacher | Current child-specific conversation grant | Staff directory, new participants or co-guardian access |
| Read feedback/results | Returned/published version and purpose grant | Draft feedback, moderation or private teacher notes |
| View/pay fees | Explicit financial read/payer mandate | Academic, care or sibling access |
| Give consent | Verified signer policy for that exact purpose/version | Complete permission when another required response is absent |
| Request pickup | Dated pickup authority workflow | Gate pass or verified collector from a household name |
| Update care/contact | Narrow private owner workflow | Emergency monitoring, medical advice or new portal/pickup grant |
| Application | Applicant-owned application scope | Existing student access or verified guardian relationship |

No public child lookup by admission number plus DOB. No automatic merge by email/name. No cross-school payment basket, sibling ranking, opaque risk score, unrestricted family directory or download of another guardian’s private requests.

## Fixture map

Kavya Mehta is the fictional account. Aarav has expanded purpose grants at Greenwood/Whitefield. Nila has school-update purposes at Greenwood/Indiranagar without payer or consent grants. Mira has a separate Westbridge/North-campus link with fewer enabled modules. A school-verified invitation for Ishan illustrates activation; it is excluded from active child lists before acceptance. These are deliberately different access examples, not real family data.
