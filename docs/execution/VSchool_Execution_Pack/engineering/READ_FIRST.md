# Engineering handoff revision 2

This revision replaces the earlier thin prompt with source-backed owner LLDs and concrete persistence/transport contracts.

Read in order: CODEX_START_PROMPT → HEXAGONAL_WIRING → TRANSACTIONS_AND_SECURITY → IMPLEMENTATION_DELTAS → the consuming module DESIGN → CRITICAL_WORKFLOWS → relevant table dictionary → ACCEPTANCE_CASES. Use API_ROUTE_MAP to locate the real route wrapper. Read live source before the historical source-reference.

Contents:
- Ten implemented-owner engineering guides with exact application/port interfaces and adapter paths.
- 51 existing physical table specifications, including columns, types, nullability, defaults, relations, keys and indexes; original migration SQL retained for SQL-only constraints.
- API route map based on actual route exports/imports.
- Detailed student registration/enrollment/transfer, attendance/open/submit/correct/recovery, imports and reporting designs; joins and sequence diagrams.
- Explicit architecture deltas and known mismatches, so existing code is not mistaken for approved policy.
- Domain, PostgreSQL and browser acceptance cases tied to risks.

No DB or live application test was run to create this design handoff. This is a richer implementation contract for the first existing-workflow delivery, not a claim that later finance/family/etc designs are all executable without further decisions. Keep approved reference pages unchanged except authorized implementation mapping.
