# VSchool control sizing contract

Revision 2.1 · **APPROVED for implementation on 20 October 2026**

This is the canonical sizing and spacing contract. Its provenance is `docs/execution/UX_CONSTITUTION_REVIEW/CONTROL_SIZING_CONTRACT.md`.

## Geometry

| Element | Desktop fine pointer, viewport ≥768px | Narrow viewport <768px or coarse pointer |
|---|---|---|
| Text, date, select and combobox trigger | 40px baseline; 14/20 text; 9px vertical and 12px horizontal padding; 1px border | 44px minimum; 16/20 text; 11px vertical padding |
| Standard button and toolbar trigger | 40px baseline; 14/20 text; 9px vertical and 16px horizontal padding | 44px minimum; 14/20 text |
| Consequential final action | 44px minimum | 44px minimum |
| Explicit compact table action | 36px minimum; 7px vertical and 12px horizontal padding | 44px minimum |
| Icon-only action | 44×44px target with 18px icon | Same |
| Checkbox/radio | 18px indicator in a row at least 40px | Row at least 44px |
| Short textarea | Three visible lines, about 80px, vertically resizable | About 84px |
| Long textarea | Six visible lines, about 140px | About 144px |

These are normal-content baselines, never clipping heights. Long labels may wrap and controls may grow. Native select popup geometry remains browser/OS owned.

### Approved route-scoped exception

The exact FIRST Student registration reference at `docs/ux/references/registration-approved/APPROVED_REGISTRATION.html` governs `/admin/students/register`: desktop form and lookup actions are 36px with 13/20 text, while narrow controls remain at least 44px. Its card, field and footer geometry is scoped under `.student-registration-*`; it does not change the shared button baseline on other routes. Controls must still grow for enlarged text and intrinsic content.

## Purpose widths

- Numeric count or roll number: 120px.
- Date: 180px, with room for localized native segments.
- Short status/category: 200px, growing to 240px for long options.
- Admission/staff code: 240px.
- Person/class selection: 320px.
- Email: 400px.
- Address/explanation: up to 640px.
- Context switcher: 240–360px.
- Form content: maximum 760px, at most two columns at 768px and above, one column below.

Widths are preferred and capped by available space. Search rows let the input grow while Filter and Sort remain content width.

## Spacing and typography

- Label to control: 6px; control to hint/error: 4px.
- Field to field: 16px, with one spacing owner.
- Form column gap: 20px; section gap: 24px.
- Related actions: 8px; form to action row: 24px.
- Form card padding: 24px desktop, 16px narrow.
- Control radius: 8px; semantic 1px border.
- Labels: 14/20, weight 500. Hint/error: 12/18.
- Control icons: 18px with 8px text separation.

All four themes use identical geometry. Shared primitives own variants: standard, compact row, consequential, icon-only, short/long textarea and purpose width. Route CSS must not override these without a documented exception.

## Evidence

Measure computed width, height, padding, line height and font for representative production controls. Verify 1440px, 900px, 390px and 360px, all themes, long/error/loading states, keyboard access and actual browser 200% zoom when available. Native exceptions and unavailable assistive-technology checks remain explicit.
