# Staff screen-state inventory

All dimensions are CSS pixels and follow `docs/ux/UX_CONSTITUTION.md` and `docs/ux/CONTROL_SIZING_CONTRACT.md`. The prototype uses the repository Forest tokens and permits the four existing themes without changing geometry.

## Shared shell

- **Desktop:** accepted 240px Administrator sidebar, 64px top bar, content maximum 1440px, 32px page padding. Staff is the current direct destination; local tabs are Profiles, Access and conditional Availability.
- **Mobile:** off-canvas navigation no wider than `calc(100vw - 32px)`; 44px open/close targets; background inert in production; focus returns to the menu trigger.
- **Typography:** the prototype bundles the same licensed `InterVariable.woff2` and SIL OFL text used by the application. Browser inspection must record the resolved face; fallback remains a defect rather than an accepted visual substitution.
- **Controls:** 40px desktop, 44px mobile/coarse pointer. Consequential final actions are at least 44px.

## Directory `/admin/teachers`

Width: full workspace. Heading 28–34px with Add staff at right. Toolbar spans the card; attribute selector prefers 168px, text input flexes, Filters/Sort remain content width. Table header 44px; rows at least 64px. Mobile rows become labelled cards.

States: populated; empty branch; no results with Clear filters; loading skeleton; read failure with Try again; filter drawer; sort drawer. Name/code Enter applies. Query, filters, sort and page survive Profile return. Filter and sort drawers keep draft values separate; Cancel and Escape leave applied state unchanged.

## Add staff `/admin/teachers/create`

Width: 760px maximum. One page, two-column form at desktop and one column below 768px. New/Existing modes are explicit radio choices. Existing mode is exact-ID resolve only. Optional teaching/access follow-up is progressively disclosed and cannot silently mutate those owners.

States: empty; inline validation; duplicate Staff profile; exact candidate resolved; explicit confirmation; submitting; unknown outcome; committed save with failed refresh; receipt/success. Unknown retains the original request and blocks a new create. Confirmed save recovery performs a read only.

## Profile `/admin/teachers/[employeeId]`

Header: avatar/name, staff code, employment badge, Back to Staff. Sections: Employment, Responsibilities, Access. Current facts appear before history; owner distinctions are named. Mobile stacks sections and keeps actions next to their owning section.

States: active teaching Staff; active non-teaching Staff; ended employment; no account; pending invitation; access suspended; failed read. No permission dump, token or restricted evidence body appears.

## Correct details drawer

Width: 480px desktop, full-width mobile. Person and Employee are separate sections. Each has its own expected version, reason and Save. Saving one section never clears the other section’s unsaved safe values.

States: clean; dirty; validation; saving; saved; stale current-versus-attempted review; unknown original-request recovery; confirmed-save/read-refresh failure; rejection. Close/Cancel/Escape use the same guard and focus return. Saving a section updates the visible fictional profile and its history while retaining the other section's draft.

## Teaching eligibility and responsibilities

Dated fields use 180px preferred width. Impact appears before confirmation with current and historical assignments separated. A blocked end/change names the affected assignment and offers an authorized Academics handoff; it never rewrites history.

States: not eligible; current bounded eligibility; historical eligibility; no assignment; current assignments; blocking impact; stale/recovery.

## Access

Employee context remains visible while Access owns identity/account/membership/invitation state. Invitation states: pending, delivery failed, expired, consumed and revoked. Membership states: pending, active, suspended and revoked. Reasoned resend and consequential lifecycle actions include consequence review and current-authority recheck.

States: no account; operator handoff; invitation pending/failure/expired/consumed/revoked; active/suspended/revoked membership; last-admin rejection; unknown; committed save with failed refresh.

## End employment

End today only. Review shows date, Teacher eligibility, affected assignments, current Access and the required Access disposition. Final success is withheld while relevant access is unresolved. It never removes global account or other branch/family/student relationships.

States: eligible; assignment block; last-admin/access block; processing; step-partial/reconciliation; success; unknown. The prototype’s suspension recommendation is awaiting PD-STF-03.

## Responsive/theme inspection matrix

| Surface | 1440×1000 | 900×1000 | 390×844 | 360×800 | Four themes |
|---|---:|---:|---:|---:|---:|
| Directory populated | Required | Required | Required | Required | Required representative |
| Profile active | Required | Required | Required | Required | Required representative |
| Correction drawer | Required | Required | Required | Required | Required representative |
| Add existing Person | Required | Required | Required | Required | Forest only unless geometry changes |
| Access/end employment | Required | Spot | Required | Spot | Forest only |

The current package records browser-based prototype captures; it is not current production-screen acceptance evidence.
