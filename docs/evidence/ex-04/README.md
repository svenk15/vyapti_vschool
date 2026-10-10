# EX-04 real school entry evidence

Implementation source: `9d1178209d29d6dcdc3a71461890d3b6af3e97fb`. Human visual review is PENDING.

## Executable outcome

- Generic and published school sign-in share one real credential form with approved field labels, compact password reveal, account-help placement, generic rejection and password clearing.
- Public branding remains recognition only. Successful credentials route through `/account`, where current server authorization sends administrators to the admin workspace and exposes teaching navigation only when the teacher has live Attendance capability at the current branch.
- Recovery keeps the non-sensitive email available and focuses the generic response. Invalid invitation/reset outcomes clear fragment tokens and password fields before focusing recovery guidance.
- Account activation, invitation, recovery, session revocation, CSRF/origin handling and Access transactions were not changed.

## Verification

- `pnpm lint` — passed.
- `pnpm typecheck` — passed.
- Focused real-PostgreSQL Playwright command: `pnpm test:e2e test/e2e/access.spec.ts test/e2e/access-management.spec.ts test/e2e/branding-management.spec.ts test/e2e/iam04.spec.ts`.
- First run: 22/24 passed. The two failures came from an added assertion that assumed a TEACHER-role fixture without an Attendance entitlement should receive teaching navigation. The rendered safe account state showed that authorization correctly withheld it.
- Corrected focused rerun: `pnpm test:e2e test/e2e/access-management.spec.ts` passed 4/4 across desktop/mobile. Together, all 24 affected cases pass on the implementation source.
- Both runs used `vyapti_vschool_test`, confirmed all 31 migrations current, and built the production application.
- `pnpm check:docs` passed for the 268-workflow matrix checkpoint.
- `pnpm check` passed after the state update: lint, typecheck, documentation, 51-table database design, extraction boundaries, backend compilation and 111/111 unit tests.

No functional persistence suite was repeated because no Access application, repository, transaction or schema behavior changed. Existing revocation, recovery and invitation behavior was exercised through the real API and PostgreSQL browser journeys.

## Visual review

The generic and live published-brand screens were inspected at 1440×1000 and 390×844. The form remains centered and bounded; title hierarchy, field alignment, help placement and primary action are clear; password reveal does not resize the form; mobile screens have no horizontal overflow. The unavailable teacher account state was also inspected and exposes no teaching destination.

Files:

- `generic-sign-in-chromium.png`, `generic-sign-in-mobile.png`
- `branded-sign-in-chromium.png`, `branded-sign-in-mobile.png`
- `teacher-account-unavailable-chromium.png`, `teacher-account-unavailable-mobile.png`

Native VoiceOver/NVDA and native 200% browser zoom remain separate DS-02 release evidence.

## Manual demo

1. Run `pnpm demo:seed`; it reuses the fictional local records and preserves private credentials.
2. Open `http://127.0.0.1:3400/sign-in`. Use `adminEmail` and `password` from `artifacts/people-02/private-demo.json`. Expect the authorized administrator workspace.
3. Sign out and open the published school sign-in URL from the Branding workspace. Expect the school identity and palette; the same authorized administrator credential reaches only its own branch.
4. Sign out and use `teacherEmail` and `teacherPassword` from the same private file. Expect the account/teaching entry with only teacher navigation; open **My teaching day**.
5. Submit one wrong password. Expect one generic focused error, the email retained and password cleared. Open **Need help signing in?**, submit an unknown fictional `@vschool.example` address, and expect the same generic recovery response.

No private credential or token is committed. TEN-03 and native accessibility remain release gates.
