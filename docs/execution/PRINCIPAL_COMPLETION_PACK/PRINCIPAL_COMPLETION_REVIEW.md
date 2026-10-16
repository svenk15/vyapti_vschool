# VSchool Principal completion package
Version 1.0 • 17 October 2026 • Product proposal and execution contract

## What this package does
Defines every remaining Principal workflow, shared product policies, owner-interface design, production UX compositions, and a dependency-ordered Codex queue. It preserves the existing Next.js / TypeScript / PostgreSQL hexagonal architecture and completed implementation. It is not a new starter or replacement repository.

## Evidence boundary
Based on the supplied docs(1).zip, not an inspection of current application source or live database. Implementation and verification statuses are documentary claims. Live Codex must reconcile later commits before implementation. No product feature, migration, acceptance or release gate is completed by this package.

## Read order
1. 01_BASELINE_AND_COVERAGE.md — exact 46-workflow inventory and inconsistencies.
2. 02_PRODUCT_DECISIONS.md — consolidated proposed defaults and deployment configuration.
3. 03_SHARED_ARCHITECTURE.md — ports, candidate persistence, transactions and design gates.
4. 04_PRODUCTION_UX.md — deterministic screen recipes; explorer is not a pixel reference for whole pages.
5. workflows/ — one definition per incomplete workflow, including original source contract.
6. 05_EXECUTION_QUEUE.md and EXECUTION_QUEUE.json — ordered tasks and readiness predicates.
7. 06_VERIFICATION_AND_RELEASE.md — test/evidence and completion requirements.
8. 07_CODEX_PROMPT.md — single programme instruction and resume contract.

## Authorization
Existing approved repository decisions remain authoritative. New D02–D19 rules in this package are RECOMMENDED_PENDING_APPROVAL. D01 preserves the already documented live Coordination contract. Creating this package does not automatically approve sensitive policies. The user can approve the proposed product rules as one numbered set, with exceptions. External providers, school-specific safety procedures, financial limits and production retention still require actual configuration. An explicit synthetic-only implementation can be approved without representing it as production-ready.

## Install without replacing existing docs
Copy this directory into docs/execution/PRINCIPAL_COMPLETION_PACK/. Do not replace the existing docs folder or approved reference packs. Commit as a documentation addition. Use the prompt in 07_CODEX_PROMPT.md. Codex then merges relevant approved deltas into the Bible and each owner DESIGN/TASKS/CURRENT_STATE before implementing that owner.

## Outcome and limitations
The package gives all 36 outstanding workflows an explicit target. Several span missing Assessment, Finance, support or AI owners and cannot truthfully be completed with placeholder Principal pages. A supported slice remains partial until its declared full scope is satisfied. No eight-hour completion guarantee. Human acceptance and production readiness remain separate.


---

# Baseline, reconciliation and complete coverage

Source: docs(1).zip, inspected 17 October 2026.

## Important reconciliations

1. Matrix rows report 10 complete, 5 partial, 31 not started; summary still says 7 complete/3 blocked and its final paragraph wrongly calls LEA-09/11/15 blocked. Correct summary from current rows and evidence, not the reverse.
2. Coordination DESIGN already defines 1–50 for LEA-10 and TASKS cites the 17 October contract. Preserve that live contract; the original explorer’s 25 is an earlier proposal, not a fresh unresolved blocker.
3. UX_CONTRACT explicitly says the HTML is a product-specification reader, not a production-screen pack. Routed UI is not inherently incorrect; absence of an agreed production composition is the gap. Approve the recipes in this package instead of copying explorer review controls.
4. Historical CURRENT_STATE entries contain superseded next actions. Use dated owning evidence plus latest task rows; preserve historical narrative but add a current summary.
5. LEA-04 documentation confirms replay is denied after revocation and recovers only after restored authority. Preserve this; do not report a new vulnerability from its abbreviated title.
6. Existing synthetic-only Coordination and Reporting snapshots remain restricted. Documents is design-only and canonical; do not create a parallel Files owner.

## Full inventory

