# Requests module design

## F09 approved scope

Requests owns operational staff requests and restricted family complaints under approved D12/D08. The first staff categories are `STAFF_AVAILABILITY` and `CLASSROOM_RESOURCE`; approval records only the owner outcome and never mutates payroll, leave, Timetable or People availability. `FAMILY_COMPLAINT` stores protected narrative only in Requests. General Coordination, Leadership home metrics, exports and platform audit receive a safe request reference and state only.

Categories are branch configuration written only by the trusted operator path in this synthetic release. A category pins one ordinary reviewer, one independent institution steward, an appeal-window length and a retention class. Both accounts are candidates until each command rechecks live account, branch/institution authority and separation. The family form supplies only the factual boolean that the concern involves the usual reviewer; the Requests owner resolves that reviewer from trusted category configuration and records the resulting implicated account. The browser never selects or asserts an account ID. If the configured reviewer is implicated, the case routes to the configured steward. If no independent live route exists, submission fails before storing protected content.

Staff creation requires a live branch membership and makes the actor the originator/subject. Family creation requires a current accepted, unrevoked Guardian child access for the exact Student and makes the Guardian account the originator. The originator, affected subject and implicated account cannot review. Only the exact assigned reviewer can read protected content or decide. Originators see their own submitted facts and public outcome, never internal notes. Another guardian receives no access automatically.

Lifecycle: `SUBMITTED → WAITING_INFORMATION → SUBMITTED → APPROVED|DECLINED`; `SUBMITTED|WAITING_INFORMATION → WITHDRAWN`. Return requires an actionable reason and creates one open information request; only the originator may respond. Decline and return require a reason. Approval records `NO_DOWNSTREAM_CHANGE` and explicitly does not update another owner. Every mutation uses expected version and an actor/command/key receipt. Replay reauthorizes before disclosure; changed payload conflicts. Case, decision, response, receipt and safe platform audit write atomically.

## Physical schema

| Physical table (Prisma model) | Columns | Responsibility | Constraints/indexes |
|---|---|---|---|
| `vs_requests_category` (RequestsCategory) | id uuid PK; organization_id/school_id/reviewer_account_id/steward_account_id/appeal_reviewer_account_id uuid; code/kind/label/retention_class/status text; appeal_days/version int; created_at/updated_at timestamptz | Trusted synthetic branch request category and separated ordinary/conflict/appeal reviewer configuration. | Scoped School/account FKs; kind/code/status/text/window/version/three-reviewer separation CHECKs; scoped id/code uniqueness; kind/status and reviewer indexes |
| `vs_requests_case` (RequestsCase) | id uuid PK; organization_id/school_id/category_id/originator_account_id/subject_account_id/implicated_account_id/reviewer_account_id/investigation_owner_account_id/student_id uuid; kind/state/title/narrative/desired_outcome/public_outcome text; submitted_at/updated_at/closed_at/acknowledged_at/appeal_deadline_at timestamptz; review_due_on date; version int | Protected operational request or family complaint aggregate with exact participants, review checkpoint and assigned reviewer. | Scoped Category/School/Student and account FKs; kind/state/text/version/lifecycle/review-checkpoint/participant/separation CHECKs; scoped id uniqueness; reviewer/state, originator and Student indexes |
| `vs_requests_decision` (RequestsDecision) | id uuid PK; organization_id/school_id/case_id/reviewer_account_id uuid; number/case_version int; action/reason/result text; occurred_at timestamptz | Immutable reviewer outcome or information request for a protected case. | Scoped Case/account FKs; action/reason/result/version CHECKs; scoped id and case/number uniqueness; case/time index; append-only trigger |
| `vs_requests_response` (RequestsResponse) | id uuid PK; organization_id/school_id/case_id/decision_id/originator_account_id uuid; response text; case_version int; occurred_at timestamptz | Immutable originator response to the current information request. | Scoped Case/Decision/account FKs; text/version CHECKs; scoped id and decision uniqueness; case/time index; append-only trigger |
| `vs_requests_command_receipt` (RequestsCommandReceipt) | id uuid PK; organization_id/school_id/actor_account_id/case_id uuid; command/key/input_hash text; result jsonb; occurred_at timestamptz | Exact owner-scoped replay receipt reauthorized before protected result disclosure. | Scoped Case/account FKs; hash CHECK; scoped id and actor/command/key uniqueness; case/time index; append-only trigger |
| `vs_requests_case_event` (RequestsCaseEvent) | id uuid PK; organization_id/school_id/case_id/actor_account_id uuid; type/reason text; review_due_on date; case_version int; occurred_at timestamptz | Immutable protected acknowledgement and appeal/reopen evidence. | Scoped Case/account FKs; type/shape/version CHECKs; scoped id uniqueness; case/time index; append-only trigger |

