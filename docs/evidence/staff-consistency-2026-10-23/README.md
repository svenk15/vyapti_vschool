# Administrator Staff consistency correction — 23 October 2026

Human visual acceptance remains **PENDING**.

## Candidate and authority

- Working-tree parent: `1664ec7ad3a2eba2f2d8b4a676e380d0ec754b94`
- Production build: `J3vMCFl4lT0S6BW1tO3A5`
- Focused E2E build: `yTvOqpC1W7LlHOAmaIEMU`
- Demo: `http://127.0.0.1:3400`
- Frozen Staff reference: `docs/execution/STAFF_REVIEW/references/approved-20261022/mock/index.html`
- Student consistency reference: existing shared `ListToolbar`, `Checkbox`, Button and drawer recipes.

The browser evidence uses fictional records. Desktop captures use 1440×1000 CSS pixels. The mobile eligibility capture uses the actual 390×844 viewport at device scale 1 and browser zoom 100%; it is intentionally a viewport capture rather than a full-page capture of the covered page.

## Requested corrections

| Request | Result |
| --- | --- |
| Staff Manage consistency | The row icon now uses the Student toolbar's slider glyph. The dialog separates `View` destinations from authorized `Manage` operations and keeps the existing owner commands. |
| Sort icon consistency | Staff uses the same bidirectional sort glyph as the Student directory. |
| Principal explanation | The implementation-only sentence was removed. An assigned Principal role is shown checked and locked because this Access command cannot remove it; School administrator and Teacher remain editable. |
| Required reason | Required Select/TextArea controls expose a visible `*`; Change roles and the supported Employment edit disable save until a reason is entered. |
| Personal and Employment Edit | Profile exposes an Employment Edit drawer for the already approved Employee-category correction, including exact replay and version checks. Personal editing and other Employment mutations remain excluded because PD-STF-02 has no approved mutable-field/authority/history contract. |
| Eligibility composition | `Review eligibility` now opens from Staff Profile in a focused drawer. Review, assignment impact, acknowledgement, exact replay and final save remain the existing Academics workflow; the standalone route remains only as a compatible deep link. |
| Role summary/editor parity | A three-role test fixture verifies Principal, School administrator and Teacher all appear. Principal is checked/disabled; the two roles owned by the command remain editable. |

## Verification

- `pnpm exec eslint` over the changed TypeScript/TSX files — passed.
- `pnpm exec tsc --noEmit --pretty false` — passed.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed from a clean generated `.next` directory.
- `VSCHOOL_E2E=1 NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed from a clean generated `.next-e2e` directory.
- Focused Chromium, one worker:
  - mixed-role Staff lifecycle and Profile drawer: 1/1 passed;
  - Employment category with required reason: passed;
  - dated eligibility with exact replay: passed;
  - invitation resend/lost-response/failed-refresh recovery: 1/1 passed.
- Development and test schemas: 122 migrations applied, none pending during focused browser verification.
- Demo health: `/api/health/live` returned `alive: true`.

Two stale selector failures and one stale generated E2E build were diagnosed rather than treated as product failures. The generated `.next` and `.next-e2e` outputs were rebuilt; no database was reset and no application records were removed.

## Evidence index

- [Manage dialog](manage-desktop-1440x1000.png)
- [Staff Profile](profile-desktop-1440x1000.png)
- [Employment edit](employment-edit-desktop-1440x1000.png)
- [Eligibility drawer — desktop](eligibility-inline-desktop-1440x1000.png)
- [Eligibility drawer — mobile viewport](eligibility-inline-mobile-390x844.png)
- [Staff access](access-desktop-1440x1000.png)
- [Change roles — ordinary fixture](change-roles-desktop-1440x1000.png)
- [Change roles — Principal/Admin/Teacher fixture](change-roles-principal-chromium.png)
- [Capture metadata](capture.json)

No schema, migration, seed, permission or owner-domain rule changed. TEN-03, native accessibility, production readiness and human acceptance remain pending.
