# Combined Parent/Student implementation backlog

The latest delivery checkpoint and the two currently actionable decision groups are summarized in [consolidated evidence](../evidence/parent-student-consolidated-2026-10-15/README.md) and [consolidated decisions](./PARENT_STUDENT_DECISION_LIST.md). This pointer does not change the detailed inventory or authorize blocked capabilities.

Last reconciled: 15 October 2026. This is a planning export from the authoritative [Parent/Guardian workflow matrix](./PARENT_GUARDIAN_WORKFLOW_MATRIX.md) and [Student workflow matrix](./STUDENT_WORKFLOW_MATRIX.md). Those matrices remain the status authorities. This document groups their incomplete workflows by shared owner capability; it does not authorize a capability, grant, lifecycle, migration or implementation.

Approved UX sources:

- Parent: `references/approved/packs/VSchool_Parent_Guardian_Design/VSchool_Parent_Guardian_Review.html`, SHA-256 `3f5fdc44d4d48dbb794dfa9cef61b1f09adbafadb737d73cbc99cdb71cc21f9e`.
- Student: `references/approved/packs/VSchool_Student_Design/VSchool_Student_Review.html`, SHA-256 `74dc76af2e3b2000dfeb4b1258d49c6081aa255d6294f9ac6fe10ae59253cc9b`.
- Both hashes match `references/approved/implementation-spec/SOURCE_MANIFEST.json`.

## Active queue — 15 October 2026

1. **COM-01 / PAR-14:** engineering-verified. Administrator publishes one immutable class notice; a Parent with the separately accepted notice purpose reads and acknowledges the exact version. Evidence is in `docs/evidence/communication-par-14-2026-10-15/`.
2. **ATT-05 / PAR-11/PAR-12 / SA-29:** engineering-verified for fictional local/test data under the 15 October first-release decision. Protected-text retention remains a real-data release gate. Evidence: `docs/evidence/attendance-explanations-2026-10-15/`.
3. **COM-02 / STW-27–28:** approved and engineering-verified for the bounded text-notice projection. STW-28 is complete; STW-27 remains partial only for attachments pending their separate file-owner/download contract. Evidence is in `docs/evidence/communication-stw-27-28-2026-10-15/`.
4. **Calendar/Events checkpoint:** the bounded one-off draft → published → canceled EV-01 slice is engineering-verified. Advanced recurrence, RSVP, payments, consent, attachments, external delivery, mixed agenda and assessment dates remain excluded.
5. **LEA-01 / TEA-27 / PAR-20 / STW-10–11:** the bounded text-only Teacher draft/resume/publish and exact frozen Parent/Student read slice is engineering-verified. The richer assignment workspace, resources, submissions, feedback and questions remain excluded. Evidence is in `docs/evidence/learning-publication-2026-10-15/`.

Functional/security status, reference comparison and human acceptance remain separate. Human acceptance is pending for every workflow in this export.

## Current counts

| Workspace | Engineering complete | Partial | Blocked/not started | Total | Incomplete in this backlog |
|---|---:|---:|---:|---:|---:|
| Parent/Guardian | 12 | 2 | 38 | 52 | 40 |
| Student | 8 | 7 | 32 | 47 | 39 |
| **Combined** | **20** | **9** | **70** | **99** | **79** |

The 79 incomplete workflows include partial delivered slices and rows whose primary planning blocker is **product** or **technical design**. PAR-11, PAR-12, PAR-14 and STW-28 have moved out of the backlog; STW-27 remains only for attachments. A row becomes implementation-ready only after its named product decisions and owner contract are settled; visual and verification work then follow the implementation.

## Capability sequence and unlock map

