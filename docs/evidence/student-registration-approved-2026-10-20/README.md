# Student registration — approved FIRST comparison

Captured 20 October 2026 (Asia/Kolkata). Human visual acceptance remains **PENDING**.

## Authority and source

- Exact reference: [`APPROVED_REGISTRATION.html`](../../ux/references/registration-approved/APPROVED_REGISTRATION.html)
- Reference README: [`README.md`](../../ux/references/registration-approved/README.md)
- Reference SHA-256: `5b1b6895a780f7fa5a7f6e170d9946e5fd843717c1d73e264106de6f30775f06`
- Application route: `/admin/students/register`
- Application commit: `6c4f64a49396c772064049b58fb3bb00f53f23b6`
- Before source: repository HEAD `766881f4646fc7398dc7adc4954951d27de1104f`
- Browser: Playwright Chromium, desktop 1440×1000 and mobile 390×844, device scale factor 1.
- Browser zoom was not programmatically available. The enlarged-control probe is CSS-based and is not labelled actual 200% browser zoom.

The reference file was served unchanged through a local static server. The application states used the real guarded API and fictional test-database records.

## Directly inspected states

| State | Reference | Before/application | Corrected application |
|---|---|---|---|
| New Student | [desktop](reference/new-desktop.png), [mobile](reference/new-mobile.png) | [desktop](before/new-desktop.png), [mobile](before/new-mobile.png) | [desktop](after/new-chromium.png), [mobile](after/new-mobile.png) |
| Existing record | [desktop](reference/existing-desktop.png), [mobile](reference/existing-mobile.png) | — | [desktop](after/existing-resolved-chromium.png), [mobile](after/existing-resolved-mobile.png) |
| Required/inline errors | [desktop](reference/errors-desktop.png), [mobile](reference/errors-mobile.png) | — | [required desktop](after/required-errors-chromium.png), [required mobile](after/required-errors-mobile.png), [inline desktop](after/inline-errors-chromium.png), [inline mobile](after/inline-errors-mobile.png) |
| Saved receipt | [desktop](reference/saved-desktop.png), [mobile](reference/saved-mobile.png) | — | [desktop](after/saved-receipt-chromium.png), [mobile](after/saved-receipt-mobile.png) |
| Unknown/recovery | [desktop](reference/unknown-desktop.png), [mobile](reference/unknown-mobile.png) | — | [desktop](after/unresolved-chromium.png), [mobile](after/unresolved-mobile.png) |

The four theme-token checks are [Forest](after/theme-forest-chromium.png), [Amethyst](after/theme-amethyst-chromium.png), [Porcelain](after/theme-porcelain-chromium.png) and [Linen](after/theme-linen-chromium.png). Theme overrides were test-only presentation probes; they did not mutate persisted branding.

## Measured comparison

| Property | Reference desktop | Application desktop | Reference mobile | Application mobile |
|---|---:|---:|---:|---:|
| Card width | 740px | 740px | 354px | 354px |
| Body padding | 28px 30px | 28px 30px | 22px 20px | 22px 20px |
| Field row/column gap | 20px / 20px | 20px / 20px | 18px / 18px | 18px / 18px |
| Input height | 40px | 40px | 44px | 44px |
| Primary action height | 36px | 36px | 44px | 44px |
| Title | 28/36px | 28/36px | 25/32px | 25/32px |
| Root overflow | none | none | none | none |

Raw measurements: [reference](reference/reference-measurements.json), [before](before/measurements.json), [after](after/measurements.json).

## Functional and focused verification

- Targeted ESLint: passed.
- `pnpm typecheck`: passed.
- `NODE_OPTIONS=--max-old-space-size=4096 VSCHOOL_E2E=1 pnpm build`: passed.
- Desktop Playwright presentation/recovery selection: 5/5 passed.
- Mobile Playwright presentation/recovery selection: 4/4 passed.
- Earlier changed-file runs cover new and exact-existing registration, linked validation, future date, identity invalidation, broad/limited receipt actions, committed lost-response recovery, genuine UNKNOWN recovery, guarded navigation and all four themes.
- Real PostgreSQL test database: 119 migrations applied, none pending. No migration or data reset was performed.
- `pnpm check:docs` was run once and remains non-green only for two pre-existing links in unrelated dirty `WORKSPACE_PRESENTATION_REVAMP` documents to the absent `workspace-presentation-route-pass-2026-10-20/README.md`.

## Necessary production deviations

- The current browser-safe existing-Person result exposes one authoritative `displayName`; the application does not parse it into the prototype's first/last fields.
- The prototype simulates saved and unknown outcomes. The application uses the existing scoped owner receipt, preserves the original key/payload, reauthorizes status reads and never interprets UNKNOWN as failure.
- Receipt destinations are rendered only after the server says the current account can use them.
- The production shell, context and authorized navigation remain authoritative and were outside this page-only slice.
- Prototype review controls and disclaimer are not product UI.

Native VoiceOver, NVDA and actual browser 200% zoom remain unperformed. These are not reported as passed.
