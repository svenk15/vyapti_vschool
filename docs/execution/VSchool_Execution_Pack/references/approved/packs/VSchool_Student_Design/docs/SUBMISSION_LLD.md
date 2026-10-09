# Learning critical path LLD
Proposed contract to reconcile with actual Learning, Teacher and Files LLDs before implementation.

## API surface
| Use case | Suggested transport | Input | Output / error |
|---|---|---|---|
| List work | GET /api/student/assignments | context ref; allowlisted search/filter/sort; cursor | minimized rows + stable cursor |
| Read work | GET /api/student/assignments/:id | assignment ref | published assignment + own summary |
| Save draft | PUT /api/student/assignments/:id/draft | expectedVersion, text, file IDs | draftVersion, savedAt; 409 conflict |
| Begin file | POST /api/student/assignments/:id/uploads | untrusted name/type/size | scoped upload reference |
| File status | GET /api/student/uploads/:id | upload ref | authorized scan state |
| Submit | POST /api/student/assignments/:id/submissions | reviewedAssignmentVersion, expectedDraftVersion, intent key | accepted receipt / exact replay / conflict |
| Check intent | GET /api/student/assignments/:id/submission-outcomes/:key | opaque random key | accepted / pending / verified not found |
| Read attempt | GET /api/student/submissions/:id | attempt ref | immutable snapshot + safe lifecycle |
| Revision | POST /api/student/assignments/:id/revisions | sourceAttemptId + expected policy version | private draft; no submission |
| Withdraw | POST /api/student/submissions/:id/withdrawal | expectedAttemptVersion, intent key | versioned withdrawn receipt |
| Feedback | GET /api/student/submissions/:id/feedback | attempt ref | only returned student-facing publication |

Names are proposed adapters; use existing route/error conventions. CSRF/session/auth guards apply to mutations. Never accept actor identity, server time, clean-file verdict, lateness or teacher review state from request JSON.

## Proposed bounds
- Response text: 10,000 characters. Validate encoded request body separately at 64 KiB for metadata/text routes; object-store byte uploads use separate limits.
- Up to 3 files, 10 MiB each; PDF, PNG, JPEG and UTF-8 text initial allowlist. Actual detection/scanning and policy review are required.
- Display names max 180 characters. Opaque object keys contain no pupil names. Escape names/text.
- Lists default 25, max 100; stable keyset cursor. Search max 120 characters; parameterized queries and allowlisted sort columns.
- Message/request text: 2,000 characters. No support attachments until their owner-specific handling is designed.
- Explicit 413/422/409 recovery; preserve editor input. Access failure cannot reveal another pupil's record.

These are proposals, not existing Bible limits. Keep IMP-01's separate existing 8 KiB contract unchanged.

## SavePrivateDraft transaction
1. Begin; resolve authenticated student context and current account/institution/school guards.
2. Read published assignment/audience and current attempt policy. Preserve a private draft after deadline where policy allows; a save cannot bypass submit policy.
3. Validate text/file bounds and exact institution/school/student/assignment ownership.
4. Update only WHERE version = expectedVersion; increment version. Unique assignment/student key and compare semantics resolve concurrent first creation.
5. Audit only minimum event metadata if required; exclude response text, filenames and file contents.
6. Commit, then return saved time/version. Network failure leaves client text unsaved/unknown until authorized re-read.

## SubmitAssignment transaction
1. Begin and recheck account, verified link, enrollment, release, module entitlement and current assignment audience.
2. Lookup receipt by scope + actor + operation + intent key. Exact accepted fingerprint returns original receipt after current read authorization; changed fingerprint is conflict.
3. Lock Assignment then current PrivateDraft and latest attempt in the owner-prescribed global order. Teacher review/withdrawal follows the same ordering.
4. Validate reviewed assignment version, draft version, non-empty response, resubmission policy, server deadline and approved extension. An extension request is not approval. Acceptance time is server-decided inside this transaction.
5. Verify persisted clean immutable file versions for exact same owner/draft scope. Snapshot references cannot later target changed content.
6. Allocate attempt number under serialized assignment/student scope; insert answer, effective due timestamp, accepted timestamp, late flag and policy version. Preserve previous attempts.
7. Insert attachment snapshots, accepted command receipt and safe audit atomically. Notifications use owner outbox; no provider network I/O under locks.
8. Commit before saying Received. Bounded deadlock/serialization retries reuse intent. Ambiguous commit requires status reconciliation.

## Lost response
Freeze intended payload/key. Accepted returns exact receipt; Pending remains pending. A definitive not-found result needs documented consistency and transaction-completion guarantees before retrying the same intent; absence on a stale replica is not proof of failure. New edited intent is unavailable until the original outcome resolves. The prototype covers accepted-but-response-lost; pending/not-found consistency remains a production gate.

## Revision and withdrawal
Return of feedback does not grant revision. Explicitly copy permitted content/assets into a new private draft, retaining attempt history and rechecking immutable clean file references. Do not silently erase source files that cannot be reused; show a file-level recovery reason.

Withdrawal rechecks version, policy and review lock in one transaction. Teacher review and student withdrawal cannot both win. Retain original received time, snapshot and withdrawal event. Replaying original submit returns original identity/current authorized lifecycle; it cannot recreate a withdrawn attempt.

## Teacher and guardian integration
Teacher sees accepted attempts, not live private drafts. Private feedback is not student-visible until returned. Guardian projections independently check child-purpose permission and released-feedback policy. Guardian UI cannot invoke submission by supplying a student identifier.

## Poor network and shared devices
Default: no persistent client storage for drafts or tokens. Text stays in memory until acknowledged save. Show failure and retain text in the live tab. Reload/sign-out can lose unsaved text; communicate before leaving. Persistent offline drafts need opt-in, key lifecycle, expiry, revocation handling, account scope and shared-device cleanup. Never background-submit on reconnect.

## Concurrency matrix
| Race | Contract |
|---|---|
| Two saves at same version | One update; other conflict retains local text |
| Double submit, same intent | One attempt; same receipt |
| Two distinct intents | Current-attempt gate plus unique allocation prevents unintended duplicate |
| Teacher changes reviewed policy | Re-review current policy |
| Scan verdict changes before submit | No untrusted asset accepted |
| Access revoked before status read | No record disclosure |
| Teacher review vs withdrawal | Shared lock/version protocol selects one |
| Private feedback revision | Published projection remains until next authorized publication |

## Retention
Do not invent durations. Approved retention separately governs drafts, accepted work, assets, command receipts and audit. Accepted evidence is not deleted when a draft is discarded, access changes or an attempt is withdrawn.
