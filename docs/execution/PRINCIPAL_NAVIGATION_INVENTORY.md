# Principal navigation inventory and implemented grouping

The baseline inventory was captured from committed source `41f94d1` and the synthetic demo on 18 October 2026 IST. The approved regrouping was then implemented in the working tree and verified against the production build at `http://127.0.0.1:3400`. Routes, owner authorization, module gates, branch switching, staged sign-out and other workspace defaults are preserved. Human visual acceptance remains PENDING.

## Implementation authority

- Catalogue and rendered order: declarative `principalNavigationGroups` in `components/principal-navigation.ts`, consumed by `PrincipalPortalFrame`.
- Visibility resolution: `LeadershipLayout` in `app/leadership/layout.tsx`.
- Active route, desktop/mobile shell, branch switcher, account utility, and sign-out: `PortalShell` in `components/portal/portal-shell.tsx`.
- Group/link rendering and SVG paths: `PortalNavigationGroup` and `PortalIcon` in `components/portal-navigation-group.tsx`.
- Routes: `app/leadership/**/page.tsx`.
- Baseline Principal authority: `leadershipGateway.getHome` in `lib/server/access.ts`, backed by `getLeadershipHome` in `backend/modules/access/application/services.ts`.

No navigation badge was added. Counts and status badges inside pages remain owner data and are not sidebar badges.

## Implemented Principal hierarchy

`My day` is a direct link. Attendance, Teaching & staff, Communication, My work, and Reports & insights are accessible disclosure groups; only one is open at a time. Empty groups are removed before rendering. Financial exceptions, Facilities incidents and Restricted support remain individually gated conditional links. Utilities contain My account and, when Access returns an active delegation, My acting access.

| Order | Group | Authorized destinations, in first-entry order |
|---:|---|---|
| 1 | Direct | My day → `/leadership` |
| 2 | Attendance | Register coverage → `/leadership/attendance`; Pupil attendance → `/leadership/attendance/pupils`; Explanations → `/leadership/attendance/explanations`; Correction requests → `/leadership/attendance/correction-requests` |
| 3 | Teaching & staff | Timetable & cover → first authorized of `/leadership/timetable` or `/leadership/cover`; Staff availability; Staff requests; Learning → first authorized Learning destination; Assessments → first authorized Assessments destination |
| 4 | Communication | Notice coverage; Notice reviews; Family concerns; Meetings |
| 5 | My work | My decisions; Follow-ups; Handover |
| 6 | Reports & insights | Reports; Decision history; Evidence assistant |
| 7 | Conditional | Financial exceptions; Facilities incidents; Restricted support |
| 8 | Utilities | My acting access when applicable; My account |

The sidebar has two levels only: group disclosure and destination. Disclosure buttons expose `aria-expanded` and `aria-controls`; group expansion does not navigate or close the mobile drawer. A route change, direct entry, refresh, Back or Forward opens the owning group. The user may collapse that group while staying on the page.

### Contextual area navigation

| Sidebar area | Independently filtered contextual tabs |
|---|---|
| Timetable & cover | Exceptions; Cover requests |
| Learning | Assignment completion; Feedback turnaround; Pupil evidence |
| Assessments | Readiness; Report publication |

Each tab is included only after its own current owner availability check. Timetable and Cover, Assessments readiness and publication, and Learning overview and evidence are not treated as interchangeable permissions.

### Visibility projections introduced by the regrouping

- Attendance named-pupil review, explanation review and correction routing expose separate fail-closed availability operations; the sidebar never reads their protected queues.
- Requests returns separate `staff` and `family` availability decisions rather than showing both children from one shared list result.
- Timetable Cover checks current coordinator, approver or substitute authority without loading cover records.
- Learning manager availability returns only capability names, without assignments or pupil evidence.
- Assessments readiness and publication are independently authorized without loading their workspaces.
- Every destination still executes its full owner query/command authorization. Navigation visibility remains a convenience and never becomes endpoint authority.

## Pre-change configured sidebar catalogue (baseline evidence)

The icon descriptions below name the implemented SVG, not a proposed icon.

