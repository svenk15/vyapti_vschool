# Staff access action alignment — 23 October 2026

This bounded checkpoint compares the production `Staff access` drawer with the frozen Administrator Staff reference at `docs/execution/STAFF_REVIEW/references/approved-20261022/mock/index.html`. Human visual acceptance remains **PENDING**.

## Candidate and scope

- Base commit: `debf6d3966c845a2b09f2e50973549a362de2567`
- Production build ID: `5JUBIQ9N3yPp3sb1kJnKb`
- Demo: `http://127.0.0.1:3400`
- Viewports: 1440×1000 and 390×844 CSS pixels
- Production route: `/admin/teachers/{employeeId}` → **View access**
- Actions inspected: **Change roles**, role-change **Review**, **Suspend access**, and **Revoke access**. Reinstate uses the same corrected action composition as Suspend when the authoritative account state permits it.

No owner command, mutation payload, authorization rule, schema, migration, fixture or recovery behavior changed.

## Findings and corrections

| Finding | Cause | Correction | Evidence |
|---|---|---|---|
| Avatar initials were visibly low/misaligned in every action state. | Broad descendant selectors changed the avatar `span` from its grid layout to `display:block`. | Limited typography rules to the adjacent identity-copy container and explicitly retained grid centring on the 36×36 avatar. | All application/reference `change`, `review`, `suspend` and `revoke` pairs; `measurements.json`. |
| Action content was vertically stretched and the footer sat too far from short forms. | A viewport-derived `min-height` plus grid stretching expanded the identity row and form composition. | Made action forms content-driven with `align-content:start`; action and review footers now follow the content with reference insets. | Desktop/mobile action pairs. |
| Suspend/Reinstate/Revoke omitted reference facts already present in the authorized projection. | The action screen rendered only the consequence and reason. | Added read-only **Sign-in email** and **Current state** facts from the existing Access projection. | `application-suspend-*` and `application-revoke-*`. |
| Mobile Back and primary actions had equal widths. | Generic mobile drawer actions made every button flexible. | Kept Back compact and let the final action occupy the remaining width, matching the frozen reference. | Mobile action and review pairs. |

The summary action icons were already correctly centred: application arrow centres differ from their row centres by at most 0.5 CSS px. After correction, the avatar and identity-copy centres match exactly within the application and differ from the frozen reference by 1 CSS px on desktop and 0.75 CSS px on mobile. The reference uses different fictional names and roles; production continues to show the authorized seeded record.

## Captures

Each state has matching `application-*-desktop.png`, `reference-*-desktop.png`, `application-*-mobile.png` and `reference-*-mobile.png` files in this directory:

- `summary`
- `change`
- `review`
- `suspend`
- `revoke`

`measurements.json` records the CSS viewport, action-row/icon centres, identity row bounds, avatar bounds and identity-copy bounds for both implementations.

## Verification

- Focused Playwright comparison opened the real production drawer, clicked every listed CTA without submitting a mutation, opened the role review stage, and captured matching reference/application states at both viewports: **passed**.
- `pnpm exec eslint components/staff-portal-management.tsx`: **passed**.
- `git diff --check -- app/globals.css components/staff-portal-management.tsx`: **passed**.
- Clean 4 GiB production build: **passed**, build ID `5JUBIQ9N3yPp3sb1kJnKb`.

Functional/security verification from the unchanged STF-04A/B and Staff full-fidelity checkpoints remains applicable. This checkpoint establishes visual interaction coverage for the affected drawer; it does not claim human acceptance, native accessibility completion, TEN-03 completion or production readiness.
