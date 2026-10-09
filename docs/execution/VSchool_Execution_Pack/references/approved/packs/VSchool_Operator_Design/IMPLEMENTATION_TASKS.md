<!-- TT-01 contract -->
## Timetable entitlement extension
OP-J11/12 extend to proposed Phase 3 Timetable through [shared TT-11](docs/timetable/TASKS.md). Keep existing Attendance licensing unchanged. This design preview does not mark Timetable released in the live catalog.

# VSchool — Platform institution management implementation handoff

Edition 03.9 · 7 October 2026

These are **proposed task IDs**, not tasks already added to the repository. Every production task is **NOT IMPLEMENTED BY THIS DESIGN PACK**. Inspect the current repository before reusing code or assigning task IDs. Prototype checks do not establish application completion.

Reconcile approved decisions into the existing four sources of truth: Bible → owning module DESIGN.md → TASKS.md / execution index → CURRENT_STATE.md with evidence. Preserve IAM-02/03/04 coexistence, tenant scope, entitlements, lock ordering and existing release gates. Do not paste the prototype's browser-local identity or authorization model into production.

## Shared architecture and acceptance

- Next.js pages/routes are inbound adapters. Access/Tenancy application use cases and ports own decisions. Keep the extraction path to a future Nest.js backend.
- Derive the operator principal from verified server authentication. Use separate capabilities for reads, institution/branch lifecycle, commercial entitlement, branch module configuration and identity grants. Do not reuse school-admin authority as platform authority.
- Validate scope on every protected read/write; revalidate version and prerequisites under the existing transaction/guard protocol. Audit successful changes atomically, or document the owner's durable-outbox contract. Never claim browser state proves security.
- All stored timestamps UTC; UI examples display Asia/Kolkata. Keep institution state, branch state, setup readiness, account activation, membership/grants and module activation separate.
- Reuse semantic Button, Field, SearchInput, Select, StatusBadge, FilterDrawer, SortDrawer, AppliedFilterChip, ListToolbar, DataTable/MobileRecordCard, Tabs, DetailCard, Modal, ErrorSummary, Notice and PageShell components. Do not rebuild layouts per page.
- Action states: idle → validation / confirmation → saving → success, recoverable failure, conflict or unauthorized. Production saving buttons show progress and prevent repeated clicks; server idempotency remains required.
- Use the current project's actual unit framework, real PostgreSQL functional suite and Playwright conventions. Do not add JUnit or HBase to this Next.js/PostgreSQL project.
- Unit checks target decisions; database tests target isolation, locking, versioning and audit guarantees; E2E proves the user journey. Avoid duplicating every model test in every layer.
- Human review can be batched at the complete module checkpoint. Never mark human acceptance passed or production security gates satisfied automatically.

## OP-L01 — Shared administrator shell and authorization map

Depends on: approved operator-console authentication design and existing identity foundation.

Design first: explicit read/edit capabilities, safe directory metadata, mobile menu behavior, keyboard focus, sign-out/session-expiry contract. Define how a platform operator gets branch-module configuration authority without acquiring operational records access.

Implement: reusable shell, sidebar identity/sign-out, mobile menu, breadcrumb, read-only and forbidden states. Mutations require server-side operator capability; URL and client role flags are untrusted.

Demo: operator sees actions; read-only reviewer can inspect but cannot mutate; signed-out caller cannot open protected URLs; mobile navigation and sign-out are discoverable.

Evidence: direct unauthorized endpoint calls rejected, keyboard menu and modal checks, responsive screenshot evidence. Native AT review recorded separately.

## OP-L02 — Institution directory and real detail navigation

Depends on: OP-L01 and authorized institution read port.

Design first: allowed search attributes (never a global multi-field query), case-insensitive partial matching, Enter submission, stable sort/tiebreaker, pagination contract and permission scope. Institution status must not be replaced by administrator-activation status.

Implement: real institution links, row click enhancement without stealing child-button clicks, separate sliders-icon Manage action, attribute-specific search (Institution name or Institution code, Enter to apply), Sort side panel with separate Sort by and Order by radio groups, generic Filters drawer for status, setup, license and policy, sort, pagination, empty/no-match/loading/error states and URL-backed filters. Detail return preserves the query. Institutions and Audit trail are siblings: each root breadcrumb shows only its own name; institution detail pages keep Institutions as the parent. Store categorical filter values as repeated URL keys. Match any selected value inside a group and require every selected group to match; validate allowed keys and values server-side. One-value chip removal preserves sibling selections. Filter attributes use borderless expandable headings with chevrons and thin dividers. Unselected groups start collapsed; groups with applied selections reopen expanded. Checkbox changes remain draft state until Apply and must not collapse the group or close the drawer. Multiple groups can remain expanded; only activating a heading toggles it. Use compact section spacing and at least 44 px touch targets. The filter header shows only Filters and its close control; omit introductory copy and overall selection totals. Its footer contains only Cancel and Apply. Applied chips remain removable, and the external Clear filters action remains available. Sorting separates field and direction into radio groups in a side panel; both groups start expanded and never auto-collapse on selection. Cancel and Escape discard draft changes; Sort Reset changes draft selections only.