| Order | Group | Displayed label | Icon key and appearance | Destination | Level | Visibility/config identifier |
|---:|---|---|---|---|---:|---|
| 1 | Leadership | My school today | `home` — house | `/leadership` | 1 | Always after `getLeadershipHome` succeeds |
| 2 | Leadership | My decisions | `activity` — clock in circle | `/leadership/decisions` | 1 | `canUseDecisions` |
| 3 | Leadership | Evidence assistant | `report` — bar chart | `/leadership/assistant` | 1 | `canUseAssistant` |
| 4 | Leadership | Attendance oversight | `attendance` — check mark | `/leadership/attendance` | 1 | `canUseAttendance` |
| 5 | Leadership | Staff availability | `people` — people | `/leadership/staff/availability` | 1 | `canUseAvailability` |
| 6 | Leadership | Staff requests | `mail` — envelope | `/leadership/staff/requests` | 1 | `canUseRequests` |
| 7 | Leadership | Family concerns | `mail` — envelope | `/leadership/concerns` | 1 | `canUseRequests` |
| 8 | Leadership | Meetings | `calendar` — calendar | `/leadership/meetings` | 1 | `canUseMeetings` |
| 9 | Leadership | Restricted support | `people` — people | `/leadership/support` | 1 | `canUseSupport` |
| 10 | Leadership | Facilities incidents | `activity` — clock in circle | `/leadership/services/incidents` | 1 | `canUseFacilities` |
| 11 | Leadership | Financial exceptions | `report` — bar chart | `/leadership/finance/exceptions` | 1 | `canUseFinance` |
| 12 | Leadership | Operational follow-ups | `activity` — clock in circle | `/leadership/coordination` | 1 | `canUseCoordination` |
| 13 | Leadership | Leadership handover | `people` — people | `/leadership/handover` | 1 | `canUseHandover` |
| 14 | Leadership | Decision history | `report` — bar chart | `/leadership/history` | 1 | `canUseHistory` |
| 15 | Leadership | Timetable exceptions | `calendar` — calendar | `/leadership/timetable` | 1 | `canUseTimetable` |
| 16 | Leadership | Cover requests | `people` — people | `/leadership/cover` | 1 | `canUseCover` |
| 17 | Leadership | Assignment completion | `academics` — open book | `/leadership/learning` | 1 | `canUseLearning` |
| 18 | Leadership | Feedback turnaround | `report` — bar chart | `/leadership/learning/feedback` | 1 | `canUseLearning` |
| 19 | Leadership | Learning evidence | `people` — people | `/leadership/learning/evidence` | 1 | `canUseLearningEvidence` |
| 20 | Leadership | Assessment readiness | `academics` — open book | `/leadership/assessments` | 1 | `canUseAssessments` |
| 21 | Leadership | Report publication | `report` — bar chart | `/leadership/assessments/publications` | 1 | `canUseAssessments` |
| 22 | Leadership | Notice reviews | `mail` — envelope | `/leadership/notices/review` | 1 | `canReviewNotices` |
| 23 | Leadership | Notice coverage | `mail` — envelope | `/leadership/communication` | 1 | `canUseCommunication` |
| 24 | Leadership | Reports | `report` — bar chart | `/leadership/reports` | 1 | `canUseReports` |
| 1 | Personal | My acting access | `activity` — clock in circle | `/leadership/delegations` | 1 | `home.actingDelegation` exists |
| 2 | Personal | My account | `account` — shield/check | `/leadership/account` | 1 | Always after `getLeadershipHome` succeeds |

### Active and expanded behavior

- `PortalShell` finds the longest matching configured `href`. `/leadership` matches only exactly; other items match exactly or by path prefix. The resulting link gets `aria-current="page"`, a stronger label, a tinted background, a two-pixel inset indicator, and a highlighted icon.
- Groups are always expanded. There is no group disclosure control and no persisted expanded state.
- Desktop uses a sticky 252-pixel sidebar with an independently scrolling navigation region and fixed identity/sign-out footer. At widths from 761 to 1100 CSS pixels the application grid reduces the sidebar column to 220 pixels.
- At 760 CSS pixels or below the sidebar is absent until the menu button opens a modal-like drawer. Opening moves focus to the first link; Tab is trapped within the drawer; Escape, backdrop click, close button, or navigation closes it; Escape returns focus to the menu button.
- The mobile drawer uses the same groups, order, visibility, labels, and routes as desktop. It does not introduce a separate Principal bottom navigation.

## Visibility and authorization

Navigation visibility is only a convenience. Every `/leadership/**` page first passes the layout's live identity and `getLeadershipHome` check. That baseline rechecks the active account/token version, active institution and branch context, active membership or valid exact-action delegation, and `leadership.read`. The selected branch cookie is a candidate and is reauthorized by `selectedSchoolId`; it is not authority.

