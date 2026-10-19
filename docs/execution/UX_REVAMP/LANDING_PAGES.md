# Landing pages

Status: authoritative composition contract for the five protected workspace entry pages. Business rules, data definitions and authorization remain owned by the cited modules. Candidate presentation is reviewable at `/design-system#landing-references`; human acceptance is pending.

## Shared composition

Every landing uses the protected shell, 28/36px page title, one content-height summary surface, and a `minmax(0,2fr) minmax(300px,1fr)` work grid with 24px gaps. At widths below 1200px the grid stacks; below 768px the summary becomes stacked rows and content follows the workspace order below. `LandingSummary`, `LandingAttention`, `LandingCalendar`, `LandingSessions` and `LandingQuickAccess` in `components/landing-page.tsx` are the production/reference components. The deterministic candidate adapter is `components/landing-reference-gallery.tsx`.

Loading, error, unavailable and successful-empty are distinct. A failed projection never becomes zero. Lists show at most five work items, three calendar entries or five classes while retaining an owner total when one exists. Links remain permission-filtered navigation; mutations stay in their owner workflows.

## Administrator — `/admin`

Order: header → summary → Attention → Today’s classes → Calendar → Quick access → incomplete School setup. The header uses the branch-local date and current school; Register student is primary when Students management is live and School setup remains secondary. Summary definitions are submitted sessions over non-cancelled sessions expected on the local date, current active placements, and the exact sum of Reporting-owned exception counts. Reporting owns the summary/readiness/attention query; Attendance owns the bounded session report; Events owns calendar publications; Access/Tenancy resolve scope and availability. Calendar is visible only through the current explicit publisher grant and Events module checks. Actions lead to the existing registration, Attendance, Imports, Staff access, Events, notices and report routes. Missing Attendance, overview or Events projections render their own unavailable state.

## Teacher — `/teacher/today`

Order: header/date → summary → open-register attention → Today’s classes → Calendar → Quick access → next-class guidance. Attendance owns the authorized assigned-session projection and actions. The production page now uses the shared landing geometry and retains live date refresh, register state/action mapping and explicit assignment scope. Learning owns assignments and accepted submissions, but has no bounded aggregate for accepted submissions awaiting feedback; Events has no Teacher reader. Those sections are **blocked owner dependencies**, not zero metrics. The Calendar renders the explicit unavailable state. Required future contracts are one scoped Learning aggregate and one Events reader tied to active Teacher membership and audience policy.

## Student — `/student`

Order: context → header → summary → Focus → Today’s classes → Calendar → Quick access → class context. Academics owns the effective published timetable; Learning owns actionable work and feedback; Events owns the selected Student’s frozen calendar publications. Each query requires the selected accepted Student context and exact purpose grant. The production page uses the full authorized timetable week to derive today’s classes and next class, shows the bounded Learning query as `N+` when another cursor exists, and wires the Events agenda through `eventsGateway.listStudent`. It does not claim a complete due-soon total, unread-feedback definition or landing notice projection. Those owner-query gaps remain absent rather than inferred.

## Parent/Guardian — `/family`

Order: child context → header → summary → Learning → Child’s classes → Calendar → Quick access → child context. Every read is resolved again for the selected accepted child. Attendance owns submitted facts; Academics owns the effective timetable; Learning exposes guardian-authorized publications only; Events uses its frozen recipient binding. The production page makes one bounded call per owner, never a call per row, and preserves independent unavailable states. Submitted Attendance records are factual records rather than inferred absences. It does not expose Student drafts/responses or combine siblings. A consolidated acknowledgement/deadline/notice composition remains an owner presentation-query gap and is not shown as zero.

## Principal — `/leadership`

Order: header → four-metric Attendance summary → Attendance follow-up → Attendance oversight → Calendar → Quick access. Attendance owns scheduled/due/received/awaiting coverage and the bounded awaiting-register links. Coordination, Learning, Assessments and Communication expose separate authorized workspace queries, but there is no single bounded landing projection and no Principal Events reader. The production page therefore remains an explicit supported Attendance overview using the shared landing geometry. Calendar stays unavailable and no cross-owner value is inferred. A future application-level composition must use owner ports with independent failure states. Principal actions remain inspect, route, review and verify under explicit grants.

## Calendar contract

`LandingCalendar` selects the branch-local current date, shows a seven-day Monday-start week, supports previous/next week and selected-date agenda, exposes full accessible date labels, and displays at most three authorized entries. Events supply `PUBLISHED`/retained `CANCELED` records; holidays and cancellations are distinguishable. Parent and Student readers enforce current accepted context, exact purpose, frozen publication binding, release, entitlement and activation. Administrator reading currently uses the Events publisher guard. Teacher and Principal readers do not yet exist. Timetable sessions never masquerade as school-calendar entries.

## Visual authority and references

- Approved Administrator composition input: `docs/evidence/ux-revamp-06-admin-landing-2026-10-18/refined-forest-concept.png` plus `ADMIN_LANDING_SPEC.md` and this superseding contract.
- Exact Administrator production workflow reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html` (`home`).
- Teacher, Parent, Student and Principal HTML packs are workflow explorers. They inform copy/state hierarchy but are not complete approved production landing images.
- The five gallery compositions are **new candidates**, not approved references. Production captures remain application evidence. Human acceptance remains pending.

The reference manifest is [LANDING_REFERENCE_MANIFEST.json](LANDING_REFERENCE_MANIFEST.json). Remaining release gates are native VoiceOver/NVDA, actual-browser 200% zoom, TEN-03 restricted-role/RLS proof, provider/retention decisions, human acceptance and production release.
