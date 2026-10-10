# EX-08 browser and owner evidence

Playwright captures the real student directory, registration dialog and detail workspace against the dedicated PostgreSQL test database at desktop and mobile viewports. Implementation source: `b1286a2e1a478401350e848f96651ee853291d3c`.

- `pnpm check`: lint, types, docs, 51-table database design, boundaries, backend compile and 113/113 unit tests passed.
- `pnpm test:functional test/functional/students-registration.test.ts`: 9/9 passed against real PostgreSQL; all 31 migrations were current. This covers registration rollback, scoped uniqueness, enrollment races, transfer/history/archive behavior, replay, module suspension, and the generic teacher-directory denial.
- Student Playwright checkpoint: registration, enrollment and transfer/archive passed 6/6 across desktop and mobile. After closing BE-04, the focused registration and teacher-denial rerun passed 4/4. Foreign-scope detail returns no record, duplicate registration leaves no orphan Person, and enrollment/transfer failure states preserve existing records.
- `pnpm demo:seed`: passed against guarded `vyapti_vschool`; the existing deterministic Students fixture and private credentials were preserved. The sandboxed attempt could not reach local PostgreSQL and is not counted as a pass.
- Desktop/mobile captures were visually inspected for hierarchy, modal fit, table containment, action placement and document overflow. The wide enrollment table remains horizontally scrollable on narrow screens.

No schema or migration changed. The school-wide directory and detail endpoints now require `student.manage`; teacher `student.read` remains limited to the Attendance-owned assigned-session roster flow. Unsupported student profile editing, guardian linking, promotion and external transfer remain absent rather than simulated.

Human visual review remains PENDING. TEN-03 and native VoiceOver/NVDA/200% zoom evidence remain release gates.
