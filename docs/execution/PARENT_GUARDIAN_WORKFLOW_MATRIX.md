# Parent/Guardian workflow matrix

Last updated: 13 October 2026. Baseline reconciliation started at 21:34 IST. The owner decision received at 22:32 IST supersedes the former five-state proposal and authorizes the simplified foundation in `docs/modules/guardians/DESIGN.md`.

Authoritative UX source: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Parent_Guardian_Design/VSchool_Parent_Guardian_Review.html` (SHA-256 `3f5fdc44d4d48dbb794dfa9cef61b1f09adbafadb737d73cbc99cdb71cc21f9e`, matching `implementation-spec/SOURCE_MANIFEST.json`). The catalog is a 52-workflow **UX design proposal**. Its database worksheet explicitly says that its table names and physical design are proposals requiring reconciliation with the live schema.

## Shared authority gate

The live repository has global `UserAccount` and organization-scoped `AccountPersonBinding`, but only `SCHOOL_ADMIN` and `TEACHER` membership roles. It has no Guardian owner, verified guardian-to-Student relationship, child-purpose grant, family invitation binding, family principal, or parent route. Existing staff invitations cannot be reused: they create a `SchoolMembership`, and a guardian must not become staff merely to enter the family workspace.

The shared authority decision is resolved and implemented: designated `family.access.manage`, explicit school authorization, fixed distinct read purposes, account-bound invitation/acceptance, per-child revocation and authorization-date history bounds. FAM-01 through FAM-04 are engineering-verified; visual comparison and human review remain separate. [Historical baseline](../evidence/parent-guardian-baseline-2026-10-13/README.md). [Current evidence](../evidence/parent-guardian-foundation-2026-10-13/README.md).

Status meanings are mutually exclusive:

- `BLOCKED_PRODUCT_DECISION`: a named security or lifecycle rule needs explicit product approval.
- `BLOCKED_FOUNDATION`: the journey has usable product semantics but cannot be implemented until the shared guardian relationship/purpose authority exists.
- `DESIGN_READINESS_REQUIRED`: an owning module or detailed lifecycle contract is absent in addition to the shared authority gate.

Functional/security status, reference comparison, and human acceptance remain separate.

| Workflow | Approved state | Owning dependency | Functional/security | Reference comparison | Exact remaining gap | Human review |
|---|---|---|---|---|---|---|
| PAR-01 Accept a school invitation | `#/flow/PAR-01` | Guardians + Access | ENGINEERING_COMPLETE | DIRECT_COMPARISON_WITH_EXTENSION | Narrow real activation confirmation is an explicit reference-less extension; no functional gap | PENDING |
| PAR-02 Sign in through the school page | `#/flow/PAR-02` | Access + family principal | ENGINEERING_COMPLETE | SHARED_AUTH_EVIDENCE | Family workspace resolves from live accepted child links; no remaining current-slice gap | PENDING |
| PAR-03 Activate or recover account access | `#/flow/PAR-03` | Access + Guardians | ENGINEERING_COMPLETE | DIRECT_COMPARISON_WITH_EXTENSION | Generic public recovery and dedicated family activation verified; font exception remains | PENDING |
| PAR-04 Review verified child links | `#/flow/PAR-04` | Guardians + Students | ENGINEERING_COMPLETE | DIRECT_COMPARISON | Server-issued permitted-child list and selector verified | PENDING |
| PAR-05 Ask about a missing child link | `#/flow/PAR-05` | Family requests | DESIGN_READINESS_REQUIRED | NOT_STARTED | Non-enumerating request owner, routing, retention and verifier disposition | PENDING |
| PAR-06 Handle changed or withdrawn access | `#/flow/PAR-06` | Guardians | ENGINEERING_COMPLETE | REFERENCE_LESS_NARROW_EXTENSION | Approved simple manager flow was absent from the prototype; real removal and open-page denial verified | PENDING |
| PAR-07 Review family overview | `#/flow/PAR-07` | Guardians + owner summaries | ENGINEERING_COMPLETE | DIRECT_COMPARISON_WITH_SCOPED_OMISSIONS | Minimal fixed-bundle summary implemented; unowned prototype Messages/Requests are deliberately absent | PENDING |
| PAR-08 Switch child and school context | `#/flow/PAR-08` | Guardians | ENGINEERING_COMPLETE | DIRECT_COMPARISON | Server-issued child context, URL state and protected reload verified | PENDING |
| PAR-09 Manage notification preferences | `#/flow/PAR-09` | Communication | DESIGN_READINESS_REQUIRED | NOT_STARTED | Preference persistence, mandatory notice policy and channel verification | PENDING |
| PAR-10 Read child attendance | `#/flow/PAR-10` | Guardians + Attendance | ENGINEERING_COMPLETE | DIRECT_COMPARISON_WITH_SCOPED_OMISSIONS | Read-only submitted history is complete; absence/query controls await their own request-owner contracts | PENDING |
| PAR-11 Submit an absence explanation | `#/flow/PAR-11` | Family requests + Attendance | DESIGN_READINESS_REQUIRED | NOT_STARTED | Request category/date/note policy, transaction, replay and school routing | PENDING |
| PAR-12 Track or withdraw an explanation | `#/flow/PAR-12` | Family requests | DESIGN_READINESS_REQUIRED | NOT_STARTED | Originator visibility, eligible states, optimistic version and retained history | PENDING |
| PAR-13 Query an attendance discrepancy | `#/flow/PAR-13` | Family requests + Attendance | DESIGN_READINESS_REQUIRED | NOT_STARTED | Query owner/routing and disposition contract without correction authority | PENDING |
| PAR-14 Read and acknowledge a notice | `#/flow/PAR-14` | Communication | DESIGN_READINESS_REQUIRED | NOT_STARTED | Versioned notice audience and explicit acknowledgement owner | PENDING |
| PAR-15 Reply to a permitted conversation | `#/flow/PAR-15` | Communication | DESIGN_READINESS_REQUIRED | NOT_STARTED | Child-scoped participant grants, recipient resolution and delivery lifecycle | PENDING |
| PAR-16 Request a teacher meeting | `#/flow/PAR-16` | Communication/calendar | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Proposed capability, availability source, confirmation and cancellation policy | PENDING |
| PAR-17 Resolve an undelivered message | `#/flow/PAR-17` | Communication | DESIGN_READINESS_REQUIRED | NOT_STARTED | Stable message/delivery attempt model and revoked-recipient handling | PENDING |
| PAR-18 Plan with school calendar | `#/flow/PAR-18` and `#/timetable` | Academics/Events + TT-06 Parent | PARTIAL | DIRECT_TIMETABLE_COMPARISON | Effective published child Timetable, including configured teaching days and lesson/break periods, is complete; Calendar/Events owner remains design-readiness work | PENDING |
| PAR-19 Respond to a school event | `#/flow/PAR-19` | Events | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Proposed response authority, versioning, withdrawal and consent separation | PENDING |
| PAR-20 Review published homework | `#/flow/PAR-20` | Learning | DESIGN_READINESS_REQUIRED | NOT_STARTED | Learning owner, published task projection and `learning.read_child` grant | PENDING |
| PAR-21 Read returned feedback | `#/flow/PAR-21` | Learning | DESIGN_READINESS_REQUIRED | NOT_STARTED | Returned-version owner and private-draft exclusion | PENDING |
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
| PAR-32 Submit a school request | `#/flow/PAR-32` | Family requests | DESIGN_READINESS_REQUIRED | NOT_STARTED | Category registry, routing, visibility, payload and retention | PENDING |
| PAR-33 Track/withdraw a request | `#/flow/PAR-33` | Family requests | DESIGN_READINESS_REQUIRED | NOT_STARTED | Originator access, transitions, concurrency and retained evidence | PENDING |
| PAR-34 Request child-record update | `#/flow/PAR-34` | Requests + Students/People | DESIGN_READINESS_REQUIRED | NOT_STARTED | Allowed field categories, evidence and owner disposition handoff | PENDING |
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
| PAR-50 Review sessions/sign out | `#/flow/PAR-50` | Access | PARTIAL | BROWSER_VERIFIED_SUPPORTED_SLICE | Current-session sign-out is complete; other-session inventory/revocation lacks an approved owner contract and implementation | PENDING |
| PAR-51 Request privacy support | `#/flow/PAR-51` | Privacy/Requests | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Jurisdiction, authority, routing, retention and child/co-guardian rights | PENDING |
| PAR-52 Ask school assistant | `#/flow/PAR-52` | Assistant | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Provider, allowed sources/data classes, grounding, evaluation and human action policy | PENDING |

## Counts and next action

| Functional/security status | Count |
|---|---:|
| `ENGINEERING_COMPLETE` | 8 |
| `PARTIAL` | 2 |
| `BLOCKED_PRODUCT_DECISION` | 16 |
| `DESIGN_READINESS_REQUIRED` | 26 |
| **Total** | **52** |

Human review remains PENDING for every row. Direct comparison is limited to the approved current-slice states named above; functional tests are not counted as visual evidence. TT-06 Parent is engineering-verified through FAM-04 and represented by the implemented Timetable portion of PAR-18. The remaining PAR-18 Calendar/Events behavior and PAR-50 cross-session management remain partial rather than being inferred from those narrower slices.
