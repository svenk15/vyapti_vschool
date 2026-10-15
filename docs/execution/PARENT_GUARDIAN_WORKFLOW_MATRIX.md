# Parent/Guardian workflow matrix

Cross-workspace capability planning is consolidated in [Combined Parent/Student implementation backlog](./PARENT_STUDENT_IMPLEMENTATION_BACKLOG.md). This matrix remains authoritative for Parent workflow status.

Last updated: 16 October 2026. Baseline reconciliation started at 21:34 IST on 13 October. The owner decision received at 22:32 IST supersedes the former five-state proposal and authorizes the simplified foundation in `docs/modules/guardians/DESIGN.md`. The dependency reconciliation below replaces the earlier undifferentiated “later phase” treatment without authorizing a missing owner or write grant.

Authoritative UX source: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Parent_Guardian_Design/VSchool_Parent_Guardian_Review.html` (SHA-256 `3f5fdc44d4d48dbb794dfa9cef61b1f09adbafadb737d73cbc99cdb71cc21f9e`, matching `implementation-spec/SOURCE_MANIFEST.json`). The catalog is a 52-workflow **UX design proposal**. Its database worksheet explicitly says that its table names and physical design are proposals requiring reconciliation with the live schema.

## Shared authority gate

The live repository has global `UserAccount` and organization-scoped `AccountPersonBinding`, but only `SCHOOL_ADMIN` and `TEACHER` membership roles. It has no Guardian owner, verified guardian-to-Student relationship, child-purpose grant, family invitation binding, family principal, or parent route. Existing staff invitations cannot be reused: they create a `SchoolMembership`, and a guardian must not become staff merely to enter the family workspace.

The shared authority decision is resolved and implemented: designated `family.access.manage`, explicit school authorization, fixed distinct read purposes, account-bound invitation/acceptance, per-child revocation and authorization-date history bounds. FAM-01 through FAM-04 are engineering-verified; visual comparison and human review remain separate. [Historical baseline](../evidence/parent-guardian-baseline-2026-10-13/README.md). [Current evidence](../evidence/parent-guardian-foundation-2026-10-13/README.md).

Status meanings are mutually exclusive:

- `BLOCKED_PRODUCT_DECISION`: a named security or lifecycle rule needs explicit product approval.
- `BLOCKED_FOUNDATION`: the journey has usable product semantics but cannot be implemented until the shared guardian relationship/purpose authority exists.
- `DESIGN_READINESS_REQUIRED`: an owning module or detailed lifecycle contract is absent in addition to the shared authority gate.

Readiness classes for incomplete work are: **A** UI/wiring under an approved contract; **B** technical design under settled product rules; **C** missing product or authority decision; **D** missing owner-module capability; **E** verification or fixture gap. PAR-14 is now complete through COM-01; no remaining incomplete row is class A or E.

Functional/security status, reference comparison, and human acceptance remain separate.

| Workflow | Approved state | Owning dependency | Functional/security | Reference comparison | Exact remaining gap | Human review |
|---|---|---|---|---|---|---|
| PAR-01 Accept a school invitation | `#/flow/PAR-01` | Guardians + Access | ENGINEERING_COMPLETE | DIRECT_COMPARISON_WITH_EXTENSION | Narrow real activation confirmation is an explicit reference-less extension; no functional gap | PENDING |
| PAR-02 Sign in through the school page | `#/flow/PAR-02` | Access + family principal | ENGINEERING_COMPLETE | SHARED_AUTH_EVIDENCE | Family workspace resolves from live accepted child links; no remaining current-slice gap | PENDING |
| PAR-03 Activate or recover account access | `#/flow/PAR-03` | Access + Guardians | ENGINEERING_COMPLETE | DIRECT_COMPARISON_WITH_EXTENSION | Generic public recovery and dedicated family activation verified; font exception remains | PENDING |
| PAR-04 Review verified child links | `#/flow/PAR-04` | Guardians + Students | ENGINEERING_COMPLETE | DIRECT_COMPARISON | Server-issued permitted-child list and selector verified | PENDING |
| PAR-05 Ask about a missing child link | `#/flow/PAR-05` | Family requests | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Non-enumerating request owner, routing, retention and verifier disposition | PENDING |
| PAR-06 Handle changed or withdrawn access | `#/flow/PAR-06` | Guardians | ENGINEERING_COMPLETE | REFERENCE_LESS_NARROW_EXTENSION | Approved simple manager flow was absent from the prototype; real removal and open-page denial verified | PENDING |
| PAR-07 Review family overview | `#/flow/PAR-07` | Guardians + owner summaries | ENGINEERING_COMPLETE | DIRECT_COMPARISON_WITH_SCOPED_OMISSIONS | Minimal fixed-bundle summary implemented; unowned prototype Messages/Requests are deliberately absent | PENDING |
| PAR-08 Switch child and school context | `#/flow/PAR-08` | Guardians | ENGINEERING_COMPLETE | DIRECT_COMPARISON | Server-issued child context, URL state and protected reload verified | PENDING |
| PAR-09 Manage notification preferences | `#/flow/PAR-09` | Communication | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Preference persistence, mandatory notice policy and channel verification | PENDING |
| PAR-10 Read child attendance | `#/flow/PAR-10` | Guardians + Attendance | ENGINEERING_COMPLETE | DIRECT_COMPARISON_WITH_SCOPED_OMISSIONS | Read-only submitted history is complete; absence/query controls await their own request-owner contracts | PENDING |
| PAR-11 Submit an absence explanation | `#/flow/PAR-11` | Guardians + Attendance | ENGINEERING_COMPLETE | DIRECT_COMPARISON_WITH_CONTRACT_EXTENSION | Exact submitted-ABSENT session flow is complete for fictional data; real-data protected-text retention remains a release gate | PENDING |
| PAR-12 Track or withdraw an explanation | `#/flow/PAR-12` | Guardians + Attendance | ENGINEERING_COMPLETE | DIRECT_COMPARISON_WITH_CONTRACT_EXTENSION | Originator-only status and versioned withdrawal are complete; real-data protected-text retention remains a release gate | PENDING |
| PAR-13 Query an attendance discrepancy | `#/flow/PAR-13` | Family requests + Attendance | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Query owner/routing and disposition contract without correction authority | PENDING |
| PAR-14 Read and acknowledge a notice | `#/flow/PAR-14` | Communication | ENGINEERING_COMPLETE | DIRECT_COMPARISON | Immutable version, frozen server-resolved audience, separate read evidence and exact-version acknowledgement complete through COM-01; broader Communication features remain separate | PENDING |
| PAR-15 Reply to a permitted conversation | `#/flow/PAR-15` | Communication | DESIGN_READINESS_REQUIRED | NOT_STARTED | Child-scoped participant grants, recipient resolution and delivery lifecycle | PENDING |
| PAR-16 Request a teacher meeting | `#/flow/PAR-16` | Communication/calendar | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Proposed capability, availability source, confirmation and cancellation policy | PENDING |
| PAR-17 Resolve an undelivered message | `#/flow/PAR-17` | Communication | DESIGN_READINESS_REQUIRED | NOT_STARTED | Stable message/delivery attempt model and revoked-recipient handling | PENDING |
| PAR-18 Plan with school calendar | `#/flow/PAR-18` and `#/timetable` | Academics/Events + TT-06 Parent + EV-02/EV-04 | PARTIAL_SUPPORTED_SLICE | DIRECT_PARTIAL | Effective published child Timetable and frozen-audience events now appear together in the selected From-date week; typed event filters, permitted export and canceled-event visibility remain supported. Academic-closure semantics and advanced event interactions remain absent. | PENDING |
| PAR-19 Respond to a school event | `#/flow/PAR-19` | Events | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Proposed response authority, versioning, withdrawal and consent separation | PENDING |
| PAR-20 Review published homework | `#/flow/PAR-20` | Learning | PARTIAL_SUPPORTED_SLICE | REFERENCE_LESS_NARROW_EXTENSION | Immutable text assignment read is verified through exact frozen Guardian binding and independent live `learning.assignment.read_child`; returned feedback, questions and richer reference workflow remain absent. | PENDING |
| PAR-21 Read returned feedback | `#/flow/PAR-21` | Learning | DEFERRED_BY_ACCEPTED_LEA_04_DECISION | NOT_STARTED | LEA-04 deliberately publishes guidance only to the submitting Student. Parent assignment access does not grant feedback; a future Parent audience/visibility contract is required. | PENDING |
| PAR-22 Ask a learning question | `#/flow/PAR-22` | Learning + Communication | DESIGN_READINESS_REQUIRED | NOT_STARTED | Question routing and permitted recipient contract | PENDING |
| PAR-23 Read published results | `#/flow/PAR-23` | Assessments | DESIGN_READINESS_REQUIRED | NOT_STARTED | Published result/version/scale owner and child-purpose read | PENDING |
| PAR-24 Download an authorized report | `#/flow/PAR-24` | Assessments/Documents | DESIGN_READINESS_REQUIRED | NOT_STARTED | Reauthorized artifact generation, storage and expiring delivery | PENDING |
| PAR-25 Request a result clarification | `#/flow/PAR-25` | Assessments/Requests | DESIGN_READINESS_REQUIRED | NOT_STARTED | Clarification owner, routing and result-version link | PENDING |
| PAR-26 Review a fee invoice | `#/flow/PAR-26` | Finance | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Payer mandate and finance-purpose authority | PENDING |
| PAR-27 Pay an authorized invoice | `#/flow/PAR-27` | Finance/Payments | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Provider, issuer, payable-state, idempotency and settlement contract | PENDING |
| PAR-28 Resolve an uncertain payment | `#/flow/PAR-28` | Payments | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Verified provider evidence and reconciliation lifecycle | PENDING |
| PAR-29 Read receipts/history | `#/flow/PAR-29` | Finance | DESIGN_READINESS_REQUIRED | NOT_STARTED | Ledger allocation/receipt owner and payer-scoped read | PENDING |
| PAR-30 Raise fee/refund query | `#/flow/PAR-30` | Finance/Requests | DESIGN_READINESS_REQUIRED | NOT_STARTED | Query owner/routing and protected evidence policy | PENDING |
| PAR-31 Ask about payer access | `#/flow/PAR-31` | Guardians/Finance | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Payer verification and grant/revocation authority | PENDING |
| PAR-32 Submit a school request | `#/flow/PAR-32` | Family requests | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Category registry, routing, visibility, payload and retention | PENDING |
| PAR-33 Track/withdraw a request | `#/flow/PAR-33` | Family requests | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Originator access, transitions, concurrency and retained evidence | PENDING |
| PAR-34 Request child-record update | `#/flow/PAR-34` | Requests + Students/People | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Allowed field categories, evidence and owner disposition handoff | PENDING |
| PAR-35 Request a school document | `#/flow/PAR-35` | Documents | DESIGN_READINESS_REQUIRED | NOT_STARTED | Document types, storage/scanning, signatory, retention and download grants | PENDING |
| PAR-36 Respond to consent | `#/flow/PAR-36` | Consent | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Signer policy/version, required signers, withdrawal and supersession | PENDING |
| PAR-37 Start/resume application | `#/flow/PAR-37` | Admissions | DESIGN_READINESS_REQUIRED | NOT_STARTED | Applicant self-scope, durable draft owner and account binding | PENDING |
| PAR-38 Track application requirements | `#/flow/PAR-38` | Admissions/Documents | DESIGN_READINESS_REQUIRED | NOT_STARTED | Applicant evidence upload, scanning, review and visibility | PENDING |
| PAR-39 Respond to an offer | `#/flow/PAR-39` | Admissions | DESIGN_READINESS_REQUIRED | NOT_STARTED | Accepted offer authority/version and conversion boundaries | PENDING |
| PAR-40 Review transport assignment | `#/flow/PAR-40` | Transport | DESIGN_READINESS_REQUIRED | NOT_STARTED | Transport owner, child assignment and safe projection | PENDING |
| PAR-41 Request pickup change | `#/flow/PAR-41` | Transport/Guardians | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Dated pickup authority, collector verification and emergency handling | PENDING |
| PAR-42 Read transport updates | `#/flow/PAR-42` | Transport | DESIGN_READINESS_REQUIRED | NOT_STARTED | Service update audience and privacy-minimal projection | PENDING |
| PAR-43 Review library loans | `#/flow/PAR-43` | Library | DESIGN_READINESS_REQUIRED | NOT_STARTED | Loan owner, renewal authority and fine visibility | PENDING |
| PAR-44 Request activity place | `#/flow/PAR-44` | Activities | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Proposed enrollment authority, capacity race and consent/charge separation | PENDING |
| PAR-45 Manage meal preference | `#/flow/PAR-45` | Meals | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Proposed capability, safety meaning, persistence and billing separation | PENDING |
| PAR-46 Submit care/contact update | `#/flow/PAR-46` | Health/Requests | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Restricted data classes, authorized updater, routing and retention | PENDING |
| PAR-47 Read school care note | `#/flow/PAR-47` | Health | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Restricted audience, safeguarding exclusions and emergency access | PENDING |
| PAR-48 Request support discussion | `#/flow/PAR-48` | Student support | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Support authority, routing, restricted notes and retention | PENDING |
| PAR-49 Update verified contact | `#/flow/PAR-49` | Access/People | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Step-up verification, compromise recovery and separation from relationship evidence | PENDING |
| PAR-50 Review sessions/sign out | `#/flow/PAR-50` | Access | ENGINEERING_COMPLETE | DIRECT_COMPARISON_WITH_EXTENSION | Approved staged safe-account/current-session/recovery/sign-out outcome complete at `7d52491`; the now-supported optional other-session path uses ACC-01 and focused desktop/mobile evidence | PENDING |
| PAR-51 Request privacy support | `#/flow/PAR-51` | Privacy/Requests | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Jurisdiction, authority, routing, retention and child/co-guardian rights | PENDING |
| PAR-52 Ask school assistant | `#/flow/PAR-52` | Assistant | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Provider, allowed sources/data classes, grounding, evaluation and human action policy | PENDING |

