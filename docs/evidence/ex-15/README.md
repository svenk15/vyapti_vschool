# Phase 1 local demo handoff

Human review: **PENDING**. This is a synthetic local demo candidate, not a production release.

## Candidate and startup

- Application source verified by the complete gate: `3c3ba5de87bc24f08083714870f2701dded0ebce`.
- Consolidated gate checkpoint: `c1ee480`; status checkpoint: `0dab12e`.
- Production build ID: `dWV3Ax1JW4dqFc20_6qqb`.
- Entry URL: `http://127.0.0.1:3400/sign-in`.
- Published synthetic school sign-in example: `http://127.0.0.1:3400/sign-in/vschool-demo-69a6f7fe`.
- Seed command: `pnpm demo:seed`.
- Primary administrator and assigned-teacher credentials: ignored private file `artifacts/people-02/private-demo.json`.
- Institution administrator credentials: ignored private file `artifacts/iam-01/private-demo.json`.
- Secondary attendance persona: ignored private file `artifacts/attendance-01/private-demo.json`.

From the repository root, prepare or refresh only missing synthetic data with `pnpm demo:seed`, build with `pnpm build`, then start the protected Phase 1 modules with:

```sh
VSCHOOL_RELEASED_MODULES=academic_core,attendance,staff_core,student_core pnpm start
```

The seed refuses non-local/non-development database targets, reuses credentials and command keys, and does not reset, delete or overwrite manual records. It prints private file locations but never passwords or tokens. The development email provider writes only to the ignored local sink.

## Personas

1. **Institution administrator** from `artifacts/iam-01/private-demo.json`: institution/branch context, module status and the published branded sign-in.
2. **School administrator** from `artifacts/people-02/private-demo.json`: school setup, staff, academics, students, roster import, attendance administration and reporting.
3. **Assigned teacher** from the same People file: assigned day, session detail, roll call and submitted receipt.
4. **Secondary teacher** from `artifacts/attendance-01/private-demo.json`: negative assignment/resource-access checks.

## Ordered manual demo

### 1. Entry, branding and context

1. Open the published synthetic school URL above. Expect the synthetic institution/branch name, forest theme and sanitized logo; public branding does not grant access.
2. Sign in with the institution administrator. Open branch administration and switch only among offered branches, then return to the original branch. Expect the header and protected data context to reload; unavailable branches are not selectable.
3. Open **Sign-in branding**. Expect the published profile and revision state. Change a safe draft field and use Preview to inspect it without publishing; cancel or reload to retain the published identity. Publishing is an explicit separate action.
4. Open **Branch module access**. Expect implemented modules to reflect the current entitlement, branch activation and release state; unreleased products remain unavailable.

### 2. School and staff administration

1. Sign out and use the school administrator from `artifacts/people-02/private-demo.json`. Expect the school overview with branch context, real attendance summary and common actions.
2. Open **School settings**. Expect one General information form, read-only timezone and separate Campuses section; Refresh is in the page header. Invalid timezone or duplicate campus changes fail without replacing the prior record.
3. Open **Staff access** and **Staff profiles**. Expect membership/account state to remain separate from employee and teacher eligibility. The seeded assigned teacher is present. Same-name staff remain separate people; contact email alone does not bind identity.
4. If demonstrating invitation/recovery, use only the local mail sink. Expect generic public recovery feedback, one-time tokens, replay rejection and old-session/old-password revocation after successful recovery.

### 3. Academics and students

1. Open **Academic setup**. Expect the open `DEMO26` year, published Monday–Friday calendar, grades, sections and subjects. Date evaluation explains weekly rules and exceptions.
2. Open **Classes and teachers**. Expect the Mathematics Demo offering and its eligible assigned teacher. A duplicate or overlapping assignment is rejected without changing the existing assignment.
3. Open **Students**. Expect four connected synthetic records with enrollment state. Search by name or admission number; Filters apply server-side. Open a student to review identity and dated placement history.
4. Register a uniquely named fictional pupil if a write demo is wanted, then enroll it into the open year/section. Expect reload to retain the record; duplicate admission, foreign scope and invalid year/section fail without an orphan Person or partial placement.
5. Use transfer/archive only on a disposable synthetic record. Expect dated history to remain visible and frozen-attendance impact to block unsafe changes.

