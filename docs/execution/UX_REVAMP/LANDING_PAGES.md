# Landing pages

Status: authoritative composition contract for the five protected workspace entry pages. Business rules, data definitions and authorization remain owned by the cited modules. Candidate presentation is reviewable at `/design-system#landing-references`; human acceptance is pending.

## Shared composition

Every landing uses the protected shell, 28/36px page title, one content-height summary surface, and a `minmax(0,2fr) minmax(300px,1fr)` work grid with 24px gaps. At widths below 1200px the grid stacks; below 768px the summary becomes stacked rows and content follows the workspace order below. `LandingSummary`, `LandingAttention`, `LandingCalendar`, `LandingSessions` and `LandingQuickAccess` in `components/landing-page.tsx` are the production/reference components. The deterministic candidate adapter is `components/landing-reference-gallery.tsx`.

Loading, error, unavailable and successful-empty are distinct. A failed projection never becomes zero. Lists show at most five work items, three calendar entries or five classes while retaining an owner total when one exists. Links remain permission-filtered navigation; mutations stay in their owner workflows.

## Administrator — `/admin`

Order: header → summary → Attention → Today’s classes → Calendar → Quick access → incomplete School setup. The header uses the branch-local date and current school; Register student is primary when Students management is live and School setup remains secondary. Summary definitions are submitted sessions over non-cancelled sessions expected on the local date, current active placements, and the exact sum of Reporting-owned exception counts. Reporting owns the summary/readiness/attention query; Attendance owns the bounded session report; Events owns calendar publications; Access/Tenancy resolve scope and availability. Calendar is visible only through the current explicit publisher grant and Events module checks. Actions lead to the existing registration, Attendance, Imports, Staff access, Events, notices and report routes. Missing Attendance, overview or Events projections render their own unavailable state.

## Teacher — `/teacher/today`

Order: header/date → summary → Next class → Attention → Today’s classes → Teaching work → Calendar → Quick access. Attendance currently owns the authorized assigned-session projection and actions. Learning owns assignments and accepted submissions. The present Teacher page has assigned sessions and register actions, but no bounded aggregate for accepted submissions awaiting feedback and no Teacher Events read projection. Those sections are **blocked owner dependencies**, not zero metrics. Required owner contracts are one scoped Learning aggregate (count plus bounded work links) and one Events reader tied to active Teacher membership and audience policy. Until those contracts exist, the production page remains a supported Attendance landing and the complete gallery composition remains a candidate.

## Student — `/student`

Order: context → header → summary → Up next → Focus → Today’s classes → Notices → Calendar → Quick access. Academics owns the effective published timetable; Learning owns actionable work and feedback; Communication owns frozen-recipient notices; Events owns the selected Student’s frozen calendar publications. Each query requires the selected accepted Student context and exact purpose grant. Current query support supplies next class, up to three actionable assignments, and the Events agenda. It does not supply complete class counts, complete due-soon totals, an unread-feedback definition, a bounded day-class list or a landing notice projection. Those metrics/sections remain owner-query gaps and must not be inferred from a limited list. Calendar may be wired immediately through `eventsGateway.listStudent` when `calendar.event.read_self` exists.

## Parent/Guardian — `/family`

Order: child context → header → summary → Attention → Child’s day → Learning → Notices → Calendar → Quick access. Every read is resolved again for the selected accepted child. Attendance owns submitted facts; Academics owns the effective timetable; Learning exposes guardian-authorized publications only; Communication and Events use their frozen recipient bindings. The current home exposes verified child context and destinations, while the underlying owner routes support timetable, Learning, notices and calendar. It lacks one bounded landing composition that returns latest submitted Attendance, deadline total, acknowledgement total and the three preview lists without N+1 reads. This is an owner presentation-query gap; the page must not combine siblings, disclose Student drafts/responses, or infer absence from missing data.

## Principal — `/leadership`

Order: header → four-metric summary → Decisions → Exceptions → Follow-ups → School pulse → Calendar → Communication → Quick access. Attendance currently owns due/received/awaiting register coverage. Coordination, Learning, Assessments and Communication already expose separate authorized workspace queries, but there is no single bounded landing projection and no Principal Events reader. The page therefore remains a supported Attendance overview. Required wiring is an application-level composition of owner ports with independent failure states and no cross-owner repository reads; unavailable owners remain unavailable rather than zero. Principal actions remain inspect, route, review and verify under explicit grants.

## Calendar contract

`LandingCalendar` selects the branch-local current date, shows a seven-day Monday-start week, supports previous/next week and selected-date agenda, exposes full accessible date labels, and displays at most three authorized entries. Events supply `PUBLISHED`/retained `CANCELED` records; holidays and cancellations are distinguishable. Parent and Student readers enforce current accepted context, exact purpose, frozen publication binding, release, entitlement and activation. Administrator reading currently uses the Events publisher guard. Teacher and Principal readers do not yet exist. Timetable sessions never masquerade as school-calendar entries.

## Visual authority and references

- Approved Administrator composition input: `docs/evidence/ux-revamp-06-admin-landing-2026-10-18/refined-forest-concept.png` plus `ADMIN_LANDING_SPEC.md` and this superseding contract.
- Exact Administrator production workflow reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html` (`home`).
- Teacher, Parent, Student and Principal HTML packs are workflow explorers. They inform copy/state hierarchy but are not complete approved production landing images.
- The five gallery compositions are **new candidates**, not approved references. Production captures remain application evidence. Human acceptance remains pending.

The reference manifest is [LANDING_REFERENCE_MANIFEST.json](LANDING_REFERENCE_MANIFEST.json). Remaining release gates are native VoiceOver/NVDA, actual-browser 200% zoom, TEN-03 restricted-role/RLS proof, provider/retention decisions, human acceptance and production release.
