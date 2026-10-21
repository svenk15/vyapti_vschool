# Connected Student onboarding and profile — 21 October 2026

Human visual acceptance is **PENDING**. This checkpoint verifies the bounded Administrator Student onboarding/profile slice; it does not change navigation or claim production readiness.

## Provenance

- Application commit: `4d50c7098f4b383f2fe6e0191a009fbbe70c7a9d`
- Verified E2E build ID: `RbHP6gqz9aguAB0phigaJ`
- Current local demo build ID: `U-xx4H6mfm5PNsPfkcgpN` from documentation checkpoint `642d305253c04d6a765e5e091ff5bae2b53b071a`; application code is unchanged from `4d50c7098f4b383f2fe6e0191a009fbbe70c7a9d`.
- Approved reference source: `refined-onboarding.html` at Sites source commit `ee0006258f5217b04d22f1561551d4516842428b`
- Reference HTML SHA-256: `4a0c5a72b7e5512bfb9b30647b5fb10f82c9c42b04e746fe6f0cae4799792bbe`
- Browser: Playwright Chromium; CSS viewports `1440×1000` and `390×844`; browser zoom was not changed.
- Database: guarded `vyapti_vschool_test`, 119 forward migrations, none pending. No schema or migration changed in this slice.

## Implementation map

| Reference element | Production route/component | Owner command/query | Acceptance check |
|---|---|---|---|
| Add Student surface | `/admin/students/register`, `StudentRegistrationWorkflow` | Students `create`, optional `enroll`; Guardians `authorize` | Connected browser journey and owner-row assertions |
| Existing record mode | same route/component | People exact selection through existing Students registration contract | Existing focused registration evidence remains applicable; no name/email matching added |
| Class placement | same surface, server-supplied options | Students enrollment options and `enroll` | One Enrollment and one first Placement, exact Section and roll value |
| Parent/Guardian setup | same surface | Guardians `canManage` and `authorize` | Rendered only for a current manager; one child access after exact replay |
| Student profile | `/admin/students/:id` | Students detail/history, Guardians list, Student portal list | Current facts, access status and owner links render after reload |
| Add/Manage Guardian drawer | `GuardianAccessManagement` | Guardians authorize/resend/purpose/remove | Focus containment/return, unsaved close, removal confirmation, current access states |

The portable `createStudentOnboardingUseCases` runs registration → optional placement → optional Guardian setup. Each owner retains its own authorization, transaction, evidence and key. A later failure returns completed receipts; retry repeats the exact owner commands so completed effects replay without duplicates. There is no generic receipt store, cross-owner transaction or compensating Student deletion.

## Verification

- `pnpm exec vitest run --config vitest.config.ts test/unit/student-onboarding.test.ts` — 3/3 passed for ordering, registration-stop and later-stage partial evidence.
- Guarded focused Students functional command against real PostgreSQL — 15/15 passed, including exact identity, scope, transaction and replay behavior.
- `pnpm exec tsc --noEmit` — passed on the implemented source.
- Targeted ESLint over all changed TypeScript/TSX files — passed.
- `pnpm check:backend` and `pnpm check:boundaries` — passed after the backend composition changes; subsequent changes were presentation/tests/docs only.
- `env VSCHOOL_E2E=1 NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed; build ID above.
- `env VSCHOOL_E2E_BUILT=1 node scripts/database.mjs e2e test/e2e/students-registration.spec.ts --project=chromium --workers=1 --grep 'completes connected Student onboarding'` — 1/1 passed.
- Same guarded command with `--project=mobile` — 1/1 passed. It asserts the mobile Guardian dialog starts at CSS x=0 and is exactly 390px wide.
- `pnpm check:docs` — the changed links resolve, but the repository check remains non-green for two pre-existing links in dirty `WORKSPACE_PRESENTATION_REVAMP/CURRENT_STATE.md` and `PAGE_COVERAGE.md` to absent `workspace-presentation-route-pass-2026-10-20/README.md` evidence. Those unrelated files were preserved.

The connected journey submits registration, placement and Guardian setup, deliberately loses the committed HTTP response, retries the exact unchanged command, and verifies one Student, one Enrollment, one Placement and one Guardian access. It then checks the profile, unsaved drawer values through Keep editing, accessible discard/removal dialogs, focus return and root overflow.

An accidental broader functional invocation completed 270 tests and exposed one unrelated existing Finance expectation (`RECONCILED` versus `UNRECONCILED`). It is not reported as a green broad suite and was not changed for this slice.

## Local demo

- Entry: `http://127.0.0.1:3400/sign-in`; Student onboarding: `http://127.0.0.1:3400/admin/students/register` after authentication.
- Private fictional administrator credentials: ignored file `artifacts/people-02/private-demo.json`; no credential value is recorded here.
- The health endpoint returned `ready:true`, and a local Playwright smoke signed in through the real form and rendered the `Add student` composition at a `1440×1000` CSS viewport with device-pixel ratio 1.
- `pnpm demo:seed` remained non-destructive and refreshed the existing People, Students and Attendance fixtures, but the aggregate command stopped at the pre-existing Principal Attendance comparison gate (`PRINCIPAL_COMPARISON_REQUIRED`). This partial aggregate seed run is not reported as passed; the existing onboarding demo credentials and records were preserved.

## Direct visual comparison

Reference captures:

- [Add Student desktop](reference/add-desktop.png) / [mobile](reference/add-mobile.png)
- [Student profile desktop](reference/profile-desktop.png) / [mobile](reference/profile-mobile.png)
- [Guardian drawer desktop](reference/guardian-desktop.png) / [mobile](reference/guardian-mobile.png)

Current application captures:

- [Add Student desktop](application/add-chromium.png) / [mobile](application/add-mobile.png)
- [Student profile desktop](application/profile-chromium.png) / [mobile](application/profile-mobile.png)
- [Add Guardian desktop](application/guardian-add-chromium.png) / [mobile](application/guardian-add-mobile.png)
- [Manage Guardian desktop](application/guardian-manage-chromium.png) / [mobile](application/guardian-manage-mobile.png)
- Four-theme Add Student captures: `application/add-{forest,amethyst,porcelain,linen}-{chromium,mobile}.png`.

The final images were inspected directly. The application matches the reference's focused width, three-section form hierarchy, compact actions, profile identity/School record/access composition, 470px desktop drawer and full-width mobile drawer. The placement-detail disclosure is collapsed in the comparison captures while its filled values remain in the submitted command.

## Necessary production differences and remaining gates

- The prototype toolbar, simulated outcomes, fixed names/dates and concept links are excluded.
- The production shell, school context, actual data and server-authorized action visibility remain authoritative.
- The Guardians owner has no relationship column or contact-only aggregate. The application therefore omits the reference relationship selector and cannot save a contact without invitation; it does not fabricate either state.
- Core Parent purposes are fixed by the Guardians owner and shown read-only. The only onboarding option here is the already-designed independent school-notices purpose.
- Profile footer links expose existing authorized history/identity/transfer workflows. They are production-only extensions, not dead reference controls.
- Invitation delivery remains the existing synthetic sink in local/test. Production provider review is pending.
- Actual native browser 200% zoom, VoiceOver, NVDA, human acceptance and TEN-03 remain pending release gates.
