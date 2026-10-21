# Administrator Students reference-fidelity correction — 21 October 2026

## Candidate and authority

- Application source: `d6c61772484ddf2df828a3917b12d7083ff6cf96` (`88195978f4aed197d68bd7e7f8372a459bd88094` presentation plus `d6c61772484ddf2df828a3917b12d7083ff6cf96` focus management).
- Production build ID: `OG1vfxhJLCRLA_ScBTEZR`.
- Demo: `http://127.0.0.1:3400`; credentials stay in the ignored private demo file and are not copied here.
- Exact approved source: [`refined-onboarding.html`](../../ux/references/student-onboarding-approved/refined-onboarding.html), SHA-256 `4a0c5a72b7e5512bfb9b30647b5fb10f82c9c42b04e746fe6f0cae4799792bbe`.
- Application routes: `/admin/students/register` and `/admin/students/:studentId`.

The reference's 47px concept-review toolbar is reviewer chrome, not part of the production page. Geometry comparisons subtract that toolbar. Synthetic record names and identifiers differ intentionally; the application renders authoritative local data.

## Corrected presentation and interaction

- Add student now uses the reference's centered 884px desktop surface and 358px mobile surface, compact title/action row, single-column fields, section rhythm, 36px desktop actions and 44px mobile controls.
- New/existing-record selection remains explicit. The exact Person-ID/admission-number field appears only in existing-record mode; identity resolution is unchanged.
- Class selection reveals effective dates and roll number without changing enrollment semantics. Parent/guardian remains an optional disclosure backed by the existing post-registration Guardians flow.
- Profile now uses the same centered 884px composition, real class/year arrival context, compact status/actions and responsive 358px mobile surface.
- Add guardian and Manage guardian access use the reference drawer width: 470px on desktop and full width on mobile. The header shows the Student context, field spacing no longer stretches to the viewport, Add guardian focuses Full name, Escape closes safely and returns focus to its opener.
- Required input semantics, validation association, command idempotency, unknown-outcome recovery, authorization and owner boundaries were preserved. No database, migration, seed, DTO or backend contract changed.

## Direct comparison evidence

All states use identical CSS viewports: desktop 1440×1000 and mobile 390×844, DPR 1 and visual viewport scale 1. Metadata records the computed font, rectangles and root-overflow result.

| State | Reference | Application |
|---|---|---|
| Empty new Student | [`desktop`](reference/empty-new-desktop.png), [`mobile`](reference/empty-new-mobile.png) | [`desktop`](application/empty-new-desktop.png), [`mobile`](application/empty-new-mobile.png) |
| Existing-record lookup | [`desktop`](reference/existing-record-desktop.png), [`mobile`](reference/existing-record-mobile.png) | [`desktop`](application/existing-record-desktop.png), [`mobile`](application/existing-record-mobile.png) |
| Class selected | [`desktop`](reference/class-selected-desktop.png), [`mobile`](reference/class-selected-mobile.png) | [`desktop`](application/class-selected-desktop.png), [`mobile`](application/class-selected-mobile.png) |
| Guardian expanded | [`desktop`](reference/guardian-expanded-desktop.png), [`mobile`](reference/guardian-expanded-mobile.png) | [`desktop`](application/guardian-expanded-desktop.png), [`mobile`](application/guardian-expanded-mobile.png) |
| Validation failure | [`desktop`](reference/validation-failure-desktop.png), [`mobile`](reference/validation-failure-mobile.png) | [`desktop`](application/validation-failure-desktop.png), [`mobile`](application/validation-failure-mobile.png) |
| Registration success | [`desktop`](reference/success-desktop.png), [`mobile`](reference/success-mobile.png) | [`desktop`](application/success-desktop.png), [`mobile`](application/success-mobile.png) |
| Partial outcome | [`desktop`](reference/partial-outcome-desktop.png), [`mobile`](reference/partial-outcome-mobile.png) | [`desktop`](application/partial-outcome-desktop.png), [`mobile`](application/partial-outcome-mobile.png) |
| Ordinary Profile | [`desktop`](reference/profile-desktop.png), [`mobile`](reference/profile-mobile.png) | [`desktop`](application/profile-desktop.png), [`mobile`](application/profile-mobile.png) |
| Add guardian | [`desktop`](reference/guardian-add-desktop.png), [`mobile`](reference/guardian-add-mobile.png) | [`desktop`](application/guardian-add-desktop.png), [`mobile`](application/guardian-add-mobile.png) |
| Manage guardian | [`desktop`](reference/guardian-manage-desktop.png), [`mobile`](reference/guardian-manage-mobile.png) | [`desktop`](application/guardian-manage-desktop.png), [`mobile`](application/guardian-manage-mobile.png) |

Capture provenance: [`capture-metadata.json`](capture-metadata.json) and [`profile-capture-metadata.json`](profile-capture-metadata.json). The partial-outcome application image uses a route-fulfilled, no-write owner failure solely to render the real production state. Registration success uses an existing authorized fictional Student. The capture scripts issued no Student mutation.

Measured desktop Add student geometry after removing reference review chrome is exact at the principal landmarks: Back `x=333, y=90`, heading `x=333, y=132`, surface `x=333, y=190, width=884`; the first application control is within 2px of the reference. Mobile uses `x=16, width=358`, with an 8–9px vertical difference caused by the production shell/header composition. Every captured state reports no root overflow.

## Contract differences retained

These differences cannot be resolved by styling and were not simulated:

- Guardian relationship has no current owned column or write contract.
- A contact-only Guardian lifecycle without portal authorization does not exist.
- Existing Guardian display name/email/relationship editing is not an owner operation.
- Manage access exposes the real fixed core bundle plus authorized optional purpose grants, instead of the mock's unconstrained free-form purpose editing.

The live Guardians LLD explicitly records these limits. The Profile also retains supported operational portal status/actions that the mock does not model. They remain visible because they are real authorized behavior.

## Verification

- `pnpm exec tsc --noEmit` — passed.
- Focused ESLint for the seven changed application/component files — passed.
- `git diff --check -- app components` — passed.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed; build ID `OG1vfxhJLCRLA_ScBTEZR`.
- Current-build Playwright comparison captured 28 registration states and 14 Profile/Guardian observations sequentially. It verified DPR/scale, computed Inter, no root overflow, initial drawer focus and focus return.

Human visual acceptance remains **PENDING**. Native VoiceOver/NVDA, actual native 200% browser zoom, TEN-03 and production provider/release gates remain pending.
