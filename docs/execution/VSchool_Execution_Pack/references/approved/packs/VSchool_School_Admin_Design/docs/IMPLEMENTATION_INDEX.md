<!-- TT-01 contract -->
## TT-01 integration
See [the shared timetable source of truth](timetable/README.md) and [persona mapping](TIMETABLE_INTEGRATION.md). Existing task and verification entries below are baseline unless explicitly refreshed in timetable-evidence.json.

# Proposed implementation index

These are design references, not replacements for existing repository task IDs. Map each SA journey to current tasks first. All statuses are **NOT_ASSESSED in the actual repository**; future physical/API LLDs remain required.

| Slice | Journey | Phase | Prerequisites | Demo outcome |
|---|---|---|---|---|
| SA-IMPL-01 | [SA-01 — Sign in and choose a branch](modules/home/DESIGN.md#sa-01) | 1 | existing verified Access + Tenancy context | The administrator lands on Today in the chosen branch. |
| SA-IMPL-02 | [SA-02 — Activate or recover an account](modules/home/DESIGN.md#sa-02) | 1 | existing IAM-02/03/04 contracts | A generic acknowledgement and permitted recovery instructions are shown. |
| SA-IMPL-03 | [SA-03 — Switch branch or sign out](modules/home/DESIGN.md#sa-03) | 1 | SA-01 | New context is resolved on the server, or the session is signed out. |
| SA-IMPL-04 | [SA-04 — Complete first-use setup](modules/home/DESIGN.md#sa-04) | 1 | SA-01, module readiness contracts | The next incomplete dependency opens in its owning module. |
| SA-IMPL-05 | [SA-05 — Resolve a daily exception](modules/home/DESIGN.md#sa-05) | 1 | SA-26, SA-24, SA-15 | The source record opens with its branch and status intact. |
| SA-IMPL-06 | [SA-06 — Edit branch information](modules/settings/DESIGN.md#sa-06) | 1 | SA-01 | Permitted details are saved with a revision and activity entry. |
| SA-IMPL-07 | [SA-07 — Review branding and school sign-in](modules/settings/DESIGN.md#sa-07) | 1 | SA-01, explicit branding delegation | A delegated publisher can publish; other school administrators can request a branding update. |
| SA-IMPL-08 | [SA-08 — Review modules and request a capability](modules/settings/DESIGN.md#sa-08) | 1 | SA-01, TEN entitlement contracts | The administrator gets a clear handoff to the institution contact. |
| SA-IMPL-62 | [SA-62 — Review activity, privacy or support access](modules/settings/DESIGN.md#sa-62) | 1 | existing append-only safe audit | A safe branch-scoped event is available for review. |
| SA-IMPL-09 | [SA-09 — Create an academic year and calendar](modules/academics/DESIGN.md#sa-09) | 1 | SA-06 | A valid year and immutable calendar revision are available. |
| SA-IMPL-10 | [SA-10 — Configure grades, sections and subjects](modules/academics/DESIGN.md#sa-10) | 1 | SA-09 | The class and subject are available for offering setup. |
| SA-IMPL-11 | [SA-11 — Create an offering and assign a teacher](modules/academics/DESIGN.md#sa-11) | 1 | SA-10, SA-16 | A dated teaching assignment is saved. |
| SA-IMPL-12 | [SA-12 — Change calendar or teaching assignment](modules/academics/DESIGN.md#sa-12) | 1 | SA-11, SA-25 | A supported future-dated change preserves historical references. |
| SA-IMPL-13 | [SA-13 — Create a staff profile](modules/staff/DESIGN.md#sa-13) | 1 | SA-01 | An organization Person and branch Employee profile are linked deliberately. |
| SA-IMPL-14 | [SA-14 — Grant staff sign-in access](modules/staff/DESIGN.md#sa-14) | 1 | SA-13, existing identity acceptance gates | A pending membership/grant is created and the permitted activation path is shown. |
| SA-IMPL-15 | [SA-15 — Review invitation or resend access](modules/staff/DESIGN.md#sa-15) | 1 | SA-14 | The new invitation attempt has an expiry and an honest delivery outcome. |
| SA-IMPL-16 | [SA-16 — Verify a staff identity and teacher eligibility](modules/staff/DESIGN.md#sa-16) | 1 | SA-14, explicit IAM-03 acceptance where documented | The teacher can be selected for dated assignments when all requirements are met. |
| SA-IMPL-17 | [SA-17 — Change or revoke staff access](modules/staff/DESIGN.md#sa-17) | 1 | SA-14 | The next protected request rechecks the changed grant. |
| SA-IMPL-18 | [SA-18 — Register a student manually](modules/students/DESIGN.md#sa-18) | 1 | SA-01, exact identity selection contract | A Student profile references the deliberately selected organization Person. |
| SA-IMPL-19 | [SA-19 — Enroll and place a student](modules/students/DESIGN.md#sa-19) | 1 | SA-18, SA-10 | The enrollment and effective placement are saved. |
| SA-IMPL-20 | [SA-20 — Review or update a student record](modules/students/DESIGN.md#sa-20) | 1 | SA-18 | The permitted correction is saved with a reason and revision. |
| SA-IMPL-21 | [SA-21 — Move a student to another section](modules/students/DESIGN.md#sa-21) | 1 | SA-19, attendance impact contract | Current and new placement intervals remain contiguous and explainable. |
| SA-IMPL-22 | [SA-22 — Promote, transfer or leave school](modules/students/DESIGN.md#sa-22) | 3 | SA-19, destination / obligation contracts | A dated lifecycle case records the outcome and preserves source history. |
| SA-IMPL-23 | [SA-23 — Preview a roster import](modules/imports/DESIGN.md#sa-23) | 1 | SA-19, import schema and upload contract | A preview is available; no student records are written. |
| SA-IMPL-24 | [SA-24 — Confirm, resume and reconcile an import](modules/imports/DESIGN.md#sa-24) | 1 | SA-23 | Each row reports created, unchanged, failed or remaining with durable receipts. |
| SA-IMPL-25 | [SA-25 — Schedule attendance sessions](modules/attendance/DESIGN.md#sa-25) | 1 | SA-11, SA-19 | The session appears in the assigned teacher’s teaching day. |
| SA-IMPL-26 | [SA-26 — Monitor and inspect attendance](modules/attendance/DESIGN.md#sa-26) | 1 | SA-25, teacher submission implementation | The exact session and its submission evidence are shown. |
| SA-IMPL-27 | [SA-27 — Correct submitted attendance](modules/attendance/DESIGN.md#sa-27) | 1 | SA-26 | A new correction revision appears with actor, reason and time. |
| SA-IMPL-28 | [SA-28 — Cancel or review a session change](modules/attendance/DESIGN.md#sa-28) | 1 | SA-25 | A supported cancellation records its reason and preserved history. |
| SA-IMPL-29 | [SA-29 — Review an absence explanation](modules/attendance/DESIGN.md#sa-29) | 2 | SA-32, SA-26, SA-35 | The family receives a permitted disposition; attendance changes only through correction. |
| SA-IMPL-30 | [SA-30 — Review and export attendance](modules/reports/DESIGN.md#sa-30) | 1 | SA-26 | A scoped report and bounded export match the underlying session records. |
| SA-IMPL-31 | [SA-31 — Compare trends and assign follow-up](modules/reports/DESIGN.md#sa-31) | 2 | SA-30, new follow-up LLD | The concern has an owner, due date and source evidence. |
| SA-IMPL-32 | [SA-32 — Verify and link a parent or guardian](modules/families/DESIGN.md#sa-32) | 2 | SA-18, guardian evidence / restricted-reason design | A verified child-specific relationship and inactive selected purpose grants are approved. Intended-account acceptance activates only those approved purposes. |
| SA-IMPL-33 | [SA-33 — Invite a verified guardian](modules/families/DESIGN.md#sa-33) | 2 | SA-32, Access account policy | An invitation has a visible delivery and acceptance state. Only intended-account acceptance activates the exact child’s approved grant. |
| SA-IMPL-34 | [SA-34 — Change, restrict or revoke a guardian link](modules/families/DESIGN.md#sa-34) | 2 | SA-32, queued delivery revocation contract | The exact child grant or school relationship changes with history preserved; old invitations and protected views recheck current access. |
| SA-IMPL-35 | [SA-35 — Compose and send a school message](modules/communication/DESIGN.md#sa-35) | 2 | SA-32, provider / consent / purpose design | A draft is approved, published or scheduled with a stable notice identity and exact immutable version. Recipients read and explicitly acknowledge through their own workspace. |
| SA-IMPL-36 | [SA-36 — Resolve failed delivery or missing acknowledgement](modules/communication/DESIGN.md#sa-36) | 2 | SA-35 | A permitted delivery attempt, reminder, version, withdrawal or verified offline response is recorded while previous evidence remains intact. |
| SA-IMPL-37 | [SA-37 — Review a family request](modules/communication/DESIGN.md#sa-37) | 2 | SA-33, owner module request contracts | The family sees the decision and any next step. |
| SA-IMPL-38 | [SA-38 — Capture inquiry and start an application](modules/admissions/DESIGN.md#sa-38) | 3 | admission cycle and application LLD | An application has a reference, checklist and next action. |
| SA-IMPL-39 | [SA-39 — Review application and make a decision](modules/admissions/DESIGN.md#sa-39) | 3 | SA-38, capacity / decision authority | The decision revision and next action are recorded. |
| SA-IMPL-40 | [SA-40 — Accept an offer and enroll once](modules/admissions/DESIGN.md#sa-40) | 3 | SA-39, SA-19 | One student conversion receipt links the application to enrollment. |
| SA-IMPL-41 | [SA-41 — Build and publish a timetable](modules/planning/DESIGN.md#sa-41) | 3 | SA-11, room / recurrence design | A published timetable version drives idempotent future session generation. |
| SA-IMPL-42 | [SA-42 — Arrange cover or a timetable exception](modules/planning/DESIGN.md#sa-42) | 3 | SA-41 | The supported substitution is visible to the affected staff. |
| SA-IMPL-43 | [SA-43 — Review learning readiness and follow-up](modules/planning/DESIGN.md#sa-43) | 3 | learning module LLD | An authorized follow-up points to the owning learning record. |
| SA-IMPL-44 | [SA-44 — Collect and review a document](modules/documents/DESIGN.md#sa-44) | 3 | document storage / scan / grant LLD | The document version and review state are visible to authorized users. |
| SA-IMPL-45 | [SA-45 — Issue a certificate or publish a form](modules/documents/DESIGN.md#sa-45) | 3 | SA-44, approved template design | An issued revision has a reference and controlled download. |
| SA-IMPL-46 | [SA-46 — Coordinate assessment setup and marks readiness](modules/assessments/DESIGN.md#sa-46) | 4 | SA-11, assessment scheme LLD | The assessment moves only when its defined prerequisites are met. |
| SA-IMPL-47 | [SA-47 — Approve, publish or correct results](modules/assessments/DESIGN.md#sa-47) | 4 | SA-46, publication concurrency design | Published results or a linked correction are available with a timestamp. |
| SA-IMPL-48 | [SA-48 — Configure fees and concessions](modules/finance/DESIGN.md#sa-48) | 5 | finance LLD + explicit approval authority | An approved plan revision can be used to generate invoice snapshots. |
| SA-IMPL-49 | [SA-49 — Generate invoices and collect payment](modules/finance/DESIGN.md#sa-49) | 5 | SA-48, payment verification / idempotency design | Posted invoice, verified payment and receipt retain separate states. |
| SA-IMPL-50 | [SA-50 — Resolve reconciliation, adjustment or refund](modules/finance/DESIGN.md#sa-50) | 5 | SA-49, refund reservation and reconciliation design | An authorized adjustment or reconciled outcome appends to the ledger. |
| SA-IMPL-51 | [SA-51 — Prepare routes and allocate students](modules/transport/DESIGN.md#sa-51) | 6 | SA-18, transport qualification / capacity design | A dated allocation contributes to the next trip manifest. |
| SA-IMPL-52 | [SA-52 — Resolve a trip or handoff exception](modules/transport/DESIGN.md#sa-52) | 6 | SA-51, handoff / offline contingency design | An accountable trip exception is recorded and escalated where needed. |
| SA-IMPL-53 | [SA-53 — Review leave and staffing coverage](modules/people-ops/DESIGN.md#sa-53) | 6 | SA-13, leave ledger / coverage design | The leave balance and coverage decisions are recorded separately. |
| SA-IMPL-54 | [SA-54 — Review payroll inputs and hand off](modules/people-ops/DESIGN.md#sa-54) | 6 | SA-53, restricted payroll rules and review | Authorized payroll review proceeds with immutable approved run history. |
| SA-IMPL-55 | [SA-55 — Catalog and circulate library items](modules/library/DESIGN.md#sa-55) | 6 | SA-18, physical copy / hold policy design | The loan or reservation is recorded with a clear due date. |
| SA-IMPL-56 | [SA-56 — Resolve overdue, lost or inventory discrepancies](modules/library/DESIGN.md#sa-56) | 6 | SA-55 | The item and borrower record show the reasoned outcome. |
| SA-IMPL-57 | [SA-57 — Receive, issue or return stock and assets](modules/facilities/DESIGN.md#sa-57) | 6 | stock and custody ledger LLD | An append-only movement and current custody state are available. |
| SA-IMPL-58 | [SA-58 — Book a facility or request maintenance](modules/facilities/DESIGN.md#sa-58) | 6 | room overlap and maintenance design | A conflict-free booking or owned maintenance order is recorded. |
| SA-IMPL-59 | [SA-59 — Refer a health or safeguarding concern](modules/health/DESIGN.md#sa-59) | 6 | restricted referral and escalation design | An authorized specialist receives a minimal referral; general admins see only permitted handoff status. |
| SA-IMPL-60 | [SA-60 — Review emergency access and restricted case handling](modules/health/DESIGN.md#sa-60) | 6 | SA-59, emergency authority and independent review | Authorized emergency access has an expiry, audit and independent review. |
| SA-IMPL-61 | [SA-61 — Review connection status and reconcile a sync](modules/integrations/DESIGN.md#sa-61) | 3 | integration secret / replay / sync design | A scoped synchronization run has reconciled per-record outcomes. |
| SA-IMPL-63 | [SA-63 — Review an AI-assisted explanation or draft](modules/assistant/DESIGN.md#sa-63) | 7 | source module permission contracts, provider / retrieval / evaluation gates | A reviewed draft or explanation can support a human decision. |

## Recommended batches

1. Reconcile current app; shared SchoolShell, context, sign-in and Today. Reuse existing identity/tenancy evidence.
2. One end-to-end attendance oversight slice, including actual correction and report consistency.
3. Student registration/enrollment/class moves; staff profile/access/eligibility; academic setup and CSV recovery.
4. School settings, branding delegation, drafts and safe activity; verify the whole Phase 1 school day.
5. Verified guardian relationships before invitation; then family requests and communication.
6. Design each later optional service independently before implementation. No blanket permission expansion.

Do not force this design order over real repository dependencies. Readiness and human gates in current module state remain authoritative.

<!-- EDITION02 -->
## Integrated family implementation order
Keep SA-IMPL-32/33/34 as the administrator parent slices; use the concrete subtask breakdown in [families/TASKS.md](modules/families/TASKS.md). SA-IMPL-37.A belongs to the existing Requests workflow, not a new family inbox product. Parent acceptance/read tasks map to PAR-01/04/05/06 in the Parent design pack. No duplicate feature queue is created.

Order: 32.A → 32.B → 33.A → 33.B → 33.C → 34.A; 37.A can follow verified owner contracts. Finish with SA-FAMILY-VERIFY. Current repository dependencies and gates take precedence. All production statuses remain NOT_ASSESSED.

<!-- EDITION03 -->
## Edition 03 — next essential module: Communication & Notices
The stable parent journeys remain SA-35 and SA-36, with TEA-17/18 and PAR-09/14 recipient/authoring handoffs. Use [Communication TASKS](modules/communication/TASKS.md) for 11 proposed demonstrable subtasks; these map to the actual repo queue before execution. Start at SA-IMPL-35.A (owner/purpose design), then editor → audience → publication → recipient acknowledgement → provider/scheduling/approval → follow-up/correction → integrated evidence. SA-37 and private conversations/attachments remain separate owner slices. No module task is declared implemented in production by this design update.
