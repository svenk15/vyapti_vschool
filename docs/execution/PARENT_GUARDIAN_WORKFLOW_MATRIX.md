# Parent/Guardian workflow matrix

Last updated: 13 October 2026. Baseline reconciliation started at 21:34 IST; the intended six-hour handover checkpoint was 03:34 IST on 14 October 2026. Execution stopped at the shared authority gate rather than inventing a guardian principal or child grant.

Authoritative UX source: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Parent_Guardian_Design/VSchool_Parent_Guardian_Review.html` (SHA-256 `3f5fdc44d4d48dbb794dfa9cef61b1f09adbafadb737d73cbc99cdb71cc21f9e`, matching `implementation-spec/SOURCE_MANIFEST.json`). The catalog is a 52-workflow **UX design proposal**. Its database worksheet explicitly says that its table names and physical design are proposals requiring reconciliation with the live schema.

## Shared authority gate

The live repository has global `UserAccount` and organization-scoped `AccountPersonBinding`, but only `SCHOOL_ADMIN` and `TEACHER` membership roles. It has no Guardian owner, verified guardian-to-Student relationship, child-purpose grant, family invitation binding, family principal, or parent route. Existing staff invitations cannot be reused: they create a `SchoolMembership`, and a guardian must not become staff merely to enter the family workspace.

SA-32 remains `BLOCKED_PRODUCT_DECISION` in the canonical Administrator matrix. It requires accepted decisions for the adult verification source and authority, restricted evidence handling, purpose-grant overlap/history, relationship lifecycle, and account-wide recovery. These decisions precede every protected child read, including TT-06's Parent projection. [Baseline evidence and the narrow proposal](../evidence/parent-guardian-baseline-2026-10-13/README.md).

Status meanings are mutually exclusive:

- `BLOCKED_PRODUCT_DECISION`: a named security or lifecycle rule needs explicit product approval.
- `BLOCKED_FOUNDATION`: the journey has usable product semantics but cannot be implemented until the shared guardian relationship/purpose authority exists.
- `DESIGN_READINESS_REQUIRED`: an owning module or detailed lifecycle contract is absent in addition to the shared authority gate.

Functional/security status, reference comparison, and human acceptance remain separate.

| Workflow | Approved state | Owning dependency | Functional/security | Reference comparison | Exact remaining gap | Human review |
|---|---|---|---|---|---|---|
| PAR-01 Accept a school invitation | `#/flow/PAR-01` | Guardians + Access | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Verification authority/evidence, intended-account binding, exact grant activation and replay lifecycle | PENDING |
| PAR-02 Sign in through the school page | `#/flow/PAR-02` | Access + family principal | BLOCKED_FOUNDATION | NOT_STARTED | Family workspace resolution from live relationships; current workspace resolution is staff membership based | PENDING |
| PAR-03 Activate or recover account access | `#/flow/PAR-03` | Access + Guardians | BLOCKED_PRODUCT_DECISION | NOT_STARTED | How active/pending/revoked guardian links participate in account-wide stricter recovery | PENDING |
| PAR-04 Review verified child links | `#/flow/PAR-04` | Guardians + Students | BLOCKED_FOUNDATION | NOT_STARTED | Active relationship and purpose-filtered child summary query | PENDING |
| PAR-05 Ask about a missing child link | `#/flow/PAR-05` | Family requests | DESIGN_READINESS_REQUIRED | NOT_STARTED | Non-enumerating request owner, routing, retention and verifier disposition | PENDING |
| PAR-06 Handle changed or withdrawn access | `#/flow/PAR-06` | Guardians | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Effective dates, revocation authority, overlap/history and cache invalidation event | PENDING |
| PAR-07 Review family overview | `#/flow/PAR-07` | Guardians + owner summaries | BLOCKED_FOUNDATION | NOT_STARTED | Purpose-filtered multi-child read model | PENDING |
| PAR-08 Switch child and school context | `#/flow/PAR-08` | Guardians | BLOCKED_FOUNDATION | NOT_STARTED | Server-issued child context and cross-request invalidation boundary | PENDING |
| PAR-09 Manage notification preferences | `#/flow/PAR-09` | Communication | DESIGN_READINESS_REQUIRED | NOT_STARTED | Preference persistence, mandatory notice policy and channel verification | PENDING |
| PAR-10 Read child attendance | `#/flow/PAR-10` | Guardians + Attendance | BLOCKED_FOUNDATION | NOT_STARTED | `attendance.read_child` authority and scoped child-to-frozen-roster projection | PENDING |
| PAR-11 Submit an absence explanation | `#/flow/PAR-11` | Family requests + Attendance | DESIGN_READINESS_REQUIRED | NOT_STARTED | Request category/date/note policy, transaction, replay and school routing | PENDING |
| PAR-12 Track or withdraw an explanation | `#/flow/PAR-12` | Family requests | DESIGN_READINESS_REQUIRED | NOT_STARTED | Originator visibility, eligible states, optimistic version and retained history | PENDING |
| PAR-13 Query an attendance discrepancy | `#/flow/PAR-13` | Family requests + Attendance | DESIGN_READINESS_REQUIRED | NOT_STARTED | Query owner/routing and disposition contract without correction authority | PENDING |
| PAR-14 Read and acknowledge a notice | `#/flow/PAR-14` | Communication | DESIGN_READINESS_REQUIRED | NOT_STARTED | Versioned notice audience and explicit acknowledgement owner | PENDING |
| PAR-15 Reply to a permitted conversation | `#/flow/PAR-15` | Communication | DESIGN_READINESS_REQUIRED | NOT_STARTED | Child-scoped participant grants, recipient resolution and delivery lifecycle | PENDING |
| PAR-16 Request a teacher meeting | `#/flow/PAR-16` | Communication/calendar | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Proposed capability, availability source, confirmation and cancellation policy | PENDING |
| PAR-17 Resolve an undelivered message | `#/flow/PAR-17` | Communication | DESIGN_READINESS_REQUIRED | NOT_STARTED | Stable message/delivery attempt model and revoked-recipient handling | PENDING |
| PAR-18 Plan with school calendar | `#/flow/PAR-18` and `#/timetable` | Academics/Events + TT-06 Parent | BLOCKED_FOUNDATION | NOT_STARTED | Published child audience plus verified relationship/purpose projection; no draft exposure | PENDING |
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
| PAR-50 Review sessions/sign out | `#/flow/PAR-50` | Access | BLOCKED_FOUNDATION | NOT_STARTED | Current-session sign-out primitive exists; Parent session view/entry and child-state clearing require family principal | PENDING |
| PAR-51 Request privacy support | `#/flow/PAR-51` | Privacy/Requests | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Jurisdiction, authority, routing, retention and child/co-guardian rights | PENDING |
| PAR-52 Ask school assistant | `#/flow/PAR-52` | Assistant | BLOCKED_PRODUCT_DECISION | NOT_STARTED | Provider, allowed sources/data classes, grounding, evaluation and human action policy | PENDING |

## Counts and next action

| Functional/security status | Count |
|---|---:|
| `BLOCKED_PRODUCT_DECISION` | 19 |
| `BLOCKED_FOUNDATION` | 7 |
| `DESIGN_READINESS_REQUIRED` | 26 |
| **Total** | **52** |

All 52 reference comparisons and human reviews are `NOT_STARTED`/`PENDING` because there is no authorized Parent application route to compare. TT-06 Parent projection is an additional cross-role dependency outside the 52 catalog rows; it remains blocked on the same verified relationship and `timetable.read` purpose authority.

The next executable slice is the Guardians foundation plus PAR-01/PAR-04 only after the five decisions in the baseline evidence are accepted. Once that foundation exists, PAR-02, PAR-07, PAR-08, PAR-10 and the TT-06 Parent projection become independently implementable without inventing another product rule.
