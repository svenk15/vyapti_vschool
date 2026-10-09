# Communication & Notices — LLD

Edition 03. This is a concrete schema/application proposal. Reconcile existing tables, migrations, owner APIs and naming before coding. None of the following is evidence that a migration or production module already exists.

## Screen and use-case map
| Surface | Application operation | Outcome |
|---|---|---|
| Notices | listNotices with bounded page/search/filter/sort | Own-branch list; status and exact denominators |
| Create notice / Drafts | saveNoticeDraft, submitNoticeDraft, requestDraftChanges | Versioned private draft or exact-review request |
| Recipients | previewNoticeAudience | Deduped account count, bounded preview, exclusions and digest |
| Review | publishNotice / scheduleNotice | Existing command receipt or accepted Processing / Scheduled result |
| Notice detail | getNoticeDeliverySummary | Published content/version, recipient/attempt/read/ack states |
| Correction | publishNoticeCorrection | Same NoticeId, new immutable version; new acknowledgement |
| Schedule / withdrawal | cancelNoticeSchedule, withdrawNotice | No future publication/send; retained history |
| Delivery follow-up | retryFailedNotification, reconcileUnknownNotification | Another permitted attempt, or evidence-based resolved outcome |
| Reminder | remindUnacknowledgedRecipients | Only current, unacknowledged, permitted recipients within throttle policy |
| Offline response | recordVerifiedOfflineAcknowledgement | Separate staff actor/method/evidence |
| Parent / staff inbox | listMyNotices, getMyNotice, markNoticeRead | Only current permitted account/version projection |
| Recipient confirmation | acknowledgeNotice | Unique version/account acknowledgement or permitted replay |

## Candidate physical tables
All timestamps are `timestamptz`; IDs are UUIDs; revisions are positive bigint. Every branch table carries `organization_id` and `school_id` NOT NULL. Use matching composite uniqueness and FKs across Communication tables, and the reconciled owner scope constraints for cross-module IDs. Defaults never confer access. All tables are branch-scoped for the TEN-03 registry; global Account references do not make these tables global.

| Table | Main fields and constraints | Stored responsibility |
|---|---|---|
| `vs_communication_notice` | `id` PK; org/school; `status` enum Draft/Processing/Scheduled/Published/Withdrawn/Cancelled/NeedsReview; `current_version_id` nullable; `revision`; `created_by_account_id`; `created_at`,`updated_at`,`withdrawn_at`; safe `withdrawal_code` | Stable notice identity and current lifecycle. Same identity survives correction; no hard deletion of published evidence. |
| `vs_communication_draft` | `id` PK; org/school; `notice_id` nullable for correction; `author_account_id`; title varchar(120); body text bounded 5,000 characters; audience kind; class/offering ref nullable; `requires_ack` boolean; `ack_due_date` date nullable; `notify_email` boolean; `scheduled_at` nullable; `revision`; status Draft/AwaitingApproval/ChangesRequested/Approved; `submitted_revision`; reviewer/feedback refs; timestamps | Editable content and exact version reviewed. Validate target scope against owner assignment/enrollment; do not trust draft audience JSON as authorization. |
| `vs_communication_notice_version` | `id` PK; org/school; `notice_id`; `version_no`; immutable title/body; category; acknowledgement policy/date; audience criteria version; `audience_digest`; `approved_by_account_id`; `approved_at`; `published_at`; original schedule/zone; UNIQUE(org,school,notice,version_no) | Published or staged immutable content revision. CHECK required acknowledgement ↔ due date presence. Content may never be updated in place after publication. |
| `vs_communication_recipient` | `id` PK; org/school; `notice_version_id`; `account_id`; `status` Pending/Eligible/Suppressed; safe suppression code; `first_read_at` nullable; timestamps; UNIQUE(org,school,version,account) | Frozen approved account manifest. One account row even with multiple eligible children; read is separate from email and acknowledgement. Contact/address not the identity key. |
| `vs_communication_recipient_binding` | `id`; org/school; `recipient_id`; binding kind GuardianPurpose/StaffMembership; exact owner grant/membership ref; student ref nullable; owner version; audience class ref nullable; reviewed effective dates; UNIQUE(recipient,kind,owner_ref) with scope | Why this account was included. Match current purpose, student/branch/class and owner relationship at read/send. Preserve provenance; do not expose all binding details to recipients. |
| `vs_communication_delivery_attempt` | `id`; org/school; `recipient_id`; channel; kind Initial/Retry/Reminder; stable `intent_key`; attempt number; status Queued/ProviderAccepted/Failed/Unknown/Suppressed; provider correlation/id nullable; safe failure code; queued/sent/evidenced timestamps; UNIQUE(org,school,intent_key,recipient,channel,kind) | Append-only attempts and authorized state transitions. Provider acceptance is not proof of delivery, read or acknowledgement. No token/provider-secret/raw-body logging. |
| `vs_communication_acknowledgement` | `id`; org/school; `notice_version_id`; `recipient_account_id`; `actor_account_id`; method RecipientAction/VerifiedOffline; `acknowledged_at`; protected `evidence_ref` nullable; UNIQUE(org,school,version,recipient_account); CHECK method-specific evidence/actor rules | Deliberate response for an exact version. Offline method retains staff actor, recipient identity and restricted evidence; never relabel as parent action. |
| Existing transaction receipt, safe audit and outbox owners | org/school/actor/command/intent + canonical digest; outcome reference/status; safe event metadata; versioned outbox intent; correlation/lease | Atomic write evidence, replay recovery and durable initial dispatch. Reuse existing tables; add `vs_communication_command_receipt` / `vs_communication_outbox` only if no compatible owner contract exists. |

