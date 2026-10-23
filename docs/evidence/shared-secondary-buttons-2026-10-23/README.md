# Shared secondary-button correction — 23 October 2026

This focused presentation correction maps every shared `btn-secondary` border to the theme's subtle `--vs-border` token. It removes the darker muted-text border that made Close, Cancel, Filter and Sort controls appear heavier than equivalent buttons on other screens. Primary, destructive, disabled, focus and business behavior are unchanged.

The production build is `b_4Tj9HkOne4Z_S4lor5g`. A one-worker Chromium check inspected the shared gallery and the authorized Staff **View access** drawer at 1440×1000 and 390×844, device-pixel ratio 1. Computed evidence confirms a 1px `rgb(220, 229, 223)` border and 8px radius for sampled shared secondary controls. The Staff Close action is 36px high on desktop and 44px on mobile, and both pages have no root overflow.

- [Computed measurements](computed-measurements.json)
- [Staff access desktop](staff-access-desktop.png)
- [Staff access mobile](staff-access-mobile.png)
- [Shared gallery desktop](design-system-desktop.png)
- [Shared gallery mobile](design-system-mobile.png)

The captures were directly inspected for border weight, action hierarchy, alignment and mobile reachability. Human visual acceptance and native assistive-technology review remain pending.