| Sequence | Shared owner capability | Parent workflows unlocked | Student workflows unlocked | Current gate |
|---:|---|---|---|---|
| 1 | Existing Access/Timetable core completion | — | STW-08, STW-44–46 | Owner contract or product policy; no immediate code-only gap |
| 2 | Family/Student requests with Attendance explanation and discrepancy categories | PAR-05, PAR-11–13, PAR-32–34 | STW-26, STW-36–38 | PAR-11/12 implemented through ATT-05; remaining generic request/discrepancy workflows still need their named product authority and Requests owner LLD |
| 3 | Communication, announcements, calendar and events | PAR-09, PAR-14–19 | STW-27–32 | Communication/Events owners plus named response and preference policies |
| 4 | Learning, assignments and feedback | PAR-20–22 | STW-06, STW-09–24 | Learning/Files owner and Teacher publish/review/return counterparts |
| 5 | Assessments, results and reports | PAR-23–25 | STW-33–35 | Assessment publication, moderation, artifact and clarification owners |
| 6 | Fees, payer authority and payments | PAR-26–31 | — | Parent-only inventory; payer mandate and finance/payment contracts |
| 7 | Documents, consent and admissions | PAR-35–39 | — | Documents/Consent/Admissions owners and applicant/signatory authority |
| 8 | Transport, library, activities and meals | PAR-40–45 | STW-39–42 | Specialist owners; pickup, capacity, consent and charge rules |
| 9 | Care, support, account, privacy and assistant | PAR-46–49, PAR-51–52 | STW-43–47 | Restricted-data, session, contact, privacy and AI policies |

## 1. Existing-core gaps

There is no independently implementable code-only gap in the current matrices. Existing core reads and current-session sign-out are already delivered. The remaining core rows need a missing owner contract or product rule before new authority can be added.

| Role / workflow | User outcome | Owner | Reusable functionality | Exact missing contract or implementation | Administrator/Teacher counterpart | Dependencies | Primary blocker |
|---|---|---|---|---|---|---|---|
| Student STW-08 | Respond to a changed class | Timetable | Self-only effective published timetable | Dated room/change/substitution projection and response semantics are absent from the owner schema | Administrator publishes a dated change; Teacher authority reflects that occurrence | STW-07; Timetable change owner | Technical design |
| Student STW-44 | Manage my sessions | Access | Current-session metadata and sign-out | Other-session inventory, device-safe labels, revocation command and capability mapping | Account security support/recovery only; no Teacher counterpart | STW-01; Access session inventory | Technical design |
| Student STW-45 | Set preferences or request contact change | Access / Preferences / People | Global account and verified-address recovery | Preference keys/precedence and step-up verified contact-change lifecycle are not approved | Authorized identity support for compromised or failed verification | STW-44 | Product |
| Student STW-46 | Get help with privacy or accessibility | Requests / Privacy | Static account-help guidance | Actionable request categories, authority, routing, response, retention and accessibility-support policy | Authorized school/privacy reviewer | STW-36 | Product |

Immediate result: none of these four can be completed safely as presentation-only work. STW-44 can proceed after a narrow Access session-inventory LLD; the other three require the named product rules first.

## 2. Requests and Attendance explanations

The smallest complete new capability is **Parent absence explanation submission and review**: PAR-11 + PAR-12 with an authorized Administrator review counterpart. It deliberately excludes mark correction, future absence planning, attachments, general requests and Student discrepancy queries from its first slice.

| Role / workflow | User outcome | Owner | Reusable functionality | Exact missing contract or implementation | Administrator/Teacher counterpart | Dependencies | Primary blocker |
|---|---|---|---|---|---|---|---|
| Parent PAR-05 | Ask about a missing child link | Family Requests / Guardians | Non-enumerating public responses; managed child links | Request owner, verifier routing, retention and safe disposition | Authorized family-access verifier | FAM-01–04 | Product |
| Parent PAR-11 | Submit an absence explanation | Guardians / Attendance | Exact submitted-ABSENT session, independent purpose and scoped replay are implemented | No fictional-data implementation gap; protected-text retention blocks real-data release | Designated Administrator reviewer; no Teacher correction authority | PAR-10, FAM-07, ATT-02 | Release policy |
| Parent PAR-12 | Track or withdraw an explanation | Guardians / Attendance | Originator-only status, disposition and versioned submitted-only withdrawal are implemented | No fictional-data implementation gap; protected-text retention blocks real-data release | Administrator disposition with expected version | PAR-11 | Release policy |
| Parent PAR-13 | Query an attendance discrepancy | Family Requests / Attendance | Exact submitted session/revision read | Separate discrepancy category, routing and disposition link without correction authority | Administrator reviews; correction remains existing guarded Attendance operation | PAR-10; request foundation | Product |
| Parent PAR-32 | Submit a school request | Family Requests | Scoped Parent link and intent replay | Category registry, enabled routes, payload, visibility and retention | Category-specific authorized school team | FAM-01–04 | Product |
| Parent PAR-33 | Track or withdraw a request | Family Requests | Version/replay patterns | Originator/co-guardian visibility, transitions, withdrawal and retained evidence | Authorized reviewer transition | PAR-32 | Product |
| Parent PAR-34 | Request child-record update | Requests / Students / People | Student and Person remain record owners | Allowed fields/evidence and owner disposition handoff; no direct record write | Administrator with current Student/People authority | PAR-32; Student/People correction commands | Product |
| Student STW-26 | Query an attendance discrepancy | Requests / Attendance | Self-only submitted Attendance history | Student request grant, exact record/version target, routing, state and response policy | Administrator review; Teacher sees only if explicitly routed | STW-25, STW-36 | Product |
| Student STW-36 | Create a school support request | Requests / Students | Accepted Student context | Allowed categories, recipient teams, payload, response expectations and retention | Authorized school support team | STW-04 | Product |
| Student STW-37 | Track or withdraw my request | Requests | Future STW-36 receipt | Visibility, transitions, withdrawal, concurrency and retained history | Authorized reviewer response | STW-36 | Product |
| Student STW-38 | Request a profile correction | Requests / Students / People | Self profile projection; Student/People ownership | Allowed fields/evidence and explicit disposition handoff; no direct profile edit | Administrator with Student/People correction authority | STW-36 | Product |

