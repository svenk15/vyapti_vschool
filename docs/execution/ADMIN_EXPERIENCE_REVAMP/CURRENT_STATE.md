# Administrator experience revamp — current state

## 19 October 2026 shell and Students checkpoint

- Baseline reviewed application source: `e00d23ee64aeceddd98c523462d23b78b8cc81fd`; programme started from HEAD `a4992e03c9084860045938668fca599e70c20984` with unrelated historical evidence changes preserved.
- Implemented: target Administrator route grouping, multi-open disclosures, active-group reveal, concise school identity, honest missing-name fallback, approved sizing/spacing, child links without repeated icons, conditional explanations, one Staff entry and authorized Staff local tabs.
- Connected reference implemented at `/design-system/admin-reference` for Today, Students, record and registration states. It uses deterministic fictional data and has no write path.
- No backend command, API, schema, migration, permission or seed change.
- Direct application inspection completed for Today, navigation, Students directory, Student record and registration entry at 1440×1000, 900×1000, 390×844 and 360×800. Connected reference comparisons cover directory, record and registration compositions at desktop/mobile. Evidence: `docs/evidence/admin-experience-revamp-01-2026-10-19/`.
- Verification: focused ESLint passed; TypeScript passed; navigation unit 3/3 passed; documentation checks passed; production build `XA1lhsCC01kFAWxYMOBsz` passed with the established 4 GiB heap; focused PostgreSQL-backed Playwright passed 2/2 desktop and 2/2 mobile with one worker. No schema or migration change.
- Human visual acceptance: PENDING.

## Open work

1. Shell/Students checkpoint committed as `1671c8f`.
2. Staff/School/Academics directly inspected at desktop/mobile. Staff tabs now sit below the page header, duplicate cross-links were removed, and School details no longer exposes an unsupported draft action. Evidence: `docs/evidence/admin-experience-revamp-02-2026-10-19/`.
3. Attendance/Timetable directly inspected at desktop/mobile. Authorized Corrections is now reachable, Attendance tabs follow the approved information architecture, unsupported Attendance draft controls were removed, and report/cover tables have labelled mobile records without root overflow. Evidence: `docs/evidence/admin-experience-revamp-03-2026-10-19/`.
4. Communication/Calendar/Assessments directly inspected at desktop/mobile. Communication local navigation no longer duplicates My work, local tabs follow the page header, and Assessments has one clear header action without a repeated workflow-entry card. Evidence: `docs/evidence/admin-experience-revamp-04-2026-10-19/`. Production build `W9MFAx9O5BmaQ4d0_zuhB` passed with the established 4 GiB heap; focused ESLint and TypeScript passed. Human visual acceptance remains PENDING.
5. Continue the remaining routes in [PAGE_COVERAGE.md](PAGE_COVERAGE.md), beginning Admissions, Imports, Requests and Coordination.

