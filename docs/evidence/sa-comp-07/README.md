# SA-COMP-07 / SA-18 exact identity resolution evidence

Date: 10 October 2026. Human review: **PENDING**.

## Outcome and source

The Student registration dialog resolves existing identity only by an exact organization-scoped Person UUID or exact current-branch admission number. A selectable Person ID is re-read by the existing guarded registration transaction. An admission/current-branch Person match is shown as an existing Student recovery link and cannot create a duplicate Student. Display names and email are not identity inputs. Ordinary directory search is unchanged.

Executable source: the focused SA-COMP-07 implementation commit recorded after verification. Base: `7f4cb033f52866691953f782515b4e662ab95982`. No migration or database contract changed.

## Verification

- `pnpm exec vitest run --config vitest.config.ts test/unit/students.test.ts`: **5/5 passed**. Strict discriminated reference parsing, UUID normalization, admission leading zeros, and name-kind rejection.
- `pnpm test:functional test/functional/students-registration.test.ts`: **12/12 passed** against real PostgreSQL `vyapti_vschool_test`; 33 migrations found with none pending. Covers exact Person ID, branch admission, already-linked Person, missing reference, foreign organization, unauthorized actor, transactional registration and existing Student readback.
- `pnpm test:e2e test/e2e/students-registration.spec.ts`: **6/6 passed** across Chromium desktop and mobile after a fresh production build. Covers explicit Person-ID selection, registration persistence, exact-admission existing-record recovery, duplicate rollback, foreign denial and mobile layout.
- `pnpm exec tsc --noEmit --pretty false`: **passed** after the contract change.

Reports were written to ignored `artifacts/unit.junit.xml`, `artifacts/functional.junit.xml` and `artifacts/e2e.junit.xml`. These checks do not constitute human visual or native screen-reader acceptance.

## Manual demo

Use the consolidated local server and credentials in `artifacts/people-02/private-demo.json` without copying secrets into documentation.

1. Open Students, choose **Register student**, and expand **Reuse an existing Person**.
2. Keep **Exact Person ID**, enter a same-institution unregistered Person UUID, resolve it, review the single exact identity, and select it. Complete the Student fields and register; expect the persisted detail to reference that Person.
3. Reopen registration, choose **Exact admission number in this branch**, enter an existing fictional admission number, and resolve it. Expect an “already registered” explanation and **Open existing student**; no write occurs.
4. Enter a name, email, malformed UUID or reference from another institution. Expect validation/no-match without identity disclosure, while the main directory still searches name/admission normally.

## Remaining scope

The approved prototype includes an admission-date field, but the live accepted Student contract has no lifecycle/storage rule for it. It remains an explicit product-contract gap rather than being misrepresented as `created_at`. TEN-03 RLS/context proof, native VoiceOver/NVDA, human review and production readiness remain outstanding gates.