### Decision sheet: first proposed capability

The approved PAR-11/12 reference supplies presentation fields and the rule that an explanation never automatically makes attendance `EXCUSED`. It does not grant writes or settle review authority. The following decisions must be approved before an LLD or implementation changes authority.

| Question | Existing approved rule | Recommended answer | Alternatives | Affected workflows |
|---|---|---|---|---|
| Who may submit? | Parent reads require an active accepted child link and exact purpose; read does not imply write | Add `attendance.explanation.submit` to the exact child only through explicit school authorization | Reuse the fixed read bundle (rejected: silently widens authority); broader household authority | PAR-11, PAR-12 |
| Which dates/records are eligible? | Parent may read submitted history bounded by `access_from`; open sessions are not absences | First release targets school-local dates with at least one submitted `ABSENT` record; no future/planned dates or attachments | Permit future planned absence; permit any status; date-range request | PAR-11 |
| Who reviews? | `attendance.read_school` and `attendance.correct` are distinct existing permissions | Add explicit branch-scoped `attendance.explanation.review` for a current Administrator | Infer from read or correct (rejected: authority widening); Teacher review | PAR-11, PAR-12; Administrator SA-29 |
| What is the lifecycle? | Reference requires durable status; no live owner state machine exists | `PENDING`, `ACCEPTED`, `NOT_ACCEPTED`, `WITHDRAWN`; terminal dispositions immutable | More granular school states; reopen terminal requests | PAR-11, PAR-12 |
| Can a Parent edit or withdraw? | No accepted edit contract | No in-place edit; originator may withdraw only `PENDING` with expected version, then submit a new request if eligible | Editable Pending request; no withdrawal | PAR-12 |
| How are retries and duplicates handled? | Existing commands use actor-scoped idempotent intent and optimistic versions | Same actor/key/payload replays; changed payload conflicts; at most one active request per child/date/category | Multiple active requests; school-wide key | PAR-11, PAR-12 |
| What can co-guardians see? | Child access and purposes are independently granted | Submission requires a separate grant and request visibility is originator-only initially | All authorized guardians share requests; one guardian acts for all | PAR-11, PAR-12 |
| How is sensitive text handled? | Student PII/reasons must not enter general logs, receipts or analytics | Reason visible only to originator and authorized reviewer; audit stores identifiers/state/actors | Shared family visibility; include reason in general audit (rejected) | PAR-11–13 |
| How long is the reason retained? | No approved reason-retention period exists | Keep the protected reason through the end of the second academic year after terminal disposition, then purge it while retaining minimal audit transition metadata | One academic year; a longer fixed legal-policy period; indefinite retention (not recommended) | PAR-11–13 |
| Does acceptance change the Attendance mark? | Approved reference says no automatic `EXCUSED`; Attendance correction has separate authority/version/history | Acceptance records review only; any mark change uses existing `attendance.correct` | Automatic correction; bundled correction during review | PAR-11–13; Administrator SA-27/SA-29 |

