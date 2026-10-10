# Shared Administrator component contracts

All numbers below are CSS pixels extracted from the Administrator reference, not dimensions estimated from a scaled screenshot. Ordered source CSS, including later sidebar overrides and specialized variants, remains authoritative. Example React names below are target roles, not assertions that these files exist in the live repository. Map each role to the existing implementation before creating a new component.

| Component role | Reference selector | Exact baseline contract |
|---|---|---|
| Portal shell | .shell | grid 240px minmax(0,1fr); at <=1100px sidebar column 220px; <=800px block/mobile navigation |
| Sidebar | .sidebar plus final override | background #173B32, foreground #EDF5EF, embedded VSchool Navigation font; sticky top 0, 100dvh; mobile drawer 260px |
| Brand | sidebar .brand | 24px/600, letter spacing -.7px; padding 26px 24px; mark 33×33px, radius 9px, outlined transparent background |
| School identity | sidebar .school-card | margin 0 24px 12px; padding 0 0 18px; bottom divider #ffffff25; strong 13px/600; secondary #C2D2C9 |
| Navigation item | .nav-item plus override | 13px; min-height 42px; padding 10px 12px; gap 11px; radius 7px; active weight 600 and #ffffff16 background; marker 2×22px #B9D9C7 |
| Navigation section | .nav-caption | 11px/600, tracking 1px, uppercase, muted #C2D2C9; preserve source margins/padding |
| Top bar | .topbar | 60px height, padding 0 32px, white with 1px divider; mobile 64px / 0 16px |
| Page content | .content | padding 32px, max-width 1500px, margin auto; <=1100 padding 28px; <=800 padding 24px 20px 48px |
| Page heading | h1 / .page-head | h1 28px/650, line-height 1.25, tracking -.7px (26px mobile); flex gap 20px, margin-bottom 24px; description margin-top 8px |
| Button | .btn | 13px/550 line-height 1.4; min-height 40px; padding 8px 14px; gap 8px; 1px line border; radius 8px; mobile min-height 44px |
| Icon | .icon | 18×18px; stroke 1.7; round caps/joins; no fill. Search 16px; row action 15×15px |
| Tabs | .tabs | gap 24px; bottom margin 22px; 1px divider; item padding 12px 0; 13px; active 2px brand underline and weight 650 |
| Toolbar | .toolbar | flex width 100%, gap 8px, margin-bottom 16px; search flex:1/min-width:0; mobile wrap/search full row, action buttons flex:1 |
| Search | .searchbar | min-height 40px, radius 8px, 1px line; select 144px max/120px min, 38px height, 12px text; input 38px height, 13px text; mobile select 136px, controls 42px/search 44px |
| Table container | .table-card | white, 1px line, radius 12px, overflow hidden; actual table width 100%, collapsed borders |
| Header cell | th | 12px/600; background #f5f7f3; padding 13px 18px |
| Data cell | td | 13px; padding 17px 18px; 1px top divider; vertical-align middle |
| Person cell | .personcell | inner flex gap 12px, min-width 175px; primary 13px; secondary 12px muted with margin-top 3px |
| Avatar | .avatar | 34×34px circle, 11px/650; soft background/brand text (sidebar has own overrides) |
| Status pill | .badge | padding 3px 9px; radius 15px; 11px/600; semantic tone from source; no added outline |
| Actions | .action-col / .row-action | column 96px, right aligned; action 12px, gap 6px, padding 8px 0; icon 15px; no extra bold or outline |
| Dialog | .dialog | min(540px,100vw - 32px), radius 14px, max-height 90dvh; shadow 0 20px 80px #153e3126 |
| Side drawer | .dialog.drawer | fixed right; min(420px,100vw), height/max-height 100dvh, radius 0; left border 1px line |
| Drawer/modal header | .dialog-head | padding 22px 24px, bottom divider, flex gap 16px; title 21px |
| Drawer body | .dialog-body | padding 8px 24px 24px (mobile top 14px); scrollable; source drawer uses calc(100dvh - 166px) |
| Footer | .dialog-foot | padding 17px 24px; top divider; flex gap 8px, justify end; white; Cancel then Apply for Sort/Filters |
| Disclosure | .filter-group | bottom divider, padding 12px 0; summary 13px/600, padding 8px 0, custom right icon; open icon rotated 180deg |
| Radio/checkbox row | .check | 13px; gap 10px; drawer padding 9px 0/margin 0; control 17×17px, margin-top 3px, brand accent |
| Form field | .field | bottom margin 20px; label 13px/600 and 7px gap; input min-height 40px/padding 10px 12px/radius 8px/border #cbd6cc |
| Helper/error | .hint / .error | 12px, margin-top 6px; muted/error semantic color; invalid border red |
| Form grid | .formgrid | two equal columns, horizontal gap 20px; .wide spans all; single column <=800px |
| Wizard layout | .wizard-grid | minmax(0,760px) + minmax(240px,1fr), gap 24px; one column <=1100px |
| Main form footer | .form-foot | top divider; padding-top 20px/margin-top 24px; Back left, primary progression right; gap 16px |
| Save draft | .save-draft | separate row margin-top 16px; right aligned; small button; enabled only after meaningful allowed data |

## Behavior contracts

- Search: default attribute selected; Enter applies attribute/value; no separate Search button. Selection focus does not highlight the whole composite. Preserve a visible keyboard-focus cue on the focused control even where the prototype suppresses it.
- Filters: multi-select sections, selections remain visible; section headings toggle; Apply commits draft choices, Cancel/Escape discards unapplied changes; existing applied state initializes each opening. No fabricated default active filter.
- Sort: separate Sort by and Order by groups, initially expanded, radio options, custom right chevrons; Apply commits, Cancel/Escape leaves prior order. Closed button is compact “Sort” with icon, not a long selected-value sentence.
- Modal/drawer: accessible title, modal focus containment, background inertness, Escape dismissal when safe, focus return to trigger. Backdrop #122c2559 with no blur. Production layout should use header/body/footer flex composition to maintain the same appearance under font scaling, rather than copying brittle fixed-height assumptions.
- Table: retain semantic table cells with inner flex person contents; separators continue across every column. Mobile .mobile-cards renders each row as a two-column grid, first cell and action cell full width, labels above secondary data; do not merely shrink the desktop table.
- Manage: grouped icon-labelled links; use exact approved actions and eligible real destinations. No dead controls, fake success, or permission-by-visibility.
- Save: disable repeated pending submission appropriately; show invalid input, stale conflict, recoverable failure and unknown outcome according to the owner contract. Prototype scenario switches are review controls, not production controls.

## Component variants and implementation ownership

Families, Communication and Timetable have additional scoped styles in the source. Preserve those variants where intentional; do not globally force their fields to the generic .field dimensions. Map shared component roles to actual repository exports in the owner DESIGN.md. One source of tokens and primitives; explicit variants for real differences. Do not hardcode per-page colors to repair a wrong shared token.

## Exact icons

The approved HTML contains inline SVG path definitions (ICONS and specialized workspaces). Reuse those shapes or a verified equivalent from the existing icon set. Match viewBox, stroke and dimensions; font glyph approximations and emoji are not substitutes. Keep decorative icons aria-hidden and name their parent controls.
