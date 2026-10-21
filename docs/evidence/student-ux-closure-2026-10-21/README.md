# Administrator → Students UX closure — 21 October 2026

## Provenance

- Starting correction checkpoint: `e84991b3b468f2a55b8a4e5dbce0a53061b63908`.
- Corrected application source: `8fe84b686a18bc6c43c9d3e80fab9abae47b2806`.
- Exact approved reference: `docs/ux/references/student-onboarding-approved/refined-onboarding.html`.
- Reference SHA-256: `4a0c5a72b7e5512bfb9b30647b5fb10f82c9c42b04e746fe6f0cae4799792bbe`.
- Production build ID: `WafBOKUaV-hyLbfLdwYXg`.
- Isolated E2E build: regenerated from the corrected working source before the focused browser runs.
- Schema/migrations: unchanged by this slice; guarded PostgreSQL verification used the existing 119-migration schema with no pending migration.
- Human review: **PENDING**.

## Outcome

The bounded closure covers the connected Administrator Students journeys without changing owner contracts or database state. Registration retains one connected page and one final Student mutation. The Profile uses the approved identity, School record, guardian and single portal-strip hierarchy. Student correction is a focused drawer with independent reasoned owner commands. Initial enrollment and section transfer each use two meaningful stages with final-only writes. Guardian and portal management are compact, state-specific and retain the exact command key after an unknown response.

The correction pass also separates a confirmed access mutation from its follow-up read, preserves both independent Student correction drafts, completes reviewed stale retries with refreshed owner versions, and keeps Guardian recovery feedback and immutable retry state inside the active overlay. See [CORRECTION_ACCEPTANCE.md](CORRECTION_ACCEPTANCE.md) for C01–C07 and the independent review.

| Surface | Before | After |
|---|---|---|
| Registration | Connected single page | Preserved; no additional confirmation or durable draft |
| Student correction | Legacy multi-stage composition | One focused drawer; one submit per name/admission-date section |
| Enrollment | Student re-selection plus staged review | Fixed Profile Student; Details → Review; final confirmation only |
| Transfer | Three presentation stages | Details → Review; final confirmation only |
| Guardian access | General management composition | Compact Add/Manage drawer with one action per purpose row |
| Student portal | Redundant setup confirmation/state text | Two stages and one compact Profile strip with state-specific action |

## Evidence map

- Requirement matrix: [IMPLEMENTATION_MATRIX.md](IMPLEMENTATION_MATRIX.md).
- Exact reference/application Add Student, Profile and Guardian comparisons: `docs/evidence/student-onboarding-connected-2026-10-21/`.
- Profile width/theme captures: `docs/evidence/student-onboarding-profile-2026-10-21/application/`.
- Shared-pattern extensions: `extensions/`.
- Portal states: `portal-states/` — no access, setup link sent, delivery failed, operator setup required, access enabled and access removed, each at desktop/mobile.

The direct-reference captures and application captures were visually inspected for hierarchy, spacing, control size, drawer composition, mobile wrapping and root overflow. Edit, enrollment, transfer and portal-management images are shared-pattern extensions rather than claims of an exact state absent from the reference.

## Verification

- Earlier unchanged unit and owner evidence remains applicable as recorded below.
- Correction-pass real PostgreSQL: Students correction 4 passed, Guardians 4 passed and Student portal 3 passed with unrelated cases explicitly skipped by focused filters.
- Correction-pass current-source Playwright ran sequentially with one worker: correction + Guardian recovery 2/2 desktop and 2/2 mobile; portal committed-save/read-failure 1/1 desktop and 1/1 mobile; connected onboarding/Profile/Guardian 1/1 desktop and 1/1 mobile.
- `pnpm check:db-design`: passed, 204 table contracts.
- `pnpm check:boundaries`: passed.
- `pnpm check:backend`: passed.
- `pnpm test:unit`: passed, 64 files / 277 tests.
- Production build with `NODE_OPTIONS=--max-old-space-size=4096`: passed; build ID above.
- `pnpm check`: lint, generated types and TypeScript passed. Documentation validation remains non-green only because two unrelated dirty `WORKSPACE_PRESENTATION_REVAMP` files link to the absent `docs/evidence/workspace-presentation-route-pass-2026-10-20/README.md`.

During iteration, a functional wrapper command forwarded its filter incorrectly and began the broad suite; it was stopped after an unrelated Finance failure. The corrected targeted command passed. A stale disposable `.next-e2e` cache initially omitted late CSS rules; a clean isolated build fixed the evidence source. Neither issue changed backend requirements or database state.

## Deviations and remaining gates

- Production shell, authorized context and fictional fixture data remain authoritative.
- The Guardians owner has no relationship field or contact-only lifecycle, so those reference elements are not fabricated.
- Exact visual authority exists for Add Student, Profile and Guardian states. The other completed surfaces use the established shared patterns and are labelled accordingly.
- Native browser 200% zoom, VoiceOver and NVDA are unperformed.
- Human visual acceptance, TEN-03, production provider and production-release gates remain pending.
