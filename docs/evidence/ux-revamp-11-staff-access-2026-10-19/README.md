# UX-11 Staff access directory checkpoint

Date: 19 October 2026 (Asia/Kolkata)

## Scope and provenance

- Base source: `2ab725f`.
- Executable product source: the focused commit containing this record.
- Production build ID: `8ja8iDFjFqxFrusMailL` (`NODE_OPTIONS=--max-old-space-size=4096 pnpm build`).
- Application route: `/admin/users`.
- Shared exact reference: the Administrator Staff directory at `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/staff`.
- Reference relationship: `/admin/users` is an Access-owned extension within the Staff/access family; the pack has no exact standalone access-list screen. The verified directory geometry is reused without claiming pixel identity.
- Schema and migrations: unchanged. Invitation, verified-Employee grant, membership mutation, pagination and branch authorization contracts are unchanged.

## Direct inspection

The populated application was captured and directly inspected at 1440×1000 and 390×844. The first capture exposed initials displaced outside their avatar circles and row-header cells inheriting the column-header background. The shared Staff table recipe now preserves Avatar grid layout and gives body row headers the same surface as adjacent cells. The Staff profiles route was recaptured as the affected shared consumer.

| State | Desktop | Mobile |
|---|---|---|
| Access directory | [application-directory-desktop.png](application-directory-desktop.png) | [application-directory-mobile.png](application-directory-mobile.png) |
| Independent invitation dialog | [application-invitation-desktop.png](application-invitation-desktop.png) | [application-invitation-mobile.png](application-invitation-mobile.png) |
| Manage membership dialog | [application-manage-desktop.png](application-manage-desktop.png) | [application-manage-mobile.png](application-manage-mobile.png) |
| Staff profiles shared consumer | [shared-consumer-staff-profiles-desktop.png](shared-consumer-staff-profiles-desktop.png) | [shared-consumer-staff-profiles-mobile.png](shared-consumer-staff-profiles-mobile.png) |
| Mobile navigation | — | [application-navigation-mobile.png](application-navigation-mobile.png) |

The page is now directory-first: guarded mutations live behind **Grant access**, **Independent invitation**, and a single per-row **Manage** action. Mobile uses labelled access cards, preserves complete role/status information, and has no root overflow. The invite and management dialogs remain bounded to the viewport with keyboard dismissal and focus restoration.

## Verification

- Focused ESLint for the changed component and browser specifications: passed.
- Focused real-PostgreSQL Access directory journey: Chromium and Mobile Chromium passed 1/1 sequentially with one worker.
- Focused IAM invitation/grant/recovery journeys: 3/3 passed across the final interaction changes. The test helper now observes both the repository and isolated standalone mail sinks; resend waits for the committed second invitation instead of querying before the asynchronous action completes.
- Production build with the established 4 GiB Node heap: passed; build ID `8ja8iDFjFqxFrusMailL`.
- Current-source capture: computed Inter, 1440×1000 and 390×844 CSS viewports, device pixel ratio 1, no root overflow, responsive directory composition, mobile drawer focus return and affected Staff profiles consumer passed. Details are in [metrics.json](metrics.json).
- Existing Access unit/PostgreSQL authorization, replay, last-administrator and branch-isolation evidence is reused because no business code, endpoint, persistence or permission changed.

Human visual acceptance remains **PENDING**. This extension has no exact standalone approved reference. Native VoiceOver/NVDA, actual-browser 200% zoom, TEN-03 and production release gates remain pending.
