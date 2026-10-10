# VSchool current state — navigation only

The authorized EX-00–EX-15 Phase 1 experience overlay is implementation-complete for the local synthetic administrator/teacher demo. Human review remains PENDING. The verified application candidate, startup command, personas, manual walkthrough, test evidence and limitations are in [the consolidated handoff](docs/evidence/ex-15/README.md).

Authoritative owner task status and evidence remain in `docs/modules/<module>/CURRENT_STATE.md`; the [execution index](docs/EXECUTION_INDEX.md) defines scope. Do not maintain a second task-status table here.

`pnpm demo:seed` is the single guarded seed command. It reuses feature-owned provisioners, existing credentials, command keys and manual records in local `vyapti_vschool`; it never resets the database or sends real messages. Primary administrator/teacher credentials remain in ignored `artifacts/people-02/private-demo.json` and are never printed.

This checkpoint is not production ready. TEN-03 RLS/non-forgeable-context proof remains IN_PROGRESS, DS-02 native VoiceOver/NVDA/200%-zoom evidence remains blocked/pending, and production provider, restore, retention/legal and pilot-load evidence remain open. No real client data is authorized.
