# Administrator landing composition

Status: definitive UX-06 composition for `/admin`

This specification resolves the earlier ambiguous choice between a summary strip and separate metric cards. It applies only to the Administrator landing page. Existing server authorization, route visibility, projections, action destinations, theme persistence and data definitions remain authoritative.

## Desktop composition

At 1440×1000 CSS pixels the shared shell uses a 240px sidebar, 64px top bar, 32px content padding and 24px section gaps. The sidebar retains every authorized route and visibility guard. Navigation rows are at least 44px high, items are separated by 4px, groups by 24px, and the middle navigation scrolls independently above the identity and separate sign-out controls.

The page header reads **Your school day, at a glance**. Its supporting line contains the branch-local date and one readable school/branch context. **Register student** is the primary action when `student.manage` is live and the module is available. **School setup** remains a secondary action. The page does not add global search, notifications, identities or commands.

One white summary surface contains three equal columns with 20px padding and subtle vertical dividers:

- Registers submitted: submitted sessions over the current non-cancelled school-day sessions.
- Active students: the current placement count from the school readiness projection.
- Needs your attention: the sum of the current Attendance, Imports and Staff-access exception counts.

Metric values use 30px/36px at weight 600. The surface is content-driven and must not clip longer content. It does not add pupil attendance percentages or other inferred metrics.

The main grid is `minmax(0, 2fr) minmax(300px, 1fr)` with a 24px gap. The left column contains **Needs your attention** followed by **Today’s sessions**. The right column contains **Quick access** followed by compact **School setup** progress.

Attention rows preserve the owner-projected category, count, description, destination and action. Category count and issue count remain distinct. Rows contain a 20px icon in a bounded icon surface, text, and one authorized action; they are at least 72px tall and may grow. A genuine empty result renders a quiet empty state.

Today’s sessions uses the authorized projection in its existing order. Desktop renders a semantic table with Time, Class, Subject, Teacher, Status and Action when those fields are present. Rows are at least 56px and may wrap. The existing View all and session destinations remain unchanged. No session data is invented.

Quick access contains compact links to the authorized Student directory, Staff directory, Attendance report and School settings destinations only when their existing checks pass. School setup shows the truthful completion ratio, a progress indicator, all unresolved readiness requirements, and one setup link. It does not repeat completed requirements as success badges.

## Responsive composition

At widths below 1200px the main work grid stacks. At widths below 1024px the shared sidebar becomes the existing modal navigation drawer. At 390px, content padding is 16px; the header, summary, attention, sessions, quick access and setup appear in that order. The summary becomes three compact stacked rows with horizontal dividers, and sessions use labelled cards backed by the same data and destinations. Controls retain 44px touch targets, keyboard access and visible focus. The document must not overflow horizontally.

The supported verification widths are 390, 768, 1024 and 1440 CSS pixels. Browser viewport measurements, `visualViewport.scale` and device pixel ratio are recorded separately; device scale is not evidence of native browser zoom.

## Theme and state rules

Forest, Amethyst & Pearl, Porcelain & Ink, and Linen & Bronze use the same composition. Primary actions, action links, non-status icons, selected navigation, focus rings, progress indicators and selected controls resolve through semantic theme tokens. Success, warning and error states retain their semantic colours.

The page renders current authorized synthetic records honestly. Awkward fixture labels or times are evidence/data observations, not permission to rewrite immutable records. The Events owner now supplies the calendar through its existing publisher-authorized projection. It remains independently unavailable when the current actor lacks that grant or the Events module chain fails; timetable sessions never substitute for calendar entries.

## Acceptance boundary

Completion requires equivalent-state desktop/mobile screenshots, the four theme states, intermediate-width overflow checks, expanded navigation, a final-section capture, keyboard/focus checks and focused shared-shell regression across Administrator, Teacher, Principal, Parent and Student. The right column is Calendar, Quick access and School setup. Functional verification, visual inspection, human acceptance and production readiness remain separate.

This checkpoint does not complete Principal, Parent, Teacher or Student page composition; browser institution-creation theme selection; Porcelain published sign-in support; or verification of the branded sign-in capture labelled “Authentication is not connected”.