## Incomplete workflow readiness

The main matrix supplies each workflow's outcome, approved state, route, owner and exact gap. This table records the remaining implementation classification, reusable live behavior, concrete unlock and minimum acceptance scenario. “Scoped Parent reads” means FAM-01's live accepted link plus the exact purpose check; it does not imply new write authority.

| ID | Class | Reusable live behavior | Concrete dependency / unlock | Minimum end-to-end acceptance |
|---|---|---|---|---|
| PAR-05 | C | Generic non-enumerating public responses; school-managed child links | Approve missing-link request owner, verifier routing, retention and safe disposition | Parent submits without learning whether another child/link exists; authorized school review resolves it; cross-child/tenant denial |
| PAR-09 | C | Global account and scoped Parent shell | Approve mandatory versus optional channels, verification and preference precedence | Save/reload preferences without suppressing mandatory notices; unrelated child/school unchanged |
| PAR-11 | C | Scoped Parent Attendance read and owner session facts | Approve `attendance.explanation.submit`, eligible dates/records and school reviewer lifecycle | Submit exact child/date explanation idempotently; Pending reference persists; Attendance mark unchanged |
| PAR-12 | C | PAR-11 proposal, version/replay patterns | Approve states, originator visibility, withdrawal and retained decision evidence | Read own status; withdraw only eligible Pending version; concurrent review wins safely |
| PAR-13 | C | Exact submitted Attendance session/revision read | Approve family-request authority, school routing and disposition linkage | Query one authorized session; receive durable reference; no correction grant or mark change |
| PAR-15 | D | Scoped Parent link | Communication conversation participants, recipient resolution and delivery lifecycle | Reply only in a permitted conversation; replay safe; revoked recipient cannot receive/read |
| PAR-16 | C | Teacher identity and timetable reads | Approve meeting requester/recipient authority, availability source and cancellation | Request one permitted slot; school/Teacher sees it; conflict/cancel outcomes persist |
| PAR-17 | D | Existing development delivery-state patterns | Communication message/delivery-attempt owner and retry policy | Show failed delivery without duplicate message; authorized retry/status survives reload |
| PAR-18 | D | Effective published child Timetable and scoped Events publication/read, typed filters/export and combined read composition are complete | Academic closure semantics and advanced calendar interactions | Mixed teaching/event calendar respects effective dates and child/school scope |
| PAR-19 | C | Future Calendar/Events owner | Approve event-response signer, version, withdrawal and consent boundary | Respond to one eligible event; stale/duplicate/cross-child attempts fail safely |
| PAR-20 | D | Scoped Parent link and published Academics context | Learning owner plus actual `learning.assignment.read_child` purpose | Only published homework for the selected child appears; drafts and siblings remain hidden |
| PAR-21 | D | Same | Learning returned-feedback version and audience | Parent reads only returned feedback; later version replaces display without exposing drafts |
| PAR-22 | D | Same | Learning question plus permitted Communication route | Ask against an authorized published task; recipient and status are traceable |
| PAR-23 | D | Scoped Parent link | Assessments published result/version/scale owner and purpose | Published result visible for exact child; unpublished/revoked/cross-tenant data denied |
| PAR-24 | D | Existing server CSV/download safety patterns | Assessments/Documents artifact generation, storage and expiring delivery | Reauthorize download; expired/foreign link fails; generated artifact matches published result |
| PAR-25 | D | Future published result | Assessments clarification request owner and result-version link | Submit against exact published version; durable status; result remains unchanged |
| PAR-26 | C | Scoped Parent link | Approve payer identity/mandate, invoice visibility and finance purpose | Authorized payer reads exact invoice; co-guardian without payer grant is denied |
| PAR-27 | C | Future invoice | Approve provider, issuer, payable states, idempotency and settlement | Exact invoice payment handles success/decline/replay without double settlement |
| PAR-28 | C | Future payment/provider evidence | Approve uncertain-payment reconciliation and authoritative evidence | Unknown response resolves from provider evidence; no duplicate debit or false success |
| PAR-29 | D | Future Finance authority | Finance ledger allocation/receipt owner and payer-scoped projection | Receipts reconcile to authorized invoice/payments; unrelated payer hidden |
| PAR-30 | D | Future Finance authority | Finance request routing and protected evidence policy | Query exact invoice/refund; school response persists without exposing finance data broadly |
| PAR-31 | C | Guardian child access | Approve payer verification, grant/revocation authority and co-guardian rules | School grants/removes payer scope independently of child read purposes |
| PAR-32 | C | Scoped Parent link, replay patterns | Approve category registry, routing, payload, visibility and retention | Submit enabled category; durable Pending reference; same intent replays; disabled category denied |
| PAR-33 | C | Future FamilyRequest | Approve transitions, originator/co-guardian visibility and withdrawal | Originator tracks/withdraws Pending request; concurrent review wins and history remains |
| PAR-34 | C | Students/People remain record owners | Approve editable field categories, evidence and owner disposition handoff | Request a permitted correction; no direct Student/Person write; owner accepts/rejects visibly |
| PAR-35 | D | Existing bounded file validation patterns | Documents owner, types, scanning, signatory, retention and grants | Request/receive an authorized document through scanned expiring delivery |
| PAR-36 | C | Scoped Parent identity | Approve signer policy, required signers, version, withdrawal and supersession | Only required signer answers exact version; superseded consent cannot be replayed |
| PAR-37 | D | Existing school-side admissions application creation is insufficient | Admissions applicant self-scope, account binding and durable draft owner | Parent creates/resumes only own application; school-side record receives explicit handoff |
| PAR-38 | D | Future applicant binding | Admissions/Documents requirement/upload/review lifecycle | Upload only requested evidence; scan/review states persist; foreign application denied |
| PAR-39 | D | Future applicant/offer owner | Admissions offer version/authority and Student conversion boundary | Intended applicant accepts/declines exact live offer; conversion is explicit and replay-safe |
| PAR-40 | D | Scoped Parent link | Transport owner and safe child assignment projection | Parent reads only selected child's current assignment and safe route details |
| PAR-41 | C | Future transport assignment | Approve dated pickup authority, collector verification and emergency behavior | Authorized dated change is reviewed/applied once; unsafe or stale request blocked |
| PAR-42 | D | Future transport audience | Transport service-update owner and privacy-minimal projection | Only affected authorized child receives update; no route passenger data leaks |
| PAR-43 | D | Scoped Parent link | Library loan/renewal/fine owner and authority | Parent sees selected child's loans; renewal obeys current loan policy and version |
| PAR-44 | C | Scoped Parent link | Approve activity authority, capacity race, consent and charge separation | Competing requests cannot overbook; waitlist/decision is durable and no implicit charge |
| PAR-45 | C | Scoped Parent link | Approve meal safety meaning, updater, persistence and billing separation | Authorized preference change is dated/audited and never implies payment or medical evidence |
| PAR-46 | C | Scoped Parent identity | Approve restricted care/contact fields, updater, routing and retention | Minimal protected update reaches authorized reviewer; general audit excludes sensitive text |
| PAR-47 | C | Scoped Parent link | Approve restricted care-note audience, safeguarding exclusions and emergency access | Only approved note class is visible; revoked/other-child access returns no sensitive label |
| PAR-48 | C | Scoped Parent identity | Approve support authority, routing, restricted notes and retention | Request reaches authorized support team without exposing internal safeguarding notes |
| PAR-49 | C | Existing verified-address recovery | Approve step-up contact change, compromise handling and identity/link separation | New contact activates only after verification; failed/expired attempt preserves current identity |
| PAR-51 | C | Scoped Parent identity and generic recovery | Approve jurisdictional privacy owner, verification, routing, retention and shared-record limits | Acknowledged request promises no automatic deletion/deadline; verified response excludes others' data |
| PAR-52 | C | None beyond scoped Parent identity | Approve provider, permitted sources/data classes, grounding, evaluation and human-action rules | Grounded answer cites allowed school data; unsafe/unavailable action is handed off, not fabricated |

