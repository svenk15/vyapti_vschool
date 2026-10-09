# Shared visual system and parent compositions

Reuse the approved VSchool theme and component source; do not build a separate parent design system. `reference/shared-tokens.json` is a handoff reference. Production must have one token source and reusable component set across Operator, Administrator, Teacher and Parent.

| Foundation | Contract |
|---|---|
| Canvas / surface | #F7F8F4 / white |
| Ink / secondary | #213A32 / #596C61 |
| Brand / soft / deep | #225B49 / #E9F2EC / #153E31 |
| Borders | #DFE6DF, consistent fine separators |
| Type | 28 page title, 18 section, 14 body, 13 navigation/control, 12 metadata, 11 uppercase category |
| Geometry | 240 desktop sidebar, 60 topbar, 32 desktop content gutter, 20 mobile gutter |
| Targets | 40 desktop controls; 44 mobile/coarse targets |
| Spacing | 4/8/12/16/20/24/32; 8 between toolbar controls |
| Components | 8 control radius, 12 cards; shared 18px stroke icons |

## Parent information hierarchy

Child context comes before the action. Home shows a small number of concrete school actions and recent updates, not unrelated metrics. The user’s name/role remain at the bottom of desktop navigation; Sign out is a separate action area. School branding stays recognizable on sign-in. Children are clearly separated; never combine their attendance percentages or invoices into a misleading family score.

`ChildContextStrip` and `ChildSwitcher` show child, class, school and branch. Long names wrap without pushing the action out of reach. On mobile the whole control stays readable with a compact labelled chevron action. Switching checks unsent work, invalidates old scope and reevaluates enabled purposes. A pending payment remains tied to its original invoice; a switch never starts or retries it.

`NextActionCard` uses one clear verb and named child/context. Source freshness and unavailable states must be honest. Missing data is not zero or a reassuring all-clear.

`SessionAttendanceList` distinguishes submitted Present/Absent/Late/Excused from Awaiting submission. No inferred daily status or percentage without an approved aggregation policy and denominator. A parent query or explanation does not edit the record.

`RequestReceipt` says received/pending/withdrawn/reviewed with a stable reference. Explain what still needs school action. A request is not an approval.

`NoticeAcknowledgement` binds to the displayed version. Reading, delivery, acknowledgement and consent are different. `FamilyThread` names only permitted participants and the selected child; replying does not invite another guardian.

`ConsentForm` has no default response. Each purpose/version has explicit choices, a read confirmation, signer policy and traceable change/withdrawal. Show the parent’s own decision separately from overall permission readiness. Never disclose private information about other signers.

`InvoiceReview` shows one issuer, invoice, child, currency and exact amount. `PaymentOutcome` distinguishes Processing/Unknown/Failed/Paid. While uncertain, show Check status and the existing reference, not another Pay button. Only verified settlement creates a receipt. The prototype’s provider controls remain in Review tools and are removed from production.

## Shared interactions retained

Search uses a compact default attribute and Enter to apply, without an explicit Search button. Selecting the attribute must not highlight the entire composite. Keyboard focus remains visible; input emphasis and focus are different concepts. Search and Filter/Sort controls span the content width with small consistent gaps.

Filters use fluid collapsible attribute headings, thin separators, no decorative boxed subsections, unselected options by default and persistent multiselect choices. OR within a group, AND across groups. Pending choices commit on Apply; Cancel discards. Exactly Apply and Cancel in the footer; applied chips clear outside the drawer. Sort uses initially expanded Sort by and Order by radio groups.

Forms put Back/Cancel on the left, Continue/Confirm on the right. Save draft and leave sits separately below and enables only after real content changes. Sensitive/password/payment credentials never enter generic drafts. No browser localStorage/IndexedDB persistence in this review; production draft persistence is a separate privacy/retention decision.

Tables use semantic headers/captions and explicit action links. Mobile uses readable labelled records, not tiny compressed grids. No wide redundant Actions column, unlabeled ellipsis or mouse-only row interaction. A receipt/unknown-state reference board may require prior steps in the interactive prototype; gallery links start the journey.

## Themes, language and accessibility

Forest, Indigo and Clay preview shared brand variables. Client branding changes logo, school copy and approved colors across screens; it does not change permissions, layout contracts or semantic status colors. Validate real client palettes and assets for contrast. Do not inject arbitrary tenant CSS. A parent spanning institutions sees the active child’s school identity; the theme must not imply a shared institution.

Use plain language: Explain an absence, Review response, Send explanation, Check payment status. Keep implementation/guard/DB detail in design notes and handoffs, not the real user flow. Avoid a blanket Success with no outcome.

Keyboard traversal, labelled radio groups, announced field errors and status messages, focus containment/return, 200% zoom, contrast and VoiceOver/NVDA need real-browser/native review on the integrated product. CSS or a PNG is not conformance evidence. Prefer reduced motion and durable on-page receipts over transient toasts alone.