Owner calls used to decide visibility are caught by the layout and converted to `false`/`null`. A hidden link therefore means that the relevant probe was unavailable or denied; it does not reveal the exact reason. Conversely, a visible link does not authorize the destination. Each destination invokes its owner gateway again and applies current resource, participant, assignment, version, purpose, and command checks.

| Item | Visibility probe and role/capability | Scope and module/configuration gate | Independent destination authorization |
|---|---|---|---|
| My school today | Baseline `leadership.read`; no extra link probe | Current institution/branch. Attendance card is separately available only under current Attendance authority. | Yes. Home reloads `getLeadershipHome` and the Attendance projection; missing owner data is shown unavailable, not as zero. |
| My decisions | Visible when Coordination is synthetic/enabled with `coordination.verify`, **or** the INR Finance summary probe succeeds | Current branch. Registered owners currently include Coordination, Assessments moderation, and Finance; each retains its own release/module gates. | Yes. The decision registry invokes the selected owner adapter; inbox presence grants no owner authority. |
| Evidence assistant | `assistantAvailability.enabled && canGenerate`; requires Principal membership, live `GENERATE` designation, and at least one authorized Reporting source | Current branch. Explicit synthetic mode gate; no real provider is configured. Source Reporting permissions are rechecked. | Yes. List/create/detail are creator-scoped and recheck the Assistant grant plus the source owner. LEA-45 remains partial for real-provider work. |
| Attendance oversight | `attendance.read_leadership` in `home.capabilities` and `moduleGateway.canUseAtScope` | Current branch; Attendance release, institution entitlement, branch activation, and module dependencies must be active. | Yes. Attendance/Reporting reads recheck live Principal capability, exact branch, query bounds, and source access. |
| Staff availability | `peopleAvailabilityGateway.leadership` must succeed; direct or delegated `leadership.read` | Current branch; `staff_core` must be released, entitled, and active. | Yes. People rechecks current account, membership/delegation, branch, and module. It excludes private reasons. |
| Staff requests | Shared `requestsGateway.list` probe must succeed | Current branch; Requests must be in synthetic mode. A staff member path requires `staff_core`; reviewer actions require exact assigned Principal authority. | Yes. List/detail/action retain participant and assignment checks. |
| Family concerns | Same shared `requestsGateway.list` result as Staff requests; there is no separate concern-availability flag | Current branch; Requests synthetic mode. A family complaint requires the `family` module and exact assigned, non-conflicted Principal reviewer. | Yes. Case reads/actions recheck participant identity and conflict routing. The shared probe can show both links even when one queue is empty. |
| Meetings | `eventsGateway.meetings.list` must succeed; broad management requires `communication.read_leadership` plus a live Meeting Manager grant | Current branch; `communication` release, entitlement, and activation | Yes. Events rechecks manager/participant status for each list, detail, and command. |
| Restricted support | `supportGateway.listReferrals` must succeed; exact Support capability/purpose is required | Current branch; `student_core` and `health` must both be released, entitled, and active. Protected text remains synthetic-only. | Yes. Support rechecks sender/specialist role, exact Student scope, and resource visibility. |
| Facilities incidents | `facilitiesGateway.list` must succeed; at least one live Facilities capability grant | Current branch; `inventory` release, entitlement, and activation. Synthetic Facilities contract. | Yes. Reporter/coordinator or explicit verify/close authority is rechecked for each incident. |
| Financial exceptions | `financeGateway.summary(identity,'INR')` must succeed; requires one applicable Finance summary/request/review grant | Current branch; `fees` release, entitlement, and activation. Synthetic ledger/provider only. The hard-coded layout probe currency is INR. | Yes. Finance rechecks exact currency, amount limit, requester/reviewer separation, assignment, reconciliation, and version. |
| Operational follow-ups | Coordination availability must be synthetic/enabled and contain a capability other than only `coordination.work` or `coordination.history` | Current branch; Coordination synthetic mode and live capability rows. Source owner modules remain independently gated. | Yes. Queue/detail/commands recheck exact Coordination capability and source-owner evidence. |
| Leadership handover | Coordination enabled and `coordination.assign` | Current branch; Coordination synthetic mode | Yes. Transfer candidates, item authority, successor eligibility, version, and replay are rechecked. |
| Decision history | Coordination enabled and `coordination.history` | Current branch; Coordination synthetic mode and exact history designation | Yes. Bounded search and protected source links recheck history/finding authority. |
| Timetable exceptions | `timetable.read_leadership` plus `moduleGateway.canUseAtScope` | Current branch; `timetable`, `academic_core`, `staff_core`, and `attendance` must all be released, entitled, and active. | Yes. Academics rechecks current publication, current Principal capability, branch, modules, and source links. |
| Cover requests | `academicsGateway.timetableCoverInbox` must succeed | Current branch; `timetable`, `academic_core`, `staff_core`, and `attendance` gates. Exact cover authority is owner-specific. | Yes. Academics rechecks occurrence, proposer/approver/substitute identity, availability, collisions, Attendance state, and version. |
| Assignment completion | `learning.read_leadership` plus module availability | Current branch; `homework`, `student_core`, `academic_core`, and `staff_core` are required by the Learning manager contract. | Yes. Learning rechecks manager designation, class/subject scope, frozen audience, and named evidence access. |
| Feedback turnaround | Same `canUseLearning` probe as Assignment completion | Same four Learning modules and current branch | Yes. Exact accepted-submission source and feedback-follow-up designation are rechecked. |
| Learning evidence | Manager workspace must include `RECIPIENT_STATUS_READ` | Current branch; same four Learning modules, plus scoped Learning manager grant | Yes. Recipient evidence and contextual handoff recheck exact assignment/recipient authority. |
| Assessment readiness | `assessmentsGateway.leadershipReadiness` must succeed | Current branch; Assessments must be released in synthetic mode, entitled, active, and the Principal must hold a live Assessments oversight grant. | Yes. Readiness rechecks the exact cycle, frozen cohort, source revisions, oversight grant, and module. |
| Report publication | Same readiness probe as Assessment readiness; there is no separate publication visibility flag | Current branch; Assessments synthetic gate. Publishing/withdrawal additionally requires exact capability grants and Documents safety. | Yes. Handoff, publisher separation, audience purpose, scanned document state, replay, and withdrawal are independently guarded. A Principal able to view readiness may still be unable to publish. |
| Notice reviews | `communicationGateway.listReviewProposals` must succeed; exact `REVIEW` workflow grant | Current branch; `communication`, `family`, `student_core`, and `academic_core` must all be released, entitled, and active. | Yes. Communication rechecks exact assigned immutable revision, reviewer independence, and current workflow grant. |
| Notice coverage | `communication.read_leadership` plus `listLeadership` success | Current branch; same four Communication modules | Yes. Coverage and reminder operations recheck leadership/reminder grants, current frozen audience purposes, version, and suppression rules. |
| Reports | Any of: authorized export type, enabled snapshot capability, or enabled branch-comparison capability | Current branch. Export requirements vary by report type and source module. Snapshots/comparison/briefs are synthetic-only and require their own designations. | Yes. Every export, snapshot, comparison, brief, and source link reauthorizes independently. |
| My acting access | `home.actingDelegation` is present after Access resolves current exact-action delegation | Current branch; no feature-module gate. Delegation window, active Employee binding, expiry, and revocation are Access-owned. | Yes. The page reloads the user's live delegations; it cannot issue or extend authority. |
| My account | Baseline leadership home only | Account-owned operations; the Principal frame still requires the current branch workspace. No feature-module gate. | Yes. Account, preferences, support configuration, and session operations recheck the signed-in account and applicable owner contract. |

