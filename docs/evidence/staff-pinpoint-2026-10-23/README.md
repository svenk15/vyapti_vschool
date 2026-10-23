# Administrator Staff pinpoint visual correction — 23 October 2026

Human visual acceptance remains **PENDING**.

## Authority and candidate

- Frozen reference: `docs/execution/STAFF_REVIEW/references/approved-20261022/mock/index.html`
- Reference SHA-256: `bbc97d7293e59138c8b7340c8591b66282fb905936be658871109cccfdb5b017`
- Application routes: `/admin/teachers` and `/admin/teachers/[employeeId]`
- Tested working tree parent: `bf0279af6c32319db4b976256c61a538333e4605`
- Production build ID: `HmWFmTRnxMhwrYzNmY3nI`
- Demo: `http://127.0.0.1:3400`

The reference and application were rendered in Chromium at 100% browser zoom and device-pixel ratio 1. Desktop captures use 1440×1000 CSS pixels; mobile captures use 390×844 CSS pixels. The computed application font is Inter with the generated Inter fallback and system fallbacks. No root horizontal overflow was observed.

## Corrected differences

- Filter and Sort drawers now use the reference's 470px desktop width, full-width mobile treatment, 94px/89px headers, content padding, divider positions, 36px desktop actions and 44px mobile actions.
- Filter checkbox rows retain their approved 38px geometry. Sort radio rows use the approved 35px geometry, so both action footers start at the same reference position.
- Cancel keeps its natural width while Apply fills the remaining mobile action row. Escape and Cancel discard unapplied draft values and restore focus to the opening control.
- Staff Profile now uses the reference's 884px desktop record width and 358px mobile record width, compact identity block, status badge, fact typography, section spacing, assignment rows, portal row and recent-activity treatment.
- The Profile's mobile section headings remain left aligned and the `View assignments` action stays on the same row. The approved outline Back icon replaces the text glyph.
- Dated teaching eligibility remains reachable in the assignments drawer, preserving the existing Academics-owned workflow without retaining the earlier oversized summary inside the Profile.

Exact CSS-pixel measurements are recorded in [computed-measurements.json](computed-measurements.json). Captures are paired by the `reference-*` and `application-*` filenames for Profile, Filter and Sort at both viewports. [capture-metadata.json](capture-metadata.json) records the browser environment and build.

## Focused verification

- `env NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed, including TypeScript and all production routes.
- `pnpm exec eslint components/people-workspace.tsx components/staff-profile-actions.tsx 'app/admin/teachers/[id]/page.tsx'` — passed.
- Focused read-only Playwright smoke — passed: Filter draft cancellation and focus restoration, Filter URL state, Sort URL state, Profile return-state preservation, assignments drawer, eligibility continuation and Escape focus restoration.
- Direct screenshot inspection — completed for all six reference/application pairs at desktop and mobile.
- `pnpm check:docs` — this evidence introduced no reported broken link; the repository check remains red on two existing links to the absent `docs/evidence/workspace-presentation-route-pass-2026-10-20/README.md` from `WORKSPACE_PRESENTATION_REVAMP/CURRENT_STATE.md` and `PAGE_COVERAGE.md`.

No backend contract, authorization rule, persistence, migration, fixture or business operation changed.

## Explicit remaining differences

- The frozen mock shows Personal and Employment `Edit` actions. These remain excluded because mutable Staff fields are pending PD-STF-02 approval; a visual mock does not authorize those writes.
- Production shows authoritative synthetic names, category, contact, assignment and portal state. It does not copy the mock's fictional values or assignment count.
- Production retains the authorized application shell and mobile header. The standalone mock's shell is reference context; the Profile record and drawers are the directly matched surfaces.