No grant, migration or UI should be implemented until this decision sheet, including the retention recommendation, is accepted.

## 3. Calendar, announcements and communication

| Role / workflow | User outcome | Owner | Reusable functionality | Exact missing contract or implementation | Administrator/Teacher counterpart | Dependencies | Primary blocker |
|---|---|---|---|---|---|---|---|
| Parent PAR-09 | Manage notification preferences | Communication / Preferences | Global account and Parent shell | Preference keys, mandatory notices, channel verification and precedence | Authorized notice policy manager | FAM-01–04 | Product |
| Parent PAR-15 | Reply to a permitted conversation | Communication | Scoped Parent identity | Participant grants, recipient resolution, delivery and revoked-recipient rules | Permitted Teacher/school recipient | PAR-14; Communication owner | Technical design |
| Parent PAR-16 | Request a teacher meeting | Communication / Calendar | Teacher identity and timetable reads | Request authority, availability source, confirmation/cancellation and conflict rules | Teacher or school accepts/declines authorized slot | Communication/Calendar owner | Product |
| Parent PAR-17 | Resolve an undelivered message | Communication | Development delivery-state patterns | Stable message/delivery-attempt owner and retry policy | Authorized recipient/delivery operations | PAR-15 | Technical design |
| Parent PAR-18 | Plan with school calendar | Calendar / Events + Timetable | Effective child timetable plus one-off frozen-audience event publication/read/cancellation are complete | Mixed timetable/event agenda, closure semantics and advanced reference interactions | Authorized event/calendar publisher | PAR-08; EV-01 | Product/technical design for remaining scope |
| Parent PAR-19 | Respond to a school event | Events | Future event publication | Signer authority, event version, response/withdrawal and consent boundary | Administrator reviews response/capacity | PAR-18 | Product |
| Student STW-27 | Read a school notice | Communication / Files | Text notice, independent purpose, frozen typed recipients, read evidence and safe withdrawal are verified | Attachment owner, scanning, recipient grant and expiring reauthorized download | Authorized publisher attaches an approved file | Delivered text slice; Files owner | Technical design |
| Student STW-29 | Message a permitted teacher | Communication | Student/Teacher identities; assignment context | Participant/recipient projection, thread/message persistence and retention | Assigned/permitted Teacher receives and replies | STW-04; Communication owner | Technical design |
| Student STW-30 | Recover a delivery problem | Communication | Future message intent/replay patterns | Delivery-attempt state, retry and uncertain-outcome recovery | Delivery operations and authorized recipient | STW-29 | Technical design |
| Student STW-31 | Review published events and assessments | Calendar / Events | Effective published timetable plus one-off frozen-audience event publication/read/cancellation are complete | Published assessment-date ownership/projection and advanced reference interactions | Administrator/Teacher publishes assessment date | STW-07; EV-01 | Product/technical design for remaining scope |
| Student STW-32 | Express event interest | Events | Future STW-31 event | Approved extension still needs capacity, consent, idempotency and withdrawal rules | Administrator reviews capacity/response | STW-31 | Product |

## 4. Learning, assignments and feedback

