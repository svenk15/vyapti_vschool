# Administrator Students correction acceptance table

Implementation source: `8fe84b686a18bc6c43c9d3e80fab9abae47b2806`. Starting evidence HEAD: `e84991b3b468f2a55b8a4e5dbce0a53061b63908`. Human acceptance remains **PENDING**.

| ID | Result | Implemented behavior | Verification and evidence |
|---|---|---|---|
| C01 | COMPLETE | Portal and Guardian mutations record confirmed success before the follow-up read. A failed read locks stale actions, keeps saved feedback, and exposes a GET-only refresh. A genuinely unknown mutation retains its exact payload and key. | Current-source portal refresh test passed at desktop/mobile; `extensions/portal-refresh-pending-*` and `extensions/guardian-refresh-pending-*`. |
| C02 | COMPLETE | Name correction refreshes the People values/version; admission-date correction refreshes the Student value/version. Both retain attempted input and reason, show current-versus-attempted review, and require explicit review before a new keyed submission. A failed current-record read retains the attempt and offers read-only recovery. | Current-source correction test passed at desktop/mobile and persists both reviewed retries; real PostgreSQL stale/concurrency cases passed; `extensions/edit-stale-*`. |
| C03 | COMPLETE | Name and admission date own separate baselines, versions, drafts, reasons and attempts. Saving either updates only its section. The other unsaved correction survives, including in both save orders covered by the focused browser flow. | Current-source correction test passed at desktop/mobile; final self-review removed a page refresh that had remounted and cleared the other draft. |
| C04 | COMPLETE | Unsent Guardian edits use the ordinary discard confirmation. Unknown invite, resend, purpose and removal operations remain bound to their exact resource, payload/version and key; conflicting actions and closure are locked until recovery. | Current-source Guardian browser flow passed at desktop/mobile; exact invitation key retry produced one durable result; `extensions/guardian-invite-unknown-*` and `extensions/guardian-unknown-*`. |
| C05 | COMPLETE | Guardian validation, rejection, unknown and refresh-failure feedback renders in the active drawer; removal feedback renders in its confirmation dialog. Confirmed closure leaves concise Profile feedback. Native dialog Escape is prevented before controlled close handling, preserving unresolved recovery state and focus containment. | Current-source Guardian flow passed keyboard/close checks at desktop/mobile; connected Profile/Guardian regression passed; active-overlay captures above. |
| C06 | COMPLETE | The Profile wrapper is centred within the main content at an approximately 884px maximum. Back link, arrival notice, identity header, card and actions align. `Student portal` remains the stable label; email/status is supporting text. Routine owner/version wording and fixed-Student implementation copy were removed. | `student-onboarding-profile-2026-10-21/application/` covers 1440, 390, 900, 360 and all four themes; screenshots were visually inspected. |
| C07 | COMPLETE | Ordinary Profile, matching Guardian state, matching portal state and active drawer/recovery states are separated from post-registration success. Exact-reference states and shared-pattern extensions are labelled separately. | Exact reference SHA-256 `4a0c5a72b7e5512bfb9b30647b5fb10f82c9c42b04e746fe6f0cae4799792bbe`; evidence paths in the closure README and matrix. |

## Independent self-review

| Review area | Outcome |
|---|---|
| Exact reference use | Verified against `docs/ux/references/student-onboarding-approved/refined-onboarding.html`; Profile/Add/Manage Guardian are direct comparison states. |
| Authorized data and server authority | Existing protected projections and owner commands remain authoritative. No browser scope, data, permission or identity rule was added. |
| URL history | Directory return URL/search state behavior is unchanged and the focused connected journey passed. |
| Accessibility | Labels, alert/status announcements, controlled close, focus containment/restoration and mobile targets were exercised in Playwright. Native VoiceOver/NVDA remains unperformed. |
| Responsive behavior | Inspected at 1440×1000 and 390×844, with 900px and 360px wrapping evidence and no observed root overflow. |
| Business rules | No backend contract, schema, migration or business rule changed. People name and Students admission-date commands remain separate. |
| Recovery | Traced normal success, rejection, stale recovery, unknown exact replay, committed-save/read-failure recovery, close/reopen protection and revoked-read handling in source/tests. |
| Evidence validity | Captures are from the current focused E2E build and fictional fixtures. Extensions absent from the exact mock are labelled shared-pattern evidence. |

## Focused verification

- Focused ESLint: passed.
- `pnpm exec tsc --noEmit`: passed.
- Playwright, one worker and sequential projects: correction + Guardian recovery 2/2 desktop and 2/2 mobile; portal committed-save/read-failure 1/1 desktop and 1/1 mobile; connected onboarding/Profile/Guardian 1/1 desktop and 1/1 mobile.
- Real PostgreSQL: Students correction 4 passed (11 unrelated cases skipped by filter); Guardians 4 passed (2 skipped); Student portal 3 passed (2 skipped).
- Final production build passed with `NODE_OPTIONS=--max-old-space-size=4096`; build ID `WafBOKUaV-hyLbfLdwYXg`.

One mistakenly forwarded Playwright command began an unrelated test before it was interrupted; it is not counted as evidence. Initial browser iterations used a stale isolated build and then a 2 GiB server that exhausted memory. The isolated build was regenerated and the established 4 GiB setting was used before the current-source results above.