### 4. Roster import

1. Open **Roster preview**. Select the open year, the school-wide campus option, a source namespace and `artifacts/imports-01/sample-roster.csv`.
2. Preview. Expect immutable server-side row decisions and explicit valid/error/skipped counts; no Student changes occur before confirmation.
3. Confirm valid rows only and process. Expect bounded progress and durable results after reload. Reusing the same source identity does not duplicate a student.
4. `artifacts/imports-01/sample-roster-partial.csv` demonstrates bounded processing and cancellation: committed rows remain, only pending rows are skipped, and the safe error CSV remains available.

### 5. Attendance administrator and teacher

1. As school administrator, open **Schedule sessions** and select school date `2026-10-06`. Expect three connected Mathematics Demo sessions in the real development database.
2. Open a submitted session. Expect its pinned roster, current records and immutable revision history. An administrator correction requires a reason and current version; a stale correction fails safely.
3. Sign in as the assigned teacher and open **My teaching day**. Select `2026-10-06` and Refresh. Expect the same three sessions: two submitted and one scheduled in the current seeded state.
4. Open the scheduled session. Expect the exact frozen roster. Mark every pupil, review totals and submit. A reload shows the confirmed receipt/result. Reusing the same intent returns the same semantic result rather than duplicating records.
5. Sign in as the secondary teacher and use the same date or copied detail URL. Expect no assigned session disclosure and no access to the first teacher's roster.

### 6. Reporting and export

1. As school administrator, open **Attendance report** with From `2026-10-06` and To `2026-10-07` (exclusive). Expect the same three session rows and explainable submitted/expected, pending, absence and attendance-rate totals.
2. Filter by year, section or subject. Expect server-side results with the selected scope retained.
3. Download submitted CSV. Expect an authorized scoped file with formula-safe values. A teacher or revoked administrator cannot export it.

## Automated evidence

- `pnpm check`: passed, including 113/113 unit tests.
- `pnpm test:functional`: passed 106/106 against real `vyapti_vschool_test` PostgreSQL with all 31 migrations current.
- `pnpm test:e2e`: passed 84/84 desktop/mobile journeys.
- `pnpm build`: passed; build ID above.
- Render audit: 59 route/view combinations passed with no failed response, missing heading or document-level overflow. See [EX-14 evidence](../ex-14/README.md).
- Workflow inventory: 29 `IMPLEMENTED_AND_VERIFIED`, 2 `IMPLEMENTED_NEEDS_DESIGN_ALIGNMENT`, 12 `PARTIALLY_IMPLEMENTED`, and 225 later-workspace/phase workflows outside the current release. The exact per-workflow contract is [the matrix](../../execution/WORKFLOW_IMPLEMENTATION_MATRIX.md).

## Remaining release gates and limitations

- TEN-03 is IN_PROGRESS: RLS remains disabled, pools still use owner credentials, and non-forgeable context, restricted-role cross-tenant read/write denial, pooled leakage, provider-role, restore and large-scale load proof remain unverified. No real client data may be onboarded.
- DS-02 remains BLOCKED/PENDING: native browser 200% zoom, VoiceOver and NVDA were not executed. Existing keyboard/focus/mobile/simulated-layout checks do not establish accessibility conformance.
- Production email/provider, trusted proxy/distributed rate limit, backup/restore targets, retention/legal review and pilot-load measurements remain open.
- Mobile wide tables use an intentional internal horizontal scroll area. Two catalog workflows still require approved-page alignment and twelve remain partial; the workflow matrix names each missing operation.
- The connected teacher walkthrough uses historical synthetic date `2026-10-06` because Teacher Today correctly rejects future dates and the preserved existing demo calendar treats 10 October as non-teaching.

No deployment, push, real outbound message, production access, database reset or migration rewrite was performed. Later operator, family and communication work remains outside this authorized Phase 1 implementation checkpoint.