Unknowns are deliberately not inferred from labels. In particular, the layout does not expose a single permission string for Facilities, Finance, Meetings, Support, Assessments publication, or Reports; it relies on each owner availability/read operation. The table names the observed owner checks rather than claiming that Principal role alone grants them.

## Pages and contextual destinations inside each area

| Sidebar area | Routed pages, secondary navigation, and contextual actions | Documented workflows |
|---|---|---|
| My school today | `/leadership`; branch/workspace switch at `/leadership/context`; attendance summary links to `/leadership/attendance`. Weekly review starts at `/leadership/reviews/new`. | LEA-01–LEA-07 |
| My decisions | `/leadership/decisions`; `/leadership/decisions/[owner]/[id]`; conflict routing at `/leadership/decisions/routing`. Detail actions include information request, decision, recusal, and owner recovery when supported. | LEA-27–LEA-31; Assessments moderation LEA-21; Finance LEA-43 |
| Evidence assistant | `/leadership/assistant`; `/leadership/assistant/new`; `/leadership/assistant/[id]`. Create, review/edit, discard, and protected recovery are contextual rather than sidebar links. | LEA-45 |
| Attendance oversight | `/leadership/attendance`; named-pupil patterns `/leadership/attendance/pupils`; source register `/leadership/attendance/sessions/[id]`; explanation queue/detail `/leadership/attendance/explanations` and `/[id]`; correction-request queue `/leadership/attendance/correction-requests`. Contextual actions enter Coordination create/bulk or existing Attendance owner routes. | LEA-08–LEA-15 |
| Staff availability | `/leadership/staff/availability`. The designated recorder counterpart is `/admin/teachers/availability`; it is not a Principal sidebar destination. | LEA-23 |
| Staff requests | `/leadership/staff/requests`; `/leadership/staff/requests/[id]`. Review actions are shown only on an exact assigned case. | LEA-25 |
| Family concerns | `/leadership/concerns`; `/leadership/concerns/[id]`. Acknowledge, information, outcome, and appeal handling are detail actions. | LEA-35 |
| Meetings | `/leadership/meetings`; `/leadership/meetings/new`; `/leadership/meetings/[id]`. Participant proposal/response and action-to-Coordination transitions are contextual. | LEA-36 |
| Restricted support | `/leadership/support`; `/leadership/support/referrals/new`; `/leadership/support/referrals/[id]`; `/leadership/support/urgent`. Specialist counterparts live under `/teacher/support`. | LEA-37, LEA-38 |
| Facilities incidents | `/leadership/services/incidents`; `/new`; `/[id]`. Report, acknowledge/coordinate, restore, verify, close, and Coordination handoff are contextual. | LEA-44 |
| Financial exceptions | `/leadership/finance/exceptions`; `/new`; `/[id]`. The Administrator requester counterpart also exists under `/admin/finance/exceptions`. | LEA-43 |
| Operational follow-ups | `/leadership/coordination`; `/new`; `/bulk`; `/[id]`; durable batch receipt `/batches/[id]`. Many owner pages link here with exact source identifiers. | LEA-09–LEA-11, LEA-12, LEA-15, LEA-17–LEA-20, LEA-24, LEA-26 |
| Leadership handover | `/leadership/handover`; `/leadership/handover/[id]`. Transfer review and receipt are detail states. | LEA-26 |
| Decision history | `/leadership/history`. Search, event sequence, source return, and separately authorized finding/escalation are page actions. | LEA-42 |
| Timetable exceptions | `/leadership/timetable`. Context links can open an existing Attendance session or an exact cover request. | LEA-16 |
| Cover requests | `/leadership/cover`; `/leadership/cover/[id]`. Teacher response is a separate `/teacher/cover` journey. | LEA-24 |
| Assignment completion | `/leadership/learning`; contextual named evidence at `/leadership/learning/evidence`; concern creation at `/leadership/learning/concerns/new`. | LEA-17, LEA-19 |
| Feedback turnaround | `/leadership/learning/feedback`; contextual follow-up at `/leadership/learning/feedback/follow-up/new`. | LEA-18 |
| Learning evidence | `/leadership/learning/evidence`; contextual handoff/concern actions route to Coordination or `/leadership/learning/concerns/new`. | LEA-17, LEA-19 |
| Assessment readiness | `/leadership/assessments`; contextual Assessments-to-Coordination handoff. Teacher mark entry is `/teacher/assessments`; moderation uses My decisions. | LEA-20, LEA-21 |
| Report publication | `/leadership/assessments/publications`; recipient counterparts `/family/results` and `/student/results`. Handoff, publish/recover, and withdraw are states/actions on the page. | LEA-22 |
| Notice reviews | `/leadership/notices/review`; `/leadership/notices/review/[id]`. Notice preparation/publish counterparts remain in the authorized Administrator Communication workspace. | LEA-32, LEA-33 |
| Notice coverage | `/leadership/communication`; reminder workflow `/leadership/communication/[id]/remind`. | LEA-34 |
| Reports | `/leadership/reports`; exports at `/communication`, `/feedback`, `/learning`, `/timetable`; retained snapshots at `/snapshots` and `/snapshots/[id]`; branch comparison at `/compare`. Leadership briefs use `/leadership/briefs/new`, `/[id]`, and `/[id]/edit`; weekly review uses `/leadership/reviews/new`. None of those subordinate routes appears separately in the sidebar. | LEA-06, LEA-07, LEA-39–LEA-41 |
| My acting access | `/leadership/delegations`. This is a display/consumption route; trusted issue/revoke is outside the browser workspace. | LEA-03 |
| My account | `/leadership/account`. The sidebar identity footer separately links to `/account`; session, preference, support, and staged workspace-exit actions are inside the account/context flows. | LEA-46 |

