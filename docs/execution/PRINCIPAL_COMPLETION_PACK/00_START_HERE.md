# VSchool Principal completion package
Version 1.0 • 17 October 2026 • Product proposal and execution contract

## What this package does
Defines every remaining Principal workflow, shared product policies, owner-interface design, production UX compositions, and a dependency-ordered Codex queue. It preserves the existing Next.js / TypeScript / PostgreSQL hexagonal architecture and completed implementation. It is not a new starter or replacement repository.

## Evidence boundary
Based on the supplied docs(1).zip, not an inspection of current application source or live database. Implementation and verification statuses are documentary claims. Live Codex must reconcile later commits before implementation. No product feature, migration, acceptance or release gate is completed by this package.

## Live repository reconciliation — 17 October 2026

F00 reconciled this imported programme against executable source `f75ad4f3e3b036132d0c72bbe6c95eceea296b1c`. The live 46-row matrix is authoritative: 12 workflows are ENGINEERING_COMPLETE, seven are PARTIAL and 27 are NOT_STARTED after F18 completed LEA-46 and F03 added the first supported slices of LEA-27, LEA-29 and LEA-31. F01/WF-10 are satisfied by the verified COORD-02/LEA-10 implementation rather than being rebuilt. On 17 October 2026 the repository owner explicitly approved D02–D19 for synthetic-only implementation with no exceptions; D01 remains unchanged. [SCREEN_MAP](SCREEN_MAP.md) records the production L/D/W/R specimens and the workflow-explorer mapping; [RESUME](RESUME.md) records the exact continuation point.

## Read order
1. 01_BASELINE_AND_COVERAGE.md — exact 46-workflow inventory and inconsistencies.
2. 02_PRODUCT_DECISIONS.md — consolidated proposed defaults and deployment configuration.
3. 03_SHARED_ARCHITECTURE.md — ports, candidate persistence, transactions and design gates.
4. 04_PRODUCTION_UX.md — deterministic screen recipes; explorer is not a pixel reference for whole pages.
5. workflows/ — one definition per incomplete workflow, including original source contract.
6. 05_EXECUTION_QUEUE.md and EXECUTION_QUEUE.json — ordered tasks and readiness predicates.
7. 06_VERIFICATION_AND_RELEASE.md — test/evidence and completion requirements.
8. 07_CODEX_PROMPT.md — single programme instruction and resume contract.

## Authorization
Existing approved repository decisions remain authoritative. New D02–D19 rules in this package are RECOMMENDED_PENDING_APPROVAL. D01 preserves the already documented live Coordination contract. Creating this package does not automatically approve sensitive policies. The user can approve the proposed product rules as one numbered set, with exceptions. External providers, school-specific safety procedures, financial limits and production retention still require actual configuration. An explicit synthetic-only implementation can be approved without representing it as production-ready.

## Install without replacing existing docs
Copy this directory into docs/execution/PRINCIPAL_COMPLETION_PACK/. Do not replace the existing docs folder or approved reference packs. Commit as a documentation addition. Use the prompt in 07_CODEX_PROMPT.md. Codex then merges relevant approved deltas into the Bible and each owner DESIGN/TASKS/CURRENT_STATE before implementing that owner.

## Outcome and limitations
The package gives all 36 outstanding workflows an explicit target. Several span missing Assessment, Finance, support or AI owners and cannot truthfully be completed with placeholder Principal pages. A supported slice remains partial until its declared full scope is satisfied. No eight-hour completion guarantee. Human acceptance and production readiness remain separate.
