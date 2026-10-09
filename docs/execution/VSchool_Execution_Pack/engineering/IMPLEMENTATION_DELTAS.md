# Explicit deltas and non-deltas

## BE-00 — lock actual contracts before UI adaptation (part of EX-00)
Write `docs/execution/CONTRACT_DIFF.md` with columns: source workflow, live input facade/method, endpoint, input/output DTO, owner tables, permitted actor, missing operation, chosen task. Use the exact API map and owner source reference, comparing live source first. Never infer an endpoint from a prototype label.

Resolve these known differences without asking routine questions:
1. Keep actual Student versus Attendance receipt stores and replay shapes. No unifying migration.
2. Keep exact method-specific idempotency-key validation (Student permits16–100 safe characters; Attendance uses UUID). No global validator replacing them.
3. Keep actual per-endpoint body bounds (Student JSON8KiB; Attendance submit32KiB; correction64KiB). Import upload limits come from its own host/parser.
4. Teacher day remains current owner date range; future timetable is a distinct module, not a new range hard-coded into UI.
5. Teacher school-wide history is not granted. Record a missing owner query for scoped teacher history.
6. Existing Person lookup currently uses exact name. Earlier requirements mentioned admission number/person ID. If live Bible/LLD still conflicts, do not broaden identity matching. Keep ordinary student-list search separate, suppress the disputed existing-Person lookup interaction from the new screen until its intended restricted contract is reconciled. Continue registration of a new Person and unrelated tasks. If the canonical live design clearly superseded the old requirement, document that evidence and use the live contract.
7. `AdminHome` does not include a verified displayName. Use a truthful fallback in the footer until an owner-approved self projection is present; no email-matching Person query.
8. Institution code is not an existing Organization column. Do not implement the operator code search by querying School.code.

## BE-01 — remove host configuration from portable composition when touched
Dependency: EX-00. Owned files: backend/composition/students.ts and lib/server/students.ts initially; equivalent live factories only if same violation exists.
- Make releasedModules and cursorSecret explicit validated factory dependencies; hosting wrapper reads environment. Preserve API output, repository methods, pool settings and disconnect behavior.
- Use existing releasedModuleIds/capabilityReleaseManifest helpers in a hosting-appropriate arrangement; do not export process.env to browser.
- Tests: creating services with injected config must not depend on environment values; empty/invalid secret fails safely before cursor use, with no secret logging. Existing Students gateway smoke and boundaries compile. Do not boot a DB just to test pure configuration parsing.
- Commit separately from screen styling. Demo: existing Students list still works; config failure yields safe unavailable response.

## BE-02 — navigation eligibility cache correctness (part of EX-02)
Current getAdminNavigation memoizes a promise using only moduleId, but invocation also takes permission. Change key to moduleId+permission if live code is unchanged, or separately memoize only permission-independent entitlement while checking each permission explicitly. Preserve institution-admin check and per-route server authorization. Test two routes sharing module but requiring different permissions; denied capability cannot inherit an allowed result. A menu test does not replace endpoint authorization tests.

## BE-03 — missing projection escalation protocol
When an approved screen needs a count/search/sort/history field absent from owner response:
1. Record requested semantics (scope, temporal cutoff, status inclusion, pagination/denominator).
2. Add the owner query/input+output contract in module DESIGN.md, with minimal required columns and existing index strategy.
3. Implement through owner repository/query port. If existing tables suffice, no migration. New index only with observed query need and forward migration/registry update.
4. Test authorized view, foreign scope denial, empty/error and boundary cases. Wire through gateway and screen. Never use a fake total, front-end all-record download or duplicated read database.

Do not implement every hypothetical projection before its screen task. Where the product rule remains genuinely unresolved, create a blocked owner task and continue another eligible slice. UI alignment cannot silently invent a domain rule.

## UI-00 — no wholesale source overwrite
Source-reference is read-only historical evidence. Compare types/symbols; never copy directories into live backend. Approved HTML is visual/interaction reference; do not paste inline fixture JS or rewrite root CSS wholesale. Shared component extraction must preserve field names, values, handlers, current API and route authorization.

## BE-04 — validate teacher read scope against live policy before promoting student screens
The snapshot grants TEACHER `student.read`; StudentRepository.list/get guard that capability and scope by branch, without an obvious teaching-assignment predicate in those methods. The product teacher workspace calls for class-needed pupil facts. This is an observed code/policy question, not proof that every teacher request is exploitable: inspect the actual host path and live LLD.
- Add a focused request-level test using a teacher and a student outside their assignments through generic /api/v1/students and /api/v1/students/[id]. Compare actual result with canonical teacher data policy.
- If the live policy is class-only, define separate school-directory permission for administrator (e.g. student.read_school) and an owner-approved assignment-scoped teacher projection. Update permission matrix, method guard, navigation and tests together; never grant teacher school-wide browse simply because an existing enum says student.read.
- If the live policy intentionally allows school-wide read, record the explicit canonical decision before retaining it. Do not confuse that permission with marking/parent/finance rights.
- Keep this isolated from nav/CSS work. A confirmed authorization defect blocks exposure of the affected student screen/API until fixed; it does not require resetting the database or stopping unrelated safe work.
