# VSchool current state — navigation only

Fresh baseline. No execution timer has started. No school business module is implemented. Platform foundation, shared UI components, branded sign-in previews and an in-memory module configurator are present. Reference entitlement and brand policies are unit-tested. IAM-01 adds real administrator authentication and current school authorization. Editable tenant configuration and operational school workflows remain planned. Review status is recorded in each module state; no acceptance is inferred.

Authoritative task statuses and evidence live in `docs/modules/<module>/CURRENT_STATE.md`. Read [execution index](docs/EXECUTION_INDEX.md) and run `pnpm next-task`. Do not maintain a second task-status list in this file.

## Synthetic demo seed command — 4 October 2026

`pnpm demo:seed` is available and verified against the guarded local development database `vyapti_vschool`. It reuses feature-owned provisioners for IAM-01/IAM-03, TEN-01/TEN-02, ACA-01, BRD-02 and IMP-01. Its IMP-01 artifact is a fictional CSV upload sample only; no ImportJob or student row is written by seeding. Two consecutive runs completed; the second TEN-02 call replayed its existing command key, IAM credentials/private artifacts were preserved, academic access was already active, and the published branding profile was reused. A test-database URL was refused before any child provisioner ran. Private files remain ignored with mode 0600; the command prints paths only.

This command does not enable Attendance, release Import, complete PER-02, seed the IAM-04 isolated test-cluster demo or change any human acceptance state. Existing synthetic Student/Enrollment records remain untouched. Feature URLs, private credential locations and manual journeys remain authoritative in each module CURRENT_STATE. Validation: `pnpm typecheck`, focused ESLint, `pnpm check:docs`, `pnpm check:db-design`, `git diff --check`, and two successful guarded seed runs passed; PostgreSQL access required the normal local sandbox escalation. No schema, migration, dependency or generated file changed for seed tooling.
