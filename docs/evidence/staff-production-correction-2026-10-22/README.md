# Administrator → Staff production correction

Capture date: 22 October 2026 (Asia/Kolkata)
Application commit: `223d62332401f972e7407f0dc977e7e990a1446c`
Normal production build ID: `bPsKDL8Z3tqD1DUJBNreD`
Demo: `http://127.0.0.1:3400` (`/api/health` returned `ready:true`)
Private synthetic credentials: `artifacts/people-02/private-demo.json` (excluded from evidence and package)

The presentation authority is [REFERENCE_FREEZE.md](../../execution/STAFF_REVIEW/REFERENCE_FREEZE.md), frozen prototype commit `ad78b1c95102ed33ecaa938f9a4b29e2c854d0e7` and combined source hash `67ca61b0204bac68c7bc7602e02b3c638305b448d377e79be4bbff9cce474a01`.

## Correction-to-evidence

| Requirement | Result | Evidence |
| --- | --- | --- |
| Confirmed Access save with failed refresh | PASS. The completed mutation form is removed. Close/Escape/reopen retains the committed result; `Refresh details` is GET-only; a new mutation requires `Create another access record`. The focused test observed `POST, GET, GET` and one membership row. UNKNOWN keeps its original-key recovery controls. | [current-source E2E capture](access-saved-refresh-failed-current-source-e2e.png); `test/e2e/access-management.spec.ts` |
| Creation → Profile | PASS. The receipt makes `Open Staff Profile` primary, keeps authorized sign-in setup secondary, validates and carries the directory return query, refuses navigation while UNKNOWN, and retains the receipt with GET-only Profile recovery. | [receipt desktop](created-receipt-desktop.png), [receipt mobile](created-receipt-mobile.png), [Profile desktop](active-profile-desktop.png), `test/e2e/people-employees.spec.ts` |
| Directory composition | PASS for the authorized production scope. Local tabs precede header and toolbar; Teaching and Access are separate; Profile is primary; guarded legacy operations remain under the specifically labelled Manage action; the table caption remains accessible but visually hidden. | [application desktop](directory-desktop.png), [mobile](directory-mobile.png), [900px](directory-900.png), [360px](directory-360.png), [frozen reference](../../execution/STAFF_REVIEW/prototype/evidence-operation-recovery/directory-open-desktop-1440x1000.png) |
| Profile density and labels | PASS for active, ended and no-account supported states. Panels are content-sized, headings no longer create blank bands, and category/state labels are human-readable. | [application desktop](active-profile-desktop.png), [mobile viewport](active-profile-mobile.png), [frozen reference](../../execution/STAFF_REVIEW/prototype/evidence-operation-recovery/profile-content-sized-desktop-1440x1000.png) |
| Teaching eligibility geometry | PASS. Reason spans the form, field gaps/card width/actions match the production reference recipe, and authoritative assignment-impact behavior is unchanged. | [desktop](eligibility-desktop.png), [mobile](eligibility-mobile.png), [900px](eligibility-900.png), [360px](eligibility-360.png) |

## Connected synthetic journey

1. Sign in with the administrator persona in the private file.
2. Open **Staff → Profiles** and apply search/filter/sort; query state is URL-backed.
3. Select **Add staff**, create a fictional Staff profile, and reach the confirmed receipt.
4. Select **Open Staff Profile**, review the content-sized profile, then use **Back to Staff** to restore the validated directory query.
5. Use **Review eligibility**. The final owner command retains expected-version, assignment-impact preview and exact-key replay. PostgreSQL verification covers the protected-assignment rejection.
6. Review Access independently. Unknown recovery reuses its original request. Confirmed-save/read-refresh failure retains the committed result and performs GET-only recovery.
7. A restricted Teacher is denied Staff Profile and management reads in the People PostgreSQL suite.

The repeat-safe fixture command is `node --import tsx scripts/demo-people.ts`. It passed against the existing development database and does not bypass the unrelated aggregate `LDR-02` gate. Current evidence creation used distinct fictional `REV-*` Staff codes and preserved every existing row/history.

## Verification

- `pnpm test:functional test/functional/people-employees.test.ts` — PASS, 14/14 against real PostgreSQL; includes assignment-impact rejection, exact replay and restricted authority.
- `pnpm test:e2e test/e2e/people-employees.spec.ts --project=chromium --workers=1` — PASS, 5/5.
- `pnpm test:e2e test/e2e/access-management.spec.ts --project=chromium --workers=1 --grep "Staff access distinguishes"` — PASS, 1/1 against final source.
- The focused mobile run passed all five People/Staff cases and the Access recovery case. Its aggregate result was 7/8 because an unrelated settings assertion still expects a 28px mobile heading while the current shared mobile contract renders 24px; that failure is not reported as passed or attributed to this correction.
- Changed-file ESLint, `pnpm typecheck`, `pnpm check:boundaries`, and `git diff --check` — PASS.
- Clean `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — PASS, build `bPsKDL8Z3tqD1DUJBNreD`.
- `curl -fsS http://127.0.0.1:3400/api/health` — PASS, `ready:true`.
- `pnpm check:docs` — FAIL on the two pre-existing missing `workspace-presentation-route-pass-2026-10-20/README.md` links in unrelated dirty `WORKSPACE_PRESENTATION_REVAMP` documents. This checkpoint introduced no broken link.

A first normal build reused stale generated CSS and omitted the Profile/eligibility block. Visual inspection found it; the output was preserved outside the repository in `/private/tmp`, then a clean build was produced and recaptured. Only the clean-build images in this directory are final-build captures, except the explicitly named Access E2E capture.

## Visual inspection and provenance

`capture-metadata.json` records 100% Playwright browser zoom (no zoom override), CSS viewport, DPR 1 and computed Inter stack. Desktop/mobile captures are viewport screenshots. Directory checks cover all four themes at 900px: [Forest](directory-theme-forest-900.png), [Amethyst](directory-theme-amethyst-900.png), [Porcelain](directory-theme-porcelain-900.png), and [Linen](directory-theme-linen-900.png).

The demo People school uses self-service invitation mode, so the operator-activation committed-refresh dialog is not reachable there without changing trusted configuration. Its capture is therefore an exact-final-source Playwright/E2E capture against the guarded test database, not a normal-demo-build capture. The behavior is proven through the real server and PostgreSQL; no trust mode was fabricated for presentation.

## Remaining limitations

- Manage remains as a narrow production deviation because it preserves already-guarded category, verified binding and employment operations. The frozen explorer’s Profile-only row does not authorize removing them.
- Prototype controls dependent on PD-STF-01–03 (identity-attestation evidence policy, general Staff corrections and employment-ending consequences) remain absent. STF-01B cross-owner Teaching/Access directory filtering and sorting and rejoining remain out of scope.
- Fixture values and permission-filtered navigation differ from the fictional reference by design.
- Native VoiceOver/NVDA, font portability, TEN-03 production enforcement and human visual acceptance remain PENDING.
