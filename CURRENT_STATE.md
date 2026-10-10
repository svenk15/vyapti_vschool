# VSchool current state — navigation only

The authorized EX-00–EX-15 experience overlay and SA-COMP integrated candidate are verified for their implemented operations. The evidence-based Administrator review records 22 Phase 1 workflows implemented/verified, six partial and SA-08 blocked. SA-COMP-07 closes SA-18's exact-identity selector gap, but full SA-18 remains partial on admission-date persistence/backfill; human review remains PENDING. Use [the completion review](docs/evidence/sa-completion-review/README.md) with later corrective evidence and [SA-COMP-06](docs/evidence/sa-comp-06/README.md) for the prior executable integration evidence.

Authoritative owner task status and evidence remain in `docs/modules/<module>/CURRENT_STATE.md`; the [execution index](docs/EXECUTION_INDEX.md) defines scope. Do not maintain a second task-status table here.

`pnpm demo:seed` is the single guarded seed command. It reuses feature-owned provisioners, existing credentials, command keys and manual records in local `vyapti_vschool`; it never resets the database or sends real messages. Primary administrator/teacher credentials remain in ignored `artifacts/people-02/private-demo.json` and are never printed.

This checkpoint is not production ready. TEN-03 RLS/non-forgeable-context proof remains IN_PROGRESS, DS-02 native VoiceOver/NVDA/200%-zoom evidence remains blocked/pending, and production provider, restore, retention/legal and pilot-load evidence remain open. No real client data is authorized.
