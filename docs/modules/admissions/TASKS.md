# Admissions tasks

## ADM-01 / SA-38 — Capture inquiry and start an application

Depends on verified Access/Tenancy module guards, active Academic GradeLevel reads and the approved SA-38 reference. Human review of those modules is not an implementation dependency.

Implement the DESIGN slice through portable domain/application/infrastructure, composition, server gateway and thin Next adapters. Add only the three documented branch tables by forward migration and register them for TEN-03. Do not create People, Student, guardian, Finance or messaging data. Preserve exact-key retry and privacy-minimized evidence.

Acceptance: approved three-stage desktop/mobile composition; real open-cycle/active-grade options; final-only atomic create; safe receipt; no Person/Student write; duplicate/replay/changed-input/rollback/current authorization/cross-branch tests on PostgreSQL; response-loss browser recovery; empty and denied states; seed one fictional open cycle/application scenario idempotently without activating admissions for unrelated schools. Run relevant repository gates and record human review PENDING.
