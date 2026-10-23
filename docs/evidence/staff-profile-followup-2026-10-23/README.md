# Staff Profile focus and Teaching assignments follow-up

Date: 23 October 2026 (Asia/Kolkata)

Application base at capture: `6f1cfc46e611675126b56b9c86ede5468559aeba`, plus the focused Staff Profile changes in this checkpoint. Production build: `Rq88qlPDMwRwVckIG3SGC`. Demo: `http://127.0.0.1:3400`.

## Findings and corrections

- `Proposed correction experience. Fields and editing permissions require approval.` is an obsolete reviewer annotation in the frozen prototype at `docs/execution/STAFF_REVIEW/references/approved-20261022/mock/app.js`. It is absent from the production Staff Profile. The frozen reference was not altered. PD-STF-02 is now approved and production exposes the guarded People correction implemented in the preceding checkpoint.
- Focused Staff form controls previously inherited an outward focus offset that reached the label area. The drawer now retains a visible 2px focus outline at offset 0 with 12px rendered label-to-control separation (10px clear beyond the outline in the inspected Chromium state).
- `View assignments` was hidden for Staff with no current assignments. It is now shown whenever the scoped Academics projection is available; an empty projection opens the same drawer with `No current teaching assignments.` and the authoritative eligibility facts. An unavailable/unauthorized projection still exposes no action.

## Evidence

- [Before inspection](before-inspection.json) records one assigned profile with the CTA and three unassigned profiles without it, plus the prior focus geometry.
- [Focused Personal drawer after](after-focused-personal-desktop.png) shows the corrected focus clearance.
- [Empty assignments desktop](after-assignment-empty-desktop.png) and [mobile](after-assignment-empty-mobile.png) show the restored action result for an unassigned Staff member.
- [After inspection](after-inspection.json) records the CTA on all four authorized synthetic profiles, the final focus geometry and zero occurrences of the obsolete prototype annotation.

The screenshots use fictional local demo data. Human visual acceptance, native accessibility review, TEN-03 and production readiness remain pending.

## Verification

- `pnpm exec eslint app/admin/teachers/[id]/page.tsx components/staff-profile-actions.tsx test/e2e/people-employees.spec.ts`
- `pnpm typecheck`
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build`
- `pnpm test:e2e test/e2e/people-employees.spec.ts --grep "Staff Profile saves authorized Personal details" --project=chromium --workers=1` — 1 passed on a freshly rebuilt `.next-e2e` candidate.
- Desktop 1440×1000 and mobile 390×844 screenshots were inspected directly.