| Role / workflow | User outcome | Owner | Reusable functionality | Exact missing contract or implementation | Administrator/Teacher counterpart | Dependencies | Primary blocker |
|---|---|---|---|---|---|---|---|
| Parent PAR-20 | Review published homework | Learning | Exact immutable text assignment read, frozen Guardian binding and independent `learning.assignment.read_child` are verified | Returned feedback, questions and the richer reference workflow | Teacher text-only draft/resume/publish is verified | LEA-01 delivered slice; later Learning feedback/communication owners | Implementation/technical design for remaining scope |
| Parent PAR-21 | Read returned feedback | Learning | Future published/submitted work | Returned-version owner, Parent audience and private-draft exclusion | Teacher returns authorized feedback | PAR-20; Student submission/feedback | Technical design |
| Parent PAR-22 | Ask a learning question | Learning / Communication | Future task plus permitted conversation | Question target, routing and permitted recipient | Assigned/permitted Teacher response | PAR-20; Communication owner | Technical design |
| Student STW-06 | Plan my school day | Day / Learning | Current class, timetable, Attendance entry, next published class and bounded future-due Learning priority are verified | Returned-feedback, room/change and request priorities | Teacher text-only publication is verified; later counterparts own feedback/change/request states | STW-10 delivered slice; later owner projections | Implementation/technical design for remaining scope |
| Student STW-09 | Open an assigned class space | Learning / Academics | Published timetable and class placement | Class-space membership and published content projection | Teacher manages assigned class space | STW-07, STW-10 | Technical design |
| Student STW-10 | Find and organize assignments | Learning | Exact published text-assignment list, frozen Student binding and independent `learning.assignment.read_self` are verified | Approved search/filter/sort/pagination and submission-status organization | Teacher text-only draft/resume/publish is verified | LEA-01 delivered slice; later submission/query contracts | Implementation/technical design for remaining scope |
| Student STW-11 | Understand an assignment | Learning | Immutable title, instructions, due time, class context and version are verified | Resources, criteria and submission lifecycle | Teacher authors/publishes the exact immutable text version | STW-10 delivered slice; Files/submission owners | Implementation/technical design for remaining scope |
| Student STW-12 | Open learning resources | Learning / Files | Bounded file/download patterns | Resource ownership, scanning, authorization and expiring delivery | Teacher attaches published resource | STW-11 | Technical design |
| Student STW-13 | Save and resume my draft | Learning | Existing idempotency/version patterns | Private durable draft owner, versioning and resume boundaries | Teacher cannot read private draft before submission | STW-11 | Technical design |
| Student STW-14 | Attach and check a file | Learning / Files | Bounded upload validation patterns | Upload/scan lifecycle tied to private draft | Teacher receives only committed submission files | STW-13 | Technical design |
| Student STW-15 | Review and submit work | Learning | Future draft and assignment version | Atomic submission, exact assignment version, receipt and duplicate protection | Teacher receives immutable submission version | STW-13 | Technical design |
| Student STW-16 | Recover an uncertain submission | Learning | Existing command-status recovery patterns | Submission intent/status lookup and exact-payload replay | Teacher sees one committed submission | STW-15 | Technical design |
| Student STW-17 | Submit under late or extended rules | Learning | Future submission | Deadline, extension source and late acceptance rules | Teacher/admin grants dated extension | STW-15 | Technical design |
| Student STW-18 | Revise and resubmit returned work | Learning | Future submission and feedback | Return/resubmit version lifecycle and previous-version retention | Teacher returns work and reviews new version | STW-15, STW-22 | Technical design |
| Student STW-19 | Withdraw a submission when allowed | Learning | Future submission versions | Eligible states, withdrawal authority and retained evidence | Teacher sees withdrawn state/history | STW-15 | Technical design |
| Student STW-20 | Request more time | Learning / Requests | Future assignment plus request patterns | Extension-request authority, routing, decision and effect on deadline | Teacher/admin decides request | STW-11, STW-36 | Product |
| Student STW-21 | Continue safely on a poor connection | Learning | Future draft and recovery patterns | Offline/local-storage boundary, conflict merge policy and recovery UX | No new Teacher authority; server remains source of truth | STW-13, STW-16 | Product |
| Student STW-22 | Read returned teacher feedback | Learning | Future submitted version | Return/revoke/version lifecycle and learner projection | Teacher returns authorized feedback | STW-15 | Technical design |
| Student STW-23 | Understand criteria and subject progress | Learning / Assessments | Future feedback/criteria | Criteria scoring and progress aggregation semantics | Teacher records/publishes criteria evidence | STW-22 | Technical design |
| Student STW-24 | Ask about feedback | Learning / Communication | Future feedback and permitted thread | Question target/version and recipient routing | Feedback author/permitted Teacher responds | STW-22, STW-29 | Technical design |

## 5. Assessments, results and reports