| ID | Outcome | Baseline | Treatment |
|---|---|---|---|
| LEA-01 | Enter the correct leadership workspace | ENGINEERING_COMPLETE | Preserve; regression and visual acceptance only |
| LEA-02 | Switch branches without losing context | ENGINEERING_COMPLETE | Preserve; regression and visual acceptance only |
| LEA-03 | Work under a temporary leadership delegation | NOT_STARTED | [Definition](workflows/LEA-03.md) |
| LEA-04 | Handle access changes during a leadership action | ENGINEERING_COMPLETE | Preserve; regression and visual acceptance only |
| LEA-05 | Review my school today | ENGINEERING_COMPLETE | Preserve; regression and visual acceptance only |
| LEA-06 | Recognize stale, incomplete or unavailable information | ENGINEERING_COMPLETE | Preserve; regression and visual acceptance only |
| LEA-07 | Run the weekly leadership review | NOT_STARTED | [Definition](workflows/LEA-07.md) |
| LEA-08 | Inspect register submission coverage | ENGINEERING_COMPLETE | Preserve; regression and visual acceptance only |
| LEA-09 | Create an accountable missing-register follow-up | ENGINEERING_COMPLETE | Preserve; regression and visual acceptance only |
| LEA-10 | Follow up multiple missing registers safely | NOT_STARTED | [Definition](workflows/LEA-10.md) |
| LEA-11 | Verify, close or reopen a follow-up | ENGINEERING_COMPLETE | Preserve; regression and visual acceptance only |
| LEA-12 | Review factual pupil attendance patterns | NOT_STARTED | [Definition](workflows/LEA-12.md) |
| LEA-13 | Review an absence explanation | NOT_STARTED | [Definition](workflows/LEA-13.md) |
| LEA-14 | Review an attendance correction request | NOT_STARTED | [Definition](workflows/LEA-14.md) |
| LEA-15 | Resolve an incorrect or duplicate scheduled session | ENGINEERING_COMPLETE | Preserve; regression and visual acceptance only |
| LEA-16 | Review timetable conflicts and uncovered classes | PARTIAL | [Definition](workflows/LEA-16.md) |
| LEA-17 | Review assignment completion with the right denominator | PARTIAL | [Definition](workflows/LEA-17.md) |
| LEA-18 | Review feedback awaiting return | PARTIAL | [Definition](workflows/LEA-18.md) |
| LEA-19 | Coordinate an evidence-based learning concern | NOT_STARTED | [Definition](workflows/LEA-19.md) |
| LEA-20 | Check assessment and report readiness | NOT_STARTED | [Definition](workflows/LEA-20.md) |
| LEA-21 | Perform an explicitly delegated moderation decision | NOT_STARTED | [Definition](workflows/LEA-21.md) |
| LEA-22 | Authorize or hand off report publication | NOT_STARTED | [Definition](workflows/LEA-22.md) |
| LEA-23 | Review staffing availability without private reasons | NOT_STARTED | [Definition](workflows/LEA-23.md) |
| LEA-24 | Approve temporary cover when delegated | NOT_STARTED | [Definition](workflows/LEA-24.md) |
| LEA-25 | Decide an assigned staff request | NOT_STARTED | [Definition](workflows/LEA-25.md) |
| LEA-26 | Hand over open work when leadership changes | NOT_STARTED | [Definition](workflows/LEA-26.md) |
| LEA-27 | Work from a purpose-scoped decision inbox | NOT_STARTED | [Definition](workflows/LEA-27.md) |
| LEA-28 | Request information before deciding | NOT_STARTED | [Definition](workflows/LEA-28.md) |
| LEA-29 | Approve, reject or return an assigned item | NOT_STARTED | [Definition](workflows/LEA-29.md) |
| LEA-30 | Recuse and route a conflict of interest | NOT_STARTED | [Definition](workflows/LEA-30.md) |
| LEA-31 | Recover an uncertain or outdated decision | NOT_STARTED | [Definition](workflows/LEA-31.md) |
| LEA-32 | Prepare a targeted school notice | NOT_STARTED | [Definition](workflows/LEA-32.md) |
| LEA-33 | Approve or return a proposed communication | NOT_STARTED | [Definition](workflows/LEA-33.md) |
| LEA-34 | Follow up delivery or acknowledgement gaps | PARTIAL | [Definition](workflows/LEA-34.md) |
| LEA-35 | Handle an escalated family concern or complaint | NOT_STARTED | [Definition](workflows/LEA-35.md) |
| LEA-36 | Run a family or staff meeting with follow-up actions | NOT_STARTED | [Definition](workflows/LEA-36.md) |
| LEA-37 | Refer a concern to an authorized specialist | NOT_STARTED | [Definition](workflows/LEA-37.md) |
| LEA-38 | Follow the school’s urgent safety escalation procedure | NOT_STARTED | [Definition](workflows/LEA-38.md) |
| LEA-39 | Drill into a metric and export permitted evidence | ENGINEERING_COMPLETE | Preserve; regression and visual acceptance only |
| LEA-40 | Compare branches responsibly | NOT_STARTED | [Definition](workflows/LEA-40.md) |
| LEA-41 | Prepare a leadership review brief | NOT_STARTED | [Definition](workflows/LEA-41.md) |
| LEA-42 | Review decision and follow-up history | NOT_STARTED | [Definition](workflows/LEA-42.md) |
| LEA-43 | Review financial exceptions under a separate grant | NOT_STARTED | [Definition](workflows/LEA-43.md) |
| LEA-44 | Coordinate a school service interruption | NOT_STARTED | [Definition](workflows/LEA-44.md) |
| LEA-45 | Review a source-linked leadership draft | NOT_STARTED | [Definition](workflows/LEA-45.md) |
| LEA-46 | Manage sessions, preferences and school support | PARTIAL | [Definition](workflows/LEA-46.md) |

## Source manifest

Hashes identify the supplied documentation snapshot, not application source.

- `execution/PRINCIPAL_WORKFLOW_MATRIX.md` — SHA256 `ef1b150c1f83f6a73651cbd51abe8cf640abe188470a0c9ee4d0fdafd6af3c25`
- `execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/docs/PRINCIPAL_WORKFLOWS.md` — SHA256 `cd68e402991e951cc191cfdb380d20e22f1e1b5dad2a956cfd68a4c1529b1111`
- `execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/docs/UX_CONTRACT.md` — SHA256 `c379c2c36629ce5f8fd22cb1b8b79ee3bda143668f3d65cf0861f4d306e8f4cc`
- `execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html` — SHA256 `c291eaa7542b609f4d67653e5f67880e4c21593e66137daade87c856ef458421`
- `modules/coordination/DESIGN.md` — SHA256 `7951fec5aec91e25c8f247569597bc2a3a4fd67ed18362cb5d12a2361553ec3e`
- `modules/documents/DESIGN.md` — SHA256 `88d09032f2af6a3a8d4f57f8279457549c3c099e1636e6f1fd91803bd51db783`
- `VSchool_Bible.md` — SHA256 `c60978e25ddddd5738231e65bc64bb6c803c07ba8cd1f4f820673c265006cba8`


---

# Consolidated product decision register

