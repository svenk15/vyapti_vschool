# Staff source and screenshot inventory

## Production source inspected at the audit baseline

| Concern | Source | What is reusable | Gap represented in this package |
|---|---|---|---|
| Administrator navigation/shell | `app/admin/layout.tsx`, `lib/server/admin-navigation.ts`, `components/admin-portal-frame.tsx`, `components/portal/portal-shell.tsx` | Server-filtered destinations, independent route guards, accessible desktop/mobile shell | Keep unchanged; proposed screens compose inside it |
| Staff local navigation | `components/admin-staff-navigation.tsx`, `components/admin-local-navigation.tsx` | Profiles, Access, conditional Availability | Profile becomes an Employee-context destination without removing existing routes |
| Directory and manage dialog | `components/people-workspace.tsx` | Scoped list, safe state badges, current guarded actions | Query attributes/filter/sort/URL state; dedicated profile; recovery |
| New Staff | `components/staff-create-workflow.tsx` | Current staged new-Person create and real People command | Single-page composition, existing-Person exact mode, browser recovery |
| People application/infrastructure | `backend/modules/people/application/employees.ts`, `backend/modules/people/infrastructure/employees.ts` | Scoped owner query, create/category/Teacher/bind/end commands, transactions and receipts | Proposed queries/commands are in `PROPOSED_LLD.md` |
| Browser contracts | `shared/contracts/people.ts` | JSON-safe current Employee DTO | Proposed directory/profile/recovery DTOs need deliberate extension |
| Access grant/change | `components/staff-grant-workflow.tsx`, `components/staff-access-change-workflow.tsx`, Access application/infrastructure | Verified Employee anchor, exact-key retry, membership lifecycle and last-admin guard | Employee-context invitation states, reasoned resend composition, refresh/stale recovery |
| Generic Access management | `components/access-management.tsx` | Existing directory and invitation delivery visibility | Current helper conflates confirmed mutation + refresh failure |
| Academics Teacher/assignment | Academics TeacherProfile and assignment application/infrastructure; `/admin/classes` | Real Teacher and dated assignment ownership | Dated eligibility interval and Staff-context projection |
| Availability/cover | People availability and Academics cover owners | Verified explicit grants and exact occurrence lifecycle | Conditional handoff only; no new rule |
| Persistence | `prisma/schema.prisma` and forward migrations | Current Person, Employee, Teacher, TeacherAssignment, Access and availability rows | Proposed future tables are listed but not migrated |

## Approved authority

- Directory measurements: `docs/execution/VSchool_Execution_Pack/references/approved/implementation-spec/administrator/screens/module-staff.md`.
- Workflow explorer: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html`, states `#/staff`, `#/staff/:id`, SA-13–SA-17.
- Workflow contracts: the same pack’s `docs/modules/staff/DESIGN.md` and `TASKS.md`.
- Production geometry: `docs/ux/UX_CONSTITUTION.md` and `docs/ux/CONTROL_SIZING_CONTRACT.md`.

## Exact reused presentation baseline

| Pattern | Accepted local reference | Production source reused | Prototype treatment |
|---|---|---|---|
| Administrator shell and navigation | `docs/execution/UX_REVAMP/ADMIN_NAVIGATION_SIMPLIFICATION.md`; accepted Concept 1 at `docs/ux/references/student-concepts/concept-1.svg` | `components/portal/portal-shell.tsx`, `components/admin-portal-frame.tsx`, `app/globals.css` `.portal-*` rules | 240px desktop sidebar, 64px top bar, 44px navigation targets and existing mobile drawer geometry; no new navigation model |
| Staff local navigation | Accepted transparent Concept 1 local-link recipe recorded in `ADMIN_NAVIGATION_SIMPLIFICATION.md` | `components/admin-local-navigation.tsx`, `components/admin-staff-navigation.tsx` | Profiles, Access and conditional Availability use the same underlined text-link treatment |
| Staff directory | `implementation-spec/administrator/screens/module-staff.md` and `VSchool_School_Admin_Review.html#/staff` | `components/people-workspace.tsx`; `.staff-directory*` in `app/globals.css` | Open responsive table/card directory with one Profile action; reviewer-only filter/sort simulation does not assert production query support |
| Theme tokens | `docs/execution/UX_REVAMP/TOKENS.md` | `app/globals.css` `--vs-*` semantic variables | Forest, Amethyst, Porcelain and Linen values are copied exactly into the isolated prototype; geometry is constant |
| Typography | `docs/execution/UX_REVAMP/TOKENS.md` Typography | `app/layout.tsx`, `app/fonts/InterVariable.woff2`, `app/fonts/LICENSE.txt` | Same font asset and SIL OFL are bundled at `prototype/assets/`; expected SHA-256 values are recorded below |

Bundled font SHA-256: `693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3`. Bundled license SHA-256: `262481e844521b326f5ecd053e59b98c8b2da78c8ee1bdbb6e8174305e54935a`. The remaining verification question is the actual resolved browser face; a system fallback is not accepted as exact typography.

## Existing production evidence used by the audit

| Evidence | Coverage | Limitation |
|---|---|---|
| `docs/evidence/ex-06/` | People/Access PostgreSQL and Staff access browser journeys | Earlier checkpoint |
| `docs/evidence/admin-staff-access-2026-10-11/` | SA-13–SA-17 reference/application states | Later shared CSS means this is not a current visual pass |
| `docs/evidence/ux-revamp-11-staff-directory-2026-10-19/` | Directory desktop/mobile and focused real API journey | Does not include the proposed profile/recovery screens |
| `docs/evidence/ux-revamp-11-staff-access-2026-10-19/` | Access directory desktop/mobile | Does not close reasoned resend/recovery gaps |
| `docs/evidence/principal-f07-availability-2026-10-17/` | Availability owner/UI | Conditional workflow only |
| `docs/evidence/principal-f07-cover-2026-10-17/` | Cover owner/UI | Conditional exact-occurrence workflow only |

Historical screenshots in the external ZIP are exported from audit commit `e8d6930`, avoiding unrelated working-tree image modifications. Prototype screenshots describe the new documentation artifact and are indexed in `PROTOTYPE_EVIDENCE.md`.