## Pre-change seeded Principal navigation

The current demo was captured from the existing port 3400 server using the ignored Principal persona in `artifacts/people-02/private-demo.json`. No credentials are stored in this inventory or its evidence.

### Rendered order

**Leadership**

1. My school today
2. My decisions
3. Evidence assistant
4. Attendance oversight
5. Staff availability
6. Staff requests
7. Family concerns
8. Meetings
9. Facilities incidents
10. Financial exceptions
11. Operational follow-ups
12. Leadership handover
13. Decision history
14. Timetable exceptions
15. Cover requests
16. Assignment completion
17. Feedback turnaround
18. Learning evidence
19. Assessment readiness
20. Report publication
21. Notice coverage
22. Reports

**Personal**

1. My account

### Configured items omitted for this persona

| Item | Why it was omitted in the rendered demo |
|---|---|
| Restricted support | The Support availability probe did not succeed. The running demo release list does not include the required `health` module, so the fail-closed owner gate prevents visibility. |
| Notice reviews | `listReviewProposals` did not succeed for this Principal. The current persona has Communication coverage but no current exact `REVIEW` workflow designation. |
| My acting access | The Principal is using direct authority; `home.actingDelegation` is absent. |

All other conditional probes succeeded for the seeded Principal. This explains catalogue-versus-rendered differences without treating link visibility as proof of destination authority.

