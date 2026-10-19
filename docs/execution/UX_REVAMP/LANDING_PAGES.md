# Landing pages

Status: authoritative composition contract for the five protected workspace entry pages. Business rules, data definitions and authorization remain owned by the cited modules. Candidate presentation is reviewable at `/design-system#landing-references`; human acceptance is pending.

## Shared composition

Every landing uses the protected shell, 28/36px page title, one content-height summary surface, and a `minmax(0,2fr) minmax(300px,1fr)` work grid with 24px gaps. At widths below 1200px the grid stacks; below 768px the summary becomes stacked rows and content follows the workspace order below. `LandingSummary`, `LandingAttention`, `LandingCalendar`, `LandingSessions` and `LandingQuickAccess` in `components/landing-page.tsx` are the production/reference components. The deterministic candidate adapter is `components/landing-reference-gallery.tsx`.

Loading, error, unavailable and successful-empty are distinct. A failed projection never becomes zero. Lists show at most five work items, three calendar entries or five classes while retaining an owner total when one exists. Links remain permission-filtered navigation; mutations stay in their owner workflows.

## Administrator — `/admin`

Order: header → summary → Attention → Today’s classes → Calendar → Quick access → incomplete School setup. The header uses the branch-local date and current school; Register student is primary when Students management is live and School setup remains secondary. Summary definitions are submitted sessions over non-cancelled sessions expected on the local date, current active placements, and the exact sum of Reporting-owned exception counts. Reporting owns the summary/readiness/attention query; Attendance owns the bounded session report; Events owns calendar publications; Access/Tenancy resolve scope and availability. Calendar is visible only through the current explicit publisher grant and Events module checks. Actions lead to the existing registration, Attendance, Imports, Staff access, Events, notices and report routes. Missing Attendance, overview or Events projections render their own unavailable state.

## Teacher — `/teacher/today`

Order: header/date → summary → current/next class → open-register attention → Teaching work → Today’s classes → Calendar → Quick access → submitted-register guidance. Attendance owns the authorized assigned-session projection and actions. Learning's existing Teacher workspace now returns a bounded feedback workload for the same currently assigned authored assignment versions, using one submission read and one feedback read. It exposes counts and existing assignment summaries, never learner identity or response text. Events still has no Teacher reader, so Calendar renders the explicit unsupported state rather than a fabricated empty result. The remaining Events audience rule is recorded in `LANDING_PROJECTION_DELTA.md`.

## Student — `/student`

Order: context → header → summary → Focus → Notices → Today’s classes → Calendar → Quick access. Academics owns the effective published timetable; Learning owns actionable work and feedback; Communication owns unread/acknowledgement facts; Events owns the selected Student’s frozen calendar publications. Each query requires the selected accepted Student context and exact purpose grant. The production page uses the full authorized timetable week to distinguish no classes from a completed day, shows the bounded Learning query as `N+` when another cursor exists, and surfaces only current published notices returned by the exact self reader. Profile-like school and admission facts remain on Profile/Account rather than repeating in daily work.

## Parent/Guardian — `/family`

Order: child context → header → summary → Learning → Notices → Child’s classes → Calendar → Quick access. Every read is resolved again for the selected accepted child. Attendance owns submitted facts; Academics owns the effective timetable; Learning exposes guardian-authorized publications only; Communication owns notice read/acknowledgement facts; Events uses its frozen recipient binding. The production page makes one bounded call per owner and preserves independent unavailable states. Attendance wording reports submitted facts or “not yet submitted”; it never infers a present/absent state. Student drafts, responses and sibling data remain undisclosed. The redundant child-facts panel is removed because the selector and header already establish context.

## Principal — `/leadership`

Order: header → cross-owner summary → current decisions/follow-ups → Attendance follow-up → school-wide signals → Calendar → Quick access. The page composes only existing bounded gateway reads. Decision, Coordination, Learning, Assessments, Communication and Attendance each reauthorize the current Principal and branch independently; a failed source is unavailable, never zero. No shared dashboard table or cross-owner repository access is introduced. Calendar stays explicitly unsupported because Events has no Principal reader. Principal actions remain inspect, route, review and verify under explicit grants.

## Calendar contract