## Capability backlog in dependency order

| Capability group | Parent workflows unlocked | Required school-side counterpart | Access purpose / dependency | Genuine decisions | Complexity | Smallest complete demo |
|---|---|---|---|---|---|---|
| Family request foundation + Attendance explanation | PAR-05, PAR-11–13, PAR-32–34 | SA-29 explanation review and SA-37 family-request review; Attendance correction stays separate | New explicit submit/read/withdraw purposes plus reviewer capability | Categories, eligibility, reviewer scope, states, co-guardian visibility, retention and correction relationship | High | Parent submits one absence explanation → administrator reviews → Parent sees disposition; mark unchanged |
| Communication and preferences | PAR-09, PAR-14–17, PAR-22 | Notice publisher, conversation recipient and delivery operations | Per-audience notice/message grants; current guardian link | Mandatory channels, reply authority, meeting policy and delivery retry semantics | High | Publish one authorized notice → Parent reads/acknowledges → school sees exact acknowledgement |
| Calendar and events | remaining PAR-18, PAR-19 | School event publisher and response review | Calendar read/respond child purposes | Event audiences, response/withdrawal and consent separation | Medium | Published event beside effective Timetable → eligible Parent response |
| Learning and results | PAR-20–25 | Teacher/school publish and clarification review | Actual `learning.assignment.read_child`, result/document purposes | Question routing, result publication, artifact and clarification lifecycles | High | Publish homework/result → Parent reads exact version → submits traceable clarification |
| Finance and payments | PAR-26–31 | Finance invoice, payment reconciliation and payer-access management | Verified payer authority independent of guardian read bundle | Payer identity, providers, settlement, uncertain outcomes and refund queries | Very high | Authorized payer reads and pays one invoice with replay-safe receipt |
| Documents and consent | PAR-35–36 | Document issuer/reviewer and consent publisher | Document/consent grants | File governance, signer rules, supersession and retention | High | Parent responds to exact consent version and downloads one authorized artifact |
| Admissions | PAR-37–39 | Admissions review/offer/conversion | Applicant self-scope distinct from current child links | Durable drafts, evidence review, offer authority and Student conversion | High | Applicant starts/resumes → school reviews → applicant responds to exact offer |
| Transport, library and school services | PAR-40–45 | Transport/library/activity/meal owners | Service-specific child grants | Pickup safety, capacity, consent, charges and meal meaning | High | Read one current assignment/loan, then complete one authorized, reviewed request |
| Care, support and restricted records | PAR-46–48 | Restricted reviewer and safeguarding boundary | Separately approved sensitive-data grants | Data classes, emergency access, routing and retention | Very high | Minimal protected request → authorized review with no sensitive general-audit payload |
| Account, privacy and assistant | PAR-49, PAR-51–52 | Access contact verification; privacy owner; governed assistant | Own-account authority; no child-purpose inference | Step-up, jurisdiction/shared records, AI provider/data/action policy | High–very high | Verified contact change is the smallest; privacy and assistant remain separate gates |