All six tables are `BRANCH` classified under TEN-ADR-006 Path A. Application authorization remains active on every read/write; TEN-03 remains the production closure gate.

## Read/write and locking contract

Reads start from live account and School state. Staff originator reads filter exact originator; reviewer reads filter exact current reviewer and exclude any row where the actor is originator, subject or implicated. Family originator reads additionally recheck the exact accepted Guardian/Student relationship. Reviewer detail joins Category and the latest decision/response only after authority. General directories and exports never join narrative.

Mutations lock account → Organization SHARE → School UPDATE and, for an existing case, Case UPDATE. Submission resolves the reviewer on the server from the category snapshot inside the serializable transaction. Decision, response and withdrawal advance the case version and append immutable evidence in one serializable transaction. Concurrent decisions have one version winner. Exact replay occurs only after current actor/participant authority. Repeating unchanged trusted category setup is a no-op; a changed trusted configuration advances its version.

## API and production composition

- `/api/v1/requests` lists the actor's permitted cases and creates one owner request.
- `/api/v1/requests/:id` returns the actor-specific projection.
- `/api/v1/requests/:id/decision` records approve, decline or return.
- `/api/v1/requests/:id/response` records the originator response; `/withdraw` closes an eligible open request with a required reason.
- `/admin/requests/new` and `/admin/requests/:id` are staff counterpart compositions.
- `/api/v1/family/concerns` resolves scope through the current accepted child context; `/family/concerns/new` and `/family/concerns/:id` are family counterpart compositions.
- `/leadership/staff/requests` and `/leadership/staff/requests/:id` are the restricted Principal queue/detail composition.
- `/leadership/concerns` and `/leadership/concerns/:id` isolate the assigned protected-family queue from staff requests.

Transport failures preserve the exact payload/key. Validation, stale version, unavailable independent route, forbidden/revoked actor and unknown outcome are distinct. No durable browser draft is introduced.

## Verification

Real PostgreSQL must prove no self/subject/implicated review, independent complaint routing, wrong-guardian and cross-branch denial, exact replay, changed payload conflict, replay-safe withdrawal, concurrent decision serialization, current authority before receipt disclosure, immutable evidence and no payroll/People/Timetable writes. Playwright must cover staff submission → assigned Principal → approve → originator receipt/reload and family submission → implicated-Principal omission → independent reviewer → originator receipt/reload. LEA-35 remains partial beyond F09 until acknowledgement, explicit investigation ownership/review date and independent appeal/reopen are implemented.

## LEA-35 lifecycle delta

The remaining protected-family lifecycle stays inside Requests. It does not grant Coordination, general Principal search, audit or export access to complaint content.

- A family case in `SUBMITTED` or `APPEALED` must be acknowledged by its current assigned reviewer before a decision. Acknowledgement records that same reviewer as the explicit investigation owner and requires a branch-local `review_due_on` date on or after the current branch date. This release does not delegate investigation content to another account.
- Family return/response resumes `UNDER_REVIEW`; operational staff return/response retains its existing `SUBMITTED` behavior. Final family approve/decline keeps the existing attributed terminal state and adds a server-calculated appeal deadline from the category's configured `appeal_days`.
- A category may name a third appeal reviewer. It must be distinct from both ordinary reviewer and leadership-conflict steward. Appeal is available only to the current authorized originator, only for a terminal family outcome within its configured window, and only once because this synthetic category configures one independent appeal tier. The browser never supplies reviewer identity.
- Appeal appends protected immutable evidence, rechecks the third reviewer's live Principal membership, reopens the same case as `APPEALED`, assigns that server-configured reviewer, clears the previous investigation checkpoint, and retains every prior decision and public outcome. The appeal reviewer must acknowledge before issuing the appeal outcome.
- A missing or ineligible appeal reviewer produces `INDEPENDENT_ROUTE_UNAVAILABLE`; expiry produces `CONFLICT`. Neither UI acknowledgement nor an old receipt clears these conditions. Every acknowledge and appeal command uses expected version plus actor/command/key receipt, reauthorizes replay disclosure and writes case, immutable event, safe audit and receipt atomically.

Forward migration `20261018190000_requests_family_lifecycle` adds the optional category appeal reviewer, case acknowledgement/review/appeal fields and immutable `vs_requests_case_event`. Existing rows retain their prior state and no reviewer is inferred or backfilled. Trusted synthetic configuration must explicitly populate the appeal reviewer before an appeal becomes available.
