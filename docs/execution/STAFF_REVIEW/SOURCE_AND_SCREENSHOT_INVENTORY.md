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