### Capture evidence

- `docs/execution/principal-navigation-current/desktop-sidebar.png` — top of the desktop sidebar.
- `docs/execution/principal-navigation-current/desktop-sidebar-lower.png` — lower desktop scroll state.
- `docs/execution/principal-navigation-current/mobile-navigation.png` — top of the open mobile drawer.
- `docs/execution/principal-navigation-current/mobile-navigation-lower.png` — lower mobile scroll state.
- `docs/execution/principal-navigation-current/rendered-navigation.json` — labels, routes, groups, order, and `aria-current` observed from the rendered DOM. It contains no credentials.

## Baseline UX findings addressed by the approved grouping

1. **The hierarchy is almost completely flat.** The configured Leadership group can contain 24 items. The seeded view contains 22, so both desktop and mobile require a long internal scroll. There is no excessive nested-menu depth; the problem is the absence of meaningful grouping.
2. **Related work is scattered.** Staff availability, Staff requests, Cover requests, Leadership handover, Timetable exceptions, and Meetings are separated by unrelated Finance, Facilities, Coordination, and history entries. Family concerns, Notice reviews, Notice coverage, and Meetings are not presented as one communication area. Learning and Assessments appear near the bottom after operational infrastructure.
3. **Decision/work terminology overlaps.** My decisions, Operational follow-ups, Decision history, Staff requests, Cover requests, Notice reviews, and Financial exceptions all represent assigned or review work, but their labels do not explain the owner/lifecycle distinction.
4. **Some labels sound like individual actions.** Report publication and Leadership handover are actually queue/workspace destinations. Their action-like labels make them look like immediate commands. The pages correctly require staged review; the navigation wording does not communicate that.
5. **Reports are split across navigation.** Attendance oversight, Assignment completion, Feedback turnaround, Learning evidence, Assessment readiness, Notice coverage, Decision history, and Reports are all report-like surfaces. The generic Reports label does not describe which reports remain inside it.
6. **Unlisted contextual routes lose sidebar location.** Prefix matching works well for listed parents such as `/leadership/attendance/**`. Routes such as `/leadership/briefs/**` and `/leadership/reviews/new` match no configured item, so the mobile top bar falls back to the role label `Principal` rather than a specific area.
7. **Account has two destinations.** The Personal item links to `/leadership/account`, while the persistent identity footer links to `/account`. Both may be valid, but the split is not explained in navigation and can feel duplicative.
8. **No Help destination exists.** There is no Principal Help item or utility in the inspected shell/configuration. School support information is inside the account workflow; this should not be relabelled as general Help without a product decision.
9. **No navigation badges exist.** There are therefore no stale or misleading badge counts. Work requiring attention is discoverable only after opening a destination or through the home page.
10. **Desktop and mobile are functionally consistent.** They use identical items, visibility, active state, school identity, account, and sign-out. Mobile adds the accessible drawer mechanics and reduces the visible portion of the already long list; the fixed footer remains visible while the middle navigation scrolls.
11. **Utilities are spatially split.** Branch/workspace switching is in the top bar, school identity is above navigation, the account identity and sign-out are in the fixed sidebar footer, and My account is also a Personal item. Sign out correctly uses the staged `/leadership/context?destination=sign-out` route.