Status: D01 is EXISTING_DOCUMENTED. D02–D19 are RECOMMENDED_PENDING_APPROVAL unless live repository evidence shows an accepted equivalent. Each recommendation below is a product proposal, not legal, medical, school-safety or financial advice. The approval record must identify the actual approving user, date, D-IDs and exceptions. Do not fabricate acceptance timestamps.

## Common policy proposed for all new capabilities
Provision new sensitive grants through the existing trusted operator-designation path; do not expand a broad Principal role automatically. Bind scope to institution, branch and purpose. An institution-wide summary grant enumerates branches, never substitutes for branch operational grants. Self-approval is checked by global account/Person identity where established, across workspaces. Default new functionality disabled until release, entitlement, activation and explicit actor grant are satisfied.

All new free-text/case storage remains synthetic-only until its school-approved retention, legal hold, purge and backup-deletion policy is configured. This is a deliberate implementation path, not a claim that all workflows are production-complete. Do not invent a universal number of retention years. Gate real-data enablement on a recorded policy revision and verified enforcement, not just an environment label or a warning.

| ID | Rule to approve | Work unlocked | Real deployment dependency |
|---|---|---|---|
| D01 | Preserve existing LEA-10 1–50 explicit selection, per-item independent commit, safe receipts and stable replay; no bulk Attendance mutation. | LEA-10 | Existing Coordination retention gate |
| D02 | Trusted operator issues exact-action branch delegation for ≤30 calendar days; no onward delegation/self-issue; expiry checked every request; revoke independent of handover. | LEA-03/24/26 | School authorized approvers and action allowlist |
| D03 | Central inbox is a typed owner projection. Each owner alone decides. Independent assigned approver, owner-defined allowed actions, safe recusal, one open information request, exact replay. | LEA-27–31; owner approvals | Each owner must implement real decision counterpart |
| D04 | Coordination may extend via typed evidence ports to academic follow-ups; no generic arbitrary object access. History window ≤90 days; handover/bulk ≤50 items; independent verification. | LEA-07/17–19/26/42 | Operational-note retention and eligible coordinator designations |
| D05 | Own density/reduced-motion preferences only. Trusted branch administrator publishes support contacts/hours; no profile identity edits here. | LEA-46 | Real school contact; no invented monitoring claim |
| D06 | Whole-branch operational comparisons for explicit branch set, ≤20 branches and ≤31 dates. No pupil subset/ranking. Briefs use immutable authorized snapshots; portal share requires rights to every section. | LEA-07/40/41 | Snapshot/narrative retention; disclosure approval |
| D07 | Separate named-pupil attendance-review grant. ≤90-day factual session/date counts; user-entered threshold, no risk label. Explanation text, correction and export are separate grants. | LEA-12–14 | School pupil-detail disclosure purpose and protected-text policy |
| D08 | Source-bound portal clarification only to authorized requester. Correction requests permitted by explicit self/child/assigned-roster purpose; decisions remain Attendance-owned. | LEA-13/14/28 | School reviewer designation and retention |
| D09 | Safe availability intervals; unknown stays unknown. Cover requires independent approval and substitute acceptance, fresh teacher eligibility/conflict check and scheduled register. No open/submitted reassignment. | LEA-16/23/24 | Approved operational availability recorder and substitute rules |
| D10 | Per-recipient due extension and excusal by explicitly designated learning manager; immutable history. Named status evidence separate from answer/feedback content. Academic follow-up uses verified evidence, no Parent feedback disclosure. | LEA-17–19 | Learning-manager/subject-coordinator grants and retained-note policy |
| D11 | Versioned assessment plan/scales, exact marks, independent moderation and separate report publication. No invented board-specific grading. Publish only approved revisions to purpose-authorized recipients. | LEA-20–22 | School-approved scale, rounding, promotion/withholding rules and report template |
| D12 | Owner-typed Requests. First staff types availability/resource; family complaint participants explicit, implicated actors excluded, independent appeal route. No blanket HR/private case visibility. | LEA-25/35 and inbox counterparts | School categories, reviewer routing, appeal window, retention |
| D13 | Separate notice create/review/publish/remind. Independent approval of exact digest; portal reminders first, ≥24h interval and ≤3 per recipient/version. Email only through configured provider; status distinctions preserved. | LEA-32–34 | Sender/provider configuration for actual email; retention |
| D14 | Explicit meeting participants, proposed/confirmed/completed state, individual responses; changed time resets responses; actions individually owned. | LEA-36 | Family meeting purpose and school scheduling rules |
| D15 | Documents canonical owner. PDF/JPEG/PNG ≤10MiB each, ≤5 attachments/action; no executable/archive/HTML/SVG. Quarantine and real scanner; private storage and authenticated server-stream download. | LEA-22/32 and shared attachments | Provider/region/encryption, scanner, quota, retention and deletion |
| D16 | Specialist referrals/urgent handoff are purpose-restricted, human-led and school-configured. Status-only referrer view, no default break-glass or diagnosis. | LEA-37/38 and sensitive escalation | Named school policy steward, reviewed procedure, specialist contacts and retention |
| D17 | Finance owner first: exact money, ledger-backed summaries, independent capped approvals and reconciliation. Principal role confers no financial action. | LEA-43 | Approved finance policy/limits/currency, ledger/payment owner and provider |
| D18 | Facilities is first service incident owner. Factual impact, explicit coordinator and independently verified restoration. Other services require real owner adapters. | LEA-44 | Service roster, approved impact/publication rules |
| D19 | AI drafts use minimized aggregate snapshots and citations, no consequential tools. Explicit human review; source permissions checked on retrieval and viewing. | LEA-45 | Approved model/provider/data-region/retention configuration and evaluation gate |

