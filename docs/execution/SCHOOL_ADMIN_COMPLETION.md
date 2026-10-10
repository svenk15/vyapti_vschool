# School administrator completion batch

Batch `SA-COMP`, started 10 October 2026. The approved Edition 03 catalog contains 63 School Administrator workflows. The current Phase 1 decision admits 29: 22 retain existing implementation evidence, seven require completion or an explicit authority decision. The other 34 are later-phase product scope and are not authorized by this batch.

| Classification | Workflows | Current decision |
|---|---|---|
| `COMPLETE_AND_VERIFIED` | SA-01, SA-02, SA-03, SA-04, SA-05, SA-06, SA-07, SA-09, SA-10, SA-11, SA-12, SA-13, SA-14, SA-16, SA-17, SA-18, SA-19, SA-21, SA-23, SA-24, SA-25, SA-26, SA-27, SA-28, SA-30 | Preserve EX and owner-module evidence; reconcile visually at the integration gate. |
| `NEEDS_FUNCTIONAL_COMPLETION` | SA-15, SA-20, SA-62 | Implement only the missing owner operations and projections below. |
| `BLOCKED_BY_PRODUCT_DECISION` | SA-08 request-capability alternative | Module status is implemented. Commercial requests remain institution/operator authority and have no approved request persistence contract; show an honest handoff. |
| `OUT_OF_RELEASE_SCOPE` | SA-22, SA-29, SA-31–SA-61, SA-63 | Preserve catalog records; no production route or speculative backend in this batch. |

The authoritative per-workflow objective, reference, owner, route, persistence and prior evidence remain in [WORKFLOW_IMPLEMENTATION_MATRIX](WORKFLOW_IMPLEMENTATION_MATRIX.md). This batch adds the missing task/evidence links without replacing that matrix.

| Task | Workflows | Demonstrable outcome | Owner and dependencies | Database | Verification |
|---|---|---|---|---|---|
| SA-COMP-01 | SA-04, SA-05 | Administrator sees derived setup readiness and current actionable exceptions, each linked to its source workspace. | Reporting projection over Access, Tenancy, Academics, People, Students, Imports and Attendance; existing verified owners. | Read only; no migration. | Unit contract, restricted scoped PostgreSQL projection, admin browser populated/empty states. |
| SA-COMP-02 | SA-10 | **VERIFIED; review PENDING.** Administrator can retire an eligible grade/section/subject prospectively and sees dependency counts when blocked. | Academics; existing calendar/student/attendance references. | Existing `active` and `version` columns; no migration. | Unit input boundary, real PostgreSQL replay/cascade/blocking, and desktop/mobile browser. |
| SA-COMP-03 | SA-15 | Failed invitation delivery is visible and a replacement invitation revokes the prior token before delivery. | Access; existing invite lifecycle and development sink. | Existing tables. | Token lifecycle PostgreSQL and browser recovery. Production provider review stays a release gate. |
| SA-COMP-04 | SA-20 | Authorized administrator corrects a student Person display name with reason and history, with stale-write comparison. | People owns identity facts; Students supplies scoped student selection. | Exact forward history contract must be designed before code. | Scope, concurrency, history and browser. |
| SA-COMP-05 | SA-62 | Administrator reads a bounded branch-safe activity projection. | Platform audit query; privacy/support actions remain separately blocked. | Existing audit tables unless query evidence proves an index gap. | Safe-field, branch isolation, pagination and browser. |
| SA-COMP-06 | all in-scope SA | Approved administrator routes are visually reconciled, seeded coherently and pass the integrated checkpoint. | Existing owners and shared UI. | No speculative schema. | `pnpm check`, real PostgreSQL suite, administrator E2E, build and rendered evidence. |

Human review remains PENDING. TEN-03 restricted-role/RLS proof, native VoiceOver/NVDA, production mail/provider review, restore/load evidence and real-client onboarding remain separate release gates.
