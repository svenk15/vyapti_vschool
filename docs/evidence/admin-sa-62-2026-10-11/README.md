# SA-62 staged safe activity review — direct comparison

## Scope and authority

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/flow/SA-62`.
- Specification: `docs/execution/VSchool_Execution_Pack/references/approved/implementation-spec/administrator/screens/SA-62-entry.md`.
- Application: `/admin/activity`; the earlier advanced directory is retained at `/admin/activity/manage`.
- Tested worktree: based on `f7a7896`; the enclosing commit is the executable checkpoint.
- Database: real `vyapti_vschool_test`, 38 migrations current. No schema or migration change in this slice.

The safe activity backend was not replaced. Every read still rechecks current account, organization, branch membership and `school.manage`, suppresses unknown commands, enforces branch/date/cursor scope and returns only the allowlisted DTO. Privacy requests, impersonation, unrestricted export and deletion remain unavailable.

## Direct visual inspection

The reference and application were captured at 1440×1000 desktop and 390×844 mobile, device scale factor 1. All three matching states were inspected directly:

| State | Reference | Application |
|---|---|---|
| Find activity | [desktop](reference-find-desktop.png) · [mobile](reference-find-mobile.png) | [desktop](application-find-chromium.png) · [mobile](application-find-mobile.png) |
| Inspect evidence | [desktop](reference-inspect-desktop.png) · [mobile](reference-inspect-mobile.png) | [desktop](application-inspect-chromium.png) · [mobile](application-inspect-mobile.png) |
| Confirm | [desktop](reference-confirm-desktop.png) · [mobile](reference-confirm-mobile.png) | [desktop](application-confirm-chromium.png) · [mobile](application-confirm-mobile.png) |

Resolved differences: approved stage order and wording; two-column desktop/stacked mobile fields; action selection; review facts; confirmation copy; side guidance; card and action placement; URL-preserved Back/Forward state; heading focus; selected-action receipt. The safe advanced directory remains reachable after the receipt.

Remaining differences are explicit: the shared production topbar shows its active destination rather than the prototype's two-part breadcrumb; the sidebar lists only implemented, entitled destinations; production uses real scoped institution/branch names; `Save draft and leave` is disabled because no durable SA-62 draft contract exists; the recorded body-font fallback remains; native VoiceOver/NVDA and actual 200% browser zoom were not run. Human visual acceptance is PENDING.

## Verification

- Approved static reference capture: passed; both viewports reported no horizontal overflow.
- `pnpm test:e2e test/e2e/platform-activity.spec.ts --project=chromium --project=mobile --grep "administrator completes"`: 2/2 passed. It covers stage transitions, URL state, focus movement, safe redaction, both selected actions, detail and clipboard acknowledgement.
- `pnpm test:e2e test/e2e/platform-activity.spec.ts --project=chromium --project=mobile --grep "empty, invalid"`: 2/2 passed. It covers genuine empty state, disabled continuation, invalid range, protected API denial and direct teacher page denial.
- The first full focused attempt exposed obsolete test-role selectors (link queried as button; alert title queried as heading) and was stopped before repeating the same mobile timeout. A later run isolated Next's route-announcer alert. The locators were corrected from the accessibility snapshots; product authorization and assertions were not weakened.
- Existing backend evidence remains applicable because no backend, authorization, query, schema or DTO code changed: [SA-COMP-05](../sa-comp-05/README.md).

Human review is PENDING. This checkpoint does not complete privacy/support authority, TEN-03, native accessibility or production release gates.