## Precise extensions and limits

### D02: delegation
A delegation adds only an allowlisted subset of actions the issuer is authorized to issue. Runtime authorization requires a live account, eligible staff identity, valid school, enabled module and a currently effective direct grant or delegation. Start/end instants are recorded with displayed branch timezone. A future grant is not active. Maximum 30 days is a proposed operational default, not a statutory requirement. Delegation records preserve issuer/reason and revokedAt; do not delete attribution after expiry. Access owner handles revoke; do not give Coordination grant-management power.

### D03: decisions and separation
Register owner adapters explicitly. An adapter provides list, detail, allowedActions, requestInformation, respondInformation, decide, recuse, status only where supported. Unsupported methods do not appear. An inbox grant is navigation permission, not decision authority. Requester, proposal author and affected subject cannot make a prohibited final approval; compare identity across all roles. Recusal never grants the chosen successor permission. Institution steward routes unassigned decisions without receiving sensitive body by default. Two concurrent decisions use expectedVersion and one transactional owner receipt.

### D06: comparisons and disclosure
Only metrics explicitly reviewed as school-level operational aggregates may enter cross-branch v1: register coverage, aggregate assignment completion, feedback turnaround and published reconciliation exception counts. Do not include pupil-pattern, case, health, protected explanation or financial subgroups. Even aggregate output requires a disclosure review; if a metric is not on the allowlist, deny rather than assume a universal k-threshold protects it. No additional filters that permit differencing of individual-sensitive groups. Null/withheld branches do not contribute to totals; state that totals cover only included scopes. Different calendars/definitions/cutoffs mean not comparable; do not rank. A brief containing staff identifiers requires the corresponding detail grant for every recipient. Keep source limitations with every figure.

### D07–D08: Attendance and family rights
Read latest effective submitted outcomes, with original revisions retained. No register implies unknown, not absence. Date bounds use branch-local dates and enrollment/history authority. Explanation reviewers see text only for assigned permitted reviews. Clarification recipient is original current authorized submitter; another guardian does not inherit visibility. If originator access is revoked, stop messages and preserve review under school policy without automatic disclosure to another adult. Proposed correction outcome comes from actual Attendance allowlist; no new EXCUSED status is implied. Correction request closure APPLIED requires exact owner receipt and independent verification where configured. Source revision change invalidates the proposed correction.

### D09: cover
Operational availability recorder is separately designated; Teacher may propose own unavailable interval but it becomes authoritative only through approved People/Requests policy. Unknown or busy elsewhere cannot be auto-selected as available. Timetable owner checks same-school occurrences and asks cross-branch conflict port for a minimal collision result. The original Teacher retains only already-authorized historical read access and loses marking for the covered occurrence; no new substitute private HR data is disclosed. Activation updates dated occurrence authority and eligible scheduled Attendance assignment atomically through owner facades. It does not rewrite immutable publication; it is a dated overlay. Frozen/submitted and OPEN registers block cover changes. Cancellation/replacement rechecks current source version and collision state; no auto-reassign after activation.

### D10: Learning extensions/excusals
A learning manager with per-class/subject authority may extend an individual effective deadline, never shorten it through this command, or excuse a recipient with a bounded operational reason. Accepted submissions stay immutable. Submission checks server clock against effective deadline; extensions can reopen an unsubmitted recipient only by explicit reviewed action. Excusal excludes recipient from required-work denominator; existing accepted response remains accessible under prior permissions, not erased. Reversal of excusal requires review and a new future deadline for an unsubmitted learner. No retroactive withdrawal of timely acceptance. Every report pins its definition and as-of rule. Parent sees allowed assignment status only, never Student response/Teacher feedback because of this extension.

### D11: assessment minimum owner contract
School supplies versioned numeric scale (min/max, precision and rounding) and optional display bands; exact decimal arithmetic, not JS floating-point totals. Plan pins subjects, cohort, max score, weighting and reporting policy. Distinguish missing/not assessed/absent/excused from zero. Teacher can enter only assigned subject marks. Moderator distinct from recorder approves exact revision. Report publisher cannot publish a stale/unapproved revision. Student/Guardian recipients require new explicit results.read_self/read_child purposes with no auto-backfill. Student-level result detail/export is separate from readiness aggregate. No promotion, national-board formula or exam scheduling is inferred. PDF artifact generated by school-approved template through Documents; until this owner works, report download is not complete. Published change creates new immutable revision or explicit withdrawal.

### D12/D16: private cases
General Coordination must never hold restricted complaint, medical, safeguarding or staff narrative. Requests/support store protected content under their own access grants and retention class; generic inbox/audit sees safe routing references only. Participant roles are explicit and rechecked; subject of complaint excluded. School must supply an independent route for complaints about leadership. If not configured, provide safe unavailable/contact-gap state, not a fake route. Specialist urgency categories and contact procedures are school-defined. Portal does not claim continuous monitoring. This package does not define legal emergency practice or break-glass access. Synthetic fixtures can prove isolation, but real configuration is still a release prerequisite.

### D13: reminders and approvals
A provider-less in-app reminder is a distinct durable portal item, not a sent email. At reminder confirmation use original frozen audience intersected with current eligible purposes, then remove acknowledged recipients for acknowledgement reminders. Recheck again before actual dispatch. Dedup key includes notice/version/recipient/channel/logical reminder ID; retry uses same key. If provider cannot deduplicate or query ambiguous acceptance, mark UNKNOWN and require reconciliation instead of retrying blindly. No background email retries unless separately approved; manual resend honors current policy. A successful provider acceptance says ACCEPTED, never DELIVERED absent trusted delivery evidence. Returning or rejecting draft requires reason; author can revise/resubmit. No unsupported schedule button.