Demo: find two different institutions, open each and confirm identities differ; use keyboard name links; filter Inactive and return with filter retained.

Evidence: authorized query functional tests, correct record lookup, query invalidation, no out-of-scope metadata leakage, desktop/mobile journey.

## OP-L03 — Institution overview and scoped activity

Depends on: OP-L02 and setup-readiness owner ports.

Design first: five section contracts; access status, active branches, administrator handover, commercial licensing and recent configuration changes as operator priorities; school readiness summarized through owner ports. Do not load operational tables directly merely to compute status.

Implement: Overview, Branches, Modules, Administrators, Activity with context-preserving navigation. Separate inactive access banner from setup progress.

Demo: inspect Ready, Setup required and Inactive examples. Every next action opens the right section for the same institution.

Evidence: read-port mapping and missing/deauthorized record handling; route smoke checks and clear mobile tabs.

## OP-L04 — Institution details editing with version checks

Depends on: OP-L03.

Design first: editable fields versus stable institution code; duplicate-name review; expected-version and audit schema. Global identity/profile changes do not belong here.

Implement: labeled edit form, reason, validation, successful-save feedback, failed-save retention and stale-edit comparison/reload.

Demo: edit a contact; fail a save without losing input; change the same record in two sessions and reject the stale save.

Evidence: transactional version test, safe audit event, no partial mutation on error, one focused browser flow.

## OP-L05 — Persistent owner-private drafts

Depends on: OP-L01; schema/retention design approved before migration.

Design first: partial payload version, owning operator, draft version, saved step, timestamps, Draft/Completed/Discarded states, retention and authorized handover boundary. Define payload bounds and reject secrets. Physical table names must follow the current `vs_` convention after checking the actual schema.

Implement: blank initial form; meaningful-content detection; partial save independent of final required-field validation; owner-filtered My drafts; exact-step resume; discard confirmation; completed-draft destination; optimistic concurrency. Keep historical completed/discarded metadata per retention policy.

Demo: save just a name, resume, advance to step 3, save/resume there, discard a different draft. Other operator cannot read the payload. Existing institutions remain unchanged.

Evidence: actual PostgreSQL privacy and stale-version tests, no write for new empty form, no write for unchanged existing draft, all values restored, failure retains edits.

## OP-L06 — Five-step onboarding and durable submit result

Depends on: OP-L05 plus existing institution, branch, entitlement and verified-administrator use cases.

Design first: sequence of owner calls, transaction versus orchestration boundary, idempotency key/payload fingerprint, durable receipt and recovery from unknown result. Reconcile reused global account behavior; email equality is not identity verification.

Implement: blank start → institution → branch → modules → independently verified administrator → review. Edit/back preserve values. Continue captures current form values before validation; do not replace the form on email blur/change. Test keyboard Enter and immediate Continue after changing email. Final create revalidates all scope and policy; stable command creates once; complete draft only when institution creation is durably confirmed. New branches have Attendance inactive and no implicit operational grants.

Demo: create from Greenwood draft, verify correct record appears once, source draft becomes completed. Simulate lost response and resolve the original reference. Duplicate code/name offers review of the actual matching record.

Evidence: real transaction/replay/concurrent-submit tests, no orphaned grants, no double institution, identity preconditions, final-source E2E.

## OP-L07 — Leave, sign-out and session-expiry recovery

Depends on: OP-L05/06 and actual sign-out adapter.

Design first: meaning of dirty state, saved baseline, saved step, explicit discard, persistence on expiry and browser refresh. Saving a draft is not proof a session still has permission.

Implement: prompt only for unsaved changes on in-app navigation and browser Back. Save then exit only on save success. Preserve saved draft on discard of latest edits. Unchanged draft uses Leave setup. Real sign-out ends the intended session and protects cached/back navigation. Session expiry reauthenticates before retrying writes.

Demo: untouched form leaves directly; edited form prompts; failed save stays on page; Keep working preserves data; signed-out protected navigation denied.

Evidence: focused browser back/escape/focus tests plus session revocation functional evidence. Document refresh limitations without pretending browser beforeunload persists data.

## OP-L08 — Institution deactivation and reactivation

Depends on: OP-L01/03 and existing scope guard.

Design first: operator capability, reason/acknowledgement, in-flight transactions and queued jobs. Define lock semantics: a deactivation committed first causes later protected work to fail; already committed work remains. Decide and test how long-running jobs recheck institution availability.

