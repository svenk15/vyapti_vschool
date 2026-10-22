# Approved Staff implementation handoff — 22 October 2026

This package freezes the user-approved Administrator Staff mocks at Site source commit `fc33c8b991134ade6d02e27fbe467ef67d86b085`. It is a design implementation task, not approval of outstanding product/security decisions. Approval covers the mock composition; it does not constitute acceptance of production behavior or simulated recovery semantics.

Open `mock/index.html` locally, or serve the `mock` folder with an existing local static server. No package install, external font, login or hosted URL is required. The hosted preview is https://vschool-staff-workflows.ven268.chatgpt.site . Use the local files as the frozen authority even if that Site changes later.

Read EXECUTION_PROMPT.md first. `REFERENCE_MANIFEST.json` records every supplied file's SHA-256. The executable mock is authoritative for presentation. The documents under supporting are historical design context: their old approval wording, old headings and earlier pagination recipes are superseded by this file and EXECUTION_PROMPT.md. Existing approved repository owner contracts remain authoritative for behavior and permissions.

## Approved final details
- Staff Profiles and Staff access remain separate local destinations.
- Staff columns: Name, Category, Employment, Teaching, Access, Actions.
- Access columns: Account, Roles, Account status, Branch access, Invitation, Actions.
- Name and Account headings align with the person text after the avatar, not the avatar edge. Actions heading and actions are left-aligned.
- Name opens Profile; Manage offers contextual actions. Keep their different purposes.
- Personal and Employment edits are scoped to their sections. Save and Cancel are concise labels. Do not add a misleading global Edit Staff command.
- Preserve the exact supplied Forest colours, bundled Inter, inline SVGs, density, spacing and content-sized panels. Other existing themes use existing semantic tokens.
- Pagination: default 25; 25 / page, 50 / page, 100 / page; range 1–25 of 36 at left; chevrons at right; no redundant Page X of Y, Rows or Showing. Accessible arrow names and touch targets remain required. At 25 or fewer total results show only the count. Keep size selection available when a dataset exceeds 25 even if a larger selected size fits all results.
- The actual mock tables have 36 fictional Staff records and 42 Access records so pagination is visible. No production fixture count is prescribed. `mock/pagination-review.html` provides isolated illustrative totals only.
- Staff access review scenarios preserve distinct global-account, branch-membership, invitation and delivery states. They are simulations, never production authority.

Do not copy the mock's JavaScript data stores, simulated grants, trust-mode selector, outcome selector or fictitious command results into production.