### D15: Documents decisions split
Product baseline (file allowlist/limits, quarantine, streaming, fail-closed safety) can be approved now. Recommend configurable synthetic branch quota100MiB to exercise quota handling; actual school quota must be set before production. Local private object directory plus real scanner can demonstrate a development adapter; no file is SAFE from extension/MIME or a mocked scanner. Unavailable scanner remains QUARANTINED/SCAN_UNAVAILABLE, with controlled retry. Provider, residency, encryption/KMS, scanner engine/service and retention are intentionally not selected by this package. Do not purchase cloud services or send user documents to third parties. Conditional linking requires SAFE immutable bytes and live owner permission; revoked links must block fresh downloads. Safe filenames/Content-Disposition, content type and nosniff protect serving. Re-scan/invalidation may disable previously safe objects; all downloads check current safety state.

### D17: Finance boundaries
Money uses currency code plus integer minor units or owner-approved fixed decimal; never combine currencies. Provider callbacks require authentication, durable dedup and ledger reconciliation. Product decision alone does not supply actual Finance implementation. Implement ledger/charges/allocations/reconciliation before leadership financial totals. School must configure approval limits and separation; null limit means no approval authority, never unlimited. Begin summary/handoff; leave LEA-43 partial until assigned action and outcome semantics in its declared scope exist. No fake settlements or inferred concessions. No live financial action is authorized by this package.

### D18–D19: service and AI completion
Facilities slice does not complete every possible service integration; document exact supported service. AI can use deterministic test adapter for boundary tests but that is not a working AI-provider demonstration. Provider approval must cover payload minimization, retention and region. Generated content remains untrusted data, cannot call owner commands, and cannot influence retrieval scope. Store authorized source version references and only policy-permitted draft text. Evaluate invented numbers, missing citations, prompt injection and revoked sources before calling the AI workflow engineering-complete.

## One approval form
Record: “Approve product definitions D02–D19 for implementation using synthetic data, with exceptions: ____. Preserve existing D01. This does not authorize production enablement, real external sends, purchases, real payments, school emergency policy or provider selection. External dependencies remain separately configured and verified.”

The user can approve subsets instead. Live Codex must not treat this prewritten form as a submitted approval. If approval is absent it may reconcile documentation and continue already-authorized D01 work, not activate proposed authority.


---

# Production UX contract

Status: proposed production interpretation requiring product acceptance. This intentionally resolves the explorer/production ambiguity; it does not pretend the approved explorer already contains all these pages.

## Source and hierarchy
The supplied UX_CONTRACT explicitly calls its HTML a product-specification reader, not a production screen pack. It specifies 28px titles; explorer CSS uses 32px h1. Use 28px for production per UX contract, preserve explorer narrative/step semantics, and record this precedence. Existing explicitly accepted production components prevail where documented. Create one production specimen per recipe, capture it and use it as baseline for all later workflows; do not re-invent layout each time.

## Exact proposed tokens
Default calm forest palette extracted from supplied HTML: background #F7F8F4; surface #FFFFFF; ink #213A32; muted #596C61; border #DFE6DF; brand #225B49; subtle #E9F2EC; dark #153E31; warning surface #FAEEDA / text #85531F. Map into shared semantic tokens, never scatter per-page hex values. Tenant branding changes permitted brand tokens through existing contrast validation; it never changes permission, page structure, status meaning or font geometry without a separately approved theme variant.

Typography: body14px/1.65 weight400; title28px/1.25 weight600; section18px/1.4 weight600; nav/control13px/1.4; metadata12px/1.4; group11px/1.4. Use a single explicit legal font stack. Proposed portable baseline for this package: Arial, ui-sans-serif, system-ui, sans-serif, matching the supplied Principal explorer body. Do not globally switch an already-approved application font during this batch; record the actual licensed existing stack and obtain baseline approval once. Never silently load Nimbus. This font decision is a recorded visual approval, not something to bury as a passed comparison.

Geometry: sidebar240px desktop; topbar60px; main gutter32px, mobile20px; 4/8/12/16/20/24/32 spacing scale. Desktop controls40px high; touch controls44px minimum. Button horizontal padding14px, gap8px, radius8px. Cards radius12px/padding20px; table header12px/600 and cell13px with12px vertical/16px horizontal padding. Table action column width1%/nowrap with View +18px stroke icon; don't stretch Actions column. Shared stroke icons18px, line1.7. No decorative title icon if redundant. Navigation group11px and links13px; name/role bottom, sign-out separate.

Proposed production breakpoints: <768px navigation drawer and one-column cards, 768–1023 collapsed rail using existing shared shell if present, ≥1024 full sidebar. Main max-width1440px, fill available width. Never add a second global branch panel inside every card. Test 1440×1000 and390×844; also real200% browser zoom separately. Pin browser/font/environment for repeatable screenshots.

## Recipe L — Directory / operational report
Page header title+one-sentence purpose, one primary action if real. Context/freshness line below. Optional metric row from owner definitions. Toolbar uses full table width: flexible pointed search +8px gap+Filters+Sort; no Search button. Search attribute default selected; opening selector does not highlight entire field, focus-visible remains on focused element. Filters drawer width400px desktop/full mobile; unboxed expanded attribute accordions separated by lines, persistent multiselect, Cancel/Apply only. Sort drawer same with expanded Sort by and Order by radios. URL persists applied filters, sort, page; Back restores. Table with caption, aligned headers, content-sized actions; mobile labelled records. Empty list distinguishes no records from no filter matches. Counts describe exact scoped dataset, not only loaded page.

