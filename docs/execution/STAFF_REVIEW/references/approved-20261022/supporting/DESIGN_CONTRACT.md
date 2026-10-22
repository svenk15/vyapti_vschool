# VSchool Staff — essential experience reference

Status: DESIGN REVIEW CANDIDATE. User approval of this revision is not inferred. Production is unchanged.

## Reference authority

The runnable `mock/index.html`, `mock/style.css`, `mock/app.js` and bundled assets are the visual and interaction reference. Open index.html locally; no private URL, login or build is needed. Data is fictional and in-memory; reload resets it. Do not copy this client-side data layer into production.

The Students Profile reference is `vschool-onboarding-interactions.ven268.chatgpt.site/refined-onboarding#add`, source 0c1a1d47bca22cc7f75ee9c1e17270047bf8caa1. The listing layout was aligned to the supplied Students production visual reference at application source 223d62332401f972e7407f0dc977e7e990a1446c. Profile and listing serve different purposes and use their corresponding recipes. This revision preserves Forest rather than recoloring it.

## Decisions

- Staff name is a link to the Profile. Do not make the entire row clickable.
- Manage is a compact icon-and-text action chooser, not a second Profile link. Its shortcuts open the relevant drawer directly from the directory.
- Profile has no global Edit staff action. Personal details and Employment each own an Edit action, with a specific accessible name.
- Routine editing uses a drawer with Save / Cancel. No routine confirmation page.
- Add staff is one focused page with Personal details and Employment; success opens the Profile. No wizard or routine confirmation.
- Portal access is separate from contact details and employment. Explicit review precedes an invitation; no default workspace grant.
- Teaching assignments are factual, read-only here. No Edit eligibility, Availability, rejoining or employment-ending CTA in this essential mock.
- Recent activity stays collapsed. No redundant explanation below every heading.
- Non-Staff sidebar destinations are context only; no other module redesign is authorized.

## Layout and visual values

Use the supplied CSS as the exact source, not these summaries alone. Bind production components to existing theme tokens; do not introduce global overrides that alter approved Students screens.

| Element | Reference |
|---|---|
| Font | Bundled licensed Inter; included license; use existing approved production font asset |
| Forest / primary | #183e33 / #236b53 |
| Text / muted | #253c32 / #687c71 |
| Divider / canvas / tint | #dce6df / #f5f7f3 / #edf4ee |
| Sidebar | 218px |
| Desktop list header | 72px; content insets 39px top, 38px horizontal |
| Directory title | 28px / 36px, weight650 |
| List toolbar | 40px; 8px between controls; search owns remaining width |
| Table | 46px header, 67px minimum data row; content may grow |
| Profile record | max884px, white surface, 10px corners, divided sections |
| Identity | 56px avatar, 28px / 36px name |
| Profile section | 24px 28px desktop, 20px 18px mobile |
| Section heading / facts | 15px600 / 13px with 21px line height |
| Routine desktop buttons | min36px, 7px 13px padding, 6px corners; no full-width desktop Save |
| Drawer | 470px desktop, full width narrow; scrollable body |
| Drawer footer | 18px 28px desktop; 16px 20px mobile; 9px gap |
| Manage chooser | 380px maximum, 48px minimum action rows, viewport-safe height |
| Mobile touch actions | 44px minimum for editing/Manage; responsive text, no truncating identity |
| Icons | Exact supplied SVG path/stroke set; sliders for Manage, pencil for Edit; no emoji |

Directory filter/sort controls retain the existing 40px mobile recipe; each must satisfy the 24px WCAG target minimum and adequate separation. Coarse-pointer editing/Manage actions remain44px. Do not conflate component height with a claim of accessibility conformance.

## Scope boundaries

This is an essential presentation proposal, not approval of mutable fields, identity attestations or access grants. Personal/contact and Employee-code/category corrections illustrate the desired placement. PD-STF-01–03 still require the repository's explicit decision record before changing owner behavior. Joining date is read-only in the edit drawer. Existing-Person linkage and rejoining are not mocked. Current production lifecycle/recovery behavior must remain reachable and correct even where absent from this simplified mock.

## Access superseding addendum
STAFF_ACCESS_COVERAGE.md and mock/access.js supersede the earlier limited portal-review scope. Role changes, suspend/reinstate/revoke and reasoned invitation resend are included because they exist in the uploaded implementation. This does not authorize new owner contracts.

## Heading and table-label revision — 22 October 2026

Page titles: Staff; Staff access. Local navigation: Profiles | Access. No redundant Sign-in access subheading.

Staff columns: Name | Category | Employment | Teaching | Access | Actions.
Access columns: Account | Roles | Account status | Branch access | Invitation | Actions.

Sentence case; 12px/600 table headings. Left-align headings and contents, including Actions and Manage, within the existing compact column. Responsive card labels use the same wording. No changes to authorization or action behavior.

## Paginated tables
Both Staff and Staff access use a shared footer: Rows per page (5/10/25 in the small mock dataset), visible result range, Previous, Page X of Y, Next. Five rows initially make pagination demonstrable. Disable unavailable boundary actions. Page size changes and Staff search/filter/sort reset to page1; URL state preserves selected page and page size and supports Back/Forward. Profile return preserves the Staff directory query. Responsive cards paginate identically; controls remain44px on narrow layouts.

Mock totals come from its finite authorized-looking fictional array. Production must preserve server-side scope, sorting, pagination and signed-cursor semantics. Do not fetch every Staff record or invent totals/page counts to reproduce the footer. If an owner doesn't expose totals, use an honest result range and Previous/Next until that owner contract is extended.

Pagination metadata refinement: visible label Rows, compact62px native select with shared chevron, 16px desktop gap and subtle divider, Showing 1–5 of 6 with tabular numerals. Match vertical centers; use44px select on mobile and omit divider. Accessible label retains Rows per page.

## Quiet pagination — supersedes previous Rows footer
Default to 25 records; options 25/50/100, subject to owner API limits. Count at left (e.g. “1–25 of 126 staff”), compact “25 per page” selector and Previous/Next at right. Omit duplicate Page X of Y, Showing, Rows label and divider. At 25 or fewer records show only the count, with no pagination controls. Keep the selector available for datasets above 25 even when a larger selected size fits all results, so users can reduce the size. On mobile count and size share the first row; Previous/Next share the second with 44px targets. Preserve URL state and owner cursor contracts; never fabricate totals or arbitrary page jumps. Existing six Staff and twelve Access mock records now fit on a single page. `pagination-review.html` demonstrates larger synthetic totals independently of those fixtures.

### Minimal footer refinement
Supersedes the verbose pagination labels: paged range reads “1–25 of 126”; size reads “25 / page”; previous/next use chevrons with accessible names and tooltips. All controls remain on one footer line on mobile; arrows have 44px touch targets. Single-page counts remain “6 staff” / “12 accounts”. No page number, explanatory copy or decorative divider.

### In-context pagination fixtures
The Staff and Access tables now include 30 additional explicitly fictional review records using example.test addresses. Staff has 36 records and Access 42, so the shared paginator appears with the default 25-row page size. All additional rows support existing Profile/Manage interactions; no real accounts or invitations are created. These fixtures supersede the prior six/twelve-row demo counts.

Identity-column headings align to the name text after the avatar: Staff Name has a 54px left inset; Access Account has 54px on desktop and 8px when its avatar is hidden at intermediate widths. Mobile card layout remains unchanged.