| Role / workflow | User outcome | Owner | Reusable functionality | Exact missing contract or implementation | Administrator/Teacher counterpart | Dependencies | Primary blocker |
|---|---|---|---|---|---|---|---|
| Parent PAR-23 | Read published results | Assessments | Exact child authorization | Result/version/scale publication owner and child-purpose read | Teacher records; authorized moderator publishes | Assessment owner | Technical design |
| Parent PAR-24 | Download authorized report | Assessments / Documents | Reauthorized CSV/download safety patterns | Artifact generation/storage, expiring link and child-purpose grant | Administrator publishes report artifact | PAR-23; Documents owner | Technical design |
| Parent PAR-25 | Request result clarification | Assessments / Requests | Future published result | Clarification owner, routing and exact result-version link | Teacher/school reviewer responds without changing result | PAR-23; Requests owner | Technical design |
| Student STW-33 | View my published report | Assessments | Accepted Student context | Moderated result publication, scale/zero/exempt representation and revocation | Teacher records; moderator publishes | STW-04 | Technical design |
| Student STW-34 | Download a published report | Assessments / Documents | Existing secure download patterns | Artifact generation/storage, reauthorization and expiry | Administrator publishes report artifact | STW-33 | Technical design |
| Student STW-35 | Ask about a result | Assessments / Requests | Future published result | Clarification category, routing and result-version link | Teacher/school reviewer responds | STW-33, STW-36 | Technical design |

## 6. Fees and payments

The Student inventory contains no fee/payment workflows. This capability unlocks only the actual Parent workflows below.

| Role / workflow | User outcome | Owner | Reusable functionality | Exact missing contract or implementation | Administrator/Teacher counterpart | Dependencies | Primary blocker |
|---|---|---|---|---|---|---|---|
| Parent PAR-26 | Review a fee invoice | Finance | Scoped child link | Payer identity/mandate, invoice states, visibility and finance purpose | Finance administrator issues invoice/manages payer grant | Finance owner | Product |
| Parent PAR-27 | Pay an authorized invoice | Finance / Payments | Future invoice; replay patterns | Provider, issuer, payable states, idempotency and settlement | Finance administrator reconciles; no Teacher counterpart | PAR-26 | Product |
| Parent PAR-28 | Resolve an uncertain payment | Payments | Future payment intent/provider evidence | Authoritative provider evidence and reconciliation lifecycle | Finance administrator reviews exception | PAR-27 | Product |
| Parent PAR-29 | Read receipts/history | Finance | Future payer authority | Ledger allocation/receipt owner and payer-scoped projection | Finance administrator issues/reconciles receipt | PAR-27 | Technical design |
| Parent PAR-30 | Raise fee/refund query | Finance / Requests | Future invoice/payment | Query owner/routing and protected evidence policy | Finance reviewer | PAR-26; Requests owner | Technical design |
| Parent PAR-31 | Ask about payer access | Guardians / Finance | Independent child relationship | Payer verification, grant/revocation and co-guardian policy | Authorized finance/family-access manager | Finance owner | Product |

## 7. Documents, consent and admissions

| Role / workflow | User outcome | Owner | Reusable functionality | Exact missing contract or implementation | Administrator/Teacher counterpart | Dependencies | Primary blocker |
|---|---|---|---|---|---|---|---|
| Parent PAR-35 | Request a school document | Documents | Bounded file validation patterns | Document types, request/issue owner, scanning, signatory, retention and download grants | Authorized document issuer/reviewer | Requests + Documents owner | Technical design |
| Parent PAR-36 | Respond to consent | Consent | Exact Parent/child identity | Signer policy, required signers, version, withdrawal and supersession | Administrator publishes and reviews exact consent version | Consent owner | Product |
| Parent PAR-37 | Start/resume application | Admissions | Global account; existing school-side application is not applicant authority | Applicant self-scope, account binding and durable draft owner | Admissions administrator reviews submitted application | Admissions owner | Technical design |
| Parent PAR-38 | Track application requirements | Admissions / Documents | Future applicant binding | Requirement/upload/scan/review lifecycle and applicant visibility | Admissions reviewer marks requirements | PAR-37; Documents owner | Technical design |
| Parent PAR-39 | Respond to an offer | Admissions | Future application/offer | Offer version, intended-applicant authority and Student conversion boundary | Admissions administrator issues/withdraws offer | PAR-37–38 | Technical design |

## 8. Transport, library, activities and meals