## Recipe D — Detail / evidence
Normal route with breadcrumb to actual parent; siblings never appear nested. Header title+safe status+source timestamp. Main evidence area and24px gap secondary action/timeline area on desktop; stack mobile. Facts precede notes/actions. Source links reauthorize. One clear primary next action. Timeline append-only metadata; no protected narrative in general audit. Small confirm/return/revoke uses an accessible modal, not another unrelated full page. Missing evidence removes decision action, not source read. For private case pages use restricted participant display and exclude global search caching.

## Recipe W — Staged operation
Dedicated recoverable route, canonical back link to source, stage indicator above form. Content max-width800px aligned to main content; no nested full app shell. Stages: details/source → evidence/impact review → confirm, varied only when source requires more. Back left; Continue/Confirm right. Save draft and leave on a separate lower row only if durable owner draft exists and dirty input warrants it. No mutation on Continue. Final receipt replaces form with result/reference/time/source link and next action. If narrow quick action ≤3 fields is used, render same step component in modal with equivalent accessible direct route; state the choice in screen map. Never recreate explorer catalogue tables inside app.

## Recipe R — Receipt / recovery
Receipt route reauthorizes current source purpose; display known state, operation timestamp, safe reference, source version and next permitted action. Unknown has Check status and guidance; no blind new command. Partial bulk shows totals and each item state; hide inaccessible labels. Stale shows permitted attempted/current fields with explicit fresh review. Revoke removes content immediately on denied response and clears local protected state. Safe reference alone never grants receipt access.

## Cross-cutting states and interaction
Dialogs: heading/description, logical initial focus, trap, Escape if safe, opener restoration. Destructive confirmation focuses safe action. Errors inline plus summary and first-error focus; retain allowed inputs. Loading dimensions avoid layout jumps. Background refresh never overwrites unsaved input. Disabled eligibility action explains why without disclosure. Long translated labels wrap without shrinking hit targets. Status icon/text accompanies colour. No hover-only control. Prefer current design-system components; patch shared recipe once rather than duplicating CSS in36 screens.

## Visual definition of done
Before implementation, create SCREEN_MAP.md rows: workflow, actual route, recipe, reference section/step, supported states, measurements and allowed deviations. Compare screenshots with identical viewport/theme/font/data-shape; redact credentials, don't save personal user screenshots. Verify sidebar240/topbar60/gutter32/20 and typography via computed styles. Geometry tolerance ±2CSSpx for fixed dimensions; text wrapping differences require explanation, not arbitrary acceptance. Pixel overlays are diagnostic; do not use a whole-image threshold to approve missing controls. Inspect every critical state and affected shared-shell screen. Baseline changes require explicit record. A documented deviation is not exact parity or human acceptance.


---

# Execution programme

This is a completion programme across sessions, not an eight-hour promise. All statuses here are PLANNED; existing verified owner functionality is reused, not redone. A foundation task may satisfy implementation subtasks in multiple workflows; the final WF task checks complete persona scope without duplicate code.

## Scheduler rules
A task is eligible only when (a) dependencies engineering-verified or satisfied by current equivalent evidence; (b) its D-IDs approved/existing; (c) required owner/provider configuration present for the intended scope; (d) no explicit acceptance dependency blocks it. Human visual review pending does not ordinarily block independent engineering, but no existing explicit human gate may be erased. Choose the earliest eligible task that closes a partial workflow or unlocks several tasks. Never wait for a provider if another approved independent task exists.

Do not implement all foundations before any UI. Complete a foundation's minimum real vertical journey, then its ready WF tasks; grow it when needed. F11/F12/F15/F17 have explicit sub-checkpoints and can span sessions. Missing source owner is substantive work, not permission to seed fake results.

## Preferred delivery order
1. F00 → F01/WF10, F18/WF46, F03/WF27–31 and F04/WF42. Prioritize existing-value closure.
2. F02/WF03/WF26; F05/WF40/WF41/WF07. Finalize brief only after Coordination dependency ready.
3. F06/WF12–14; F08/WF17–19. These introduce explicit pupil/private-content grants and need focused reviews.
4. F07/WF16/WF23/WF24; F10/WF33/WF34 and text-only WF32 partial.
5. F09/WF25/WF35; F13/WF36; F12 closes attachment gaps in WF32 and later WF22.
6. F11/WF20–22; F14/WF37–38; F16/WF44; F15/WF43; F17/WF45, only when approved dependencies/configuration exist.

This ordering is a recommendation; the machine dependency graph is authoritative for readiness. No decision-inbox workflow is fully verified merely by displaying static rows: use real owner decisions, information replies, recusal and replay. Supported-owner scope must be explicit and new owner adapters retain independent acceptance tests.

## Foundation tasks

