# Delivery plan and dependencies
These are proposed roadmap placements based on existing persona packs. They do not overwrite the actual execution index or claim a phase is complete.

| Release | Include | Explicit prerequisites |
|---|---|---|
| L1: attendance visibility | Leadership context, today, fresh coverage, exact session evidence, controlled report | Phase 1 source records; new leadership read capability and UI |
| L2: accountable follow-up | Single-item assign, receipt/status, evidence verification, reassignment/reopen; permitted communication | Approved Phase 2 coordination extension, staff eligibility and communication owner |
| L3: leadership decisions | Assigned inbox, request information, owner-specific decisions, conflict routing, communication approval | Each Phase 2 request/notice owner has its own transition/authority contract |
| L4: academics | Timetable/cover, assignment completion, feedback review, learning coordination | Phase 3 owners; student/teacher/guardian boundaries preserved |
| L5: assessments | Readiness, delegated moderation, publication handoff, released evidence | Phase 4 moderation/publication/separation policy |
| L6: specialist oversight | Financial exception review, staffing/services/referrals | Phase 5 or 6 independently released; explicit specialist grants |
| L7: reviewed assistance | Evidence-linked brief drafting | Phase 7 provider/privacy/evaluation gates |

An attendance-only institution should get a complete L1/L2 experience with no Fees, Admissions, grading or AI prerequisites. Do not rename these release slices as Bible phases; they are leadership delivery batches layered over owner phases.

## Module handoff convention
Per area: DESIGN.md contains workflow requirements and owner boundaries; TASKS.md has demo-able slices; CURRENT_STATE.md records design/code/review state. Proposed LEA-* workflow IDs do not replace existing task IDs. Reconcile duplicates and real dependencies before creating code tasks.

Use focused checks during each slice. Architecture, authorization, meaningful transaction tests and evidence remain mandatory. Batch visual review across related screens when it saves effort. Preserve required human/release gates from actual documents; this pack neither creates blanket approval nor removes those gates.

## Done / pending
Done in this pack: product catalogue, required states, permissions, metric definitions, first release, task outlines and searchable workflow reader.
Pending: school product acceptance, physical schema reconciliation, owner-specific LLD/API details, production UI screens, implementation, actual PostgreSQL/E2E/performance/accessibility verification.
