# Academic setup and teaching context — execution tasks

Phase 1. Each task is a vertical slice with a running demo. Follow the matching named flow in DESIGN.md and shared agent runbook. No task completion is claimed by this document.

## ACA-01 — Configure academic year, terms, grades and sections

Depends on: IAM-02, TEN-02

Design: [flow ACA-01](DESIGN.md). Scope and API: POST /api/v1/academics/years; PUT /api/v1/academics/years/:id/terms; POST /api/v1/academics/grades|subjects|sections.

### Implementation instructions

1. Authorize school.manage for year/terms and class.manage for catalogs.
2. Lock account then School; replay receipt only after authorization.
3. Create DRAFT year and unpublished calendar atomically; terms replace only while DRAFT, within year and nonoverlapping.
4. Create school grade/subject and section after validating active references and matching year/campus.
5. Return joined display DTO; audit/outbox/receipt commit with version change.
6. Require the trusted `academic_core` release, active institution entitlement and branch activation on every read/write; do not enable it through browser input. Default deployment release remains deny-all. The local ACA-01 demo may explicitly pass `academic_core` to its server process and must use TEN-02 application commands to provision its synthetic contract/activation.

Files: extend `backend/modules/academics/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/academics`, `test/functional/academics` and `test/e2e/academics` as the suite grows.

### Acceptance and test strategy

- Unit / application: Civil dates, term overlap, state rules, code normalization.
- Real PostgreSQL: Parallel no-campus duplicates: exactly one; cross-year/scope FK rejection; atomic year+calendar creation.
- Browser: Create year/terms/grade/subject/section then refresh; actionable duplicate and overlap errors.
- Failure contract: Duplicate code/section →409; invalid range/overlap→422; terms after OPEN→409; foreign/inactive references→404/409.
- Required DB effect: AcademicYear + SchoolCalendar on create; AcademicTerm replacement under year; GradeLevel, Subject, Section; transactional envelopes.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Create AY2026, Grade 8, Section A and Mathematics; add two adjacent terms; try an overlapping term and duplicate Section A; refresh and verify stored values.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.

## ACA-02 — Publish calendar and open or close the year

Depends on: ACA-01

Design: [flow ACA-02](DESIGN.md). Scope and API: POST /api/v1/academics/calendars/:id/publish; POST /api/v1/academics/years/:id/open|close; GET /api/v1/academics/calendars/:id/evaluate?date=.

### Implementation instructions

1. Authorize school.manage and acquire guards.
2. Validate complete policy, dates/campuses and expected calendar/year version.
3. Compare affected existing sessions through attendance CalendarImpact port; no-op adapter allowed only before attendance tables exist, then replace it in ATT-01.
4. Append immutable revision and exceptions, then change current pointer/version in one transaction.
5. Open year requires published calendar; close requires no noncancelled scheduled/open session on or after school-local today. Persist events/audit/receipt.

Files: extend `backend/modules/academics/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/academics`, `test/functional/academics` and `test/e2e/academics` as the suite grows.

### Acceptance and test strategy

- Unit / application: Campus-over-school precedence; all weekdays validation; state transitions.
- Real PostgreSQL: Publication failure leaves pointer unchanged; deferred pointer FK; immutable records; close-vs-schedule serialization.
- Browser: Publish holiday/campus exception and evaluate dates; open year; term edit denied; close empty disposable year.
- Failure contract: Affected existing future session→409 CALENDAR_IN_USE; no calendar on open→409; pending future sessions on close→409; stale revision→409.
- Required DB effect: CalendarRevision, CalendarException, SchoolCalendar pointer/version; AcademicYear state/version; envelopes. No editing old revisions.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Publish weekdays and one holiday; inspect a teaching day and holiday; open the year; confirm term editing is disabled and old revision remains visible after a valid future revision.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.

## ACA-03 — Create offerings and assign teachers

Depends on: ACA-02, PER-02

Design: [flow ACA-03](DESIGN.md). Scope and API: POST /api/v1/offerings; POST /api/v1/teacher-assignments; PATCH /api/v1/teacher-assignments/:id/end.

### Implementation instructions

1. Require class.manage, acquire actor/School guards and recheck OPEN year.
2. Validate section/year identity, subject active, Teacher→Employee eligibility and current account binding only when portal access needed.
3. Check assignment interval inside year and nonoverlap for offering.
4. Ending assignment rejects intervals that leave future open sessions with no eligible teacher; admin must replan/cancel explicitly.
5. Persist offering/assignment and envelopes; class list displays joined teacher names and dates.

Files: extend `backend/modules/academics/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/academics`, `test/functional/academics` and `test/e2e/academics` as the suite grows.

### Acceptance and test strategy

- Unit / application: Effective-date endpoints and teacher eligibility.
- Real PostgreSQL: Assignment races serialize; cross-school FK; end-assignment vs teacher submit reauthorization.
- Browser: Create offering, assign teacher, inspect effective dates; reject overlap.
- Failure contract: Overlapping assignment→409; inactive teacher/employee→409; section from other year→422; foreign references→404.
- Required DB effect: CourseOffering, TeacherAssignment; may create Teacher through academic owner when Employee already exists; envelopes.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Create Grade 8 A Mathematics, assign the teacher for the year, then attempt an overlapping primary assignment and confirm it is rejected.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.