`LandingCalendar` selects the branch-local current date, shows a seven-day Monday-start week, supports previous/next week and selected-date agenda, exposes full accessible date labels, and displays at most three authorized entries. Events supply `PUBLISHED`/retained `CANCELED` records; holidays and cancellations are distinguishable. Parent and Student readers enforce current accepted context, exact purpose, frozen publication binding, release, entitlement and activation. Administrator reading currently uses the Events publisher guard. Teacher and Principal readers do not yet exist. Timetable sessions never masquerade as school-calendar entries.

## Visual authority and references

- Approved Administrator composition input: `docs/evidence/ux-revamp-06-admin-landing-2026-10-18/refined-forest-concept.png` plus `ADMIN_LANDING_SPEC.md` and this superseding contract.
- Exact Administrator production workflow reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html` (`home`).
- Teacher, Parent, Student and Principal HTML packs are workflow explorers. They inform copy/state hierarchy but are not complete approved production landing images.
- The five gallery compositions are **new candidates**, not approved references. Production captures remain application evidence. Human acceptance remains pending.

The reference manifest is [LANDING_REFERENCE_MANIFEST.json](LANDING_REFERENCE_MANIFEST.json). Remaining release gates are native VoiceOver/NVDA, actual-browser 200% zoom, TEN-03 restricted-role/RLS proof, provider/retention decisions, human acceptance and production release.

## Review correction status — 19 October 2026

The implementation/capture tables above describe the `784c5b9` executable checkpoint. They do not close the full landing contract. The current correction batch classifies the remaining work as follows:

| Workspace | Implemented and verified | Presentation defects being corrected | Missing owner projection | Decision/gate |
|---|---|---|---|---|
| Administrator | Authorized header/actions, factual metrics, exception categories, sessions and quick access | Calendar range/state truthfulness, attention tone, explicit Subject/Class columns and 24px summary gap | Complete bounded published-event week read | Human review pending |
| Teacher | Assigned Attendance sessions and guarded actions | Current/next class priority and narrower empty wording | Published Events reader and bounded feedback/teaching-work preview | Human review pending |
| Student | Accepted context, Timetable/Learning/Attendance reads and authorized shortcuts | Distinguish no schedule from ended day; remove repeated context emphasis | Bounded due-work, feedback and notice preview | Human review pending |
| Parent/Guardian | Accepted child context and guarded Attendance/Learning/Results reads | Human-readable Attendance state and redundant-context removal | Bounded acknowledgement/attention/notices preview | Human review pending |
| Principal | Factual Attendance coverage and guarded destinations | Must be labelled as an Attendance-focused starting view until broader sections exist | Bounded decisions, follow-ups, exceptions, Learning, assessment readiness, communication coverage and published Events | Human review pending |

`Missing owner projection` is an engineering/design classification, not automatically a product-decision blocker. Existing capabilities and resource-purpose rules will be reused where they already authorize the bounded read. Unsupported, unauthorized, loading, failed, successful-empty and not-loaded states must remain distinguishable.

## Correction implementation checkpoint — 19 October 2026

Shared calendar semantics, attention tone, session columns and Administrator spacing are implemented in commit `cd7736a`. The exact old-to-new navigation map and permission-preserving workspace grouping are implemented in commit `95839f5`. The role composition source now implements the already-authorized Teacher Learning workload, Student/Parent notice attention and Principal bounded owner composition described above. Teacher and Principal published-event reads remain unresolved authority decisions documented in [LANDING_PROJECTION_DELTA.md](LANDING_PROJECTION_DELTA.md); their calendars continue to say unsupported. Functional verification, direct visual comparison and human acceptance remain separate, and human acceptance is pending.

## Correction verification checkpoint — 19 October 2026

The supported five-workspace landing contract is engineering-verified at executable source `271917adf5e0f55cb2e5475a85ed95b96637b440`, build `Fv3qWOdG-v7QSU68zLxnF`. Administrator, Teacher, Student, Parent and Principal production pages passed the current-source persona journey at 1440×1000 and 390×844; the shared composition also passed at 900×1000 and across Forest, Amethyst, Porcelain and Linen. Calendar selected, complete-empty and failed/retry states were directly inspected. Parent notice summary disclosure now follows the exact notice-read purpose, and Principal decision descriptions do not expose opaque references.

The current evidence is [the landing completion record](../../evidence/ux-revamp-landing-completion-2026-10-19/README.md). Teacher and Principal Events readers remain precise unresolved authority decisions rather than presentation defects. Browser institution creation remains the independent UX-15 platform-operator dependency. Human acceptance and all production gates remain pending.