Implement: review affected branches; deactivate parent access without deleting records or changing other-institution memberships. Existing sessions must not retain access. Reactivate parent only; preserve inactive branches, revoked memberships, licenses and branch module settings.

Demo: deactivate Oakridge and deny its protected workspace in an existing session; retain another institution's access; reactivate Lakeview while West branch remains inactive.

Evidence: direct API/DB functional authorization paths, concurrent mutation/deactivation, separate institutions and existing sessions, audit reason, rollback on failure. UI-only hiding is insufficient.

## OP-L09 — Branch configuration and readiness

Depends on: OP-L03/08 and Academic/People/Student readiness contracts.

Design first: unique branch codes within institution, immutable existing-branch time zone and validated creation-time choice, new branch defaults, readiness ownership and last-active-branch consequences.

Implement: add/edit branch with time zone read-only after creation; reject forged time-zone changes in the use case; inspect school-owned readiness; deactivate/reactivate the intended branch with a reason. Show explicit impact if it is the last active branch. No operator shortcut marks operational setup complete.

Demo: add a setup-required branch, inspect next owner steps, reject duplicate code, deactivate one branch without affecting siblings.

Evidence: foreign institution/branch pairing rejection, code uniqueness, rejected time-zone changes with no partial writes, preserved historic dates and future schedules, branch-only access denial and audit.

## OP-L10 — Licensing and per-branch activation

Depends on: OP-L03/09 and TEN-02 owner contracts.

Design first: commercial entitlement capability versus branch configuration capability; released-module catalog; dependencies and data retention. Explicitly choose revocation/reactivation behavior documented in WORKFLOWS.html.

Implement: license changes with approval reference; activation prerequisites checked transactionally. Removing Attendance license makes it unavailable in all branches and clears activation; adding it later requires explicit activation. Deactivation preserves historical attendance.

Demo: unready branch cannot activate; ready authorized branch can; removing then restoring license does not silently reactivate.

Evidence: concurrent license/activation changes, direct unauthorized writes, dependency checks, effective availability matrix and retained data.

## OP-L11 — Verified administrator grants and activation handover

Depends on: OP-L01/03 and existing IAM-02/03/04 contracts.

Design first: account versus membership/grant state; independent identity reference; existing-account ownership confirmation; selected branch setup permissions; operator-assisted bootstrap; externally verified activation lookup.

Implement: review-before-grant, pending activation instructions and status check, branch setup scope changes, institution-only revocation. Block last-active-admin revocation under a lock/constraint that is safe against two operators acting concurrently. A pending replacement is insufficient.

Demo: block last-active-admin revoke; add and activate a verified replacement through the actual approved path; revoke old institution grant while their other institution access remains.

Evidence: cross-institution identity reuse, independent identity requirement, scope limits, last-admin concurrency, verified activation response; no secrets in logs or UI. No manual checkbox may stand in for activation proof.

## OP-L12 — Global audit, recovery states and module review

Depends on: OP-L02–11.

Design first: audit read capability, scope, stable pagination, metadata exclusion list, filters and timezone display.

Implement: genuine global authorized configuration audit plus institution activity, event detail, shared Search + Filters drawer with action/actor/date filters; omit institution filter in institution-scoped Activity. Complete missing loading, no-match, denied, expired, conflict and unknown-result states. Use the shared components throughout.

Demo: complete a lifecycle from draft to handover, deactivate/reactivate and inspect the corresponding audit history. Repeat key flows on a narrow viewport and keyboard.

Evidence: final-source unit and real PostgreSQL functional checks, critical Playwright journeys, screenshots at desktop and 390/360 px, 200% zoom, native VoiceOver/NVDA status recorded honestly. Link actual commit/build and demo instructions in CURRENT_STATE.md. Do not describe TEN-03 or production readiness as complete unless its independent gates actually pass.

## Checkpoint record for each task

Record task ID, scope, source commit/build, changed owners/contracts, migrations if any, fixture/seed command, commands actually run and results, demo route/steps, known gaps, and human-review state. Existing seed generation should grow incrementally with each slice; never overwrite unrelated user/test data. Keep production data out of the design review.


## Current baseline — Manage popup only

Edition 03.9 restores Edition 03.7 and retains only the grouped Manage popup from Edition 04. Group View institution / View activity / View audit under View; editing, branch, module and administrator controls under Edit; Deactivate or Reactivate under Institution access. Only deactivation uses the red divider and icon. Preserve the existing confirmation forms and all other Edition 03.7 interactions. The other Edition 04 additions and OP-L13–15 extensions are not part of this baseline.


Sidebar identity and session controls: render the avatar, name and role as one non-interactive identity block. Place Sign out in a separate row below a thin divider, with a logout icon, quiet styling and a full-row hit target (at least 44 px for touch). Preserve the existing unsaved-draft sign-out behavior.
