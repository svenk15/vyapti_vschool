# UX-12 Learning record details

Status: **ENGINEERING VERIFIED / DIRECT INSPECTION COMPLETE / HUMAN REVIEW PENDING**

This checkpoint covers the implemented Teacher publication detail, Parent published-assignment detail, and Student assignment detail for the connected synthetic assignment `Local habitats field notes`.

## Source and state

- Tested working tree: implementation change on base `ef528ff`; the focused commit containing this record is the executable checkpoint.
- Standard production build: `AXMCiGbnvOfm2hphYv8U5` using the repository's 4 GiB build configuration.
- Demo: `http://127.0.0.1:3400`, started with `pnpm demo:start` so the documented synthetic release manifest is present.
- Data: the existing connected Learning fixture and separate authorized Teacher, Parent, and Student accounts. No grant, owner data, schema, migration, or seed contract changed.

## Direct visual review

The current Teacher, Parent, and Student detail states were captured at 1440×1000 and 390×844. All have computed Inter and zero root overflow. The Teacher and Student captures were produced on build `W4fweDwPT7U_tJ7747JKm`; their source and shared styles are unchanged by this checkpoint. The corrected Parent captures and `parent-final-metrics.json` were produced on build `AXMCiGbnvOfm2hphYv8U5`.

- Teacher: `application-teacher-desktop.png`, `application-teacher-mobile.png`
- Parent corrected: `application-parent-desktop.png`, `application-parent-mobile.png`
- Student: `application-student-desktop.png`, `application-student-mobile.png`
- Measurements: `metrics.json`, `parent-final-metrics.json`

The approved pack supplies workflow/explorer states rather than exact production detail pages for these three routes. Comparison therefore uses the established Learning/detail recipe and is labelled a shared-pattern design extension. Existing reference captures remain at:

- `docs/evidence/learning-publication-2026-10-15/reference-teacher-tea27-{chromium,mobile}.png`
- `docs/evidence/learning-publication-2026-10-15/reference-parent-par20-{chromium,mobile}.png`
- `docs/evidence/learning-publication-2026-10-15/reference-student-assignments-{chromium,mobile}.png`

Direct inspection found one concrete defect in the Parent route: the two record cards touched and its notice used internal release terminology. The final page uses the shared 24px stack and concise school-family wording while preserving the same read-only projection and non-disclosure boundary. Teacher publication and Student assignment details retained clear hierarchy, state-specific actions, responsive composition, and return navigation.

## Verification

- `pnpm exec tsc --noEmit` — passed.
- `pnpm exec eslint 'app/family/learning/[id]/page.tsx'` — passed.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed, build `AXMCiGbnvOfm2hphYv8U5`.
- Explicit Parent desktop/mobile browser capture — passed: protected route rendered the intended assignment, corrected copy was present, and root overflow was zero.
- The current Learning owner behavior remains covered by the unchanged LEA-03/LEA-04 and UX-11 real-PostgreSQL/browser evidence. It was not rerun for this presentation-only card-spacing/copy change.

The initial demo restart omitted `VSCHOOL_RELEASED_MODULES`, and the protected route correctly returned `Access unavailable`. The database diagnostic confirmed the accepted Parent link, exact Learning purpose, active enrollment, school, entitlement, and activation were intact. Restarting through `pnpm demo:start` restored the intended runtime configuration; no authorization fallback or data repair was introduced. A subsequent `pnpm demo:seed` attempt stopped safely when the existing synthetic operator prerequisites were unavailable and did not modify this Learning contract.

Human visual acceptance, native VoiceOver/NVDA, actual-browser 200% zoom, TEN-03, and production release remain pending.