Use typed searchable columns for status, scope, IDs and dates. If audience criteria use JSON, the schema version is mandatory and the JSON is bounded; all identities and permissions are resolved via owner ports. Parent DTOs omit recipient lists, exclusions, private contacts, safe-but-internal error codes and other guardians.

### Constraints and indexes
- Composite FKs enforce same org/school for NoticeVersion→Notice, Recipient→Version, Binding→Recipient and Attempt→Recipient. Resolve cross-module scope and record ownership against real schemas before migration.
- Guard reference cycles between Notice and its current Version with a deferred same-notice composite FK or controlled two-step transaction; document the chosen SQL explicitly.
- List index `(organization_id, school_id, status, updated_at DESC, id)`; exact reference lookup uses scoped NoticeId. Use bounded subject search and an EXPLAIN-proven index strategy; do not make every request a full-body wildcard scan.
- Recipient inbox index `(organization_id, school_id, account_id, notice_version_id)`; pending acknowledgement/read projections use scoped version/account. Count eligible, suppressed and total snapshot accounts separately; label the denominator.
- Attempt lookup `(organization_id, school_id, recipient_id, created_at DESC)`; worker claim index on queue state/next eligible time with bounded batches and leases.
- Scheduled publication index `(status, scheduled_at, organization_id, school_id, id)` on the controlled worker surface. A scheduler has its own narrow principal; never reuse owner credentials as an application bypass.
- Unique command intent and version/account acknowledgement indexes are concurrency controls, not merely performance hints. Map status update CAS conditions to expected revisions.

## Query and join workflows
### Administrator notice list
Server derives account/org/school context and checks communication read/manage capability. Query scoped Notice → current Version; compose recipient count, current-eligible denominator, read and current-version acknowledgement count. Page using deterministic `(updated_at,id)` cursor. Each count must use the same version and visibility rules. The UI cannot calculate school-wide counts from a parent endpoint.

### Audience preview
Current school enrollment/class selection → explicit verified `communication.notice.read` purpose grants → accepted Account binding → current relationship, institution/branch/module status → verified channel preference. Staff notices resolve active branch memberships; teacher composers can resolve only assigned class audiences. Deduplicate by AccountId; preserve all justifying child-purpose bindings. Exclusions show bounded operational counts without custody reasons or unauthorized adult data. Return a server-signed/durable preview reference plus audience digest and draft revision. Browser-provided counts and emails are never authoritative.