| Task | Outcome | Dependencies | Decisions | Demo acceptance |
|---|---|---|---|---|
| F00 | Reconcile and establish production screen specimens: Correct stale matrix summary; map actual routes and owners; preserve accepted contracts; produce L/D/W/R specimens using shared tokens and legal existing font. No feature claim from docs. | — | Existing architecture / proposed UX specimen | Use existing verified journeys to demonstrate specimens; capture desktop/mobile; record source manifest. |
| F01 | Finish bounded Coordination bulk contract: Implement existing COORD-02 design and real resumable owner receipts; no new generic workflow engine. | F00 | D01 | Three selected records produce created/existing/failed; kill-response recovery yields no duplicates. |
| F02 | Access delegated authority: Dated action grants, runtime evaluation, trusted provision/revoke and eligible target query. | F00 | D02 | Future/active/expired/revoked persona; same account across roles cannot self-issue. |
| F03 | Typed decision facade and first owner adapter: Register Coordination verification as real first adapter; owner-specific action/status and protected routing; no universal business decision persistence. | F00 | D03 | Principal opens actual pending verification through inbox and owner commits result; unknown/revoked replay proved. |
| F04 | Coordination owner extensions and safe history: Typed source/evidence registration, academic-assignee policy seam, bounded handover and event projections. | F03 | D04 | Existing Attendance follow-up remains unchanged; foreign source kind denied; handover preserves history. |
| F05 | Reporting briefs and comparison contracts: Enumerated aggregate branches, compatible metrics, brief revisions/recipients and snapshot gating. | F00 | D06 | Different branch grants/calendars show qualified comparison; withdrawn recipient cannot read brief. |
| F06 | Attendance pupil/review/request contracts: Distinct pupil detail and explanation reviewer grants; correction request and clarification counterpart; retain Attendance mutations in owner. | F03 | D07, D08 | Parent flags own record; reviewer clarifies/corrects via owner; other guardian denied; explanation acceptance changes no mark. |
| F07 | People availability and Timetable cover: Availability records and privacy projection; exact occurrence cover with approval+acceptance; scheduled Attendance atomic change. | F02, F03 | D09 | Substitute accepts before class; marking changes only after activation; open register conflicts. |
| F08 | Learning recipient rules and academic evidence: Recipient extensions/excusal, status evidence grant and academic follow-up evidence adapter. | F04 | D10 | Extend one recipient, excuse another, submit work; aggregate reconciles without Parent feedback access. |
| F09 | Requests categories and restricted participants: Operational staff requests and family complaint scope; originator response, independent routing, category state machine. | F03 | D12, D08 | Staff request approved without payroll effect; complaint about Principal excluded from their inbox/count. |
| F10 | Communication review and reminders: Versioned author/reviewer/publisher workflow and durable in-app reminder; provider attempt seam without fake email. | F03 | D13 | Publish reviewed exact version; remind one eligible unacknowledged recipient; revoke another before dispatch. |
| F11 | Assessments minimum owner: Subtasks: plan+scale+cohort; teacher mark revisions; independent moderation; report revision/audience. Each checkpoint demo-able; register a distinct owner. | F03 | D11 | Teacher records marks, reviewer returns then approves revised set, publisher prepares report; no missing-as-zero. |
| F12 | Documents safe implementation: Follow DOC-00/01/02 etc canonical tasks: metadata/quarantine, private adapter, real scanning, conditional owner links, authenticated serving and deletion policy. | F00 | D15 | Safe file serves; EICAR-style safe test fixture per scanner docs quarantined; scanner failure blocks download; no real personal files. |
| F13 | Meetings and participant responses: Event-owner scheduling lifecycle, explicit purpose-granted participants, versioned responses and agreed actions. | F04 | D14 | Family invite accepted, changed time resets response, completed meeting creates one reviewed action. |
| F14 | School-configured restricted support: Restricted referral, reviewed procedure/contact configuration and safe status; no invented emergency service. | F09 | D16 | Synthetic referral to specialist; referrer status-only; missing urgent procedure honestly unavailable. |
| F15 | Finance prerequisites and leadership boundary: Subtasks: full Finance LLD; exact-money ledger and charge/receipt facts; allocation/reconciliation; bounded independent decision; safe oversight port. No live payments. | F03 | D17 | Synthetic posted charge/payment/reconciliation drives real aggregate; simulated provider adapter labelled, not real settlement. |
| F16 | Facilities service incidents: Concrete facility/service owner, incident lifecycle and independent restoration evidence; Coordination/notice handoffs. | F04, F10 | D18 | Outage routed, restored and independently verified; notice acknowledgement remains unchanged. |
| F17 | Reviewed AI adapter: Source-minimized retrieval, no mutation tools, provider configuration gate, citation validator and draft lifecycle. | F05 | D19 | Configured approved provider produces cited draft; injected source ignored; revoked source blocks reopen. Test-double only remains partial. |
| F18 | Account preferences and support configuration: Own allowlisted preference persistence and trusted published branch support contact. | F00 | D05 | Reload density preference and separate sign-out; wrong-account write denied; unconfigured support honest. |

## Workflow completion tasks

