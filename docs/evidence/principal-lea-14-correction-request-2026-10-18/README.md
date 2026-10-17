# LEA-14 exact attendance correction request evidence

Status: engineering and direct comparison complete with documented deviations; human review PENDING.

The approved source is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, workflow `LEA-14`. It is a workflow-explorer dialog. Production maps the approved stages to contextual requester routes, `/leadership/attendance/correction-requests` for Principal routing, and `/admin/attendance/correction-requests/:id` for the separately authorized reviewer.

Implemented behavior:

- Parent, Student and assigned Teacher requesters use distinct explicit purpose grants. Server-side identity, branch, assignment, roster and source-revision checks determine authority.
- Every request binds the exact Student, submitted session, Attendance record and source revision. Principal routing grants no mark-change authority.
- The current separately granted reviewer may decline or invoke the existing Attendance owner correction command. APPLIED is persisted only after the exact committed owner receipt matches the reviewed request.
- A concurrent mark change records CHANGED and requires a fresh request and review. Exact same-key/same-payload replay returns one original result; changed payload conflicts.
- Request, route, review, withdrawal and protected receipt reads recheck current authority. Revocation prevents protected result disclosure.
- General audit and receipt metadata exclude pupil names and request narrative. Protected-text storage remains synthetic-only.

Verification applies to implementation commit `c58992b` (`Implement exact attendance correction requests`):

- Focused unit purpose-bundle test: 1/1 passed.
- Real-PostgreSQL correction-request lifecycle/security: 3/3 passed, including scope, separation of duties, source-revision changes, one owner correction, replay and revoked disclosure.
- Sequential one-worker Playwright: 1/1 Chromium and 1/1 mobile passed through request, routing, review, owner mutation and persisted APPLIED receipt.
- `pnpm check`: passed, including 224/224 unit tests, lint, TypeScript, documentation, 156 database contracts, boundaries and portable-backend compilation.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build`: passed; build ID `JnLnbVA2I0X0O3MsVygcr`. Isolated Playwright build ID `zTbtVdMk_mPzTrhSLt4yz`.
- Development and test databases each contain 97 forward migrations through `20261018221000_attendance_correction_request_purposes`; neither database was reset.
- Repeat-safe synthetic seed stores only identifiers and credentials in ignored `artifacts/attendance-correction-requests/private-demo.json`.

Direct visual inspection used 1440×1000 and 390×844 captures. `reference-*` shows the explorer state; `application-request-*` and `application-applied-*` show the comparable routed production states. The approved stage order, factual source evidence, separate authorities, terminal receipt and responsive hierarchy are preserved. The explorer remains a catalogue dialog rather than a literal production page. Font portability, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03 and human acceptance remain pending.