## Attendance explanation decision boundary

Sources: `workflow-tasks/WF-PAR-11.md`, `WF-PAR-12.md`, `WF-SA-29.md`, the matching approved Parent/Admin Attendance designs, and the owner’s 15 October 2026 first-release authorization. The later authorization supersedes the prototype’s arbitrary date range, “Ask for more information” state and generic draft behavior for this bounded slice.

- Submission requires an active accepted exact-child link with independently granted `attendance.explanation.submit`; there is no inference or backfill.
- The case targets one existing submitted `ABSENT` session on/after `access_from`, never a future or browser-invented occurrence. Category and bounded plain text are required; attachments and rich text are excluded.
- States are `SUBMITTED`, `ACCEPTED`, `DECLINED` and `WITHDRAWN`. Only the originator may read/withdraw while submitted; another Guardian cannot read the narrative or author identity. Active or accepted cases block a competing submission; declined/withdrawn permits a new one.
- A separately designated branch reviewer may accept/decline and cannot review their own submission. Review/withdraw use current authority, versioning and scoped exact-key replay. Narrative is excluded from general evidence.
- A disposition never changes Attendance. Correction stays a separate `attendance.correct` command.
- Protected narrative storage is disabled by default and enabled only for fictional local/test data. Real-data release remains blocked until a protected-text retention policy is approved; this does not make the fictional-data implementation incomplete.
- PAR-13 remains a separate discrepancy-query contract.

## Counts and next action

| Functional/security status | Count |
|---|---:|
| `ENGINEERING_COMPLETE` | 12 |
| `PARTIAL` | 2 |
| `BLOCKED_PRODUCT_DECISION` | 22 |
| `DESIGN_READINESS_REQUIRED` | 16 |
| **Total** | **52** |

Human review remains PENDING for every row. Direct comparison is limited to the approved current-slice states named above; functional tests are not counted as visual evidence. TT-06 Parent is engineering-verified through FAM-04 and represented by the implemented Timetable portion of PAR-18. EV-01/EV-02 provide the one-off typed Events agenda and EV-04 composes it with the independently authorized effective teaching week; PAR-18 remains partial for academic closures and advanced interactions. PAR-14 is engineering-complete through COM-01. PAR-11/PAR-12 are engineering-complete for the explicitly authorized fictional-data slice; protected-text retention still blocks real data.

Earlier combined Parent/Student provenance is recorded in [15 October consolidated evidence](../evidence/parent-student-consolidated-2026-10-15/README.md). ATT-05 evidence is recorded separately above; the latest row counts are authoritative. Human acceptance is not inferred.
