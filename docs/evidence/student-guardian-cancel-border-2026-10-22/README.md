# Add Guardian Cancel border correction — 22 October 2026

## Scope

The Add/Manage Guardian drawer's secondary **Cancel** action now uses the existing faded `--vs-border` token instead of the darker global secondary-button outline. The override is scoped to the Guardian drawer footer. Button behavior, focus treatment, sizing, authorization and Guardian operations are unchanged.

- Base HEAD: `ee61958f6c753058d64c47a55d4e64446d0811f6`
- Verified production build ID: `eaTYX_SdjC1o4zXAODBOZ`
- Approved reference: `docs/ux/references/student-onboarding-approved/refined-onboarding.html#guardian`
- Application route: `/admin/students/491a5bc0-5b6a-4751-bd05-207fadec0bc8`, **Add guardian**
- Viewports: 1440×1000 and 390×844 CSS pixels, DPR 1, Chromium visual scale 1

## Comparison

The approved reference renders the Cancel border as `rgb(220, 230, 223)`. The Forest application token renders `rgb(220, 229, 223)`. Both use a one-pixel white-surface secondary action, and the application no longer inherits the solid muted-text outline.

- [Reference desktop](reference-guardian-desktop.png)
- [Application desktop](application-guardian-desktop.png)
- [Reference mobile](reference-guardian-mobile.png)
- [Application mobile](application-guardian-mobile.png)
- [Computed measurements](metrics.json)

The matching captures were inspected directly. The footer hierarchy, button shape, spacing and border softness are aligned; no root overflow was detected.

## Verification

- Clean production build with the established 4 GiB heap: **PASS**
- Focused signed-in Chromium comparison: **PASS**
- Direct desktop/mobile visual inspection: **PASS**
- Backend, schema, migration, seed and data changes: **none**

Human visual acceptance remains **PENDING**.
