# Principal leadership tasks

## LDR-01 — explicit Principal branch workspace

Dependencies: current Access/Tenancy/session/context foundations and shared portal shell.

Acceptance criteria:

1. A verified operator can add an exact branch `PRINCIPAL` grant with existing version, replay, audit, and transaction rules.
2. School administrators, teachers, parents, and students do not acquire Principal authority; school staff management cannot create or alter a Principal grant.
3. Sign-in and workspace choice expose only live server-returned role/branch combinations.
4. `/leadership` independently reauthorizes the Principal grant and denies forged, foreign, suspended, and revoked scope.
5. The shell shows institution, branch, Principal role, mobile navigation, account controls, and honest unavailable owner states without fabricated metrics.
6. Development and test databases retain all earlier migrations and accept the forward role-constraint migration.
7. Unit, real PostgreSQL, desktop/mobile Playwright, build, boundary, and database-design gates pass for the verified source.

Human visual/product acceptance is recorded separately.

## Next slices

- LDR-02: bounded due-register coverage projection for LEA-05/06/08.
- LDR-03: exact session evidence and freshness.
- LDR-04–06: accountable follow-up lifecycle after Coordination owner design.
- LDR-07: scoped history/export only with a separately established export grant.
