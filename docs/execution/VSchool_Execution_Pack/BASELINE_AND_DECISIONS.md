# Baseline and decisions

## Observed in the shared repository snapshot
- Next.js 16.3.8, React 19.2.8, TypeScript 5.9.3, Prisma 7.10.0, NextAuth 4.24.15, PostgreSQL; Node 24 and pnpm 11.25.0. Keep the actual lockfile. These are snapshot versions, not upgrade recommendations.
- Portable backend already exists under backend/modules; factories under backend/composition; Next hosting seams under lib/server; browser DTOs under shared/contracts.
- Real owner implementations exist for access, tenancy, branding, academics, people, students, imports, attendance and reporting. Reuse their facades and transaction guards.
- Existing UI frames: components/admin-portal-frame.tsx, teacher-portal-frame.tsx and portal-navigation-group.tsx. Existing server menu: lib/server/admin-navigation.ts. Existing primitives/forms/interactive/table controls under components/ui.
- `RoleCode` in shared/contracts/access.ts contains SCHOOL_ADMIN and TEACHER only. OperatorPrincipal is a trusted server/CLI type, not proof of a browser operator login. Parent, student and principal portal authentication must not be faked by exposing an existing admin session under another URL.
- Snapshot has 51 Prisma models. SQL migrations carry additional checks; schema.prisma alone is not the full database contract.
- Historical evidence records TEN-03 unfinished; no production readiness is claimed. DS-02 native accessibility and visual review remain separate evidence. Local demo may proceed with synthetic data under the previously authorized demo scope. Application authorization remains mandatory.
- Root CURRENT_STATE.md includes stale introductory baseline prose. Module CURRENT_STATE and docs/EXECUTION_INDEX.md are authoritative; do not restart already implemented modules from that introduction.

## Binding decisions for this implementation overlay
EX-ADR-001 — Extend the existing modular monolith. No restart, wholesale ORM/repository rewrite, service split, JPA/DAO layer or new UI framework.
EX-ADR-002 — The uploaded all-design-packs archive with the approved navigation-only change is the visual reference. Its page bodies remain the target; do not use the rejected enhanced page redesign. Reference prototypes are fictional UI behavior, not production permission or persistence code.
EX-ADR-003 — Foundations are limited to immediately consuming slices. Build shell, list toolbar, drawers and action-state presentation once; do not pre-create every future database entity.
EX-ADR-004 — Implement by backend owner and expose it through multiple persona views. Parent/Teacher/Principal are workspaces, not duplicate Attendance databases.
EX-ADR-005 — First delivery is existing school-admin/teacher workflows. Operator UI and additional identities enter after explicit server authentication and grant contracts exist. Their design tasks are tracked, never silently omitted.
EX-ADR-006 — Separate implementation verification, human review and production release. Continue after a verified slice with review PENDING; never turn pending reviews into PASSED. Preserve unresolved security release gates.
EX-ADR-007 — New tables use the existing owner spelling: e.g. vs_academics_*, not a new vs_academic_* convention. Proposed timetable names in references need canonical reconciliation before migration. Reuse equivalent owner tables.
EX-ADR-008 — Existing public API, idempotency and error contracts remain authoritative. Do not introduce a generic response wrapper that breaks existing clients. New shared types in this pack are presentation contracts, not replacement business DTOs.
EX-ADR-009 — Keep module entitlement × branch activation × release availability × current capability × resource authorization server-enforced. Branding and hidden menu entries never confer access.
EX-ADR-010 — No implicit authorization expansion to satisfy a prototype. Record an explicit module design gap and continue unrelated ready work. No institution-admin-to-operator escalation.

## Files to inspect at EX-00
AGENTS.md; START_HERE.md; docs/AGENT_RUNBOOK.md; docs/EXECUTION_INDEX.md; docs/VSchool_Bible.md; docs/BACKEND_EXTRACTION.md; docs/DATABASE_DESIGN.md; docs/database/TABLE_REGISTRY.json; module CURRENT_STATE files; package.json; prisma/schema.prisma and migration head; current git status/diff.
