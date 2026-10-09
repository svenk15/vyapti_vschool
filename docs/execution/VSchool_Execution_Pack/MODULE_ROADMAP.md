# Module rollout and design gates

Delivery waves are engineering order, not a renumbering of Bible product phases. Catalog phase labels are preserved; a proposed earliest phase is not proof of an implemented permission or dependency.

| Order | Owner scope | Demo outcome | Promotion requirement |
|---|---|---|---|
| Wave A | Shared UX + existing owner integrations | Real administrator/teacher workflows match approved design | EX-00–EX-15 below; reuse current application contracts |
| Wave B | Access/Tenancy operator workspace | Institution directory/detail, onboarding draft/resume, branch lifecycle, licenses, administrator handover, activity | Separate browser operator identity/authentication; complete lifecycle state and mutation LLD; never promote CLI `verified:true` from request JSON |
| Wave C | Guardians + self-account access | Admin verifies child/guardian relationship; parent sees only permitted children; verified student sees own records | Relationship verification, per-purpose revocation, account binding, school policy, permission matrix, scoped schema and invitations designed first |
| Wave D | Communication + Requests | One notice/request seen consistently by admin, teacher and permitted family/student | Audience authorization, recipient snapshot/recheck, delivery statuses, reply/ack rules, file safety and retention contracts |
| Wave E | Academic Timetable + Learning | Publish schedule, dated cover/change; assignments and submissions | Existing shared timetable LLD reconciled to vs_academics names and Attendance owner contract; Learning separately owns work/submission/feedback |
| Wave F | Assessments + leadership projections | Moderated and published results, drill-down and accountable review | Publish/version/withdraw/recheck contracts, explicit principal grants, source cutoff and denominator semantics |
| Wave G | Finance + Payments | Bills, collection, allocation, reconciliation, receipts/refunds | Exact money/rounding, idempotency, payment provider webhook/unknown state, ledger, reversals, permissions and reconciliation design |
| Wave H | Admissions and independently licensed services | Enrollment handover; transport/library/HR/etc by module | Each module has its own invariants, privacy and delivery contracts; don't create a generic catch-all CRUD module |
| Wave I | Reviewed AI + analytics | Purpose-scoped, source-linked assistance and measurable usage | Versioned consent/privacy/redaction/event schemas and human confirmation on consequential actions |

Run the applicable production security gates before onboarding real clients regardless of wave. TEN-03 is not moved to “after everything”. Preserve its existing production blocker and budget a separate tracked closure slice after the visual demo, without confusing it with a cosmetic task.

## Design ticket required for every new owner module
Before marking its first implementation task READY, produce a module DESIGN.md with: full state machine; commands and queries with TypeScript signatures; request/response/error examples; schema columns/nullability/types/defaults/FKs/indexes; scoped read joins; transaction and lock order; idempotency/unknown outcome; authorization matrix and revocation; sequence diagram; file map; deterministic demo fixtures; unit/PostgreSQL/E2E acceptance. Then TASKS.md, then code. Use the supplied reference owner designs as input, not a blanket assurance they already meet this gate.

One module-design task may produce many independently implementable slices. Foundational tables must have a first consuming use case. Never pre-build all later-phase schemas before validating the first product workflow.

## Operator-specific decisions to resolve in its design task
Use server-authenticated operator principal separate from school roles; define operator scope, expiry and revocation. Preserve CLI bootstrap/recovery paths. Draft onboarding is not an active Organization; define incomplete fields, ownership/visibility, discard and concurrency. Define deactivate/reactivate impact on branch access and existing sessions; require reason/version/receipt/audit. Branch timezone read-only after creation as approved. Institution code is absent from current Organization schema: explicitly design stable code/backfill or reconcile the search design; do not reuse a branch code. License removal and activation are different operations. Audit queries redact private account/token/child data.