### Parent/staff inbox
Start at Recipient where `account_id` equals authenticated principal; join same-scope NoticeVersion and Notice current-version pointer. Check Published and current permission for at least one permitted binding. Do not list all school notices then filter in the client. Minimize current-child names if one binding was removed; another child's valid grant does not justify revealing the removed child's context. Old versions require explicit policy; the first slice asks recipients to read the current version.

### Delivery detail and acknowledgement join
Conceptual Communication-only SQL, after the application has authorized this branch/version:
```sql
SELECT r.id, r.account_id, r.first_read_at,
       a.method, a.actor_account_id, a.acknowledged_at
FROM vs_communication_recipient r
LEFT JOIN vs_communication_acknowledgement a
  ON a.organization_id = r.organization_id
 AND a.school_id = r.school_id
 AND a.notice_version_id = r.notice_version_id
 AND a.recipient_account_id = r.account_id
WHERE r.organization_id = :organization_id
  AND r.school_id = :school_id
  AND r.notice_version_id = :version_id
ORDER BY r.id
LIMIT :page_size;
```
Resolve latest delivery attempt with a scoped lateral query or an explicit owner projection, not an unbounded join that multiplies acknowledgement counts. Revalidate each binding through its owner contract when generating delivery/read decisions. RLS remains a second layer governed by the actual TEN-03 state, not a replacement for these checks.

## Command and transaction protocols
### Save and review a draft
Bound body to 32 KiB at the transport, title to 120 and message to 5,000 Unicode characters. Accept only known DTO fields. Reject raw HTML/script, arbitrary attachment URLs and client-supplied actor/tenant claims. BEGIN → current account/context/module/compose authority → existing scope guard and mutation lock order → expected draft revision → save draft/update revision + safe receipt → COMMIT. A teacher submit pins draft revision; review or request changes compares that exact revision. Publication requires a separate current publisher capability.

### Publish now
Derive context; validate draft and review reference; recompute allowed audience and compare digest. If content/audience/version changed, return ReviewRequired with safe refreshed counts. Do not silently accept a changed recipient list. Small manifests can be persisted atomically with immutable Version, Recipient/Binding rows, current Notice pointer, outbox intents, receipt and audit. For large audiences accept a durable Processing command, persist resumable manifest batches with uniqueness, then publish only after the full manifest is complete and final scope policy is rechecked. Never expose a partially prepared notice as Published. One command intent must produce one NoticeId/current-version transition.

### Schedule and publish when due
Convert school-local entered date/time using the institution's immutable branch zone to an unambiguous UTC instant; validate DST ambiguity/nonexistent times where applicable. Store original zone and local value for review. At confirmation freeze the approved manifest and content revision. Scheduler claims bounded due work under a narrow principal/lease. Under write guard and CAS, recheck current eligibility of that manifest; do not add newly joined families automatically. Suppress removed recipients. If none remain, use NeedsReview; do not report successful delivery. Publish and enqueue allowed initial notifications atomically; cancel-versus-worker race has one winning revision. A replacement schedule requires new deliberate review; delivered effects cannot be rolled back.

### Dispatch and retry
Commit an outbox intent before a provider call. Worker claims the intent, checks withdrawal/current version/live binding/current verified contact/preference/quiet-hour policy, and records a stable attempt identity before crossing the external boundary. Email contains a generic portal sign-in prompt; private notice content remains behind authorization. Persist ProviderAccepted only with provider evidence; timeout is Unknown. Reconcile Unknown using provider correlation/status/idempotency; where impossible, require an operator decision and clearly explain uncertainty—never blind retry.

This first slice uses explicit authorized retry for confirmed Failed attempts. Suppressed/revoked/opted-out/unverified targets are not retry candidates. Workers execute initial/scheduled dispatch; they do not silently retry failed delivery in this cut. IAM invite/password-reset rotation is unchanged and remains a different contract.

