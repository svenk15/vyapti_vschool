# Administrator Staff Profile and drawer follow-up — 23 October 2026

Human visual acceptance remains **PENDING**.

## Candidate and reference

- Implementation checkpoints: `d008c582b27264991742b206ab36cb1e944e3185` and `5e89fd59b4bfe1a7c61e300a4345be6d1711abe8`
- Production build ID: `wcBTqLXJ3Sk4fQixRsRl9`
- Demo: `http://127.0.0.1:3400`
- Application routes: `/admin/teachers` and `/admin/teachers/[employeeId]`
- Frozen reference: `docs/execution/STAFF_REVIEW/references/approved-20261022/mock/index.html`
- Frozen reference SHA-256: `bbc97d7293e59138c8b7340c8591b66282fb905936be658871109cccfdb5b017`

Chromium rendered both candidates at 100% browser zoom and device-pixel ratio 1. Desktop captures use 1440×1000 CSS pixels and mobile captures use 390×844 CSS pixels. The computed application font is Inter with the generated Inter fallback and system fallbacks. No root horizontal overflow was observed.

## Corrections and direct findings

- The directory Filter and Sort triggers now use a 1px pale theme border. The Forest application computes `rgb(220, 229, 223)`; the reference computes `rgb(220, 230, 223)`. Both use a 6px radius and 40px control height.
- Filter and Sort footer Cancel actions use the same 1px pale border at desktop and mobile widths. The earlier dark `rgb(86, 102, 93)` outline is no longer present.
- The Profile's current assignments are compact rows, while dates and eligibility remain available in the dedicated assignments drawer.
- The assignments drawer now follows the frozen composition: Staff identity, compact assignment/status rows and a single Academics handoff. The unapproved extra footer action was removed; header Close and Escape remain available and restore the opener.
- Portal triggers are state-specific: `Set up access`, `View invitation` or `View access`. The pending-invitation and active-account drawer heading is the reference label `Staff access`.
- Active Staff access now opens the approved Profile-local composition rather than redirecting to the general access directory. It shows the authoritative sign-in identity, account/branch state, roles and invitation state, then exposes the existing guarded Change roles, Suspend/Reinstate and Revoke operations.
- Role changes follow the reference's staged interaction: edit roles and reason, review the current/proposed roles, then save. The form reuses the Access owner's existing expected-version, exact-key recovery and authorization path; the visual review did not submit a mutation.
- Action icons are the reference-sized 16px outline icons, and access actions use compact divided rows at desktop and mobile widths.
- Real production invitation and access states remain authoritative. The reference's fictional account, role and invitation values were not copied.

[computed-measurements.json](computed-measurements.json) records final border, size, font and overflow measurements. [invitation-state.json](invitation-state.json) records the pending-invitation heading comparison. `reference-*` and `application-*` captures pair Filter, Sort, Profile, assignments, access and invitation states at both viewports.

## Functional boundary

The frozen Profile shows Personal and Employment Edit actions. They remain absent because `PD-STF-02` is still unapproved. The exact unresolved contract covers mutable Person and Employee fields, their separate correction authorities, reason/history rules and the safe start-date boundary. Adding visually enabled Edit controls before that decision would create a non-functional or unauthorized action. Existing Profile reads, dated eligibility, invitation review/resend, access management, exact replay, version checks and owner authorization remain intact.

## Verification

- `pnpm exec eslint components/access-management.tsx components/staff-invitation-management.tsx components/staff-portal-management.tsx 'app/admin/teachers/[id]/page.tsx'` — passed after removing one unused import.
- `env NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed from implementation commit `5e89fd59b4bfe1a7c61e300a4345be6d1711abe8`; build `wcBTqLXJ3Sk4fQixRsRl9`.
- Focused local Playwright comparison — passed at 1440×1000 and 390×844 for Filter, Sort, Profile, assignment, access summary, role-edit and role-review states, including Escape closure and no root overflow.
- Focused pending-invitation comparison — passed; application and reference both render the `Staff access` drawer title at both viewports.
- Direct screenshot inspection — completed for the paired captures. The remaining Edit-control difference is the explicit `PD-STF-02` contract boundary above.

No backend behavior, authorization rule, schema, migration, fixture or database state changed. The Profile composition calls the existing Access owner APIs rather than introducing a new authority path.
