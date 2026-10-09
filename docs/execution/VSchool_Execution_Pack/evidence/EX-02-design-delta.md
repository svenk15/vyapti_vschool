# EX-02 design delta — shared left navigation

Date: 9 October 2026. Status: READY for implementation. Human review: PENDING.

- **Targets:** approved enhanced school-administrator and teacher navigation from the pinned static references; production routes `/admin/**` and `/teacher/**`.
- **Use case:** render only destinations already authorized and released by the server, retain authorized branch switching, expose a reachable account identity and real sign-out, and provide the same grouped shell on desktop and mobile.
- **Presentation files:** `components/portal/portal-shell.tsx` owns the shared client interaction; `admin-portal-frame.tsx` and `teacher-portal-frame.tsx` remain thin role wrappers; `portal-navigation-group.tsx` retains link/icon mapping; `app/globals.css` owns shell tokens and responsive composition.
- **Server files:** `lib/server/admin-navigation.ts` retains route policy and server filtering. Its request-local eligibility memoization is keyed by both module and capability so one permission result cannot authorize another route.
- **Owner/transport contracts:** reuse `AdminHome`, `accountGateway.getHome`, `moduleGateway.canUseAtScope`, `BranchSwitcher` and the existing Access sign-out. No new owner operation, browser authority, role or route is introduced.
- **Persistence:** read-only account, membership, role, entitlement, activation and branding resolution through existing owners. No direct table access, write, transaction, key, version, schema or migration change.
- **Authorization:** page/API guards remain authoritative. Navigation begins with current `home.capabilities`; module routes additionally require the current organization/branch, release, entitlement, activation and the route's own capability. Teacher navigation contains only the implemented teaching-day route.
- **Failure states:** missing/revoked home continues to use the existing protected-page fallback; failed module eligibility hides only the affected destination; failed branch-directory loading remains visible in the context control; failed sign-out remains an alert. Mobile Escape and navigation restore focus to the menu trigger.
- **Focused verification:** unit coverage for capability-aware memoization; lint/type/boundary/unit checks; focused administrator/teacher Playwright at desktop/mobile, including link filtering, teacher denial of administrator data, mobile focus containment/return and sign-out; visual screenshots inspected against EX-01. Existing page bodies must retain their layout outside the shell.

Open release gates are unchanged: native VoiceOver/NVDA and native 200% zoom remain DS-02 evidence; TEN-03 remains incomplete and blocks production/real-client data.
