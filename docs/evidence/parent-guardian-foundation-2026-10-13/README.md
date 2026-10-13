# Parent/Guardian simplified foundation evidence

Captured 13–14 October 2026 from a working tree based on `20cdd8b5ce9ac73bb5f50719660c39db2912d193`. Human acceptance is **PENDING**.

## Authority and scope

- Product/engineering contract: `docs/modules/guardians/DESIGN.md` and `TASKS.md` FAM-01–FAM-04.
- Approved UX authority: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Parent_Guardian_Design/VSchool_Parent_Guardian_Review.html`.
- Reference SHA-256: `3f5fdc44d4d48dbb794dfa9cef61b1f09adbafadb737d73cbc99cdb71cc21f9e`, matching `implementation-spec/SOURCE_MANIFEST.json`.
- Application routes: `/admin/students/:studentId`, `/family/invite`, `/family`, `/family/children`, `/family/attendance`, `/family/timetable`, `/family/account`.

## Functional and security evidence

- `pnpm test:functional test/functional/guardians.test.ts`: real `vyapti_vschool_test`, 47 migrations, 5/5 tests passed. This covers designated manager and self denial, no guardian staff membership, replay/conflict, invitation lifecycle, wrong-account handling, acceptance/removal concurrency, delivery failure, per-child revocation, child tampering, date bounds and strict mixed-affiliation recovery.
- `VSCHOOL_E2E_BUILT=1 pnpm test:e2e --project=chromium test/e2e/guardians.spec.ts --timeout=90000`: 1/1 passed.
- `VSCHOOL_E2E_BUILT=1 pnpm test:e2e --project=mobile test/e2e/guardians.spec.ts --timeout=90000`: 1/1 passed.
- `pnpm demo:seed`: completed and preserved existing data; credentials/tokens were written only to the ignored private artifact.
- `pnpm lint`: passed.
- `pnpm check:docs`: passed; 30 task documents, links, design coverage, status values and dependency graph valid.
- `pnpm check:db-design`: passed; 67 registered table contracts agree with physical names, owner prefixes, LLDs and Prisma mappings.
- `pnpm check:boundaries`: passed; portable backend and browser-contract boundaries hold.
- `pnpm check:backend`: passed.
- `pnpm build` and `VSCHOOL_E2E=1 pnpm build`: passed, including TypeScript and production route generation.
- `pnpm exec prisma migrate status`: development database has 47 migrations and is up to date. Both focused test harnesses also reported 47 migrations with none pending in `vyapti_vschool_test`.

No unexecuted native accessibility check is represented as passed.

## Direct visual comparison

The reference and application were served independently and captured through Playwright at 1440×900 and 390×844. Images were inspected directly for shell geometry, typography scale, colors, spacing, icons, action placement, responsive composition and clipping.

| State | Reference | Application | Result |
|---|---|---|---|
| Home desktop | `reference-home-desktop.png` | `application-home-desktop.png` | Shared dark shell, child context, hierarchy and cards align; application shows only real fixed-bundle data. |
| Home mobile | `reference-home-mobile.png` | `application-home-mobile.png` | Mobile header/drawer/bottom navigation and child selector fit without horizontal overflow. |
| Invitation desktop/mobile | `reference-invitation-*.png` | `application-invitation-*.png` | Reference invitation hierarchy retained; real password/confirmation stepper is a narrow required extension absent from the prototype. |
| Attendance desktop/mobile | `reference-attendance-*.png` | `application-attendance-*.png` | Real submitted records use the shared table/card compositions. Prototype explanation/query actions are omitted because those request-owner contracts are outside this slice. |
| Timetable desktop/mobile | `reference-timetable-*.png` | `application-timetable-*.png` | Published owner data, week selection and previous/next navigation are real. Rooms, breaks and change notices are not fabricated because the Parent projection does not expose them. |

The approved prototype review toolbar, fictional Greenwood values and hard-coded academic year are not production content. Prototype Messages, Requests, absence explanations and attendance queries remain separately gated workflows rather than dead controls. The application retains the documented Inter/system fallback because provenance for the embedded reference font files is not established; exact font portability remains open.

## Demo state

- Start: `pnpm demo:start`
- Seed: `pnpm demo:seed`
- Entry: `http://127.0.0.1:3400/sign-in`
- Private credentials/tokens: `artifacts/guardians-01/private-demo.json` (ignored; never commit or print values).
- The retained published lesson is in the week beginning 26 October 2026. Use the Parent Timetable week picker or Next week control; seed reruns do not move historical records to today.

## Remaining gates

Human visual/behavior acceptance, native VoiceOver/NVDA, font portability, production email/provider review and TEN-03 RLS/context proof remain pending. TEN-03 still blocks production and real-client data.