## Approved mapping implemented

This mapping preserves every configured destination and its owner visibility predicate. Ambiguities recorded during inventory were resolved by the user's approved hierarchy; no route or owner contract was removed.

| Proposed group | Existing destinations | Placement notes |
|---|---|---|
| My day | My school today (`/leadership`) | Keep as the first destination. Weekly review (`/leadership/reviews/new`) and leadership briefs may be contextual actions from My day or My work rather than new sidebar entries. |
| Attendance | Attendance oversight (`/leadership/attendance`) and all existing Attendance child routes | Keep pupil patterns, source sessions, explanations, correction requests, and bulk follow-up contextual beneath the area. Timetable exceptions is adjacent but ambiguous; do not move it here without deciding whether users understand it as attendance operations or teaching cover. |
| Teaching & staff | Staff availability, Staff requests, Timetable exceptions, Cover requests, Assignment completion, Feedback turnaround, Learning evidence, Assessment readiness | Keeps staff, timetable, learning, and assessment operations together. Report publication is ambiguous between this area and My work because it is an assigned governed action over Assessments evidence. |
| Families & communication | Family concerns, Meetings, Notice reviews, Notice coverage | Meetings supports both staff and family participants, so its final placement should retain that dual meaning. Notice preparation remains in its authorized Administrator counterpart and must not appear merely because review/coverage is visible. |
| My work | My decisions, Operational follow-ups, Leadership handover, Evidence assistant | These are cross-owner assigned/review/generation workspaces. Report publication can be placed here if the intended mental model is assigned publication work. Acting access is a utility/status rather than ordinary work. |
| Reports | Reports, Decision history | The Reports landing already owns exports, snapshots, comparison, and briefs. Attendance, Learning, Assessments, and Communication operational views should retain their own routes and permissions even if Reports links to them contextually. |
| Finance — conditional | Financial exceptions | Preserve `canUseFinance`, `fees`, currency, amount-limit, assignment, and separation checks. Do not place under generic Reports because it includes decisions. |
| Services — conditional | Facilities incidents | Preserve the `inventory` and exact Facilities capability gates. |
| Restricted support — conditional | Restricted support and its referral/urgent child routes | Keep visually distinct because visibility implies protected-purpose eligibility, while every destination still reauthorizes. |
| Utilities | My account, My acting access when active, branch/workspace switch, Help if later designed, Sign out | Preserve `/leadership/account`, `/leadership/delegations`, `/leadership/context`, and staged sign-out behavior. Reconcile the footer `/account` link deliberately. No Help route currently exists. |

## Regrouping evidence

- Baseline screenshots: `docs/execution/principal-navigation-current/desktop-sidebar.png`, `desktop-sidebar-lower.png`, `mobile-navigation.png`, and `mobile-navigation-lower.png`.
- Implemented screenshots: `docs/evidence/principal-navigation-regrouping-2026-10-18/after-desktop.png` and `after-mobile.png`.
- Browser observations: `docs/evidence/principal-navigation-regrouping-2026-10-18/browser-results.json`.
- The full seeded Principal rendered all five disclosure groups and the authorized conditional links. Restricted-catalogue unit coverage verified empty-group removal and independent first-authorized Cover, Learning evidence, and Assessments publication entries.
- Direct Learning entry, one active destination, one open disclosure, collapsible current group, Back/Forward restoration, contextual tabs, mobile first-focus, drawer retention, Escape dismissal/focus return, Principal account link, staged sign-out route and a representative Administrator shell were checked on the production build.
- Visual comparison was performed on the captured desktop and mobile images. The grouping is materially shorter and clearer, keeps the approved shared theme, and introduces no viewport overflow. Human visual acceptance remains PENDING.

Ambiguous placements from the baseline inventory are retained as historical notes. The approved implemented hierarchy drops no existing route, item, or permission requirement.
