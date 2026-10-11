# SA-27 staged attendance correction — 11 October 2026

Owner review on 11 October 2026 **PASSED only the staged layout and normal successful correction journey** at source `f1a06607c9df7176629a436cc7586f27a9d92041`. It does not accept forced recovery or cancellation states, native accessibility, the documented font deviation, production gates or another Administrator workflow. This checkpoint changes presentation and client flow only; it does not alter Attendance persistence, authorization, transaction, locking, receipt or migration contracts.

## Authority and compared state

- Approved HTML: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/flow/SA-27`.
- Measured specification: `docs/execution/VSchool_Execution_Pack/references/approved/implementation-spec/administrator/screens/SA-27-entry.md` and `workflows/SA-27.md`.
- Application: `/admin/attendance/sessions/7c3a79f4-1225-4579-b243-35dd190dcdb6` in the fictional VSchool People demo branch. The route is seed-specific; open Today and choose its submitted session if the fixture ID changes.

The final desktop and mobile captures were directly inspected against the matching reference captures. Both use the three steps, 28 px page title, 18 px stage heading, 40 px desktop fields/actions, 760 px main card, 352 px aside, two-column desktop fields, stacked mobile fields, reference color tokens, action placement and disabled draft presentation. The application adds real authorized history and cancellation links to the approved “Something changed?” card. Its sidebar also lists additional implemented and authorized management destinations. These additions preserve required real operations rather than simulate prototype actions.

## Behavior and focused evidence

The browser probe uses real demo persistence for corrections and route interception only to reproduce response loss, history-read failure and stale-version responses. It verified:

- Back/Continue preserves the selected Student, session, corrected status, reason and review state in the active flow.
- Required stage validation prevents progression; only `Confirm correction` invokes the command.
- A committed response deliberately lost by the browser replays the exact retained body/key and returns the existing result.
- A stale response retains attempted values, loads current records, shows current versus attempted status and requires a fresh review.
- Successful correction persists after reload and immutable history remains separately reachable.
- Cancellation remains reachable after resetting/completing a correction and is locked while a correction draft or unknown outcome exists.
- Desktop 1440×1000, mobile 390×844 and CDP `Emulation.setPageScaleFactor(2)` had no document-level horizontal overflow. This is page-scale emulation, not native browser zoom.

`measurements.json` records computed styles, rendered fonts, overflow results and recovery assertions. `reference-sa-27-desktop.png` / `reference-sa-27-mobile.png` are the authority captures. `application-stage-select-desktop.png`, `application-stage-confirm-desktop.png`, `application-stage-select-mobile.png`, `application-correction-unknown-desktop.png`, `application-correction-stale-desktop.png`, `application-saved-history-unavailable-desktop.png`, `application-stage-final-desktop.png` and `application-cancellation-unknown-desktop.png` show the implemented states.

## Verification and remaining deviation

- Focused TypeScript, ESLint and `git diff --check`: passed.
- `pnpm build`: passed with Next.js 16.3.8.
- `VSCHOOL_DEMO_URL=http://127.0.0.1:3400 node scripts/verify-admin-attendance-local.mjs`: passed all six recovery assertions plus stage retention and layout checks.
- Real-PostgreSQL owner verification was reused from the unchanged Attendance backend: scoped correction/history authorization, current-value derivation, stale concurrency, replay, rollback and immutable revision evidence remain recorded in Attendance CURRENT_STATE.

The reference sidebar renders bundled Nimbus Sans while the application uses the established macOS system fallback; redistribution authority remains unestablished. No font asset or reference was changed. Native 200% browser zoom, VoiceOver/NVDA, TEN-03 and production-release gates remain outstanding. Human acceptance is limited to the staged layout and normal successful correction journey described above.