| Task | Workflow | Owner | Dependencies | Definition |
|---|---|---|---|---|
| WF-03 | LEA-03 Work under a temporary leadership delegation | Access | F02 | [Contract](workflows/LEA-03.md) |
| WF-07 | LEA-07 Run the weekly leadership review | Reporting + Coordination | F01,F04,F05 | [Contract](workflows/LEA-07.md) |
| WF-10 | LEA-10 Follow up multiple missing registers safely | Coordination | F01 | [Contract](workflows/LEA-10.md) |
| WF-12 | LEA-12 Review factual pupil attendance patterns | Attendance + Coordination | F06,F04 | [Contract](workflows/LEA-12.md) |
| WF-13 | LEA-13 Review an absence explanation | Attendance explanations | F06,F03 | [Contract](workflows/LEA-13.md) |
| WF-14 | LEA-14 Review an attendance correction request | Attendance requests + Attendance | F06,F03,F04 | [Contract](workflows/LEA-14.md) |
| WF-16 | LEA-16 Review timetable conflicts and uncovered classes | Timetable + People | F07 | [Contract](workflows/LEA-16.md) |
| WF-17 | LEA-17 Review assignment completion with the right denominator | Learning + Coordination | F08,F04 | [Contract](workflows/LEA-17.md) |
| WF-18 | LEA-18 Review feedback awaiting return | Learning + Coordination | F08,F04 | [Contract](workflows/LEA-18.md) |
| WF-19 | LEA-19 Coordinate an evidence-based learning concern | Learning + Coordination | F08,F04 | [Contract](workflows/LEA-19.md) |
| WF-20 | LEA-20 Check assessment and report readiness | Assessments | F11 | [Contract](workflows/LEA-20.md) |
| WF-21 | LEA-21 Perform an explicitly delegated moderation decision | Assessments | F11,F03 | [Contract](workflows/LEA-21.md) |
| WF-22 | LEA-22 Authorize or hand off report publication | Assessments + Documents | F11,F12,F03 | [Contract](workflows/LEA-22.md) |
| WF-23 | LEA-23 Review staffing availability without private reasons | People + Timetable | F07 | [Contract](workflows/LEA-23.md) |
| WF-24 | LEA-24 Approve temporary cover when delegated | Timetable + People | F02,F07,F03 | [Contract](workflows/LEA-24.md) |
| WF-25 | LEA-25 Decide an assigned staff request | Requests + People | F09,F03 | [Contract](workflows/LEA-25.md) |
| WF-26 | LEA-26 Hand over open work when leadership changes | Coordination + Access | F02,F04 | [Contract](workflows/LEA-26.md) |
| WF-27 | LEA-27 Work from a purpose-scoped decision inbox | Leadership aggregation + owner facades | F03 | [Contract](workflows/LEA-27.md) |
| WF-28 | LEA-28 Request information before deciding | Each decision owner | F03 | [Contract](workflows/LEA-28.md) |
| WF-29 | LEA-29 Approve, reject or return an assigned item | Each decision owner | F03 | [Contract](workflows/LEA-29.md) |
| WF-30 | LEA-30 Recuse and route a conflict of interest | Each decision owner | F03 | [Contract](workflows/LEA-30.md) |
| WF-31 | LEA-31 Recover an uncertain or outdated decision | Each decision owner + Access | F03 | [Contract](workflows/LEA-31.md) |
| WF-32 | LEA-32 Prepare a targeted school notice | Communication + Documents | F10,F12 | [Contract](workflows/LEA-32.md) |
| WF-33 | LEA-33 Approve or return a proposed communication | Communication | F10,F03 | [Contract](workflows/LEA-33.md) |
| WF-34 | LEA-34 Follow up delivery or acknowledgement gaps | Communication | F10 | [Contract](workflows/LEA-34.md) |
| WF-35 | LEA-35 Handle an escalated family concern or complaint | Requests restricted cases | F09,F03 | [Contract](workflows/LEA-35.md) |
| WF-36 | LEA-36 Run a family or staff meeting with follow-up actions | Events + Coordination | F13,F04 | [Contract](workflows/LEA-36.md) |
| WF-37 | LEA-37 Refer a concern to an authorized specialist | Restricted support | F14 | [Contract](workflows/LEA-37.md) |
| WF-38 | LEA-38 Follow the school’s urgent safety escalation procedure | Restricted support + school configuration | F14 | [Contract](workflows/LEA-38.md) |
| WF-40 | LEA-40 Compare branches responsibly | Reporting + Access | F05 | [Contract](workflows/LEA-40.md) |
| WF-41 | LEA-41 Prepare a leadership review brief | Reporting | F05 | [Contract](workflows/LEA-41.md) |
| WF-42 | LEA-42 Review decision and follow-up history | Coordination + decision owners + Reporting | F04,F03 | [Contract](workflows/LEA-42.md) |
| WF-43 | LEA-43 Review financial exceptions under a separate grant | Finance | F15,F03 | [Contract](workflows/LEA-43.md) |
| WF-44 | LEA-44 Coordinate a school service interruption | Services + Coordination + Communication | F16,F04,F10 | [Contract](workflows/LEA-44.md) |
| WF-45 | LEA-45 Review a source-linked leadership draft | AI application + Reporting | F17,F05 | [Contract](workflows/LEA-45.md) |
| WF-46 | LEA-46 Manage sessions, preferences and school support | Access + school configuration | F18 | [Contract](workflows/LEA-46.md) |

## Every task follows the same evidence path
1. Read target contract and the exact owner dependencies, not the whole archive.
2. Write narrow LLD delta; for DB changes include exact column-level SQL/Prisma mapping and migration/backfill.
3. Implement owner/counterpart/Principal journey with shared UI.
4. Run risk-based focused verification (06_VERIFICATION_AND_RELEASE.md).
5. Extend repeat-safe seed, capture comparison states and normal-navigation walkthrough.
6. Commit code and evidence; record executable commit separately from documentation-only HEAD.
7. Update authoritative owner state and matrix row; choose next eligible task without requesting repeated permission.

## Review and audit task G99
Account for all46 once. Re-run affected shared-shell regression and final integration on one source checkpoint. A broad suite not rerun is not reported as passed on latest source. Identify code completion, supported slices, exact visual deviations, pending human review and deployment gates. If a provider or school policy is missing, record exact blocking field and affected workflows; do not turn65% coverage into “all complete.”

## Session control
One implementation track, one build/browser worker; desktop/mobile sequential. One local demo server. Never kill all Node processes; identify only task-owned stale servers. Inspect wrapper arguments before focused tests. Batch documentation updates per coherent slice; reuse unchanged evidence with source provenance. No repeated unchanged tests to consume time.

Leave RESUME.md at each checkpoint: current task/subtask, approved decisions, touched files, migrations per database, source/build, tests with results, outstanding failure, next exact action. A fresh session reads this plus relevant contracts only. Secrets stay in private ignored fixtures, never the resume file.
