# Admissions — current state

Last updated: 2026-10-11.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| ADM-01 / SA-38 | VERIFIED | PENDING | [Direct reference and verification evidence](../../evidence/admin-sa-38-2026-10-11/README.md) |

## Design-readiness note — 11 October 2026

Resolved owner separation (Applicant is not Person/Student), branch scope, exact duplicate behavior, open-cycle/active-grade predicates, three physical tables and indexes, transaction locks, current authorization/module checks, privacy-minimized evidence, exact-key recovery, UI stages and verification. No application-triggered merge, Student conversion, guardian link, fee record, message or durable draft is permitted. Production retention remains a release-policy gate but does not block additive local creation because deletion is unsupported.

## Implementation checkpoint — 11 October 2026

ADM-01 is implemented through the portable facade, Prisma adapter, composition factory, Next server gateway/API and approved staged UI. Migration `20261011170000_admissions_inquiry_application` is applied to both designated local databases; all three tables remain registered for the TEN-03 closure gate. Focused unit 15/15, real-PostgreSQL 3/3 and browser 2/2 passed; the browser gate built current source. Direct desktop/mobile reference comparison is recorded in the evidence directory. `pnpm demo:seed` creates/preserves the fictional 2027–28 cycle and activates Admissions only for its existing fictional demo branch. Human visual review, native accessibility, font resolution, production retention and TEN-03 remain pending. Next action: assess SA-39 design readiness without implying its decision-authority contract is approved.
