# Communication & Notices — integrated design

Edition 03 · Phase 2 · Stable journeys SA-35 and SA-36; SA-37 remains the existing Requests flow. This is the next essential module after Family Access.

The four connected sources of truth are the proposed Bible amendment, this DESIGN entry (with HLD/LLD), TASKS, and CURRENT_STATE. Reconcile the proposal into the live repository before coding; do not overwrite verified work or invent implementation status.

- [HLD.md](HLD.md): product scope, actors, aggregates, ports, permissions and phases.
- [LLD.md](LLD.md): tables, fields, constraints, indexes, joins, commands, transactions, sequence and failure behavior.
- [TASKS.md](TASKS.md): small demonstrable implementation slices.
- [CURRENT_STATE.md](CURRENT_STATE.md): prototype evidence and pending production gates.

## How a non-technical school user works
| Goal | Start | What to do | What completion looks like |
|---|---|---|---|
| Tell families something | Communication → Create notice | Write the message → choose recipients → review → publish | Published notice with recipient and acknowledgement status |
| Finish later | Create notice → Save draft and leave | Resume under Drafts & approvals | Same safe entries, no publication until confirmed |
| Publish at a planned time | Review → At a scheduled time | Pick school-local time and confirm | Scheduled; can cancel before publication |
| Ask the office to publish | Teacher preview → Prepare class notice | Review assigned class and submit for approval | Awaiting approval; nothing sent yet |
| Review a teacher draft | Drafts & approvals | Review & publish, or request changes | Published exact revision, or actionable teacher feedback |
| Find out who received it | Notice → Recipients & delivery | Read the separate email/read/ack columns | Accurate evidence, not inferred delivery or consent |
| Fix email failure | Delivery & follow-up → Details | Retry a confirmed failure; Check status for Unknown | Appended attempt or reconciled evidence |
| Get a response | Notice → Remind pending recipients | Review remaining eligible accounts and confirm | In-app reminder; acknowledgement stays pending |
| Record a phone response | Recipient Details → Record verified offline response | Enter safe school reference and confirm exact version | Staff-recorded method and actor, never a forged parent action |
| Correct a mistake | Notice → Publish correction | Review changed content and audience | Same notice, new version, previous evidence preserved |
| Remove a notice | Notice → Withdraw | Review effect, choose reason, confirm | Portal body unavailable; delivered email cannot be recalled |
| Read as a parent/staff recipient | Recipient inbox | Read current notice → explicitly acknowledge when asked | Version-specific receipt; no other family list |

<a id="sa-35"></a>
## SA-35 — Compose, approve and publish
Three steps: **Message → Recipients → Review**. Main action is Continue; Save draft and leave sits on a separate secondary line and starts disabled. Choose portal audience from an explicit branch/class/staff scope; show eligible account count, excluded-student count and a collapsible permitted-recipient preview. School-notice access is independently approved; attendance alone is insufficient. Optional email uses verified channels/preferences and generic content. Publication/scheduling requires explicit review and current publisher authority.

A teacher can compose for an assigned class and submit for school approval. The role does not gain direct publish permission. Review pins the exact draft revision. School changes or recipient changes require renewed review.

<a id="sa-36"></a>
## SA-36 — Follow up without false certainty
Email Queued/ProviderAccepted/Failed/Unknown/Suppressed, portal Read, and Acknowledged are distinct. Count current eligible recipient accounts and show exclusions separately. Known failed notification can be retried explicitly; Unknown requires reconciliation. Read is never inferred from email tracking. A reminder does not acknowledge. Offline response uses its own staff capability and verified reference. Correction/withdrawal never rewrites prior evidence.

<a id="sa-37"></a>
## SA-37 — Existing family requests remain connected
The Family requests tab opens the existing administrator request flow. Family Access's missing-access queue remains integrated with its verifier handoff. A general request never directly changes identity, attendance or financial data. This notice module does not claim to complete private conversations, request-owner APIs or meeting bookings.

## Screen recipes and important states
- **Notices:** compact metrics, subject/reference search on Enter, separate shared filter/sort drawers, concise row View action; Draft/Processing/Scheduled/Published/Withdrawn/Cancelled/NeedsReview states.
- **Editor:** bounded labels, per-field validation, purposeful recipient preview, school-local timing, error summary, unsaved-leave confirmation. Attachments are an explicit later slice.
- **Detail:** content and outcome first; next action at the side on desktop; recipient evidence table; history and earlier versions; a clearly labeled fictional recipient preview.
- **Inbox:** only notices addressed to the current actor, with Needs acknowledgement / Acknowledged / Read / New. No co-recipient list.
- **Failure states:** empty branch, no eligible recipient, changed audience/version, save failure, unknown publication, failed/unknown email, revoked purpose, superseded notice, withdrawal and canceled schedule.
- **Mobile:** stacked forms and recipient cards, contained horizontal tabs, keyboard-usable dialogs, separate signout. Same shared theme variables apply throughout.

## Prototype scope
The complete administrator HTML opens directly on Communication; Families and Communication are visible in the main navigation. All state is fictional and resets on reload. No emails are sent. Parent and teacher actor switches are review controls, not authorization features. Existing production code and security gates have not changed.
