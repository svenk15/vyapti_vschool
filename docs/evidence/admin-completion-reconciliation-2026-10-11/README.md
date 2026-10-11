# Administrator completion reconciliation — 11 October 2026

Human visual acceptance remains **PENDING**. This record separates current-release functionality, reference fidelity, deferred release gates and unresolved product contracts.

## Scope classification

| Gap | Classification | Owning contract or decision | Current effect |
|---|---|---|---|
| SA-19 Student beyond the first 100 | Engineering work under an approved contract | Students DESIGN list query/cursor contract and TASKS directory acceptance; SA-19 requires an authorized Student choice | Corrected: standalone selection now supports branch-scoped name/admission search and signed-cursor paging. |
| Attendance combined register/history/cancellation composition | Required business facts plus an unaccepted visual deviation | Attendance DESIGN owns frozen roster, immutable revision history, correction and cancellation; approved visual state is SA-27 | Functional behavior is verified. No approval source accepts replacing the reference's staged composition with the combined production page. |
| Durable workflow drafts | Missing product/data decision | Each workflow card says not to infer draft ownership or retention; owner LLDs record persistence/resume as unspecified | Disabled affordance is honest. Core commands remain verified; full reference interaction fidelity is partial. |
| SA-30 Student attendance and Class summary | Required by approved SA-30 reference; missing owner query contracts | `implementation-spec/administrator/workflows/SA-30.md`; Reporting CURRENT_STATE | Session completeness is verified. The other two reference views remain unavailable and cannot be called full SA-30 fidelity. |
| SA-15 reasoned resend | Required by approved SA-15 reference; missing reconciled reason/audit contract | `implementation-spec/administrator/workflows/SA-15.md` versus Access DESIGN SA-COMP-03 | Safe resend is verified. The required reason field and evidence semantics remain a product/LLD decision. |
| SA-16 dated eligibility and assignment impact | Required by approved SA-16 reference; missing Academics owner contract | SA-16 workflow; Access CURRENT_STATE | Current binding/enablement is verified; dated eligibility/reference recovery remains partial. |
| Nimbus Sans navigation typography | Unaccepted reference deviation and licensing/provenance dependency | `implementation-spec/TYPOGRAPHY.md`, source font manifest and shared-shell evidence | Production uses the system fallback. Exact typography is not claimed. |
| TEN-03 RLS/runtime-role proof | Explicitly deferred for demo sequencing | TEN-ADR-006, EXECUTION_INDEX demo-sequencing note | Application authorization remains mandatory; production and real-client onboarding remain blocked. |
| Native VoiceOver/NVDA and native 200% zoom | Required release evidence, not an implementation dependency | DS-02 DESIGN/TASKS/CURRENT_STATE | Automated browser evidence does not close these gates. |

## Attendance decision correction

No user or owner approval of the composition difference was found. The accepted Attendance domain contract requires the frozen roster, effective record, immutable revisions and reasoned cancellation to remain reachable and truthful; it does not authorize a visual departure from the approved SA-27 reference. The earlier phrase “required by the accepted attendance contract” described the data/operation requirement only. The visual difference is now explicitly unaccepted.

## Fonts

The enhanced reference contains two extracted OpenType assets:

- `font-7c25be4d7815.otf`, SHA-256 `7c25be4d78155523080ab85b10277150657ff7dabbcad7037bdd536c9b6d0d08`, internally Nimbus Sans Regular.
- `font-7f33328e6b4d.otf`, SHA-256 `7f33328e6b4d4cd21b45fa625791928c9407dc702db6780e56b09ca9a3ecaa67`, internally Nimbus Sans Bold.

Embedded metadata names URW and a 2014 copyright, but the supplied pack contains no license grant, license URL, COPYING or NOTICE file. Extraction is provenance evidence, not redistribution permission. The reference body merely declares Inter and embeds no Inter asset; on macOS the compared body/headings rendered through the system stack. Production declares the same Inter/system stack and currently resolves to the system fallback.

A concrete replacement option is to obtain approved, redistributable Inter 400/600 assets with their license file, use Inter for both body and navigation, then intentionally update the reference baseline and application together. This would change Nimbus glyph shapes, text widths, navigation wrapping and some measured geometry, so it requires owner approval before implementation.

## Focused verification

- Focused ESLint and full type generation/TypeScript passed for the SA-19 correction.
- PostgreSQL-backed Chromium: one focused case passed. It proved cursor-page discovery and admission search for an eligible Student beyond the initial 100, followed by authorized fixed-Student enrollment entry.
- The production build used by that Playwright case passed with 38 current migrations and no migration changes.
- Shared-presentation regression captures cover Attendance lifecycle/detail, attendance report, Students directory, SA-18 registration, SA-19 enrollment and Staff/access at desktop, plus SA-19 mobile. They reuse unchanged backend evidence.
- A final normal production build passed with build ID `hiY3CsYJBS7SmF3VEa_S_`. The authenticated local verifier passed every listed route with a 240px desktop sidebar and no document overflow. The captures were visually inspected for heading/action alignment, form width, control density, table containment, sidebar state and mobile stacking. The corrected SA-19 search row is aligned in one desktop row and becomes labelled, full-width controls on mobile.

The shared shell/navigation change affects every protected Administrator journey because each consumes `.portal-sidebar`, `.portal-topbar`, shared navigation and page-heading rules. The later Today CTA change is selector-scoped to `.admin-dashboard` and does not alter Attendance, Students, Reports or Staff content controls.

## Remaining fidelity

Functional completion is retained for the implemented owner operations. Full design-pack fidelity is not claimed while the Attendance composition, drafts, SA-15 reason, SA-16 dated eligibility, SA-30 additional views and exact navigation font remain unresolved. TEN-03 and native accessibility stay separate production-release gates.
