# Shared VSchool experience system — tasks

Read DESIGN.md and Bible v4.1. These are vertical slices; previews do not prove persistence or authorization.

## DS-01 — Review and adopt the shared UI foundation

Depends on: FND-01

### Implementation instructions

Use the included component gallery. Review all controls and three palettes, data table sort/search/pagination, dialog/drawer keyboard behavior, tabs/errors/loading, branding and responsive composition. Improve components centrally, not by module-specific duplication. Record visual owner acceptance separately from automated checks; update UI inventory and token contracts.

### Acceptance and test strategy

Run pnpm check, applicable PostgreSQL functional and Playwright suites, and production build. Capture source fingerprint/commit and actual test commands/exits. Validate the documented negative cases, not only the happy path. Update module state and affected Bible/ADRs in the same checkpoint.

### Demo and checkpoint

Visit /design-system; change palettes; search/sort/page sample table; open modal, Escape, verify focus; use arrow-key tabs; inspect mobile form and error state.

Start/check the server, give URL and steps, request user review, and mark review PENDING. Do not mark human acceptance until actual feedback.

## DS-02 — Validate production screen recipes and accessibility

Depends on: DS-01, ATT-02, BRD-02

### Implementation instructions

Integrate shared components into real protected teacher/admin screens. Verify async unknown/conflict/success states and authorized menus, keyboard order, 200% zoom/360px/high contrast, reduced motion, VoiceOver and NVDA with recorded results. Add required server table and institution-switcher composition. Specialized future widgets remain gated before their consuming module, no claim all are already implemented.

### Acceptance and test strategy

Run pnpm check, applicable PostgreSQL functional and Playwright suites, and production build. Capture source fingerprint/commit and actual test commands/exits. Validate the documented negative cases, not only the happy path. Update module state and affected Bible/ADRs in the same checkpoint.

### Demo and checkpoint

Complete login → branch switch → attendance submission using keyboard and mobile; demonstrate conflict recovery, labels and same component styles across setup/roster/reports.

Start/check the server, give URL and steps, request user review, and mark review PENDING. Do not mark human acceptance until actual feedback.