| Role / workflow | User outcome | Owner | Reusable functionality | Exact missing contract or implementation | Administrator/Teacher counterpart | Dependencies | Primary blocker |
|---|---|---|---|---|---|---|---|
| Parent PAR-40 | Review transport assignment | Transport | Scoped child authorization | Transport owner, current assignment and privacy-minimal projection | Transport administrator assigns route/stop | Transport owner | Technical design |
| Parent PAR-41 | Request pickup change | Transport / Guardians | Future transport assignment | Dated pickup authority, collector verification and emergency handling | Authorized transport/school reviewer | PAR-40 | Product |
| Parent PAR-42 | Read transport updates | Transport | Future assignment/audience | Service-update owner and affected-child projection | Transport administrator publishes update | PAR-40 | Technical design |
| Parent PAR-43 | Review library loans | Library | Scoped child authorization | Loan/fine owner, projection and renewal authority | Librarian issues/returns/renews | Library owner | Technical design |
| Parent PAR-44 | Request activity place | Activities | Scoped child authorization | Enrollment authority, capacity race, waitlist, consent and charge separation | Activity administrator publishes/reviews place | Activities owner | Product |
| Parent PAR-45 | Manage meal preference | Meals | Scoped child authorization | Preference safety meaning, updater, dating, persistence and billing separation | Authorized meal/school administrator | Meals owner | Product |
| Student STW-39 | Review my library loans | Library | Accepted Student context | Loan/fine owner and self projection | Librarian issues/returns | STW-04 | Technical design |
| Student STW-40 | Request a library renewal | Library | Future loan projection | Renewal command, eligibility, version and receipt | Librarian policy/exception review | STW-39 | Technical design |
| Student STW-41 | Join an enabled activity | Activities / Events | Future published event | Approved extension still needs allocation, capacity, waitlist, consent and charge rules | Activity administrator publishes/reviews place | STW-31 | Product |
| Student STW-42 | Read my transport assignment | Transport | Accepted Student context | Transport assignment owner and privacy-minimal self projection | Transport administrator assigns route/stop | STW-04 | Technical design |

## 9. Care, support, account, privacy and assistant

| Role / workflow | User outcome | Owner | Reusable functionality | Exact missing contract or implementation | Administrator/Teacher counterpart | Dependencies | Primary blocker |
|---|---|---|---|---|---|---|---|
| Parent PAR-46 | Submit care/contact update | Health / Requests | Scoped Parent identity | Restricted data classes, authorized updater, routing, audit exclusion and retention | Authorized health/school reviewer | Restricted-data policy | Product |
| Parent PAR-47 | Read school care note | Health | Scoped child authorization | Note classes, audience, safeguarding exclusions and emergency access | Authorized health publisher/reviewer | Health owner | Product |
| Parent PAR-48 | Request support discussion | Student Support | Scoped Parent identity | Support authority, routing, restricted notes and retention | Authorized support team | Support owner | Product |
| Parent PAR-49 | Update verified contact | Access / People | Verified-address recovery | Step-up contact change, compromise recovery and identity/link separation | Authorized account support | Access/People decision | Product |
| Parent PAR-51 | Request privacy support | Privacy / Requests | Scoped Parent identity and generic recovery | Jurisdiction, verification, routing, retention and shared-record limits | Authorized privacy reviewer | Privacy owner | Product |
| Parent PAR-52 | Ask school assistant | Assistant | Scoped Parent identity only | Provider, permitted sources/data classes, grounding, evaluation and human-action rules | Governed school knowledge/action owners | Assistant policy/owner | Product |
| Student STW-43 | Request wellbeing support | Student Support / Requests | Accepted Student context | Explicit Student authority, routing, confidentiality, safeguarding escalation and retention | Authorized support/safeguarding team | STW-36 | Product |
| Student STW-47 | Ask a learning question with sources | Assistant / Learning | Future authorized learning resources | Provider, retrieval sources, assessment-use restrictions, redaction, safety, evaluation and retention | Teacher/source owner; governed handoff | STW-12 | Product |

## Next eligible action

COM-01/PAR-14, the bounded COM-02 text-notice projection, ATT-05 Parent Attendance explanations, EV-01 one-off Calendar/Events and LEA-01 text-only Learning publication/read are engineering-verified supported slices. STW-27 remains partial only for attachments, STW-28 is engineering-complete, PAR-18 remains partial for a mixed agenda/closures, STW-31 remains partial for assessment dates, and PAR-20/STW-10/STW-11 remain partial for their richer Learning interactions. Technical design by itself is not an approval gate; unresolved product authority, sensitive-data retention and financial/consent rules remain the named gates.

Until then, the current Parent and Student checkpoints remain preserved. No new authority, lifecycle, migration, visual claim or test result is created by this planning export.
