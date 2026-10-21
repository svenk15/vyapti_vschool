# Add student Parent / Guardian and control correction — 21 October 2026

## Candidate

- Application source: `ecc3ba290da98c96db27355cf59c6a8fa482e86d`.
- Production build: `fhA5_7X3k6pPhzl_sswVE`.
- Demo: `http://127.0.0.1:3400/admin/students/register`.
- Authority: [`refined-onboarding.html`](../../ux/references/student-onboarding-approved/refined-onboarding.html).

## Correction

- Parent / Guardian is present in the initial Add student form. Authorized users see Full name, Email address and the explicit `Send a parent portal invitation` action without first opening a disclosure.
- When the current account lacks the separate Guardians authority, the section remains visible and truthfully explains that Parent access can be added later; the page does not expose an unauthorized command.
- First name, last name, admission number, roll number, guardian name and guardian email use gray example placeholders. Placeholder text is never submitted as a value.
- Registration controls use the theme's light one-pixel border, 6px radius and no inset/drop shadow. Computed Forest values are `40px` desktop or `44px` mobile, `1px` border and `rgb(220, 229, 223)` border color.
- If guardian details are entered without selecting the invitation action, client validation explains that invitation is required and issues no owner command. This preserves the current Guardians contract, which has no contact-only record or relationship field.

## Evidence

| State | Desktop | Mobile |
|---|---|---|
| Approved reference | [`reference`](reference/add-desktop.png) | [`reference`](reference/add-mobile.png) |
| Empty application with gray examples | [`application`](application/add-empty-desktop.png) | [`application`](application/add-empty-mobile.png) |
| Details require explicit invitation | [`application`](application/guardian-validation-desktop.png) | [`application`](application/guardian-validation-mobile.png) |
| Invitation selected | [`application`](application/guardian-invitation-desktop.png) | [`application`](application/guardian-invitation-mobile.png) |

[`capture-metadata.json`](capture-metadata.json) records the CSS viewport, DPR, visual scale, root overflow, section/field visibility, placeholder strings and computed control styles. The capture used fictional data and issued no Student or Guardian mutation.

## Verification

- Focused TypeScript and ESLint: passed.
- Changed-file whitespace validation: passed.
- Production build with the established 4 GiB Node heap: passed after invalidating a stale webpack cache; build ID `fhA5_7X3k6pPhzl_sswVE`.
- No-write Playwright inspection: six observations passed across 1440×1000 and 390×844. Parent / Guardian heading, name and email are visible; root overflow is absent; invitation-required validation and invitation-expanded presentation were inspected.
- The guarded E2E command stopped during Prisma test-database schema-engine startup, before browser launch or assertions. No development data changed. Existing owner-command evidence remains applicable because this slice changes presentation and client validation only.

Human visual acceptance remains **PENDING**. The absent Guardian relationship/contact-only contract, native accessibility checks, TEN-03 and production release gates remain pending.
