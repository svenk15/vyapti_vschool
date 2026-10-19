# UX-10 workspace dashboard evidence

Captured 19 October 2026 (Asia/Kolkata) from the focused working tree based on `c9a8f2c8d36787f20ab895a92cbd4af737cdbb7c`. The executable application changes and this record are committed together. The verified production build ID is `ATWQIJNhCYH1x5uX5_Iwg`; the demo serves that build at `http://127.0.0.1:3400`.

This presentation slice changes no schema, migration, owner API, authorization rule, route or seed. Existing synthetic personas and authorized contexts provide all captured data.

## Scope and authority

| Workspace | Route | Reference authority | Result |
|---|---|---|---|
| Administrator | `/admin` | Approved Refined Forest composition and `ADMIN_LANDING_SPEC.md` | Existing conforming implementation retained and included in automated shell coverage |
| Teacher | `/teacher/today` | Approved Teacher `today` populated/empty states | Existing specialized task dashboard retained and recaptured after shared-style changes |
| Parent | `/family?child=…` | Approved selected-child family overview | Primary child summary and three authorized common actions use the shared 2:1 dashboard recipe |
| Student | `/student?student=…` | Approved Student day overview | Priority work, class records, next class and help retain owner behavior in the shared responsive grid |
| Principal | `/leadership` | Principal workflow explorer plus implemented first-release owner projections | Reviewed design extension: technical architecture copy and decorative panels were removed; only real Attendance coverage and authorized quick links remain |

The Principal reference is not an exact production screen. Its captures prove the shared production pattern and truthful current projection; they do not claim pixel identity. Parent prototype summaries without implemented owner data remain omitted. Student room/change/request priorities remain outside this presentation slice.

## Direct visual inspection

- [Principal desktop](principal-desktop.png) and [mobile](principal-mobile.png): summary labels use their full column width, the desktop 2:1 grid aligns, mobile stacks in reading order, and architecture narration is absent.
- [Parent desktop](parent-desktop.png) and [mobile](parent-mobile.png): selected-child context stays primary, common actions form a separate compact rail, and the fixed bottom navigation leaves the page scrollable.
- [Student desktop](student-desktop.png) and [mobile](student-mobile.png): task actions remain adjacent to their records on desktop and stack without clipping on mobile; owner-provided empty and populated states remain distinct.
- [Teacher desktop](teacher-desktop.png) and [mobile](teacher-mobile.png): the specialized date/session composition remains intact after the shared additions.

Inspection covered alignment, hierarchy, text wrapping, action placement, root overflow, desktop sidebar reachability and mobile navigation overlap. Inter is the computed body font in every checked workspace. Human visual acceptance remains pending.

## Verification

| Check | Result |
|---|---|
| `pnpm exec eslint app/leadership/page.tsx app/family/page.tsx app/student/page.tsx scripts/verify-demo-personas.mjs --no-warn-ignored` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm check:docs` | PASS |
| `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` | PASS; build `ATWQIJNhCYH1x5uX5_Iwg` |
| `VSCHOOL_CAPTURE_PERSONAS=1 node scripts/verify-demo-personas.mjs` | PASS; 11/11 current-source states, one browser worker |
| `git diff --check` | PASS |

The browser result is preserved as [persona-verification.json](persona-verification.json). It records computed layout tracks, effective font, overflow, sidebar row height/scroll, mobile focus return and safe action destinations without credentials or session state.

## Remaining gates

Human visual acceptance, actual-browser 200% zoom, native VoiceOver/NVDA, TEN-03 restricted-role/RLS proof and production release remain pending. UX-11 continues with searchable directories; it must not infer completion of unimplemented owner capabilities from this dashboard work.