The existing Access email seam `{ok:true}|{ok:false,reason}` is not extended by changing IAM semantics. Communication's NotificationSender port needs an evidence-bearing result such as Accepted(providerMessageId), Failed(safeCode), or Unknown(correlation). A provider adapter may share infrastructure underneath; domain code never imports `lib/server/email.ts` directly.

### Read and acknowledge
Read checks current recipient and permission first. Record first_read_at idempotently via a separate protected read-event command; opening alone never writes acknowledgement. Acknowledge command contains NoticeId, exact VersionId/number and stable intent. BEGIN → current account/context/recipient grant → lock or version-check current Notice/Version under documented order → require Published/current version and acknowledgement policy → insert unique version/account acknowledgement with actor=current account, method=RecipientAction → receipt/audit → COMMIT. Retry returns the existing authorized result. Correction/withdrawal/revocation racing acknowledgement must fail or serialize consistently, never acknowledge unseen newer content.

Offline response requires an independent explicit staff capability, current exact recipient/version, a bounded protected evidence reference and a deliberate confirmation. Store method=VerifiedOffline and staff actor; do not set first_read_at or claim recipient-side interaction. Restrict evidence and preserve actor history.

### Correct or withdraw
Correction pins expected Notice revision and prior VersionId. Reuse NoticeId, append a new immutable Version and new reviewed recipient manifest, change current pointer, and enqueue notices in one controlled publication. Old content, attempts and acknowledgements remain associated with the old version. New version requires its own acknowledgement when requested. Withdrawal CAS wins against pending publication/delivery; blocks future portal body reads and suppresses unsent outbox work. Retain safe history and inform the publisher that already-sent notifications cannot be recalled.

### Remind
Select current Published version → pending acknowledgement → live, permitted recipient → approved throttle policy. One reminder intent cannot create duplicate reminders. Record last-reminded state/attempt independently from acknowledgement. Prototype offers one in-app reminder per account/version; production must settle configured rate/quiet-hour policy before external-channel reminders. No automatic acknowledgement and no repeated uncontrolled reminder loop.

```mermaid
sequenceDiagram
 participant School
 participant App as Communication application
 participant DB as Scoped database
 participant Parent
 School->>App: Publish reviewed draft + audience digest
 App->>DB: Guard, version, manifest, outbox, receipt
 DB-->>School: Published or durable Processing receipt
 Parent->>App: Open addressed notice
 App->>DB: Current version + live recipient grant
 App-->>Parent: Minimal published content
 Parent->>App: Acknowledge exact version
 App->>DB: Recheck and insert unique acknowledgement
 DB-->>Parent: Existing or new acknowledgement
 School->>App: Publish a correction
 App->>DB: New version; preserve prior acknowledgements
 Parent->>App: Acknowledge old version
 App-->>Parent: Read the updated version first
```

## Typed outcomes, recovery and read contracts
Application outcomes: Saved, AwaitingApproval, ReviewRequired, Processing, Scheduled, Published, ExistingReceipt, ValidationError, Forbidden, Conflict, OutcomeUnknown, Withdrawn, DeliveryFailed, DeliveryUnknown and Suppressed. Public/recipient denied responses do not reveal other account or child existence.

Writes use explicit command endpoints or server actions with CSRF and rate limits. GET never publishes, consumes an invitation, acknowledges or withdraws. UI edits keep a stable intent until its outcome is known. Poor network preserves safe in-memory draft where permitted; unknown publication offers Check status. Offline publication/acknowledgement is not promised. Do not store protected message drafts in long-lived browser storage without an approved device/privacy design; clear scope-specific data on logout/revocation/context change.

Prototype identities are fictional email labels and local state; production uses verified AccountId/PersonId and owner grants. Prototype actor switches are not an impersonation API. Native accessibility, real provider credentials, real-DB concurrency and load benchmarks remain unverified.
